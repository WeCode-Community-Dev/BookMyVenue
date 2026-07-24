import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, 
    limits: { fileSize: 5 * 1024 * 1024 }, // mx 5MB
});

export default upload;
