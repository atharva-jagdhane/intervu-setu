import express from 'express';
import {
  createConfig,
  getMyConfigs,
  getConfigById,
  getTaxonomy,
  generateQuestions,
  getQuestionsByConfig
} from '../controllers/interviewController.js';
import {
  startSession,
  saveTranscript,
  endSession,
  getSessionById,
  getMySessions
} from '../controllers/sessionController.js';
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

// Protected Real-Time Interview Session endpoints (Phase 4)
router.post('/session/start', protect, startSession);
router.post('/session/:sessionId/transcript', protect, saveTranscript);
router.post('/session/:sessionId/end', protect, endSession);
router.get('/session/:sessionId', protect, getSessionById);
router.get('/sessions', protect, getMySessions);

export default router;
