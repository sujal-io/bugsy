import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create team
    const team = await Team.create({
      name,
      admin: req.user.id,
      members: [req.user.id],
      inviteCode,
    });

    // Add membership + set active team
    user.teams = Array.isArray(user.teams) ? user.teams : [];
    if (!user.teams.some((t) => String(t) === String(team._id))) {
      user.teams.push(team._id);
    }
    user.activeTeam = team._id;
    // Back-compat
    user.team = team._id;
    await user.save();

    // Populate admin and members
    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam,
      user: {
        id: user._id,
        teams: user.teams,
        activeTeam: user.activeTeam,
        team: user.team,
      },
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
    if (!user) return res.status(404).json({ message: "User not found" });

    // find team by invite code
    const team = await Team.findOne({ inviteCode });

    if (!team) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    // add user to team members
    if (!team.members.some((m) => String(m) === String(req.user.id))) {
      team.members.push(req.user.id);
    }
    await team.save();

    // assign membership + set active team
    user.teams = Array.isArray(user.teams) ? user.teams : [];
    if (!user.teams.some((t) => String(t) === String(team._id))) {
      user.teams.push(team._id);
    }
    user.activeTeam = team._id;
    // Back-compat
    user.team = team._id;
    await user.save();

    // opulate for response
    const populatedTeam = await Team.findById(team._id)
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(200).json({
      message: "Joined team successfully",
      team: populatedTeam,
      user: {
        id: user._id,
        teams: user.teams,
        activeTeam: user.activeTeam,
        team: user.team,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const teamId = user?.activeTeam || user?.team;
    if (!teamId) {
      return res.status(404).json({ message: "User is not part of any team" });
    }

    const populatedTeam = await Team.findById(teamId)
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

export const getMyTeams = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const teamIds = Array.isArray(user.teams)
      ? user.teams
      : user.team
        ? [user.team]
        : [];

    const teams = await Team.find({ _id: { $in: teamIds } })
      .populate("admin", "username email")
      .populate("members", "username email");

    return res.status(200).json({
      teams,
      activeTeam: user.activeTeam || user.team || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const setActiveTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) return res.status(400).json({ message: "teamId is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const memberships = Array.isArray(user.teams)
      ? user.teams.map(String)
      : user.team
        ? [String(user.team)]
        : [];

    if (!memberships.includes(String(teamId))) {
      return res.status(403).json({ message: "Not a member of this team" });
    }

    user.activeTeam = teamId;
    // Back-compat
    user.team = teamId;
    await user.save();

    return res.status(200).json({
      message: "Active team updated",
      user: {
        id: user._id,
        teams: user.teams,
        activeTeam: user.activeTeam,
        team: user.team,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};