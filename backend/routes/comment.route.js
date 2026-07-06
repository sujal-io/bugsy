import express from "express";
import protect from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", protect, upload.array("attachments", 20), addComment);

router.get("/:bugId", protect, getComments);

export default router;