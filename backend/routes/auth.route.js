import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, getProfile, updateProfile, changePassword } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", getCurrentUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logoutUser);

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadAvatar.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

export default router;