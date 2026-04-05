import express from "express";
import { createTeam } from "../controllers/team.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);

export default router;