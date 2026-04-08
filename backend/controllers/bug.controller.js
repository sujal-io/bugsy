import Bug from "../models/bug.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";
export const createBug = async (req, res, next) => {
  try {
    const { title, description, steps, expected, actual, priority } = req.body;

    // get user
    const user = await User.findById(req.user.id);

    const teamId = user?.activeTeam || user?.team;
    if (!teamId) {
      return res.status(400).json({
        message: "User is not part of any team",
      });
    }

    const bug = await Bug.create({
      title,
      description,
      steps,
      expected,
      actual,
      priority,
      user: req.user.id,
      team: teamId,
    });

    res.status(201).json(bug);
  } catch (error) {
    next(error); // pass to middleware
  }
};

export const getBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find().populate("user", "username email");
    res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

export const updateBug = async (req, res, next) => {
  try {
    const { status, solution, title, description } = req.body;

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const user = await User.findById(req.user.id);
    const userTeamId = user?.activeTeam || user?.team;

    const isCreator = String(bug.user) === String(req.user.id);

    // TEAM CHECK (legacy-safe)
    // If a legacy bug somehow has no team, only the creator can update it.
    if (!bug?.team) {
      if (!isCreator) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this bug" });
      }
      // Auto-migrate legacy bug to the user's team (required by schema)
      if (!userTeamId) {
        return res.status(400).json({
          message: "User is not part of any team, cannot update legacy bug",
        });
      }
      bug.team = userTeamId;
    } else {
      if (!userTeamId || String(bug.team) !== String(userTeamId)) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this bug" });
      }
    }

    bug.status = status;

    if (status) {
      bug.status = status;

      if (status === "Fixed") {
        if (!solution || solution.trim() === "") {
          return res
            .status(400)
            .json({ message: "Solution is required while fixing a bug" });
        }

        bug.solution = solution;
        bug.updatedBy = req.user.id;
      }
    }

    if (title || description) {
      if (!bug.user || String(bug.user) !== String(req.user.id)) {
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

export const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const user = await User.findById(req.user.id);
    const userTeamId = user?.activeTeam || user?.team;
    const team = userTeamId ? await Team.findById(userTeamId) : null;

    const isCreator = String(bug.user) === String(req.user.id);
    const isAdmin = String(team?.admin) === String(req.user.id);

    // TEAM CHECK (legacy-safe)
    // If a legacy bug somehow has no team, only the creator can delete it.
    if (!bug?.team) {
      if (!isCreator) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this bug" });
      }
    } else {
      if (!userTeamId || String(bug.team) !== String(userTeamId)) {
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

export const getMyBugs = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort } = req.query;

    let filter = { user: req.user.id };

    // filtering
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // sorting
    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const [totalCount, bugs] = await Promise.all([
      Bug.countDocuments(filter),
      Bug.find(filter)
        .populate("user", "username email")
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

export const getTeamBugs = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sort } = req.query;
    const user = await User.findById(req.user.id);

    const teamId = user?.activeTeam || user?.team;
    if (!teamId) {
      return res.status(400).json({ message: "User is not part of any team" });
    }

    const filter = { team: teamId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const [totalCount, bugs] = await Promise.all([
      Bug.countDocuments(filter),
      Bug.find(filter)
        .populate("user", "username email")
        .populate("updatedBy", "username email")
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
