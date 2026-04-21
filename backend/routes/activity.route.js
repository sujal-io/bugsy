import express from "express";
import {
  getBugActivities,
  getBugActivityCount,
} from "../controllers/activity.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all activities for a bug
router.get("/:bugId", protect, getBugActivities);

// Get activity count for a bug
router.get("/:bugId/count", protect, getBugActivityCount);

export default router;
