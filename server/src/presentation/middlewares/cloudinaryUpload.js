import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../infrastructure/config/cloudinary.config.js";

const cloudinaryUpload = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  return multer({
    storage,
  });
};

export default cloudinaryUpload;