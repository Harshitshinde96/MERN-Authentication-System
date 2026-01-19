import express from "express";
import {
  checkAuth,
  login,
  logout,
  registerUser,
  resetPassowrd,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", isAuthenticated, sendVerifyOtp);
authRouter.post("/verify-account", isAuthenticated, verifyEmail);
authRouter.get("/is-auth", isAuthenticated, checkAuth);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassowrd);