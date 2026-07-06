import Comment from "../models/comment.model.js";
import { logActivity } from "./activity.controller.js";
import { io } from "../server.js";
import Bug from "../models/bug.model.js";
// Add comment
export const addComment = async (req, res) => {
  try {
    const { bugId, text } = req.body;

    // Build attachment array from multer + Cloudinary
    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      url: file.path,
      publicId: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: req.user.id,
    }));

    const comment = await Comment.create({
      bug: bugId,
      user: req.user.id,
      text: text || "",
      attachments,
    });

    const populated = await Comment.findById(comment._id)
      .populate("user", "username")
      .populate("attachments.uploadedBy", "username");

    // Log activity
    await logActivity(bugId, req.user.id, "commented on bug");

    // Get bug to access team
    const bug = await Bug.findById(bugId);

    // Emit the complete comment (including attachments)
    io.to(bug.team.toString()).emit("commentAdded", populated);

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
};
// Get comments
export const getComments = async (req, res) => {
  try {
    const { bugId } = req.params;

    const comments = await Comment.find({ bug: bugId })
      .populate("user", "username")
      .populate("attachments.uploadedBy", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};
