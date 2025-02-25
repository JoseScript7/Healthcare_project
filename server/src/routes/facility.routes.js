import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import {
  getAllFacilities,
  getFacility,
  addFacility,
  updateFacilityDetails,
  removeFacility,
  getFacilityUsers,
  addFacilityUser,
  removeFacilityUser
} from '../controllers/facility.controller.js';

const router = Router();

// Protected routes
router.use(authMiddleware);

// Public routes (for authenticated users)
router.get('/', getAllFacilities);
router.get('/:id', getFacility);

// Admin only routes
router.post('/', checkRole(['admin']), addFacility);
router.put('/:id', checkRole(['admin']), updateFacilityDetails);
router.delete('/:id', checkRole(['admin']), removeFacility);

// Facility user management routes
router.get('/:id/users', checkRole(['admin', 'manager']), getFacilityUsers);
router.post('/:id/users', checkRole(['admin']), addFacilityUser);
router.delete('/:id/users/:userId', checkRole(['admin']), removeFacilityUser);

export default router; 