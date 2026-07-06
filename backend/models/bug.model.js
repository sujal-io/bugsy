import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    // Full Cloudinary URL used to display or download the file
    url: {
      type: String,
      required: true,
    },
    // Cloudinary public_id — required to delete the file from Cloudinary later
    publicId: {
      type: String,
      required: true,
    },
    // MIME type stored so the frontend knows how to render the file
    mimetype: {
      type: String,
      required: true,
    },
    
    size: {
      type: Number,
      required: true,
    },
    
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

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

    attachments: {
      type: [attachmentSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A bug cannot have more than 5 attachments",
      },
    },
  },
  { timestamps: true },
);

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;
