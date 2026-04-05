import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bugRoutes from "./routes/bug.route.js";
import authRoutes from "./routes/auth.route.js";
import teamRoutes from "./routes/team.route.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config({quiet: true});

connectDB();

const app = express();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/bugs", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);

// error middleware (always last)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});