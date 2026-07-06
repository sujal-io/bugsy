import Bug from "../models/bug.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { logActivity } from "./activity.controller.js";
import { io } from "../server.js";

export const uploadAttachments = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    // Authorization — requester must belong to the same team as the bug
    const user = await User.findById(req.user.id);
    if (!user?.team || String(user.team) !== String(bug.team)) {
      return res.status(403).json({
        message: "Only team members can upload attachments",
      });
    }

    const incoming = req.files; // array from multer
    if (!incoming || incoming.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    // Enforce the 5-attachment cap across existing + incoming files
    if (bug.attachments.length + incoming.length > 5) {
      // Roll back any files already sent to Cloudinary in this request
      await Promise.allSettled(
        incoming.map((f) =>
          cloudinary.uploader.destroy(f.filename, {
            resource_type: f.mimetype?.startsWith("image/") ? "image" : "raw",
          })
        )
      );
      return res.status(400).json({
        message: `Attachment limit exceeded. A bug can have at most 5 attachments. This bug already has ${bug.attachments.length}.`,
      });
    }

    // Build the subdocument array from what Multer + CloudinaryStorage gave us
    const newAttachments = incoming.map((f) => ({
      filename: f.originalname,
      url:      f.path,          
      publicId: f.filename,      
      mimetype: f.mimetype,
      size:     f.size,
      uploadedBy: req.user.id,
    }));

    bug.attachments.push(...newAttachments);
    await bug.save();

    // Populate the full bug so the emitted payload matches other bugUpdated events
    const populatedBug = await Bug.findById(bug._id)
      .populate("user",       "username email")
      .populate("assignedTo", "username email")
      .populate("updatedBy",  "username email")
      .populate("attachments.uploadedBy", "username email");

    // Emit real-time event — reuse the existing bugUpdated channel
    io.to(bug.team.toString()).emit("bugUpdated", populatedBug);

    // Log one activity entry per uploaded file
    await Promise.allSettled(
      newAttachments.map((att) =>
        logActivity(
          bug._id,
          req.user.id,
          "uploaded attachment",
          `Uploaded ${att.filename}`
        )
      )
    );

    return res.status(200).json({
      message: "Attachments uploaded successfully",
      attachments: populatedBug.attachments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    // Authorization — requester must belong to the bug's team
    const user = await User.findById(req.user.id);
    if (!user?.team || String(user.team) !== String(bug.team)) {
      return res.status(403).json({
        message: "Not authorized to modify this bug",
      });
    }

    const team      = await Team.findById(bug.team);
    const isCreator = String(bug.user)    === String(req.user.id);
    const isAdmin   = String(team?.admin) === String(req.user.id);

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message: "Only the bug creator or team admin can delete attachments",
      });
    }

    // Locate the attachment subdocument
    const attachment = bug.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const { filename, publicId, mimetype } = attachment;
    const resourceType = mimetype?.startsWith("image/") ? "image" : "raw";

    // Remove from Cloudinary first — if this fails we abort before touching the DB
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (cloudinaryErr) {
      console.error("Cloudinary delete error:", cloudinaryErr.message);
      return res.status(502).json({
        message: "Failed to delete file from storage. Attachment was not removed.",
      });
    }

    // Remove subdocument from the array and persist
    attachment.deleteOne();
    await bug.save();

    const populatedBug = await Bug.findById(bug._id)
      .populate("user",       "username email")
      .populate("assignedTo", "username email")
      .populate("updatedBy",  "username email")
      .populate("attachments.uploadedBy", "username email");

    // Emit real-time event
    io.to(bug.team.toString()).emit("bugUpdated", populatedBug);

    // Log activity
    await logActivity(
      bug._id,
      req.user.id,
      "deleted attachment",
      `Deleted ${filename}`
    );

    return res.status(200).json({
      message: "Attachment deleted successfully",
      attachments: populatedBug.attachments,
    });
  } catch (error) {
    next(error);
  }
};
