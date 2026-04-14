import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    steps: [
      {
        type: String,
        required: true,
      },
    ],

    expected: {
      type: String,
    },

    actual: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Fixed"],
      default: "Open",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    solution: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;
