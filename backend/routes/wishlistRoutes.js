import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.get('/', getWishlist);
router.route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

export default router;
