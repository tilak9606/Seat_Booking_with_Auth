import crypto from "crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, or } from "drizzle-orm";
import db from "../../common/config/db.js";
import User from "./auth.models.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import { raw } from "express";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const sanitizeUser = (user) => {
  if (!user) {
    return user;
  }

  const {
    password,
    accessToken,
    refreshToken,
    verificationToken,
    resetPasswordToken,
    ...safeUser
  } = user;
  return safeUser;
};

const register = async ({ name, email, password }) => {
  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, email),
  });
  if (existingUser) {
    throw ApiError.badRequest("Email already in use");
  }
  const rawToken = generateAccessToken({ email });
  const hashedPassword = await bcrypt.hash(password, 10);

  const [createdUser] = await db
    .insert(User)
    .values({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: rawToken,
    })
    .returning();

  try {
    await sendVerificationEmail(email, rawToken);
  } catch (error) {
    console.error("Failed to send verification email", error.message);
  }
  return sanitizeUser(createdUser);
};

const login = async ({ email, password }) => {
  try {
    const user = await db.query.User.findFirst({
      where: eq(User.email, email),
    });
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (!user.isVerified) {
      throw ApiError.unauthorized("Please verify your email to login");
    }

    const refreshToken = generateRefreshToken({ user_id: user.user_id });

    await db
      .update(User)
      .set({ refreshToken: refreshToken })
      .where(eq(User.user_id, user.user_id));

    return {
      user: sanitizeUser({ ...user }),
      refreshToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const refresh = async (token) => {
  if (!token) {
    throw ApiError.unauthorized("No refresh token provided");
  }
  const decoded = verifyRefreshToken(token);

  const user = await db.query.User.findFirst({
    where: eq(User.user_id, decoded.user_id),
  });

  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ user_id: user.user_id });
  return { accessToken };
};

const logout = async (userId) => {
  await db
    .update(User)
    .set({ refreshToken: null })
    .where(eq(User.user_id, userId));
};

const verifyEmail = async (token) => {
  const trimmed = String(token).trim();
  if (!trimmed) {
    throw ApiError.badRequest("Invalid token");
  }

  const user = await db.query.User.findFirst({
    where: or(eq(User.verificationToken, trimmed)),
  });

  if (!user) {
    throw ApiError.badRequest("Invalid token");
  }

  await db
    .update(User)
    .set({
      isVerified: true,
      verificationToken: null,
    })
    .where(eq(User.user_id, user.user_id))
    .returning();

  return sanitizeUser(user);
};

const forgotPassword = async (email) => {
  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
  });
  if (!user) {
    throw ApiError.badRequest("No user found with that email");
  }
  const { rawToken } = generateResetToken();

  await db
    .update(User)
    .set({
      resetPasswordToken: rawToken,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    })
    .where(eq(User.user_id, user.user_id));

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (error) {
    console.error("Failed to send reset password email", error.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const rawToken = token;
  const user = await db.query.User.findFirst({
    where: and(
      eq(User.resetPasswordToken, rawToken),
      gt(User.resetPasswordExpires, new Date()),
    ),
  });

  if (!user) {
    throw ApiError.badRequest("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(User)
    .set({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })
    .where(eq(User.user_id, user.user_id));
};

const getMe = async (userId) => {
  const user = await db.query.User.findFirst({
    where: eq(User.user_id, userId),
  });
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return sanitizeUser(user);
};

export {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
