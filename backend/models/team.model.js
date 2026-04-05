import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    // Team name
    name: {
      type: String,
      required: true,
    },

    // Admin (creator of team)
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Members of team
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Invite code (used to join team)
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;