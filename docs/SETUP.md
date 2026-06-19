# Setup Guide

Complete setup instructions for the IBM Fusion Cadence Generator.

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: For version control

### Required Accounts
- **Azure OpenAI Access**: Through IBM's Microsoft enterprise agreement
- **IBM Corporate Account**: For accessing Azure resources

## Step-by-Step Setup

### 1. Install Node.js

**macOS** (using Homebrew):
```bash
brew install node@18
```

**Windows**:
Download from [nodejs.org](https://nodejs.org/)

**Verify installation**:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

### 2. Clone the Repository

```bash
cd ~/projects  # or your preferred directory
git clone <repository-url>
cd salesloft-cadence-generator
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

### 4. Get Azure OpenAI Access

#### Option A: Through IBM IT
1. Submit a request through IBM's internal portal
2. Request access to Azure OpenAI Service
3. Specify: GPT-4 deployment for sales automation
4. Wait for approval (typically 1-3 business days)

#### Option B: Direct Azure Portal (if you have access)
1. Log into [Azure Portal](https://portal.azure.com)
2. Navigate to Azure OpenAI Service
3. Create a new resource or use existing
4. Deploy a GPT-4 model
5. Note your:
   - API Key
   - Endpoint URL
   - Deployment Name

### 5. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=abc123def456...
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Finding Your Azure OpenAI Details**:

1. **API Key**: 
   - Azure Portal → Your OpenAI Resource → Keys and Endpoint
   - Copy "KEY 1" or "KEY 2"

2. **Endpoint**:
   - Same location as API Key
   - Format: `https://your-resource-name.openai.azure.com/`
   - Include the trailing slash

3. **Deployment Name**:
   - Azure Portal → Your OpenAI Resource → Model deployments
   - Use the exact name you gave your GPT-4 deployment

4. **API Version**:
   - Use `2024-02-15-preview` (latest stable)
   - Or check Azure OpenAI documentation for current version

### 6. Test Azure OpenAI Connection

```bash
# Start the backend
cd backend
npm run dev
```

In another terminal:
```bash
# Test the connection
curl http://localhost:5000/api/cadence/test
```

Expected response:
```json
{
  "status": "success",
  "message": "Azure OpenAI connection successful"
}
```

If you see an error:
- Double-check your API key
- Verify endpoint URL format
- Ensure deployment name matches exactly
- Check Azure OpenAI resource is active

### 7. Start the Application

**Option A: Start both servers together**
```bash
# From root directory
npm run dev
```

**Option B: Start separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 8. Access the Application

Open your browser to:
```
http://localhost:3000
```

You should see the IBM Fusion Cadence Generator interface.

## Verification Checklist

- [ ] Node.js v18+ installed
- [ ] All npm dependencies installed
- [ ] Azure OpenAI credentials configured
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 3000)
- [ ] Azure OpenAI connection test passes
- [ ] Can access UI at localhost:3000
- [ ] Training data files exist in `data/` directory

## Common Issues

### "Cannot find module" errors
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm run install:all
```

### "Port already in use"
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### "Azure OpenAI API error"
1. Verify API key is correct (no extra spaces)
2. Check endpoint URL format (must end with `/`)
3. Confirm deployment name matches Azure
4. Ensure your Azure resource is active
5. Check you have quota available

### "Failed to load training data"
```bash
# Verify data files exist
ls -la data/

# Should see:
# - training_examples.json
# - cadence_templates.json
# - company_intelligence.json
# - prompt_templates.json
```

### CORS errors in browser
1. Ensure backend is running
2. Check `CORS_ORIGIN` in backend `.env`
3. Clear browser cache
4. Try incognito/private mode

## Next Steps

Once setup is complete:

1. **Test Generation**: Try generating cadences with real prospect data
2. **Review Training Data**: Examine `data/training_examples.json`
3. **Add Your Examples**: Follow [TRAINING_GUIDE.md](TRAINING_GUIDE.md)
4. **Deploy**: See [DEPLOYMENT.md](DEPLOYMENT.md) when ready

## Security Notes

- **Never commit `.env` files** to version control
- **Keep API keys secure** - they provide access to Azure resources
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** per IBM security policy
- **Monitor usage** in Azure portal to prevent unexpected costs

## Support

If you encounter issues not covered here:

1. Check the main [README.md](../README.md)
2. Review error messages carefully
3. Check Azure OpenAI service status
4. Contact IBM IT support for Azure access issues
5. Reach out to the development team

---

**Last Updated**: June 19, 2026  
**Version**: 1.0.0