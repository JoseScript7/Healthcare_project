import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  searchInventory,
  getSavedSearches,
  saveSearch,
  getSearchSuggestions
} from '../controllers/search.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/inventory', searchInventory);
router.get('/saved', getSavedSearches);
router.post('/save', saveSearch);
router.get('/suggestions', getSearchSuggestions);

export default router; 