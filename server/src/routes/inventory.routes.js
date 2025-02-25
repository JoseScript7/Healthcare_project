import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import {
  getAllItems,
  addItem,
  updateItemDetails,
  removeItem,
  getStock,
  updateStockLevel
} from '../controllers/inventory.controller.js';

const router = Router();

// Protected routes
router.use(authMiddleware);

// Item routes
router.get('/', checkRole(['admin', 'staff', 'manager']), getAllItems);
router.post('/', checkRole(['admin']), addItem);
router.put('/:id', checkRole(['admin']), updateItemDetails);
router.delete('/:id', checkRole(['admin']), removeItem);

// Stock routes
router.get('/:id/stock', checkRole(['admin', 'staff', 'manager']), getStock);
router.put('/:id/stock', checkRole(['admin', 'staff']), updateStockLevel);

export default router; 