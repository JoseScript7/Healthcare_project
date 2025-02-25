import express from 'express';
import authRoutes from './auth.routes.js';
import inventoryRoutes from './inventory.routes.js';
import facilityRoutes from './facility.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/facilities', facilityRoutes);

export default router; 