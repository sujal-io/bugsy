import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if user already in a team
    const user = await User.findById(req.user.id);

    if (user.team) {
      return res.status(400).json({
        message: "User already in a team",
      });
    }

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create team
    const team = await Team.create({
      name,
      admin: req.user.id,
      members: [req.user.id],
      inviteCode,
    });

    // Assign team to user
    user.team = team._id;
    await user.save();

    // Populate admin and members
    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
