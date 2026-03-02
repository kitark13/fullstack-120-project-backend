import multer from 'multer';

const baseConfig = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
};

export const uploadAvatar = multer({
  ...baseConfig,
  limits: { fileSize: 500 * 1024 },
}); // 500KB

export const uploadStoryImage = multer({
  ...baseConfig,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB
