import express from 'express';
import {
  createConfig,
  getMyConfigs,
  getConfigById,
  getTaxonomy,
  generateQuestions,
  getQuestionsByConfig
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public metadata
router.get('/taxonomy', getTaxonomy);

// Protected student configuration endpoints
router.post('/config', protect, createConfig);
router.get('/config', protect, getMyConfigs);
router.get('/config/:id', protect, getConfigById);

// Protected AI Question Generation endpoints (Phase 3)
router.post('/:configId/generate', protect, generateQuestions);
router.get('/:configId/questions', protect, getQuestionsByConfig);

export default router;
