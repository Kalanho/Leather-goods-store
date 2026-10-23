import { Router } from 'express';
import { upload } from '../config/multerStorage';
import { uploadImages } from '../controllers/uploadController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/',
  requireAuth,
  upload.array('images', 10),
  uploadImages
);

export default router;