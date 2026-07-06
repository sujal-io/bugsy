import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
  type: String,
  required: true,
  unique: true,
  trim: true,
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

password: {
  type: String,
  default: null,
},

avatar: {
  type: String,
  default: "",
},

provider: {
  type: String,
  enum: ["local", "google", "github"],
  default: "local",
},

googleId: {
  type: String,
  default: null,
},

githubId: {
  type: String,
  default: null,
},

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    teamHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;