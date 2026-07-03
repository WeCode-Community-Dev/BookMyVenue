import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination : (req, file, cb)=> {
        cb(null, "uploads/venue-documents");
    },

    filename : (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(
                            Math.random() * 1e9
                            )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
  }
};

export const uploadVenueDocuments = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "owner_id_proof", maxCount: 1 },
  { name: "ownership_proof", maxCount: 1 },
  { name: "business_registration", maxCount: 1 },
]);
