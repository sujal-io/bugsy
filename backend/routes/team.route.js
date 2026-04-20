import express from "express";
import { createTeam, getMyTeam, joinTeam, leaveTeam, getTeamHistory, rejoinTeam } from "../controllers/team.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.get("/me", protect, getMyTeam);
router.get("/history", protect, getTeamHistory);
router.post("/rejoin", protect, rejoinTeam);

export default router;