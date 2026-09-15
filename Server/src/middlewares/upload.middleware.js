import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Cloudinary Storage for Profiles
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safqa/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('الملف المرفوع يجب أن يكون صورة بصيغة (PNG, JPG, WEBP)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Helper function to extract Cloudinary secure URL
export const getFileUrl = (req, file) => {
  if (!file) return undefined;
  return file.path || file.secure_url || file.url;
};

export default upload;
