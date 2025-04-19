import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dbvb5gscj',
  api_key: '479336277386214',
  api_secret: 'K2gPsrhOOFqzR5E3OXoooBIioTY',
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
