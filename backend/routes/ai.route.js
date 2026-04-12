import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { explainBug } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/explain", protect, explainBug);

export default router;