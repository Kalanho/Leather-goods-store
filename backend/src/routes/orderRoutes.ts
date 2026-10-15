import { Router } from 'express';
import {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/:orderNumber', getOrderByNumber);

router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;