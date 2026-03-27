import express from "express";
import { createBug, deleteBug, getBugs, updateBug } from "../controllers/bug.controller.js";

const router = express.Router();

router.post("/", createBug);
router.get("/", getBugs);
router.put("/:id", updateBug);
router.delete("/:id", deleteBug);

export default router;