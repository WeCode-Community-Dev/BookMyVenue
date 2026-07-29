import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { AppError } from '@/utils/AppError';

// Strict allowlist — SVGs excluded to prevent stored-XSS via Cloudinary
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// 5 MB per file cap — prevents disk exhaustion DoS
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: 'uploads/',
  // Randomise filename completely — never use user-supplied originalname
  // Prevents path traversal and filename injection
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).replace(/[^.a-z0-9]/gi, '').toLowerCase();
    const safeName = `${Date.now()}-${randomUUID()}${ext ? `.${ext}` : ''}`;
    cb(null, safeName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, WebP, and GIF images are allowed', 400));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 10, // Maximum 10 files per request
  },
});
