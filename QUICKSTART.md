# Quick Start Guide

Get the IBM Infrastructure Cadence Generator running in 5 minutes.

## Prerequisites

- Node.js v18+ installed
- Azure OpenAI API access (through IBM)

## Setup Steps

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Azure OpenAI

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your Azure OpenAI credentials:

```env
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### 3. Start the Application

```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 4. Generate Your First Cadence

1. Open http://localhost:3000
2. Enter a real prospect name (e.g., "Sarah Chen")
3. Enter a real company name (e.g., "Goldman Sachs")
4. **Select one or more cadence types**:
   - Virtualization (IBM Fusion) - for VMware migration
   - Application Modernization (IBM Fusion) - for container platforms
   - Generative AI (IBM Fusion) - for AI infrastructure
   - Power Systems Modernization (IBM PowerVS) - for AIX/IBM i workloads
   - Storage Modernization (IBM FlashSystems) - for storage refresh
   - Whitespace/New Client Introduction - for new accounts
   - Infrastructure Transformation - for multi-product deals
5. Click "Generate Cadences"
6. Copy the generated emails to Salesloft

## 🎯 Product Selection Guide

**IBM Fusion**: Hybrid cloud infrastructure, VMware migration, app modernization, AI workloads

**IBM PowerVS**: Cloud-based Power Systems for AIX and IBM i workloads

**IBM FlashSystems**: High-performance enterprise storage with cyber resilience

**Multi-Product**: Whitespace accounts or comprehensive infrastructure transformation

## Important Rules

✅ **DO**:
- Use real prospect and company names
- Review and customize generated content
- Add your own training examples

❌ **DON'T**:
- Use placeholders like {{Name}} or TBD
- Use generic examples like "Acme Corp"
- Share API keys or commit .env files

## Next Steps

- **Add Training Data**: Edit `data/training_examples.json` with your best emails
- **Customize Prompts**: Modify `data/prompt_templates.json` for your style
- **Deploy**: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup

## Troubleshooting

**"Azure OpenAI API error"**
- Check your API key in `backend/.env`
- Verify endpoint URL format
- Ensure deployment name matches Azure

**"Port already in use"**
```bash
lsof -ti:5000 | xargs kill -9  # Kill backend
lsof -ti:3000 | xargs kill -9  # Kill frontend
```

**Need Help?**
- See full [README.md](README.md)
- Check [docs/SETUP.md](docs/SETUP.md)
- Review training examples in `data/`

---

**Ready to generate personalized cadences!** 🚀