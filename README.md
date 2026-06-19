# IBM Infrastructure Cadence Generator

AI-powered personalized sales cadence generator for IBM infrastructure solutions, designed to create highly targeted outbound sequences for enterprise B2B sales.

## 🎯 Overview

This application generates personalized Salesloft cadences tailored to specific prospects and their companies across IBM's infrastructure portfolio: **IBM Fusion**, **IBM PowerVS**, and **IBM FlashSystems**. It uses Azure OpenAI to create executive-level, industry-specific outreach that eliminates generic templates and placeholders.

## ✨ Key Features

- **AI-Powered Personalization**: Generates cadences using Azure OpenAI GPT-4
- **Multi-Product Support**: IBM Fusion, IBM PowerVS, and IBM FlashSystems
- **Flexible Cadence Types**: Choose from 7 different cadence scenarios
- **Industry Intelligence**: Automatically infers industry and applies relevant context
- **Training System**: Learn from your best examples to improve output quality
- **Validation**: Prevents placeholder usage and ensures real prospect data
- **Professional UI**: Clean, IBM-branded interface built with React and Tailwind CSS

## 🎯 Supported Products & Cadence Types

### IBM Fusion (Hybrid Cloud Infrastructure)
- **Virtualization Focus**: VMware cost pressure, hybrid flexibility, infrastructure optimization
- **Application Modernization**: Containers, OpenShift, platform engineering, developer velocity
- **Generative AI**: Data readiness, AI infrastructure, secure scaling of AI workloads

### IBM PowerVS (Cloud-based Power Systems)
- **Power Systems Modernization**: AIX/IBM i workload migration, cloud flexibility, cost optimization

### IBM FlashSystems (Enterprise Storage)
- **Storage Modernization**: Performance, data management, cyber resilience, cost efficiency

### Multi-Product Scenarios
- **Whitespace/New Client Introduction**: Discovery-focused outreach for new accounts
- **Infrastructure Transformation**: End-to-end modernization across compute, storage, and Power workloads

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│   Vite + Tailwind│
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express Backend│ (Port 5000)
│   Node.js API   │
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼──────┐  │
│ Azure OpenAI  │  │
│   GPT-4 API   │  │
└───────────────┘  │
                   │
         ┌─────────▼─────────┐
         │  Training Data    │
         │  JSON Files       │
         └───────────────────┘
```

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Azure OpenAI**: API key and endpoint (see setup guide)
- **IBM Account**: For accessing Azure OpenAI through IBM's Microsoft agreement

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
cd salesloft-data

# Install all dependencies
npm run install:all
```

### 2. Configure Azure OpenAI

```bash
# Copy environment template
cd backend
cp .env.example .env

# Edit .env with your Azure OpenAI credentials
nano .env
```

Required environment variables:
```env
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 3. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 5000
```

### 4. Access the Application

Open your browser to: **http://localhost:3000**

## 📖 Usage

### Generating Cadences

1. Enter a **real prospect name** (e.g., "Sarah Chen")
2. Enter a **real company name** (e.g., "Goldman Sachs")
3. **Select one or more cadence types** based on your sales strategy:
   - Choose product-specific cadences (Fusion, PowerVS, FlashSystems)
   - Select whitespace intro for new client outreach
   - Pick infrastructure transformation for comprehensive deals
4. Click **"Generate Cadences"**
5. Review the personalized cadences
6. Copy individual emails or entire cadences
7. Paste into Salesloft

### Cadence Selection Guide

**For VMware Migration Opportunities**: Select "Virtualization (IBM Fusion)"

**For Application Modernization**: Select "Application Modernization (IBM Fusion)"

**For AI Infrastructure**: Select "Generative AI (IBM Fusion)"

**For Power Systems Customers**: Select "Power Systems Modernization (IBM PowerVS)"

**For Storage Refresh**: Select "Storage Modernization (IBM FlashSystems)"

**For New Accounts (Whitespace)**: Select "Whitespace/New Client Introduction"

**For Large Infrastructure Deals**: Select "Infrastructure Transformation (Multi-Product)"

