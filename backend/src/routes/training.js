import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const TRAINING_FILE = path.join(__dirname, '../../../data/training_examples.json');

/**
 * GET /api/training/examples
 * Get all training examples
 */
router.get('/examples', async (req, res) => {
  try {
    const data = await fs.readFile(TRAINING_FILE, 'utf-8');
    const trainingData = JSON.parse(data);
    res.json(trainingData);
  } catch (error) {
    console.error('Error reading training examples:', error);
    res.status(500).json({
      error: 'Failed to load training examples'
    });
  }
});

/**
 * POST /api/training/examples
 * Add a new training example
 */
router.post('/examples', async (req, res) => {
  try {
    const newExample = req.body;

    // Validate required fields
    if (!newExample.input || !newExample.output) {
      return res.status(400).json({
        error: 'Example must have input and output fields'
      });
    }

    // Read current data
    const data = await fs.readFile(TRAINING_FILE, 'utf-8');
    const trainingData = JSON.parse(data);

    // Generate ID
    const id = `example_${Date.now()}`;
    newExample.id = id;
    newExample.created_at = new Date().toISOString();

    // Add to examples
    trainingData.examples.push(newExample);
    trainingData.last_updated = new Date().toISOString();

    // Save
    await fs.writeFile(TRAINING_FILE, JSON.stringify(trainingData, null, 2));

    res.status(201).json(newExample);
  } catch (error) {
    console.error('Error adding training example:', error);
    res.status(500).json({
      error: 'Failed to add training example'
    });
  }
});

/**
 * PUT /api/training/examples/:id
 * Update a training example
 */
router.put('/examples/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExample = req.body;

    // Read current data
    const data = await fs.readFile(TRAINING_FILE, 'utf-8');
    const trainingData = JSON.parse(data);

    // Find and update example
    const index = trainingData.examples.findIndex(ex => ex.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Example not found'
      });
    }

    trainingData.examples[index] = {
      ...updatedExample,
      id,
      updated_at: new Date().toISOString()
    };
    trainingData.last_updated = new Date().toISOString();

    // Save
    await fs.writeFile(TRAINING_FILE, JSON.stringify(trainingData, null, 2));

    res.json(trainingData.examples[index]);
  } catch (error) {
    console.error('Error updating training example:', error);
    res.status(500).json({
      error: 'Failed to update training example'
    });
  }
});

/**
 * DELETE /api/training/examples/:id
 * Delete a training example
 */
router.delete('/examples/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Read current data
    const data = await fs.readFile(TRAINING_FILE, 'utf-8');
    const trainingData = JSON.parse(data);

    // Filter out the example
    const originalLength = trainingData.examples.length;
    trainingData.examples = trainingData.examples.filter(ex => ex.id !== id);

    if (trainingData.examples.length === originalLength) {
      return res.status(404).json({
        error: 'Example not found'
      });
    }

    trainingData.last_updated = new Date().toISOString();

    // Save
    await fs.writeFile(TRAINING_FILE, JSON.stringify(trainingData, null, 2));

    res.json({ message: 'Example deleted successfully' });
  } catch (error) {
    console.error('Error deleting training example:', error);
    res.status(500).json({
      error: 'Failed to delete training example'
    });
  }
});

export default router;

// Made with Bob
