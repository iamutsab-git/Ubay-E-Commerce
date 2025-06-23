import multer from 'multer';
import { storage } from '../Config/cloudinary.js';

const upload = multer({ storage });

export default upload;