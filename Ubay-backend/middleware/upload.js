import multer from 'multer';
import { cloudinary} from '../Config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'mern_uploads', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file formats
      resource_type: 'auto', // Auto-detect file type (image, video, etc.)
    },
  });


const upload = multer({ storage });

export default upload;