import multer from "multer";
import ApiError from "../utils/apiError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

const upload = multer({
   storage: multer.memoryStorage(),

   limits: {
      files: 5,
      fileSize: 5 * 1024 * 1024, // 5 MB
   },

   fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
         return cb(
            new ApiError(
               STATUS_CODES.BAD_REQUEST,
               "Only image files are allowed"
            )
         );
      }

      cb(null, true);
   },
});

export default upload;