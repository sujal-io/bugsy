import Bug from "../models/bug.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createBug = async (req, res, next) => {
  try {
    const { title, description, steps, expected, actual, priority, assignedTo } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.team) {
      return res.status(400).json({
        message: "User is not part of any team",
      });
    }

    // Validate assignedTo if provided
    if (assignedTo) {
      const isValidMember = await User.findOne({
        _id: assignedTo,
        team: user.team,
      });

      if (!isValidMember) {
        return res.status(400).json({
          message: "User is not part of this team",
        });
      }
    }

    const bug = await Bug.create({
      title,
      description,
      steps,
      expected,
      actual,
      priority,
      user: req.user.id,
      team: user.team,
      assignedTo: assignedTo || null,
    });

    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET ALL BUGS ----------------
export const getBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find()
      .populate("user", "username email")
      .populate("assignedTo", "username email");

    res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

// ---------------- UPDATE BUG ----------------
export const updateBug = async (req, res, next) => {
  try {
    const { status, solution, title, description, assignedTo } = req.body;

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const user = await User.findById(req.user.id);
    const team = await Team.findById(bug.team || user?.team);
    const isCreator = String(bug.user) === String(req.user.id);
    const isAdmin = String(team?.admin) === String(req.user.id);
    const isAssignedUser =
      bug.assignedTo && String(bug.assignedTo) === String(req.user.id);

    // ---------------- TEAM CHECK ----------------
    if (!bug?.team) {
      if (!isCreator) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this bug" });
      }

      if (!user?.team) {
        return res.status(400).json({
          message: "User is not part of any team, cannot update legacy bug",
        });
      }

      bug.team = user.team;
    } else {
      if (!user?.team || String(bug.team) !== String(user.team)) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this bug" });
      }
    }

    // ---------------- ASSIGN USER ----------------
    if (assignedTo !== undefined) {
      // Only creator and admin can change assignment
      if (!isCreator && !isAdmin) {
        return res.status(403).json({
          message: "Only bug creator and team admin can assign users",
        });
      }

      if (assignedTo) {
        const isValidMember = await User.findOne({
          _id: assignedTo,
          team: bug.team,
        });

        if (!isValidMember) {
          return res.status(400).json({
            message: "User is not part of this team",
          });
        }
      }

      bug.assignedTo = assignedTo || null;
    }

    // ---------------- STATUS UPDATE ----------------
    if (status) {
      // Determine who can change status
      if (status === "Fixed") {
        // Only assigned user can mark as Fixed
        if (!isAssignedUser) {
          return res.status(403).json({
            message: "Only assigned user can mark this bug as Fixed",
          });
        }
      } else if (status === "In Progress") {
        // Only assigned user or creator can change to In Progress
        if (!isAssignedUser && !isCreator) {
          return res.status(403).json({
            message: "Only assigned user or creator can change status to In Progress",
          });
        }
      } else if (status === "Open") {
        // Only creator can change back to Open
        if (!isCreator) {
          return res.status(403).json({
            message: "Only bug creator can reopen this bug",
          });
        }
      }

      bug.status = status;
    }

    // -------- SOLUTION UPDATE (separate from status) --------
    if (solution !== undefined) {
      // Only assigned user can add/update solution
      if (!isAssignedUser) {
        return res.status(403).json({
          message: "Only assigned user can add or update solution",
        });
      }

      if (solution && solution.trim() === "") {
        return res.status(400).json({
          message: "Solution cannot be empty",
        });
      }

      // If solution is provided, set status to Fixed
      if (solution && solution.trim() !== "") {
        bug.solution = solution;
        bug.status = "Fixed";
        bug.updatedBy = req.user.id;
      }
    }

    // ---------------- EDIT TITLE/DESCRIPTION ----------------
    if (title || description) {
      if (!isCreator) {
        return res.status(403).json({
          message: "Only creator can edit bug details",
        });
      }

      if (title) bug.title = title;
      if (description) bug.description = description;
    }

    const updatedBug = await bug.save();

    return res.status(200).json(updatedBug);
  } catch (error) {
    next(error);
  }
};

// ---------------- DELETE BUG ----------------
export const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const user = await User.findById(req.user.id);
    const team = await Team.findById(user.team);

    const isCreator = String(bug.user) === String(req.user.id);
    const isAdmin = String(team?.admin) === String(req.user.id);

    if (!bug?.team) {
      if (!isCreator) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this bug" });
      }
    } else {
      if (!user?.team || String(bug.team) !== String(user.team)) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this bug" });
      }
    }

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message: "Only creator or admin can delete this bug",
      });
    }

    await bug.deleteOne();

    return res.status(200).json({ message: "Bug deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------- MY BUGS ----------------
export const getMyBugs = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort } = req.query;

    const user = await User.findById(req.user.id);

    if (!user?.team) {
      return res.status(400).json({ message: "User is not part of any team" });
    }

    let filter = { user: req.user.id, team: user.team };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const [totalCount, bugs] = await Promise.all([
      Bug.countDocuments(filter),
      Bug.find(filter)
        .populate("user", "username email")
        .populate("assignedTo", "username email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limitNumber));

    return res.status(200).json({
      bugs,
      page: pageNumber,
      limit: limitNumber,
      totalCount,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- TEAM BUGS ----------------
export const getTeamBugs = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort, assignedTo } = req.query;
    const user = await User.findById(req.user.id);

    if (!user?.team) {
      return res.status(400).json({ message: "User is not part of any team" });
    }

    const filter = { team: user.team };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (assignedTo) filter.assignedTo = assignedTo;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const [totalCount, bugs] = await Promise.all([
      Bug.countDocuments(filter),
      Bug.find(filter)
        .populate("user", "username email")
        .populate("updatedBy", "username email")
        .populate("assignedTo", "username email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limitNumber));

    return res.status(200).json({
      bugs,
      page: pageNumber,
      limit: limitNumber,
      totalCount,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};