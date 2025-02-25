import { Router } from 'express';
import { login, register, logout, getProfile, changePassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);

export default router; 