import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prompt Builder Service
 * Constructs sophisticated prompts for cadence generation
 */
class PromptBuilder {
  constructor() {
    this.trainingExamples = null;
    this.cadenceTemplates = null;
    this.companyIntelligence = null;
    this.promptTemplates = null;
  }

  /**
   * Load all data files
   */
  async loadData() {
    try {
      const dataDir = path.join(__dirname, '../../../data');
      
      // Load training examples
      const trainingPath = path.join(dataDir, 'training_examples.json');
      const trainingData = await fs.readFile(trainingPath, 'utf-8');
      this.trainingExamples = JSON.parse(trainingData);
      
      // Load cadence templates
      const templatesPath = path.join(dataDir, 'cadence_templates.json');
      const templatesData = await fs.readFile(templatesPath, 'utf-8');
      this.cadenceTemplates = JSON.parse(templatesData);
      
      // Load company intelligence
      const companyPath = path.join(dataDir, 'company_intelligence.json');
      const companyData = await fs.readFile(companyPath, 'utf-8');
      this.companyIntelligence = JSON.parse(companyData);
      
      // Load prompt templates
      const promptPath = path.join(dataDir, 'prompt_templates.json');
      const promptData = await fs.readFile(promptPath, 'utf-8');
      this.promptTemplates = JSON.parse(promptData);
      
      console.log('✓ All data files loaded successfully');
    } catch (error) {
      console.error('Error loading data files:', error.message);
      throw new Error('Failed to load training data. Please ensure data files exist.');
    }
  }

  /**
   * Infer industry from company name
   * @param {string} companyName - Company name
   * @returns {string} - Inferred industry
   */
  inferIndustry(companyName) {
    const companyLower = companyName.toLowerCase();
    
    // Financial Services indicators
    if (companyLower.match(/bank|financial|capital|investment|securities|insurance|credit/)) {
      return 'Financial Services';
    }
    
    // Healthcare indicators
    if (companyLower.match(/health|medical|hospital|pharma|biotech|care/)) {
      return 'Healthcare';
    }
    
    // Retail indicators
    if (companyLower.match(/retail|store|shop|mart|commerce/)) {
      return 'Retail';
    }
    
    // Technology indicators
    if (companyLower.match(/tech|software|digital|cloud|data|cyber/)) {
      return 'Technology';
    }
    
    // Manufacturing indicators
    if (companyLower.match(/manufacturing|industrial|automotive|aerospace/)) {
      return 'Manufacturing';
    }
    
    // Telecommunications indicators
    if (companyLower.match(/telecom|wireless|network|communications/)) {
      return 'Telecommunications';
    }
    
    // Energy indicators
    if (companyLower.match(/energy|oil|gas|utility|power/)) {
      return 'Energy';
    }
    
    return 'Enterprise';
  }

  /**
   * Get relevant training examples based on industry
   * @param {string} industry - Industry name
   * @param {number} limit - Max number of examples
   * @returns {Array} - Relevant examples
   */
  getRelevantExamples(industry, limit = 2) {
    if (!this.trainingExamples || !this.trainingExamples.examples) {
      return [];
    }
    
    // Filter examples by industry match
    const industryExamples = this.trainingExamples.examples.filter(
      ex => ex.input.industry === industry
    );
    
    // If we have industry-specific examples, use those
    if (industryExamples.length > 0) {
      return industryExamples.slice(0, limit);
    }
    
    // Otherwise, return general examples
    return this.trainingExamples.examples.slice(0, limit);
  }

  /**
   * Build system prompt
   * @returns {string} - System prompt
   */
  buildSystemPrompt() {
    return this.promptTemplates.systemPrompt;
  }

