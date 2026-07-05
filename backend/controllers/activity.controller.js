import Activity from "../models/activity.model.js";
import Bug from "../models/bug.model.js";
import { io } from "../server.js";

// Log a bug activity entry.
export const logActivity = async (bugId, userId, action, details = null) => {
  try {
    const activity = await Activity.create({
      bug: bugId,
      user: userId,
      action,
      details,
    });
    
    const populatedActivity = await Activity.findById(activity._id)
      .populate("user", "username email");
    
    const bug = await Bug.findById(bugId);
    
    io.to(bug.team.toString()).emit(
      "activityAdded",
      populatedActivity
    );
  } catch (error) {
    console.error("Error logging activity:", error.message);
    // Don't throw - activity logging should not block the main operation
  }
};

// Get activities for a bug.
export const getBugActivities = async (req, res, next) => {
  try {
    const { bugId } = req.params;

    const activities = await Activity.find({ bug: bugId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

// Get the number of activities for a bug.
export const getBugActivityCount = async (req, res, next) => {
  try {
    const { bugId } = req.params;

    const count = await Activity.countDocuments({ bug: bugId });

    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
