import express from 'express';
import watsonxAI from '../services/watsonxAI.js';
import promptBuilder from '../services/promptBuilder.js';

const router = express.Router();

/**
 * POST /api/cadence/generate
 * Generate personalized cadences for a prospect
 */
router.post('/generate', async (req, res) => {
  try {
    const { prospectName, companyName, cadenceTypes, industry, additionalContext } = req.body;

    // Validate input
    if (!prospectName || !companyName) {
      return res.status(400).json({
        error: 'Both prospectName and companyName are required'
      });
    }

    // Validate no placeholders
    const placeholderPattern = /\{\{.*?\}\}|TBD|TODO|PLACEHOLDER|example|test|sample/i;
    if (placeholderPattern.test(prospectName) || placeholderPattern.test(companyName)) {
      return res.status(400).json({
        error: 'Please provide real prospect and company names (no placeholders)'
      });
    }

    // Log generation request
    const cadenceInfo = cadenceTypes && cadenceTypes.length > 0
      ? `with cadence types: ${cadenceTypes.join(', ')}`
      : 'with default cadences';
    console.log(`Generating cadences for ${prospectName} at ${companyName} ${cadenceInfo}...`);

    // Build prompts with enhanced context
    const { systemPrompt, userPrompt } = await promptBuilder.buildPrompt(
      prospectName,
      companyName,
      cadenceTypes,
      industry,
      additionalContext
    );

    // Generate cadences using Watsonx.ai
    const response = await watsonxAI.generateCadences(systemPrompt, userPrompt);

    // Parse JSON response
    let cadences;
    try {
      // Try to extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cadences = JSON.parse(jsonMatch[0]);
      } else {
        cadences = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', response);
      return res.status(500).json({
        error: 'Failed to parse AI response. Please try again.',
        details: parseError.message
      });
    }

    // Validate response structure
    if (!cadences.cadences || !Array.isArray(cadences.cadences)) {
      return res.status(500).json({
        error: 'Invalid response structure from AI'
      });
    }

    console.log(`✓ Successfully generated ${cadences.cadences.length} cadences`);

    res.json(cadences);
  } catch (error) {
    console.error('Error generating cadences:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate cadences'
    });
  }
});

/**
 * GET /api/cadence/test
 * Test Watsonx.ai connection
 */
router.get('/test', async (req, res) => {
  try {
    const isConnected = await watsonxAI.testConnection();
    
    if (isConnected) {
      res.json({
        status: 'success',
        message: 'Watsonx.ai connection successful'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Watsonx.ai connection failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;

// Made with Bob
