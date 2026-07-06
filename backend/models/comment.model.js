import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    filename: String,
    url: String,
    publicId: String,
    mimetype: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: true },
);

const commentSchema = new mongoose.Schema(
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
    text: {
      type: String,
      default: "",
      trim: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
