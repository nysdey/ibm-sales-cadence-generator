import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Check if database is enabled
const DB_ENABLED = process.env.DB_ENABLED !== 'false';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sales_cadence_builder',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool only if database is enabled
let pool = null;
let dbConnected = false;

if (DB_ENABLED) {
  pool = new Pool(dbConfig);

  // Test connection
  pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
    dbConnected = true;
  });

  pool.on('error', (err) => {
    console.warn('⚠️  Database connection error:', err.message);
    dbConnected = false;
  });
} else {
  console.log('ℹ️  Database disabled - running in file-based mode');
}

// Query helper function
export const query = async (text, params) => {
  if (!pool || !DB_ENABLED) {
    console.warn('⚠️  Database not available, query skipped');
    return { rows: [], rowCount: 0 };
  }
  
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  if (!pool || !DB_ENABLED) {
    console.warn('⚠️  Database not available, transaction skipped');
    return null;
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database schema
export const initializeDatabase = async () => {
  if (!pool || !DB_ENABLED) {
    console.log('ℹ️  Database disabled, skipping initialization');
    return false;
  }
  
  try {
    console.log('🔄 Initializing database schema...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('Owner', 'Manager', 'Seller')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cadences table
    await query(`
      CREATE TABLE IF NOT EXISTS cadences (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        persona VARCHAR(255),
        campaign VARCHAR(255),
        type VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        archived BOOLEAN DEFAULT FALSE,
        duration INTEGER,
        steps JSONB DEFAULT '[]',
        people_added INTEGER DEFAULT 0,
        people_started INTEGER DEFAULT 0,
        people_finished INTEGER DEFAULT 0,
        bounced INTEGER DEFAULT 0,
        reply_rate DECIMAL(5,2) DEFAULT 0,
        click_rate DECIMAL(5,2) DEFAULT 0,
        open_rate DECIMAL(5,2) DEFAULT 0,
        meeting_rate DECIMAL(5,2) DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create generated_emails table
    await query(`
      CREATE TABLE IF NOT EXISTS generated_emails (
        id SERIAL PRIMARY KEY,
        cadence_id INTEGER REFERENCES cadences(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        prospect_name VARCHAR(255),
        company_name VARCHAR(255),
        cadence_name VARCHAR(255),
        cadence_type VARCHAR(255),
        industry VARCHAR(255),
        step_day INTEGER,
        grade VARCHAR(10),
        grade_reason TEXT,
        additional_context TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create email_ratings table
    await query(`
      CREATE TABLE IF NOT EXISTS email_ratings (
        id SERIAL PRIMARY KEY,
        email_id INTEGER REFERENCES generated_emails(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        criterion VARCHAR(50) NOT NULL,
        score INTEGER CHECK (score >= 1 AND score <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email_id, user_id, criterion)
      )
    `);

    // Create email_comments table
    await query(`
      CREATE TABLE IF NOT EXISTS email_comments (
        id SERIAL PRIMARY KEY,
        email_id INTEGER REFERENCES generated_emails(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create knowledge_base table
    await query(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL CHECK (type IN ('product', 'company', 'industry')),
        name VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_cadences_status ON cadences(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_cadences_archived ON cadences(archived)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_cadences_created_by ON cadences(created_by)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_emails_cadence_id ON generated_emails(cadence_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_ratings_email_id ON email_ratings(email_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_comments_email_id ON email_comments(email_id)`);

    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Seed initial data
export const seedDatabase = async () => {
  if (!pool || !DB_ENABLED) {
    console.log('ℹ️  Database disabled, skipping seeding');
    return false;
  }
  
  try {
    // Check if users exist
    const userCheck = await query('SELECT COUNT(*) FROM users');
    if (userCheck.rows && userCheck.rows[0] && parseInt(userCheck.rows[0].count) > 0) {
      console.log('ℹ️  Database already seeded, skipping...');
      return true;
    }

    console.log('🌱 Seeding database with initial data...');

    // Insert sample users
    await query(`
      INSERT INTO users (name, email, role) VALUES
      ('Sarah Johnson', 'sarah.johnson@ibm.com', 'Owner'),
      ('Mike Chen', 'mike.chen@ibm.com', 'Manager'),
      ('Emily Rodriguez', 'emily.rodriguez@ibm.com', 'Manager'),
      ('David Kim', 'david.kim@ibm.com', 'Seller')
    `);

    console.log('✅ Database seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
    throw error;
  }
};

export default pool;

// Made with Bob
