# IBM Sales Cadence Builder

AI-powered sales cadence management platform for IBM infrastructure solutions, designed to help sellers create, personalize, and manage highly targeted outbound sequences for enterprise B2B sales.

## 🎯 Overview

This application helps IBM sellers manage and personalize sales cadences using AI-powered email generation. Built with Watsonx.ai, it enables sellers to create contextual, personalized outreach for prospects across IBM's infrastructure portfolio: **IBM Fusion**, **IBM PowerVS**, and **IBM FlashSystems**.

## ✨ Key Features

### Cadence Management
- **Browse Cadences**: View and analyze existing sales cadences with performance metrics
- **Personalize Steps**: AI-powered personalization for each cadence step
- **Performance Analytics**: Track open rates, click rates, reply rates, and meeting conversions
- **Context-Aware**: Save cadence-specific context for better personalization

### AI-Powered Email Generation
- **Watsonx.ai Integration**: Leverages IBM's Watsonx.ai for intelligent email generation
- **Multi-Product Support**: IBM Fusion, IBM PowerVS, and IBM FlashSystems
- **Contextual Personalization**: Uses prospect, company, industry, and additional context
- **Real-time Generation**: Generate and regenerate emails on-demand
- **Quality Tracking**: Review and provide feedback on generated emails

### Knowledge Base
- **Company Intelligence**: Store and manage company profiles with tech stacks and pain points
- **Industry Insights**: Track industry trends, pain points, and IBM solutions
- **Use Cases Library**: Product-specific use cases for PowerVS, FlashSystems, and Fusion
- **Training Data**: Manage good and bad examples to improve AI output

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
│  Watsonx.ai   │  │
│  IBM AI API   │  │
└───────────────┘  │
                   │
         ┌─────────▼─────────┐
         │  Knowledge Base   │
         │  JSON Files       │
         └───────────────────┘
```

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Watsonx.ai**: API key and project ID (IBM internal)
- **IBM Account**: For accessing Watsonx.ai through IBM's AI platform

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
cd sales-cadence-builder

# Install all dependencies
npm run install:all
```

### 2. Configure Watsonx.ai

```bash
# Copy environment template
cd backend
cp .env.example .env

# Edit .env with your Watsonx.ai credentials
nano .env
```

Required environment variables:
```env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
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

### Managing Cadences

1. Navigate to the **Cadences** tab
2. Browse existing cadences with performance metrics
3. Click on a cadence to view detailed steps
4. Click on email steps to personalize with AI

### Personalizing Emails

1. Click on an email step in a cadence
2. Enter prospect details:
   - Prospect Name (required)
   - Company Name (required)
   - Industry (optional)
   - Additional Context (optional)
3. Click **"Generate Personalized Email"**
4. Review the AI-generated email
5. **Save** to database or **Regenerate** for alternatives
6. **Copy** to clipboard for use in Salesloft

### Reviewing Generated Emails

1. Navigate to the **Generated Emails** tab
2. View all AI-generated emails organized by cadence and step
3. Filter by grade, feedback, or search terms
4. Click on an email to provide detailed feedback
5. Rate emails on multiple criteria to improve AI learning

### Managing Knowledge Base

1. Navigate to the **Database** tab
2. Browse tabs:
   - **Companies**: Manage company profiles and intelligence
   - **Industries**: Track industry trends and IBM solutions
   - **Use Cases**: Product-specific use cases and migration paths
   - **Training Data**: Good and bad examples for AI learning
3. Add, edit, or delete records as needed
4. Export data for backup or analysis

## 📁 Project Structure

```
sales-cadence-builder/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── generator/   # Cadence management
│   │   │   ├── training/    # Generated emails
│   │   │   └── admin/       # Database management
│   │   ├── services/        # API and validation
│   │   └── App.jsx          # Main app
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── watsonxAI.js # Watsonx.ai integration
│   │   │   └── promptBuilder.js # Prompt engineering
│   │   ├── config/          # Configuration
│   │   └── server.js        # Entry point
│   └── package.json
├── data/                     # Knowledge base
│   ├── training_examples.json
│   ├── cadence_templates.json
│   ├── company_intelligence.json
│   ├── generated_emails.json
│   └── prompt_templates.json
└── docs/                     # Documentation
    ├── SETUP.md
    └── CHROME_EXTENSION_PLAN.md
