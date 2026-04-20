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

    // Assign team to user and add to history
    user.team = team._id;
    if (!user.teamHistory.includes(team._id)) {
      user.teamHistory.push(team._id);
    }
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

export const joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    // find user
    const user = await User.findById(req.user.id);

    // check if already in a team
    if (user.team) {
      return res.status(400).json({
        message: "User already in a team",
      });
    }

    // find team by invite code
    const team = await Team.findOne({ inviteCode });

    if (!team) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    // add user to team members
    team.members.push(req.user.id);
    await team.save();

    // assign team to user and add to history
    user.team = team._id;
    if (!user.teamHistory.includes(team._id)) {
      user.teamHistory.push(team._id);
    }
    await user.save();

    // opulate for response
    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(200).json({
      message: "Joined team successfully",
      team: populatedTeam,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.team) {
      return res.status(404).json({ message: "User is not part of any team" });
    }

    const populatedTeam = await Team.findById(user.team)
      .populate("admin", "username email")
      .populate("members", "username email");

    if (!populatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({ team: populatedTeam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.team) {
      return res.status(400).json({ message: "User is not part of any team" });
    }

    const team = await Team.findById(user.team);

    if (!team) {
      // clear user's team just in case
      user.team = null;
      await user.save();
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove user from members
    team.members = team.members.filter(
      (m) => m.toString() !== req.user.id.toString()
    );

    // If the user was the admin
    if (team.admin.toString() === req.user.id.toString()) {
      if (team.members.length > 0) {
        // Promote the first remaining member to admin
        team.admin = team.members[0];
      } else {
        // No members left -> delete the team
        await Team.findByIdAndDelete(team._id);
        user.team = null;
        await user.save();
        return res.status(200).json({ message: "Left team and deleted empty team", team: null });
      }
    }

    await team.save();

    // Clear user's team (but keep in history)
    user.team = null;
    await user.save();

    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    return res.status(200).json({ message: "Left team successfully", team: populatedTeam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET TEAM HISTORY ----------------
export const getTeamHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "teamHistory",
        select: "name inviteCode admin members",
        populate: [
          { path: "admin", select: "username email" },
          { path: "members", select: "username email" },
        ],
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const teamHistory = user.teamHistory || [];

    return res.status(200).json({ teamHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------- REJOIN TEAM ----------------
export const rejoinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const user = await User.findById(req.user.id);

    // Check if user already in a team
    if (user.team) {
      return res.status(400).json({
        message: "User already in a team",
      });
    }

    // Find team by invite code
    const team = await Team.findOne({ inviteCode });

    if (!team) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    // Check if team is in user's history
    if (!user.teamHistory.includes(team._id)) {
      return res.status(403).json({
        message: "You are not allowed to rejoin this team",
      });
    }

    // Add user back to team members
    if (!team.members.includes(req.user.id)) {
      team.members.push(req.user.id);
    }
    await team.save();

    // Assign team to user
    user.team = team._id;
    await user.save();

    // Populate for response
    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(200).json({
      message: "Rejoined team successfully",
      team: populatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};