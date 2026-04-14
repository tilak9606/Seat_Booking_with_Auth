import { Router } from "express";
import * as controller from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import ForgotPasswordDto from "./dto/forgot-password.dto.js";
import ResetPasswordDto from "./dto/reset-password.dto.js";

const authRouter = Router();

authRouter.get("/me", authenticate, controller.getMe);
authRouter.post("/register", validate(RegisterDto), controller.register);
authRouter.post("/login", validate(LoginDto), controller.login);
authRouter.post("/refresh-token", controller.refreshToken);
authRouter.post("/logout", authenticate, controller.logout);
authRouter.get("/verifyemail/:token", controller.verifyEmail);
authRouter.post(
  "/forgot-password",
  validate(ForgotPasswordDto),
  controller.forgotPassword,
);
authRouter.put(
  "/reset-password/:token",
  validate(ResetPasswordDto),
  controller.resetPassword,
);

export default authRouter;
