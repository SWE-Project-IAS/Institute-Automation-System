import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
    const isRaw = ['application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/octet-stream'].includes(file.mimetype);
    return {
        folder: 'assignments',
        public_id: `${req.body.studentRollNo}_${Date.now()}`,
        resource_type: isRaw ? 'raw' : 'auto',
    };
    }

  });
  

export const upload = multer({ storage });
