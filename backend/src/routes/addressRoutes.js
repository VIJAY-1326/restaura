import { Router } from 'express';
import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAddress } from '../middleware/validate.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAddresses);
router.post('/', validateAddress, createAddress);
router.put('/:id', validateAddress, updateAddress);
router.patch('/:id/default', setDefaultAddress);
router.delete('/:id', deleteAddress);

export default router;
