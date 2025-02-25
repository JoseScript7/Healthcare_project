import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules
} from '../controllers/scheduled-report.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createSchedule);
router.get('/', getSchedules);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router; 