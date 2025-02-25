import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  generateInventoryReport,
  generateTransactionReport
} from '../controllers/report.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/inventory', generateInventoryReport);
router.get('/transactions', generateTransactionReport);

export default router; 