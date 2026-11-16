import express from 'express';
import {
  createConfig,
  getMyConfigs,
  getConfigById,
  getTaxonomy
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public metadata
router.get('/taxonomy', getTaxonomy);

// Protected student configuration endpoints
router.post('/config', protect, createConfig);
router.get('/config', protect, getMyConfigs);
router.get('/config/:id', protect, getConfigById);

export default router;
