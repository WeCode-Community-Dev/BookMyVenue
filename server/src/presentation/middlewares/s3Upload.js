import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../../infrastructure/config/s3.config.js";

const s3Upload = (folderName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,

      contentType: multerS3.AUTO_CONTENT_TYPE,

      key: (req, file, cb) => {
        cb(
          null,
          `${folderName}/${Date.now()}-${file.originalname}`
        );
      },
    }),
  });

export default s3Upload;