import express from "express";
import protect from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {uploadAttachments,deleteAttachment} from "../controllers/attachment.controller.js";

const router = express.Router({ mergeParams: true }); // gives access to :id from parent router

router.post("/", protect, upload.array("attachments", 5), uploadAttachments);

// DELETE /api/bugs/:id/attachments/:attachmentId
router.delete("/:attachmentId", protect, deleteAttachment);

export default router;
