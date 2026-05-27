import Comment from "../models/comment.model.js";
import { logActivity } from "./activity.controller.js";
import { io } from "../server.js";
import Bug from "../models/bug.model.js";
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

    // Get bug to access team
    const bug = await Bug.findById(bugId);

    // Realtime emit
    io.to(bug.team.toString()).emit("commentAdded", populated);


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