import { Router } from 'express';
import {
  getWishlist,
  toggleWishlist,
  getWishlistIds
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getWishlist);
router.get('/ids', getWishlistIds);
router.post('/toggle', toggleWishlist);

export default router;
