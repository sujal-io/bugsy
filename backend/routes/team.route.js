import express from "express";
import { createTeam, getMyTeam, joinTeam } from "../controllers/team.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.get("/me", protect, getMyTeam);

export default router;