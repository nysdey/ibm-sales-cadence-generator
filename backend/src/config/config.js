import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Azure OpenAI
  azureOpenAI: {
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
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
  
  if (!config.azureOpenAI.apiKey) {
    errors.push('AZURE_OPENAI_API_KEY is required');
  }
  
  if (!config.azureOpenAI.endpoint) {
    errors.push('AZURE_OPENAI_ENDPOINT is required');
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
