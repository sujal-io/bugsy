import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bugRoutes from "./routes/bug.route.js";
import authRoutes from "./routes/auth.route.js";
import teamRoutes from "./routes/team.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import aiRoutes from "./routes/ai.route.js";
import commentRoutes from "./routes/comment.route.js";
import activityRoutes from "./routes/activity.route.js";

dotenv.config({quiet: true});

connectDB();

const app = express();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors({
  origin: "*",
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bugsy API is running 🚀");
});


// routes
app.use("/api/bugs", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activity", activityRoutes);

// error middleware (always last)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});