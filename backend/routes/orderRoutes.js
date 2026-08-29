import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.get('/:id', getOrderById);

export default router;
