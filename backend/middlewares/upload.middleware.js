import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Allowed MIME types and their canonical extensions
const ALLOWED_MIME_TYPES = {
  "image/png":        "png",
  "image/jpeg":       "jpg",
  "application/pdf":  "pdf",
  "text/plain":       "txt",
  // .log files are typically sent as text/plain or application/octet-stream
  "application/octet-stream": "log",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_BUG   = 5;

// Store files in a dedicated Cloudinary folder, preserving the original filename
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bugsy/attachments",
    // Cloudinary uses 'raw' resource type for non-image files
    resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  }),
});

// Filter runs before the file reaches Cloudinary — reject unsupported types early
function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: PNG, JPG, JPEG, PDF, TXT, LOG`
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
    files:    MAX_FILES_PER_BUG,
  },
});

export default upload;
