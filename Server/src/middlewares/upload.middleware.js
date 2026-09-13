import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safqa/profiles', // The folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Optional
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional
  },
});

const upload = multer({ storage: storage });

export default upload;