**Pro Tip**: You can select multiple cadence types to generate different approaches for the same prospect!

### Important Rules

❌ **DO NOT USE**:
- Placeholders like `{{Name}}`, `{{Company}}`, `TBD`
- Generic examples like "Acme Corp", "John Doe"
- Test data or sample names

✅ **DO USE**:
- Real prospect names from your target accounts
- Actual company names you're prospecting
- Specific, identifiable organizations

## 📁 Project Structure

```
salesloft-cadence-generator/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API and validation
│   │   └── App.jsx          # Main app
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration
│   │   └── server.js        # Entry point
│   └── package.json
├── data/                     # Training data
│   ├── training_examples.json
│   ├── cadence_templates.json
│   ├── company_intelligence.json
│   └── prompt_templates.json
└── docs/                     # Documentation
    ├── SETUP.md
    ├── TRAINING_GUIDE.md
    ├── DEPLOYMENT.md
    └── CHROME_EXTENSION_PLAN.md
```

## 🎓 Training the System

The system learns from examples in `data/training_examples.json`. To add your own:

1. Copy an empty template from the file
2. Fill in with your best-performing emails
3. Include prospect name, company, industry, and full email text
4. Save the file - the system will use it immediately

See [TRAINING_GUIDE.md](docs/TRAINING_GUIDE.md) for detailed instructions.

## 🔧 API Endpoints

### Cadence Generation
- `POST /api/cadence/generate` - Generate cadences
  - Body: `{ prospectName, companyName, cadenceTypes: [] }`
  - cadenceTypes: Optional array of cadence type strings
- `GET /api/cadence/test` - Test Azure OpenAI connection

### Training Data
- `GET /api/training/examples` - Get all examples
- `POST /api/training/examples` - Add new example
- `PUT /api/training/examples/:id` - Update example
- `DELETE /api/training/examples/:id` - Delete example

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Deploy backend
cd ../backend
vercel
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🔮 Future Roadmap

### Phase 2: Training Management (1 week)
- Web UI for managing training examples
- Import/export functionality
- Quality scoring system

### Phase 3: Multi-User & Roles (1-2 weeks)
- Authentication (Auth0/Clerk)
- Role-based access (Owner/Admin/Seller)
- User management dashboard
- PostgreSQL database

### Phase 4: Chrome Extension (2-3 weeks)
- Direct Salesloft integration
- Auto-populate cadence steps
- Context extraction from Salesloft pages
- One-click generation

See [CHROME_EXTENSION_PLAN.md](docs/CHROME_EXTENSION_PLAN.md) for technical details.

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style
- ESLint for JavaScript
- Prettier for formatting
- Follow existing patterns

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store secrets in deployment platform

## 🐛 Troubleshooting

### "Azure OpenAI API error"
- Check your API key in `.env`
- Verify endpoint URL is correct
- Ensure deployment name matches your Azure resource

### "Failed to load training data"
- Ensure `data/` directory exists
- Check JSON files are valid
- Run `npm run dev:backend` to see detailed errors

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/src/server.js`
- Clear browser cache

## 📄 License

UNLICENSED - Internal IBM use only

## 👥 Support

For questions or issues:
1. Check documentation in `docs/`
2. Review training examples in `data/`
3. Contact the IBM Fusion sales team

## 🙏 Acknowledgments

Built for IBM Fusion sales team to accelerate personalized outreach and improve conversion rates through AI-powered cadence generation.

---

**Version**: 2.0.0 (Multi-Product Support)
**Last Updated**: June 19, 2026

## 🆕 What's New in v2.0

- ✅ **Multi-Product Support**: IBM Fusion, PowerVS, and FlashSystems
- ✅ **7 Cadence Types**: Flexible cadence selection for different scenarios
- ✅ **Whitespace Cadences**: New client introduction sequences
- ✅ **Product-Specific Intelligence**: Tailored messaging for each product line
- ✅ **Enhanced Industry Context**: Product fit recommendations by industry
- ✅ **Flexible Generation**: Select 1 or more cadence types per generation