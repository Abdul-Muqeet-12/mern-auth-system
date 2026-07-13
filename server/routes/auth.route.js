import express from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp", authMiddleware, sendVerifyOtp);
router.post("/verify-account", authMiddleware, verifyEmail);

export default router;
