import Activity from "../models/activity.model.js";

/**
 * Helper function to log activity
 * @param {string} bugId - The bug ID
 * @param {string} userId - The user ID who performed the action
 * @param {string} action - The action type
 * @param {string} details - Optional details about the action
 */
export const logActivity = async (bugId, userId, action, details = null) => {
  try {
    await Activity.create({
      bug: bugId,
      user: userId,
      action,
      details,
    });
  } catch (error) {
    console.error("Error logging activity:", error.message);
    // Don't throw - activity logging should not block the main operation
  }
};

/**
 * Get all activities for a bug
 * @route GET /api/activity/:bugId
 */
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

/**
 * Get activities count for a bug (useful for frontend badges)
 */
export const getBugActivityCount = async (req, res, next) => {
  try {
    const { bugId } = req.params;

    const count = await Activity.countDocuments({ bug: bugId });

    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
