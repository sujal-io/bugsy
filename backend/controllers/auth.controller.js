import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Team from "../models/team.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists (email OR username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create a personal team so every user has a workspace.
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const personalTeam = await Team.create({
      name: `${username}'s Personal`,
      admin: user._id,
      members: [user._id],
      inviteCode,
    });

    user.teams = [personalTeam._id];
    user.activeTeam = personalTeam._id;
    // Back-compat with existing code paths
    user.team = personalTeam._id;
    await user.save();

    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        teams: user.teams,
        activeTeam: user.activeTeam,
        team: user.team,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        teams: user.teams || (user.team ? [user.team] : []),
        activeTeam: user.activeTeam || user.team || null,
        team: user.team || user.activeTeam || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};