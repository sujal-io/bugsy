import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bugRoutes from "./routes/bug.route.js";
import authRoutes from "./routes/auth.route.js";
import oauthRoutes from "./routes/oauth.route.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import teamRoutes from "./routes/team.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import aiRoutes from "./routes/ai.route.js";
import commentRoutes from "./routes/comment.route.js";
import activityRoutes from "./routes/activity.route.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config({quiet: true});

connectDB();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinTeam", (teamId) => {
    socket.join(teamId);
  
    console.log(`Socket ${socket.id} joined team ${teamId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;

// middlewares
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.send("Bugsy API is running 🚀");
});


// routes
app.use("/api/bugs", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/activity", activityRoutes);

// error middleware (always last)
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});