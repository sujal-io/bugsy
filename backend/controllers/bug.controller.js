import Bug from "../models/bug.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";
export const createBug = async (req, res, next) => {
  try {
    const { title, description, steps, expected, actual, priority } = req.body;

    // get user
    const user = await User.findById(req.user.id);

    if (!user.team) {
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
      team: user.team,
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
    const { status } = req.body;

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const user = await User.findById(req.user.id);

    // OWNER CHECK
    if (bug.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this bug" });
    }

    bug.status = status;

    if (status === "Fixed") {
      bug.solution = solution;
      bug.updatedBy = req.user.id;
    }

    await bug.save();

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
    const team = await Team.findById(user.team);

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

    const bugs = await Bug.find(filter)
      .populate("user", "username email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

export const getTeamBugs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const bugs = await Bug.find({ team: user.team })
      .populate("user", "username")
      .populate("updatedBy", "username")
      .sort({ createdAt: -1 });

    res.json(bugs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};