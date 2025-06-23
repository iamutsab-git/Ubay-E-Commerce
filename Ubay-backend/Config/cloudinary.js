import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern_uploads', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file formats
    resource_type: 'auto', // Auto-detect file type (image, video, etc.)
  },
});

export { cloudinary, storage };