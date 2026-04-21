import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    bug: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bug",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created bug",
        "assigned bug",
        "changed status",
        "added solution",
        "commented on bug",
        "edited bug",
      ],
      required: true,
    },

    details: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
