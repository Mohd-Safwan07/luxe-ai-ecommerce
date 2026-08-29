import express from 'express';
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAdminUsers
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin); // All admin routes require authentication and admin authorization

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAdminUsers);

export default router;
