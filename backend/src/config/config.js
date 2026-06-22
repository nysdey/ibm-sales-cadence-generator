import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Watsonx.ai Configuration
  watsonx: {
    apiKey: process.env.WATSONX_API_KEY,
    endpoint: process.env.WATSONX_ENDPOINT,
    projectId: process.env.WATSONX_PROJECT_ID,
    modelId: process.env.WATSONX_MODEL_ID || 'anthropic/claude-3-5-sonnet-20241022',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // Data paths
  dataPath: {
    trainingExamples: './data/training_examples.json',
    cadenceTemplates: './data/cadence_templates.json',
    companyIntelligence: './data/company_intelligence.json',
    promptTemplates: './data/prompt_templates.json',
  }
};

// Validate required configuration
export const validateConfig = () => {
  const errors = [];
  
  if (!config.watsonx.apiKey) {
    errors.push('WATSONX_API_KEY is required');
  }
  
  if (!config.watsonx.endpoint) {
    errors.push('WATSONX_ENDPOINT is required');
  }
  
  if (!config.watsonx.projectId) {
    errors.push('WATSONX_PROJECT_ID is required');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('See .env.example for reference.');
    return false;
  }
  
  return true;
};

export default config;

// Made with Bob
