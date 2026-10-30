import { Router } from 'express';
import { deleteOrder } from '../controllers/orderController';
import {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Публичные
// Правильно:
router.get('/', requireAuth, getAllOrders);
router.post('/', createOrder);
router.get('/:orderNumber', getOrderByNumber);
router.patch('/:id/status', requireAuth, updateOrderStatus);
router.delete('/:id', requireAuth, deleteOrder);

export default router;