import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_FILES = {
  training: path.join(__dirname, '../../../data/training_examples.json'),
  templates: path.join(__dirname, '../../../data/cadence_templates.json'),
  intelligence: path.join(__dirname, '../../../data/company_intelligence.json'),
  prompts: path.join(__dirname, '../../../data/prompt_templates.json')
};

/**
 * GET /api/database/:type
 * Get data from a specific database file
 */
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!DATA_FILES[type]) {
      return res.status(404).json({
        error: 'Database type not found',
        available: Object.keys(DATA_FILES)
      });
    }

    const data = await fs.readFile(DATA_FILES[type], 'utf-8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error(`Error reading ${req.params.type} database:`, error);
    res.status(500).json({
      error: 'Failed to load database'
    });
  }
});

/**
 * PUT /api/database/:type
 * Update entire database file
 */
router.put('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!DATA_FILES[type]) {
      return res.status(404).json({
        error: 'Database type not found'
      });
    }

    const updatedData = req.body;
    updatedData.last_updated = new Date().toISOString();

    await fs.writeFile(
      DATA_FILES[type],
      JSON.stringify(updatedData, null, 2)
    );

    res.json({
      message: 'Database updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error(`Error updating ${req.params.type} database:`, error);
    res.status(500).json({
      error: 'Failed to update database'
    });
  }
});

/**
 * POST /api/database/training/example
 * Add a new training example
 */
router.post('/training/example', async (req, res) => {
  try {
    const newExample = req.body;

    if (!newExample.input || !newExample.output) {
      return res.status(400).json({
        error: 'Example must have input and output fields'
      });
    }

    const data = await fs.readFile(DATA_FILES.training, 'utf-8');
    const trainingData = JSON.parse(data);

    const id = `example_${Date.now()}`;
    newExample.id = id;
    newExample.created_at = new Date().toISOString();

    trainingData.examples.push(newExample);
    trainingData.last_updated = new Date().toISOString();

    await fs.writeFile(DATA_FILES.training, JSON.stringify(trainingData, null, 2));

    res.status(201).json(newExample);
  } catch (error) {
    console.error('Error adding training example:', error);
    res.status(500).json({
      error: 'Failed to add training example'
    });
  }
});

/**
 * PUT /api/database/training/example/:id
 * Update a training example
 */
router.put('/training/example/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExample = req.body;

    const data = await fs.readFile(DATA_FILES.training, 'utf-8');
    const trainingData = JSON.parse(data);

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

    await fs.writeFile(DATA_FILES.training, JSON.stringify(trainingData, null, 2));

    res.json(trainingData.examples[index]);
  } catch (error) {
    console.error('Error updating training example:', error);
    res.status(500).json({
      error: 'Failed to update training example'
    });
  }
});

/**
 * DELETE /api/database/training/example/:id
 * Delete a training example
 */
router.delete('/training/example/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await fs.readFile(DATA_FILES.training, 'utf-8');
    const trainingData = JSON.parse(data);

    const originalLength = trainingData.examples.length;
    trainingData.examples = trainingData.examples.filter(ex => ex.id !== id);

    if (trainingData.examples.length === originalLength) {
      return res.status(404).json({
        error: 'Example not found'
      });
    }

    trainingData.last_updated = new Date().toISOString();

    await fs.writeFile(DATA_FILES.training, JSON.stringify(trainingData, null, 2));

    res.json({ message: 'Example deleted successfully' });
  } catch (error) {
    console.error('Error deleting training example:', error);
    res.status(500).json({
      error: 'Failed to delete training example'
    });
  }
});

/**
 * POST /api/database/intelligence/company
 * Add company intelligence
 */
router.post('/intelligence/company', async (req, res) => {
  try {
    const newCompany = req.body;

    if (!newCompany.name) {
      return res.status(400).json({
        error: 'Company name is required'
      });
    }

    const data = await fs.readFile(DATA_FILES.intelligence, 'utf-8');
    const intelligenceData = JSON.parse(data);

    const id = `company_${Date.now()}`;
    newCompany.id = id;
    newCompany.created_at = new Date().toISOString();

    if (!intelligenceData.companies) {
      intelligenceData.companies = [];
    }

    intelligenceData.companies.push(newCompany);
    intelligenceData.last_updated = new Date().toISOString();

    await fs.writeFile(DATA_FILES.intelligence, JSON.stringify(intelligenceData, null, 2));

    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error adding company intelligence:', error);
    res.status(500).json({
      error: 'Failed to add company intelligence'
    });
  }
});

/**
 * PUT /api/database/intelligence/company/:id
 * Update company intelligence
 */
router.put('/intelligence/company/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCompany = req.body;

    const data = await fs.readFile(DATA_FILES.intelligence, 'utf-8');
    const intelligenceData = JSON.parse(data);

    if (!intelligenceData.companies) {
      return res.status(404).json({
        error: 'No companies found'
      });
    }

    const index = intelligenceData.companies.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Company not found'
      });
    }

    intelligenceData.companies[index] = {
      ...updatedCompany,
      id,
      updated_at: new Date().toISOString()
    };
    intelligenceData.last_updated = new Date().toISOString();

    await fs.writeFile(DATA_FILES.intelligence, JSON.stringify(intelligenceData, null, 2));

    res.json(intelligenceData.companies[index]);
  } catch (error) {
    console.error('Error updating company intelligence:', error);
    res.status(500).json({
      error: 'Failed to update company intelligence'
    });
  }
});

/**
 * DELETE /api/database/intelligence/company/:id
 * Delete company intelligence
 */
router.delete('/intelligence/company/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await fs.readFile(DATA_FILES.intelligence, 'utf-8');
    const intelligenceData = JSON.parse(data);

    if (!intelligenceData.companies) {
      return res.status(404).json({
        error: 'No companies found'
      });
    }

    const originalLength = intelligenceData.companies.length;
    intelligenceData.companies = intelligenceData.companies.filter(c => c.id !== id);

    if (intelligenceData.companies.length === originalLength) {
      return res.status(404).json({
        error: 'Company not found'
      });
    }

    intelligenceData.last_updated = new Date().toISOString();

    await fs.writeFile(DATA_FILES.intelligence, JSON.stringify(intelligenceData, null, 2));

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company intelligence:', error);
    res.status(500).json({
      error: 'Failed to delete company intelligence'
    });
  }
});

export default router;

// Made with Bob