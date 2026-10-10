import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrdersAdmin,
  updateOrderStatus,
  getAllCustomers,
  toggleCustomerStatus,
  getAnalytics
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrdersAdmin);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAllCustomers);
router.patch('/customers/:id/toggle-status', toggleCustomerStatus);
router.get('/analytics', getAnalytics);

export default router;
