import Bug from "../models/bug.model.js";

// CREATE BUG
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
    });

    res.status(201).json(bug);
  } catch (error) {
    next(error); // pass to middleware
  }
};