```

## 🎓 Training the AI

The system learns from examples in `data/training_examples.json` and user feedback:

### Adding Training Examples
1. Navigate to Database > Training Data
2. Review good and bad examples
3. Add new examples with clear labels
4. System uses these for prompt engineering

### Providing Feedback
1. Review generated emails in the Generated Emails tab
2. Click on an email to provide detailed feedback
3. Rate on multiple criteria (personalization, relevance, clarity, etc.)
4. Add comments and suggestions
5. Feedback helps improve future generations

## 🔧 API Endpoints

### Cadence Generation
- `POST /api/cadence/generate` - Generate personalized emails
  - Body: `{ prospectName, companyName, cadenceTypes, industry, additionalContext }`
- `GET /api/cadence/test` - Test Watsonx.ai connection

### Training Data
- `GET /api/training/examples` - Get all training examples
- `POST /api/training/examples` - Add new example
- `PUT /api/training/examples/:id` - Update example
- `DELETE /api/training/examples/:id` - Delete example

### Generated Emails
- `POST /api/training/generated-emails` - Save generated email
- `GET /api/training/generated-emails` - Get all generated emails

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

See [SETUP.md](docs/SETUP.md) for detailed deployment instructions.

## 🔮 Future Roadmap

### Phase 2: Enhanced Cadence Management (Current)
- ✅ AI-powered email personalization
- ✅ Knowledge base management
- ✅ Feedback and learning system
- 🔄 Cadence creation with dropdowns
- 🔄 Edit and publish cadences
- 🔄 Context management per cadence

### Phase 3: Multi-User & Roles (1-2 weeks)
- Authentication (Auth0/Clerk)
- Role-based access (Admin/Seller)
- User management dashboard
- PostgreSQL database

### Phase 4: Salesloft Integration (2-3 weeks)
- Direct Salesloft API integration
- Auto-populate cadence steps
- Sync performance metrics
- One-click publishing

### Phase 5: Chrome Extension (2-3 weeks)
- Salesloft page integration
- Context extraction from pages
- In-page email generation
- Quick personalization

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
- IBM Carbon design principles
- Follow existing patterns

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store secrets in deployment platform

## 🐛 Troubleshooting

### "Watsonx.ai API error"
- Check your API key in `.env`
- Verify project ID is correct
- Ensure you have access to Watsonx.ai

### "Failed to load training data"
- Ensure `data/` directory exists
- Check JSON files are valid
- Run `npm run dev:backend` to see detailed errors

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/src/server.js`
- Clear browser cache

### Email generation fails
- Check Watsonx.ai connection with `/api/cadence/test`
- Verify prompt templates in `data/prompt_templates.json`
- Review backend logs for detailed errors

## 📄 License

UNLICENSED - Internal IBM use only

## 👥 Support

For questions or issues:
1. Check documentation in `docs/`
2. Review training examples in `data/`
3. Contact the IBM Infrastructure sales enablement team

## 🙏 Acknowledgments

Built for IBM Infrastructure sales team to accelerate personalized outreach and improve conversion rates through AI-powered cadence management and email generation.

---

**Version**: 3.0.0 (AI-Powered Platform)
**Last Updated**: June 23, 2026

## 🆕 What's New in v3.0

- ✅ **Watsonx.ai Integration**: Powered by IBM's enterprise AI platform
- ✅ **Cadence Management**: Browse, analyze, and personalize existing cadences
- ✅ **AI Email Generation**: Context-aware personalization for each step
- ✅ **Knowledge Base**: Comprehensive company, industry, and product intelligence
- ✅ **Feedback System**: Rate and improve AI output quality
- ✅ **Use Cases Library**: Product-specific scenarios for PowerVS, FlashSystems, Fusion
- ✅ **Training Data Management**: Curate examples to improve AI performance