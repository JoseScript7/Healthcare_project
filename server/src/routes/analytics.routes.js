import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import {
  getAnalytics,
  getStockMovements,
  getLowStock,
  getExpiring
} from '../controllers/analytics.controller.js';

const router = Router();

router.use(authMiddleware);

// Analytics routes accessible by managers and admins
router.get('/', checkRole(['admin', 'manager']), getAnalytics);
router.get('/movements', checkRole(['admin', 'manager']), getStockMovements);
router.get('/low-stock', checkRole(['admin', 'manager']), getLowStock);
router.get('/expiring', checkRole(['admin', 'manager']), getExpiring);

export default router; 