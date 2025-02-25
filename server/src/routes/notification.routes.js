import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead
} from '../controllers/notification.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router; 