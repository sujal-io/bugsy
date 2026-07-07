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

// Store attachments in Cloudinary
const attachmentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bugsy/attachments",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  }),
});

// Store avatars in Cloudinary
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "bugsy/avatars",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    transformation: [{ width: 400, height: 400, crop: "fill" }],
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
  storage: attachmentStorage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_BUG,
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

export default upload;
export { uploadAvatar };