  /**
   * Build user prompt with context
   * @param {string} prospectName - Prospect name
   * @param {string} companyName - Company name
   * @param {Array<string>} cadenceTypes - Array of cadence types to generate (optional)
   * @param {string} industry - Industry (optional, will be inferred if not provided)
   * @param {string} additionalContext - Additional context to integrate naturally (optional)
   * @returns {string} - User prompt
   */
  buildUserPrompt(prospectName, companyName, cadenceTypes = null, industry = null, additionalContext = null) {
    const inferredIndustry = industry || this.inferIndustry(companyName);
    const relevantExamples = this.getRelevantExamples(inferredIndustry, 2);
    
    // Get industry-specific context
    const industryContext = this.getIndustryContext(inferredIndustry);
    
    // Get product fit information
    const productFit = this.getProductFit(inferredIndustry);
    
    // Add additional context section if provided
    let additionalContextSection = '';
    if (additionalContext) {
      additionalContextSection = `\n## CRITICAL PERSONALIZATION CONTEXT:
${additionalContext}

INTEGRATION REQUIREMENTS:
1. This context MUST be woven naturally into the email opening or body
2. DO NOT add as a P.S., footnote, or separate section
3. Use this context to demonstrate research and relevance
4. Make it feel like you've done your homework on ${companyName}
5. Connect this context directly to the value proposition

Example of good integration:
"I noticed [context detail] - this is exactly why [our solution] could help [company] achieve [specific outcome]."

Example of bad integration:
"[Generic pitch]... P.S. I saw that [context]"
\n`;
    }
    
    // Build examples section
    let examplesSection = '';
    if (relevantExamples.length > 0) {
      examplesSection = '\n\n## TRAINING EXAMPLES (for reference style and quality):\n\n';
      relevantExamples.forEach((example, index) => {
        examplesSection += `### Example ${index + 1}:\n`;
        examplesSection += `Input: ${example.input.prospect_name} at ${example.input.company_name} (${example.input.industry})\n`;
        examplesSection += `Sample Email (Day 1):\n`;
        if (example.output.steps && example.output.steps[0]) {
          examplesSection += `Subject: ${example.output.steps[0].subject}\n`;
          examplesSection += `${example.output.steps[0].body}\n\n`;
        }
      });
    }
    
    // Determine which cadences to generate
    let cadenceInstructions = '';
    if (cadenceTypes && cadenceTypes.length > 0) {
      cadenceInstructions = `Generate ${cadenceTypes.length} complete cadence(s) for ${prospectName} at ${companyName}:\n`;
      cadenceTypes.forEach((type, index) => {
        cadenceInstructions += `${index + 1}. ${this.getCadenceDescription(type)}\n`;
      });
    } else {
      // Default: generate three standard cadences
      cadenceInstructions = `Generate THREE complete cadences for ${prospectName} at ${companyName}:
1. Virtualization Focus (IBM Fusion): VMware cost pressure, hybrid flexibility, infrastructure optimization
2. Application Modernization (IBM Fusion): Containers, OpenShift, platform engineering, developer velocity
3. Generative AI (IBM Fusion): Data readiness, AI infrastructure, secure scaling of AI workloads`;
    }
    
    // Build the complete prompt
    const prompt = `${this.promptTemplates.userPromptTemplate}

## INPUT DATA:
Prospect Name: ${prospectName}
Company Name: ${companyName}
Inferred Industry: ${inferredIndustry}

${industryContext}

${productFit}

${additionalContextSection}

${examplesSection}

## YOUR TASK:
${cadenceInstructions}

CRITICAL REQUIREMENTS:
1. Use the REAL prospect name "${prospectName}" and company name "${companyName}" in EVERY email
2. Make specific, credible references to ${inferredIndustry} industry challenges
3. NO generic placeholders or example text
4. Each cadence must have 8-12 touches across 3-4 weeks
5. Mix Email, Call, and LinkedIn touches
6. Keep emails under 150 words
7. Executive-level tone (concise, insight-driven, outcome-focused)
8. Reference the appropriate IBM product(s) based on the cadence type

OUTPUT FORMAT:
Return a valid JSON object with this exact structure:
{
  "cadences": [
    {
      "name": "Cadence name",
      "product": "ibm_fusion|ibm_powervs|ibm_flashsystems|multi_product",
      "targetPersona": "Specific role",
      "valueProposition": "Business outcome focus",
      "triggerEvents": ["event1", "event2"],
      "differentiation": "vs competitors",
      "steps": [
        {
          "day": 1,
          "channel": "Email",
          "subject": "Subject line",
          "body": "Email body",
          "cta": "Call to action"
        }
      ]
    }
  ]
}`;

    return prompt;
  }

  /**
   * Get cadence description based on type
   * @param {string} cadenceType - Cadence type
   * @returns {string} - Cadence description
   */
  getCadenceDescription(cadenceType) {
    const descriptions = {
      'virtualization': 'Virtualization Focus (IBM Fusion): VMware cost pressure, hybrid flexibility, infrastructure optimization',
      'application_modernization': 'Application Modernization (IBM Fusion): Containers, OpenShift, platform engineering, developer velocity',
      'generative_ai': 'Generative AI (IBM Fusion): Data readiness, AI infrastructure, secure scaling of AI workloads',
      'power_modernization': 'Power Systems Modernization (IBM PowerVS): AIX/IBM i workload migration, cloud flexibility, cost optimization',
      'storage_modernization': 'Storage Modernization (IBM FlashSystems): Performance, data management, cyber resilience, cost efficiency',
      'whitespace': 'Whitespace/New Client Introduction: General infrastructure challenges, multi-product value proposition, discovery-focused',
      'infrastructure_transformation': 'Multi-Product Infrastructure Transformation: End-to-end modernization across compute, storage, and Power workloads'
    };
    return descriptions[cadenceType] || cadenceType;
  }

