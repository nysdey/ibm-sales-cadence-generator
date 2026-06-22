import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const FEEDBACK_FILE = path.join(__dirname, '../../../data/generated_emails.json');

// Initialize feedback file if it doesn't exist
async function initializeFeedbackFile() {
  try {
    await fs.access(FEEDBACK_FILE);
  } catch {
    const initialData = {
      emails: [],
      last_updated: new Date().toISOString()
    };
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(initialData, null, 2));
  }
}

/**
 * GET /api/feedback/emails
 * Get all generated emails with feedback
 */
router.get('/emails', async (req, res) => {
  try {
    await initializeFeedbackFile();
    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const feedbackData = JSON.parse(data);
    res.json(feedbackData);
  } catch (error) {
    console.error('Error reading generated emails:', error);
    res.status(500).json({
      error: 'Failed to load generated emails'
    });
  }
});

/**
 * POST /api/feedback/emails
 * Save a generated email
 */
router.post('/emails', async (req, res) => {
  try {
    await initializeFeedbackFile();
    const { prospectName, companyName, cadenceType, emailContent } = req.body;

    if (!prospectName || !companyName || !cadenceType || !emailContent) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const feedbackData = JSON.parse(data);

    const newEmail = {
      id: `email_${Date.now()}`,
      prospectName,
      companyName,
      cadenceType,
      emailContent,
      created_at: new Date().toISOString(),
      feedback: {
        ratings: {},
        comments: [],
        overall_score: null
      }
    };

    feedbackData.emails.unshift(newEmail);
    feedbackData.last_updated = new Date().toISOString();

    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2));

    res.status(201).json(newEmail);
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({
      error: 'Failed to save email'
    });
  }
});

/**
 * PUT /api/feedback/emails/:id/rating
 * Add or update rating for an email
 */
router.put('/emails/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { criterion, score } = req.body;

    if (!criterion || score === undefined) {
      return res.status(400).json({
        error: 'Criterion and score are required'
      });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({
        error: 'Score must be between 1 and 5'
      });
    }

    await initializeFeedbackFile();
    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const feedbackData = JSON.parse(data);

    const emailIndex = feedbackData.emails.findIndex(e => e.id === id);
    if (emailIndex === -1) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    feedbackData.emails[emailIndex].feedback.ratings[criterion] = score;
    
    // Calculate overall score
    const ratings = Object.values(feedbackData.emails[emailIndex].feedback.ratings);
    if (ratings.length > 0) {
      feedbackData.emails[emailIndex].feedback.overall_score = 
        ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }

    feedbackData.last_updated = new Date().toISOString();

    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2));

    res.json(feedbackData.emails[emailIndex]);
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({
      error: 'Failed to update rating'
    });
  }
});

/**
 * POST /api/feedback/emails/:id/comment
 * Add a comment to an email
 */
router.post('/emails/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        error: 'Comment is required'
      });
    }

    await initializeFeedbackFile();
    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const feedbackData = JSON.parse(data);

    const emailIndex = feedbackData.emails.findIndex(e => e.id === id);
    if (emailIndex === -1) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    const newComment = {
      id: `comment_${Date.now()}`,
      text: comment.trim(),
      created_at: new Date().toISOString()
    };

    feedbackData.emails[emailIndex].feedback.comments.push(newComment);
    feedbackData.last_updated = new Date().toISOString();

    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2));

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      error: 'Failed to add comment'
    });
  }
});

/**
 * DELETE /api/feedback/emails/:id
 * Delete an email
 */
router.delete('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await initializeFeedbackFile();
    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const feedbackData = JSON.parse(data);

    const originalLength = feedbackData.emails.length;
    feedbackData.emails = feedbackData.emails.filter(e => e.id !== id);

    if (feedbackData.emails.length === originalLength) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    feedbackData.last_updated = new Date().toISOString();

    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackData, null, 2));

    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({
      error: 'Failed to delete email'
    });
  }
});

export default router;

// Made with Bob