import express from "express";
import { createBug, deleteBug, getBugs, getMyBugs, updateBug } from "../controllers/bug.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",protect, createBug);
router.get("/", protect, getBugs);
router.get("/my", protect, getMyBugs);
router.put("/:id",protect, updateBug);
router.delete("/:id",protect, deleteBug);

export default router;