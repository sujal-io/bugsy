import Bug from "../models/bug.model.js";
export const createBug = async (req, res, next) => {
  try {
    const { title, description, steps, expected, actual, priority } = req.body;

    const bug = await Bug.create({
      title,
      description,
      steps,
      expected,
      actual,
      priority,
      user: req.user.id,
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

    // OWNER CHECK
    if (bug.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this bug" });
    }

    bug.status = status;
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

    // OWNER CHECK
    if (bug.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this bug" });
    }

   await bug.deleteOne();

    return res.status(200).json({ message: "Bug deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyBugs = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;

    let filter = { user: req.user.id };

    // filter by status
    if (status) {
      filter.status = status;
    }

    // filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // search by title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const bugs = await Bug.find(filter).populate(
      "user",
      "username email"
    );

    return res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};
