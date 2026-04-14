import ApiError from "../../common/utils/api-error.js";
import { verifyRefreshToken } from "../../common/utils/jwt.utils.js";
import { eq } from "drizzle-orm";
import db from "../../common/config/db.js";
import User from "../auth/auth.models.js";

const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw ApiError.unauthorized("Not Logged IN");
    }

    const decoded = verifyRefreshToken(token);

    const user = await db.query.User.findFirst({
      where: eq(User.user_id, decoded.user_id),
    });

    if (!user) {
      throw ApiError.unauthorized("User not authorized");
    }

    req.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      ApiError.internalServerError();
    }
  }
};

export { isLoggedIn };
