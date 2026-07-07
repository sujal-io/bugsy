import express from "express";
import { registerUser, loginUser, logoutUser ,getCurrentUser} from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", getCurrentUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logoutUser);

export default router;