import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getInventoryForecast,
  getStockOptimization,
  getExpiryRisk
} from '../controllers/ml.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/forecast', getInventoryForecast);
router.get('/optimize', getStockOptimization);
router.get('/risk', getExpiryRisk);

export default router; 