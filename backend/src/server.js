import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config, { validateConfig } from './config/config.js';
import { initializeDatabase, seedDatabase } from './config/database.js';
import cadenceRoutes from './routes/cadence.js';
import trainingRoutes from './routes/training.js';
import feedbackRoutes from './routes/feedback.js';
import databaseRoutes from './routes/database.js';

// Validate configuration before starting
if (!validateConfig()) {
  console.error('\n❌ Server startup failed due to configuration errors.');
  console.error('Please create a .env file based on .env.example and configure Watsonx.ai settings.\n');
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/cadence', cadenceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/database', databaseRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Initialize database and start server
const PORT = config.port;

async function startServer() {
  try {
    // Try to initialize database (optional)
    let dbStatus = '✗ Not configured (file-based mode)';
    try {
      const dbInit = await initializeDatabase();
      const dbSeed = await seedDatabase();
      if (dbInit) {
        dbStatus = '✓ Connected & Initialized';
      }
    } catch (dbError) {
      console.warn('⚠️  Database initialization failed:', dbError.message);
      console.log('ℹ️  Continuing in file-based mode...');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 IBM Sales Cadence Builder - Backend Server');
      console.log('='.repeat(60));
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`🔐 CORS enabled for: ${config.corsOrigin}`);
      console.log(`🤖 Watsonx.ai: ${config.watsonx.endpoint ? '✓ Configured' : '✗ Not configured'}`);
      console.log(`💾 Database: ${dbStatus}`);
      console.log('='.repeat(60));
      console.log('\n📋 Available endpoints:');
      console.log('  GET  /health                         - Health check');
      console.log('  POST /api/cadence/generate           - Generate cadences');
      console.log('  GET  /api/cadence/test               - Test Watsonx.ai connection');
      console.log('  GET  /api/training/examples          - Get training examples');
      console.log('  POST /api/training/examples          - Add training example');
      console.log('  PUT  /api/training/examples/:id      - Update training example');
      console.log('  DELETE /api/training/examples/:id    - Delete training example');
      console.log('  GET  /api/feedback/emails            - Get generated emails');
      console.log('  POST /api/feedback/emails            - Save generated email');
      console.log('  PUT  /api/feedback/emails/:id/rating - Rate email');
      console.log('  POST /api/feedback/emails/:id/comment - Add comment');
      console.log('  DELETE /api/feedback/emails/:id      - Delete email');
      console.log('  GET  /api/database/:type             - Get database');
      console.log('  PUT  /api/database/:type             - Update database');
      console.log('  POST /api/database/training/example  - Add training example');
      console.log('  POST /api/database/intelligence/company - Add company intel');
      console.log('\n✨ Ready to generate personalized cadences!\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;

// Made with Bob
