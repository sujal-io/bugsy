import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_BUG = 20;

// Store images in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bugsy/attachments",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  }),
});

// Reject unsupported file types
function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Only PNG, JPG and JPEG images are allowed."
      ),
      false
    );
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_BUG,
  },
});

export default upload;