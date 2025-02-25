import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import {
  createTransferRequest,
  approveTransferRequest,
  completeTransferRequest,
  getFacilityTransfers
} from '../controllers/transfer.controller.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createTransferRequest);
router.get('/', getFacilityTransfers);
router.put('/:id/approve', checkRole(['admin', 'manager']), approveTransferRequest);
router.put('/:id/complete', checkRole(['admin', 'manager']), completeTransferRequest);

export default router; 