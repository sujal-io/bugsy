import express from "express";
import { createBug } from "../controllers/bug.controller.js";

const router = express.Router();

router.post("/", createBug);

export default router;