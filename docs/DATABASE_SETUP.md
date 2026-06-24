# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the IBM Sales Cadence Builder application.

## Prerequisites

- PostgreSQL 14 or higher installed on your system
- Node.js 18 or higher
- npm or yarn package manager

## Installation

### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

### Windows

1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Add PostgreSQL bin directory to your PATH

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

## Database Configuration

### 1. Create Database

```bash
# Connect to PostgreSQL as postgres user
psql -U postgres

# Create database
CREATE DATABASE sales_cadence_builder;

# Exit psql
\q
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` in the backend directory:

```bash
cd backend
cp .env.example .env
```

Update the database configuration in `.env`:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sales_cadence_builder
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sales_cadence_builder
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

**Important:** Replace `your_password` with your actual PostgreSQL password.

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
```

### 4. Initialize Database Schema

Run the database setup script to create tables and seed initial data:

```bash
npm run setup-db
```

This will:
- Create all necessary tables (users, cadences, generated_emails, email_ratings, etc.)
- Create indexes for optimal performance
- Seed the database with sample users

## Database Schema

### Tables

#### users
- Stores user information (name, email, role)
- Roles: Owner, Manager, Seller

#### cadences
- Stores sales cadence information
- Includes metrics (open rate, click rate, reply rate, etc.)
- Supports draft/published status and archiving

#### generated_emails
- Stores AI-generated emails
- Links to cadences and users
- Includes grading and context information

#### email_ratings
- Stores user ratings for emails
- Multiple criteria (relevance, personalization, clarity, etc.)
- Scores from 1-5

#### email_comments
- Stores user feedback comments on emails

#### knowledge_base
- Stores product, company, and industry intelligence
- JSON data structure for flexibility

## Verification

### Check Database Connection

```bash
# Connect to database
psql -U postgres -d sales_cadence_builder

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```

### Start the Server

```bash
# Start development server
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database schema initialized successfully
🚀 Server running on port 3001
```

## Troubleshooting

### Connection Refused

If you see "connection refused" errors:

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify PostgreSQL is listening on port 5432:
   ```bash
   sudo lsof -i :5432
   ```

### Authentication Failed

If you see "authentication failed" errors:

1. Verify your password in `.env` matches your PostgreSQL password
2. Try connecting manually:
   ```bash
   psql -U postgres -d sales_cadence_builder
   ```

### Database Does Not Exist

If you see "database does not exist" errors:

1. Create the database manually:
   ```bash
   psql -U postgres
   CREATE DATABASE sales_cadence_builder;
   \q
   ```

2. Run the setup script again:
   ```bash
   npm run setup-db
   ```

## Maintenance

### Backup Database

```bash
pg_dump -U postgres sales_cadence_builder > backup.sql
```

### Restore Database

```bash
psql -U postgres sales_cadence_builder < backup.sql
```

### Reset Database

```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE sales_cadence_builder;
CREATE DATABASE sales_cadence_builder;
\q

# Run setup script
npm run setup-db
```

## Production Considerations

For production deployments:

1. **Use strong passwords** - Never use default passwords
2. **Enable SSL** - Set `DB_SSL=true` in production
3. **Connection pooling** - Already configured (max 20 connections)
4. **Regular backups** - Set up automated backup schedule
5. **Monitoring** - Monitor database performance and connections
6. **Security** - Restrict database access to application servers only

## Next Steps

After setting up the database:

1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Access the application at http://localhost:3000
4. Test database functionality (create cadences, save emails, etc.)

## Support

For issues or questions:
- Check the main README.md
- Review backend logs for error messages
- Verify all environment variables are set correctly