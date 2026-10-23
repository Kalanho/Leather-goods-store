import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Публичные
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Только для авторизованных админов
router.post('/', requireAuth, createProduct);
router.patch('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;