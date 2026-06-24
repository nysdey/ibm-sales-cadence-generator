import { initializeDatabase, seedDatabase } from '../config/database.js';

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');
    
    await initializeDatabase();
    await seedDatabase();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now start the server with: npm run dev\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

// Made with Bob
