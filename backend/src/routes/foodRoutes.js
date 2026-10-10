import { Router } from 'express';
import {
  getAllFoods,
  getFoodByIdOrSlug,
  createFood,
  updateFood,
  deleteFood,
  toggleAvailability
} from '../controllers/foodController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateFoodItem } from '../middleware/validate.js';

const router = Router();

router.get('/', getAllFoods);
router.get('/:idOrSlug', getFoodByIdOrSlug);
router.post('/', authenticateToken, requireAdmin, validateFoodItem, createFood);
router.put('/:id', authenticateToken, requireAdmin, updateFood);
router.patch('/:id/toggle-availability', authenticateToken, requireAdmin, toggleAvailability);
router.delete('/:id', authenticateToken, requireAdmin, deleteFood);

export default router;
