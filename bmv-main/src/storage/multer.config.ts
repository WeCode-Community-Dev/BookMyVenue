import { diskStorage } from 'multer';
import { extname } from 'path';

export const venueImageMulterOptions = {
  storage: diskStorage({
    destination: './uploads/venue',

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);

      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'), false);
    }

    cb(null, true);
  },
};

export const venueDocumentMulterOptions = {
  storage: diskStorage({
    destination: './uploads/venues',

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);

      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error('Only PDF, JPG and PNG files are allowed.'),
        false,
      );
    }

    cb(null, true);
  },
};

export const profilePictureMulterOptions = {
  storage: diskStorage({
    destination: './uploads/profiles',

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);

      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'), false);
    }

    cb(null, true);
  },
};