import * as authService from "./auth.services.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    ApiResponse.created(
      res,
      "User registered successfully, Verify your Email",
      user,
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, refreshToken } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Login successful", { user, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    const { accessToken } = await authService.refresh(token);
    ApiResponse.ok(res, "Token refreshed successfully", { accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.user_id);
    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "Logout successful");
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully");
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, "Password reset email sent if the email is registered");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    ApiResponse.ok(res, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.user_id);
    ApiResponse.ok(res, "User profile retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
