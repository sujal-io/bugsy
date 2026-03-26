import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const app = express();

const PORT = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});