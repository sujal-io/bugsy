import express from "express";
import { createTeam, getMyTeams, getTeamById, joinTeam, leaveTeam } from "../controllers/team.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.get("/teams", protect, getMyTeams);
router.get("/:teamId", protect, getTeamById);
router.delete("/:teamId", protect, leaveTeam);

export default router;