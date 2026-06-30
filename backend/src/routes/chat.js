import express from 'express';
import WatsonxAIService from '../services/watsonxAI.js';

const router = express.Router();
const watsonxService = new WatsonxAIService();

/**
 * POST /api/chat
 * Conversational endpoint — forwards message history to Watsonx.ai
 * Body: { messages: [{ role: 'system'|'user'|'assistant', content: string }] }
 */
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const response = await watsonxService.generateCompletion(messages, {
      maxTokens: 1500,
      temperature: 0.7,
    });

    return res.json({ response });
  } catch (error) {
    console.error('Chat route error:', error.message);
    return res.status(500).json({ error: 'Failed to generate response', detail: error.message });
  }
});

export default router;

// Made with Bob
