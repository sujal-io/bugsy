import express from "express";
import { createBug, getBugs, updateBug } from "../controllers/bug.controller.js";

const router = express.Router();

router.post("/", createBug);
router.get("/", getBugs);
router.put("/:id", updateBug);

export default router;