  /**
   * Get product fit information for industry
   * @param {string} industry - Industry name
   * @returns {string} - Product fit context
   */
  getProductFit(industry) {
    if (!this.companyIntelligence || !this.companyIntelligence.industries[industry]) {
      return '';
    }
    
    const industryData = this.companyIntelligence.industries[industry];
    if (!industryData.product_fit) {
      return '';
    }
    
    return `
## PRODUCT FIT FOR ${industry.toUpperCase()}:
- IBM Fusion: ${industryData.product_fit.ibm_fusion}
- IBM PowerVS: ${industryData.product_fit.ibm_powervs}
- IBM FlashSystems: ${industryData.product_fit.ibm_flashsystems}`;
  }

  /**
   * Get industry-specific context
   * @param {string} industry - Industry name
   * @returns {string} - Industry context
   */
  getIndustryContext(industry) {
    const contexts = {
      'Financial Services': `
## INDUSTRY CONTEXT (Financial Services):
- Key Challenges: VMware cost increases post-Broadcom, regulatory compliance (SOX, PCI-DSS), legacy infrastructure modernization
- Priorities: Cost optimization, security, compliance, operational resilience
- Trigger Events: Broadcom VMware acquisition, cloud migration initiatives, digital transformation
- Tech Stack: Typically VMware-heavy, mainframes, traditional data centers
- Decision Makers: CIO, VP Infrastructure, CISO, Head of IT Operations`,
      
      'Healthcare': `
## INDUSTRY CONTEXT (Healthcare):
- Key Challenges: HIPAA compliance, legacy EHR systems, data security, cost pressures
- Priorities: Patient data security, system reliability, interoperability, cost reduction
- Trigger Events: EHR modernization, cloud adoption, cybersecurity incidents
- Tech Stack: Epic, Cerner, legacy systems, hybrid infrastructure
- Decision Makers: CIO, CMIO, VP IT, Director of Infrastructure`,
      
      'Retail': `
## INDUSTRY CONTEXT (Retail):
- Key Challenges: Seasonal scalability, omnichannel experience, supply chain optimization
- Priorities: Customer experience, agility, cost efficiency, real-time data
- Trigger Events: Peak season prep, digital transformation, supply chain disruption
- Tech Stack: E-commerce platforms, POS systems, inventory management
- Decision Makers: CIO, CTO, VP Digital, VP IT Operations`,
      
      'Technology': `
## INDUSTRY CONTEXT (Technology):
- Key Challenges: Developer velocity, infrastructure costs, scaling AI workloads
- Priorities: Innovation speed, platform engineering, cloud-native architecture
- Trigger Events: Product launches, scaling challenges, competitive pressure
- Tech Stack: Cloud-native, containers, Kubernetes, modern DevOps
- Decision Makers: CTO, VP Engineering, VP Platform, Head of Infrastructure`,
      
      'Manufacturing': `
## INDUSTRY CONTEXT (Manufacturing):
- Key Challenges: OT/IT convergence, supply chain visibility, legacy systems
- Priorities: Operational efficiency, predictive maintenance, supply chain resilience
- Trigger Events: Industry 4.0 initiatives, supply chain disruption, automation projects
- Tech Stack: SCADA, MES, ERP systems, edge computing
- Decision Makers: CIO, VP Operations, VP IT, Plant Managers`,
      
      'Enterprise': `
## INDUSTRY CONTEXT (Enterprise):
- Key Challenges: Infrastructure costs, hybrid cloud complexity, modernization
- Priorities: Cost optimization, agility, security, operational efficiency
- Trigger Events: VMware cost increases, cloud migration, digital transformation
- Tech Stack: Mixed legacy and modern, hybrid cloud, traditional data centers
- Decision Makers: CIO, CTO, VP Infrastructure, Director IT`
    };
    
    return contexts[industry] || contexts['Enterprise'];
  }

  /**
   * Build complete prompt for cadence generation
   * @param {string} prospectName - Prospect name
   * @param {string} companyName - Company name
   * @param {Array<string>} cadenceTypes - Array of cadence types to generate (optional)
   * @param {string} industry - Industry (optional)
   * @param {string} additionalContext - Additional context (optional)
   * @returns {Object} - { systemPrompt, userPrompt }
   */
  async buildPrompt(prospectName, companyName, cadenceTypes = null, industry = null, additionalContext = null) {
    // Ensure data is loaded
    if (!this.trainingExamples) {
      await this.loadData();
    }
    
    return {
      systemPrompt: this.buildSystemPrompt(),
      userPrompt: this.buildUserPrompt(prospectName, companyName, cadenceTypes, industry, additionalContext)
    };
  }
}

// Export singleton instance
export default new PromptBuilder();

// Made with Bob
