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

    await bug.deleteOne();

    return res.status(200).json({ message: "Bug deleted successfully" });
  } catch (error) {
    next(error);
  }
};
