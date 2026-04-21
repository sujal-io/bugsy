import Comment from "../models/comment.model.js";
import { logActivity } from "./activity.controller.js";

// Add comment
export const addComment = async (req, res) => {
  try {
    const { bugId, text } = req.body;

    const comment = await Comment.create({
      bug: bugId,
      user: req.user.id,
      text,
    });

    const populated = await comment.populate("user", "username");

    // Log activity
    await logActivity(bugId, req.user.id, "commented on bug");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

// Get comments
export const getComments = async (req, res) => {
  try {
    const { bugId } = req.params;

    const comments = await Comment.find({ bug: bugId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};