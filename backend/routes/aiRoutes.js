import express from 'express';
import { getAIShoppingAssistant } from '../controllers/aiController.js';

const router = express.Router();

// @route   POST /api/ai/shopping-assistant
// @desc    Personal Shopping Copilot powered by Gemini API
// @access  Public
router.post('/shopping-assistant', getAIShoppingAssistant);

export default router;
