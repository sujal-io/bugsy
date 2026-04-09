import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    // Get user (no single team restriction)
    const user = await User.findById(req.user.id);

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create team
    const team = await Team.create({
      name,
      admin: req.user.id,
      members: [req.user.id],
      inviteCode,
    });

    // Add team to user's teams array
    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }

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

    // find team by invite code
    const team = await Team.findOne({ inviteCode });

    if (!team) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    // check if already in this team
    if (user.teams.includes(team._id)) {
      return res.status(400).json({
        message: "User already in this team",
      });
    }

    // add user to team members
    team.members.push(req.user.id);
    await team.save();

    // add team to user's teams array
    user.teams.push(team._id);
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

export const getMyTeams = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("teams");

    if (!user?.teams || user.teams.length === 0) {
      return res.status(200).json({ teams: [] });
    }

    const populatedTeams = await Team.find({ _id: { $in: user.teams } })
      .populate("admin", "username email")
      .populate("members", "username email");

    return res.status(200).json({ teams: populatedTeams });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const user = await User.findById(req.user.id);

    // Check if user is member of this team
    if (!user.teams.includes(teamId)) {
      return res.status(403).json({ message: "Access denied" });
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

export const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const user = await User.findById(req.user.id);

    // Check if user is member of this team
    if (!user.teams.includes(teamId)) {
      return res.status(400).json({ message: "User is not a member of this team" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove user from team members
    team.members = team.members.filter(memberId => memberId.toString() !== req.user.id);
    await team.save();

    // Remove team from user's teams array
    user.teams = user.teams.filter(team => team.toString() !== teamId);
    await user.save();

    // If user was admin, transfer admin to next member or delete team
    if (team.admin.toString() === req.user.id) {
      if (team.members.length > 0) {
        team.admin = team.members[0];
        await team.save();
      } else {
        await Team.findByIdAndDelete(teamId);
        return res.status(200).json({ message: "Team deleted as you were the last member" });
      }
    }

    return res.status(200).json({ message: "Left team successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};