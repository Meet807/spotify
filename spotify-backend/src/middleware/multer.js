import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";  // ✅ Correct path


// Define storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "uploads";

    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "uploads/audios";
    }

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "video",
      public_id: Date.now().toString() // Using timestamp as file name
    };
  }
});

// File filter: Allow only images and audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and audio files are allowed"), false);
  }
};

// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
