import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// Memory storage to process directly with Cloudinary or fallback
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Invalid image format. Allowed formats: JPG, PNG, WEBP, GIF"), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
});

export const uploadSingle = (fieldName = "image") => upload.single(fieldName);
