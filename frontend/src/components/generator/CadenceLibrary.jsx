import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Plus, Upload, Search, Filter, X, Mail, Phone, Linkedin, ChevronRight, ArrowLeft, Edit2, Copy, Check, Save } from 'lucide-react';
import { generateCadences, saveGeneratedEmail } from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Sample cadences with full step details
const SAMPLE_CADENCES = [
  {
    id: '4080797',
    name: 'US | Select | Infrastructure | Outbound | Client-Intro',
    region: 'US',
    segment: 'Select',
    category: 'Infrastructure',
    persona: 'IT Leaders',
    type: 'Outbound',
    campaign: 'Client-Intro',
    fiscal_year: 'FY26',
    duration: 10,
    people_added: 5479,
    people_started: 3248,
    people_finished: 4057,
    bounced: 4070,
    success_rate: 0.60,
    open_rate: 6.50,
    click_rate: 28.70,
    reply_rate: 0.80,
    meeting_rate: 0.90,
    steps: [
      {
        day: 1,
        channel: 'Email',
        subject: 'Quick introduction - IBM Infrastructure Solutions',
        body: 'Hi {{first_name}},\n\nI hope this email finds you well. I\'m reaching out from IBM\'s Infrastructure team because I noticed {{company_name}} is in a growth phase, and I thought you might be interested in learning how we\'re helping similar organizations modernize their infrastructure.\n\nWe\'ve recently helped companies like yours reduce infrastructure costs by 40% while improving performance. Would you be open to a brief conversation?\n\nBest regards,\n{{sender_name}}',
        status: 'Completed',
        stats: { sent: 2649, opened: 172, clicked: 76, replied: 21 }
      },
      {
        day: 2,
        channel: 'Call',
        body: 'Hi {{first_name}}, this is {{sender_name}} from IBM. I sent you an email yesterday about infrastructure modernization opportunities. I wanted to follow up personally to see if you had a chance to review it and if you\'d like to discuss how we can help {{company_name}} optimize your infrastructure investments.',
        status: 'Logged',
        stats: { attempted: 343, connected: 45, meetings: 12 }
      },
      {
        day: 3,
        channel: 'Email',
        subject: 'Re: Quick introduction - IBM Infrastructure Solutions',
        body: 'Hi {{first_name}},\n\nI wanted to follow up on my previous email. I understand you\'re busy, so I\'ll keep this brief.\n\nI\'d love to share a quick case study of how we helped a company in {{industry}} reduce their infrastructure spend by 35% while improving application performance by 50%.\n\nWould next Tuesday or Wednesday work for a 15-minute call?\n\nBest,\n{{sender_name}}',
        status: 'Scheduled',
        stats: { sent: 2051, opened: 133, clicked: 59, replied: 16 }
      },
      {
        day: 5,
        channel: 'LinkedIn',
        body: 'Hi {{first_name}}, I\'ve been trying to reach you regarding infrastructure modernization opportunities for {{company_name}}. Would you be open to connecting here on LinkedIn? I have some insights that might be valuable for your team.',
        status: 'Scheduled',
        stats: { sent: 1365, accepted: 89, replied: 23 }
      },
      {
        day: 6,
        channel: 'Email',
        subject: 'Thought this might interest you',
        body: 'Hi {{first_name}},\n\nI came across this recent article about infrastructure trends in {{industry}} and immediately thought of you: [Article Link]\n\nThe key takeaway that resonated with me: "Organizations that modernize their infrastructure see 3x faster time-to-market for new applications."\n\nThis aligns perfectly with what we\'re doing at IBM. Would you be interested in learning more?\n\nBest,\n{{sender_name}}',
        status: 'Scheduled',
        stats: { sent: 1740, opened: 95, clicked: 41, replied: 8 }
      },
      {
        day: 8,
        channel: 'Call',
        body: 'Hi {{first_name}}, {{sender_name}} from IBM again. I wanted to make one more attempt to connect with you about infrastructure modernization. I have some specific ideas for {{company_name}} that I think could be really valuable. Do you have 10 minutes this week?',
        status: 'Scheduled',
        stats: { attempted: 285, connected: 31, meetings: 8 }
      },
      {
        day: 10,
        channel: 'Email',
        subject: 'Final follow-up - IBM Infrastructure',
        body: 'Hi {{first_name}},\n\nI don\'t want to be a pest, so this will be my last email. I genuinely believe IBM can help {{company_name}} achieve significant infrastructure improvements.\n\nIf you\'re interested in learning more, just reply to this email or book time directly on my calendar: [Calendar Link]\n\nIf not, no worries at all - I wish you and {{company_name}} all the best!\n\nBest regards,\n{{sender_name}}',
        status: 'Scheduled',
        stats: { sent: 1541, opened: 77, clicked: 35, replied: 12 }
      }
    ]
  },
  {
    id: '4087855',
    name: 'US | Select | Infrastructure | Head of IT | Outbound | Fusion | FY26',
    region: 'US',
    segment: 'Select',
    category: 'Infrastructure',
    persona: 'Head of IT',
    type: 'Outbound',
    campaign: 'Fusion',
    fiscal_year: 'FY26',
    duration: 20,
    people_added: 279,
    people_started: 207,
    people_finished: 356,
    bounced: 488,
    success_rate: 0.00,
    open_rate: 0.80,
    click_rate: 13.50,
    reply_rate: 3.90,
    meeting_rate: 6.10,
    steps: [
      {
        day: 1,
        channel: 'Email',
        subject: 'IBM Fusion - Modernize Your VMware Environment',
        body: 'Hi {{first_name}},\n\nWith recent changes in VMware licensing, many IT leaders are exploring alternatives. IBM Fusion offers a compelling path forward.\n\nWe\'re helping organizations like {{company_name}} migrate from VMware while reducing costs by up to 50% and improving performance.\n\nInterested in learning more?\n\nBest,\n{{sender_name}}',
        status: 'Completed',
        stats: { sent: 207, opened: 2, clicked: 0, replied: 8 }
      },
      {
        day: 3,
        channel: 'LinkedIn',
        body: 'Hi {{first_name}}, I sent you an email about IBM Fusion and VMware alternatives. Given the current market dynamics, I thought this might be timely for {{company_name}}. Would you be open to a brief conversation?',
        status: 'Completed',
        stats: { sent: 195, accepted: 12, replied: 5 }
      },
      {
        day: 5,
        channel: 'Email',
        subject: 'VMware Alternative: Case Study',
        body: 'Hi {{first_name}},\n\nI wanted to share a quick case study: A Fortune 500 company in {{industry}} recently migrated from VMware to IBM Fusion.\n\nResults:\n• 52% cost reduction\n• 40% performance improvement\n• Zero downtime migration\n\nWould you like to see how this could work for {{company_name}}?\n\nBest,\n{{sender_name}}',
        status: 'Scheduled',
        stats: { sent: 180, opened: 1, clicked: 0, replied: 3 }
      }
    ]
  },
  {
    id: '4141902',
    name: 'US | Select | Infrastructure | IT Leaders & Architects | Flash Availability | US | FY26',
    region: 'US',
    segment: 'Select',
    category: 'Infrastructure',
    persona: 'IT Leaders & Architects',
    type: 'Outbound',
    campaign: 'Flash Availability',
    fiscal_year: 'FY26',
    duration: 10,
    people_added: 7999,
    people_started: 3480,
    people_finished: 5075,
    bounced: 8054,
    success_rate: 0.10,
    open_rate: 5.50,
    click_rate: 25.60,
    reply_rate: 0.30,
    meeting_rate: 0.50,
    steps: [
      {
        day: 1,
        channel: 'Email',
        subject: 'IBM FlashSystem - Storage Performance Breakthrough',
        body: 'Hi {{first_name}},\n\nI wanted to reach out about IBM FlashSystem - our latest storage innovation that\'s delivering unprecedented performance for enterprise applications.\n\nKey benefits:\n• 10x faster than traditional storage\n• 99.9999% availability\n• AI-powered optimization\n\nWould you be interested in a demo?\n\nBest,\n{{sender_name}}',
        status: 'Completed',
        stats: { sent: 3480, opened: 191, clicked: 89, replied: 10 }
      },
      {
        day: 3,
        channel: 'Call',
        body: 'Hi {{first_name}}, this is {{sender_name}} from IBM. I wanted to follow up on my email about FlashSystem. I have some specific performance benchmarks that I think would be really interesting for {{company_name}}. Do you have a few minutes to chat?',
        status: 'Logged',
        stats: { attempted: 892, connected: 98, meetings: 15 }
      },
      {
        day: 5,
        channel: 'Email',
        subject: 'FlashSystem ROI Calculator',
        body: 'Hi {{first_name}},\n\nI wanted to share our FlashSystem ROI calculator with you. Based on typical deployments in {{industry}}, organizations see:\n\n• 60% reduction in storage costs\n• 5x improvement in application performance\n• ROI in under 12 months\n\nWould you like me to run a custom analysis for {{company_name}}?\n\nBest,\n{{sender_name}}',
        status: 'Scheduled',
        stats: { sent: 2890, opened: 159, clicked: 74, replied: 8 }
      }
    ]
  },
  {
    id: '4200001',
    name: 'US | Enterprise | AI & Automation | CTO | Outbound | watsonx | FY26',
    region: 'US',
    segment: 'Enterprise',
    category: 'AI & Automation',
    persona: 'CTO',
    type: 'Outbound',
    campaign: 'watsonx',
    fiscal_year: 'FY26',
    duration: 14,
    people_added: 0,
    people_started: 0,
    people_finished: 0,
    bounced: 0,
    success_rate: 0.00,
    open_rate: 0.00,
    click_rate: 0.00,
    reply_rate: 0.00,
    meeting_rate: 0.00,
    status: 'draft',
    steps: [
      {
        day: 1,
        channel: 'Email',
        subject: 'Transform Your Business with watsonx AI',
        body: 'Hi {{first_name}},\n\nI wanted to introduce you to watsonx, IBM\'s enterprise AI platform that\'s helping organizations like {{company_name}} accelerate AI adoption.\n\nKey capabilities:\n• Foundation models trained on enterprise data\n• Governance and compliance built-in\n• Deploy anywhere - cloud, on-prem, or hybrid\n\nWould you be interested in a personalized demo?\n\nBest,\n{{sender_name}}',
        status: 'Draft',
        stats: { sent: 0, opened: 0, clicked: 0, replied: 0 }
      },
      {
        day: 3,
        channel: 'LinkedIn',
        body: 'Hi {{first_name}}, I sent you an email about watsonx and how it can help {{company_name}} scale AI initiatives. Given your role in driving technology strategy, I thought this might be relevant. Would you be open to connecting?',
        status: 'Draft',
        stats: { sent: 0, accepted: 0, replied: 0 }
      },
      {
        day: 7,
        channel: 'Email',
        subject: 'watsonx Success Story: {{industry}}',
        body: 'Hi {{first_name}},\n\nI wanted to share a recent success story from a company in {{industry}} that implemented watsonx:\n\n• 70% reduction in AI development time\n• 3x faster model deployment\n• Full compliance with data governance requirements\n\nWould you like to learn how this could work for {{company_name}}?\n\nBest,\n{{sender_name}}',
        status: 'Draft',
        stats: { sent: 0, opened: 0, clicked: 0, replied: 0 }
      }
    ]
  }
];

const CadenceLibrary = () => {
  const [cadences, setCadences] = useState(SAMPLE_CADENCES);
  const [filteredCadences, setFilteredCadences] = useState(SAMPLE_CADENCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [personalizationData, setPersonalizationData] = useState({
    prospectName: '',
    prospectTitle: '',
    companyName: '',
    industry: '',
    industryOther: '',
    companySize: '',
    location: '',
    additionalContext: ''
  });

  // Toggle publish/unpublish status
  const togglePublishStatus = (cadenceId, e) => {
    e.stopPropagation(); // Prevent row click
    setCadences(prevCadences =>
      prevCadences.map(c =>
        c.id === cadenceId
          ? { ...c, status: c.status === 'draft' ? 'published' : 'draft' }
          : c
      )
    );
  };
  
  // Industry options
  const INDUSTRIES = [
    'Financial Services', 'Banking', 'Insurance', 'Healthcare', 'Life Sciences',
    'Retail', 'Manufacturing', 'Technology', 'Telecommunications', 'Energy & Utilities',
    'Government', 'Education', 'Transportation', 'Media & Entertainment', 'Other'
  ];
  
  // Company size options
  const COMPANY_SIZES = [
    '1-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1,000 employees',
    '1,001-5,000 employees',
    '5,001-10,000 employees',
    '10,001+ employees'
  ];
  
  // Location suggestions
  const LOCATIONS = [
    'New York, NY', 'San Francisco, CA', 'Chicago, IL', 'Boston, MA', 'Austin, TX',
    'Seattle, WA', 'Los Angeles, CA', 'Atlanta, GA', 'Dallas, TX', 'Denver, CO',
    'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Singapore', 'Tokyo, Japan'
  ];
  const [createCadenceData, setCreateCadenceData] = useState({
    country: 'US',
    market: 'Select',
    portfolio: 'Infrastructure',
    recipients: '',
    customFields: '',
    steps: '10',
    days: '15',
    description: '',
    context: ''
  });
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  
  const [filters, setFilters] = useState({
    region: 'all',
    segment: 'all',
    persona: 'all',
    type: 'all',
    campaign: 'all'
  });

  // Country options
  const COUNTRIES = ['US', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'China'];
  const MARKETS = ['Enterprise', 'Strategic', 'Select Horizon', 'Select Territory'];
  const PORTFOLIOS = ['Infrastructure', 'Data & AI', 'Automation'];

  // Extract unique filter values
  const filterOptions = {
    regions: [...new Set(cadences.map(c => c.region))],
    segments: [...new Set(cadences.map(c => c.segment))],
    personas: [...new Set(cadences.map(c => c.persona))],
    types: [...new Set(cadences.map(c => c.type))],
    campaigns: [...new Set(cadences.map(c => c.campaign))]
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = cadences;

    if (searchTerm) {
      filtered = filtered.filter(cadence =>
        cadence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cadence.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cadence.persona.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.region !== 'all') filtered = filtered.filter(c => c.region === filters.region);
    if (filters.segment !== 'all') filtered = filtered.filter(c => c.segment === filters.segment);
    if (filters.persona !== 'all') filtered = filtered.filter(c => c.persona === filters.persona);
    if (filters.type !== 'all') filtered = filtered.filter(c => c.type === filters.type);
    if (filters.campaign !== 'all') filtered = filtered.filter(c => c.campaign === filters.campaign);

    setFilteredCadences(filtered);
  }, [searchTerm, filters, cadences]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({
      region: 'all',
      segment: 'all',
      persona: 'all',
      type: 'all',
      campaign: 'all'
    });
    setSearchTerm('');
  };

  const getChannelIcon = (channel) => {
    switch (channel.toLowerCase()) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel.toLowerCase()) {
      case 'email': return 'bg-ibm-blue/10 text-ibm-blue border border-border';
      case 'call': return 'bg-gray-80/50 text-gray-30 border border-border';
      case 'linkedin': return 'bg-ibm-purple/10 text-ibm-purple border border-border';
      default: return 'bg-bg-raised text-text-secondary border border-border';
    }
  };

  const handleStepClick = (step) => {
    if (step.channel.toLowerCase() === 'email') {
      setSelectedStep(step);
      setShowPersonalizeModal(true);
      setGeneratedEmail(null);
      setCopiedEmail(false);
    }
  };

  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    setEmailSaved(false);
    try {
      // Build enhanced context for AI generation
      const finalIndustry = personalizationData.industry === 'Other'
        ? personalizationData.industryOther
        : personalizationData.industry;
      
      const enhancedContext = {
        prospectName: personalizationData.prospectName,
        companyName: personalizationData.companyName,
        cadenceTypes: [selectedCadence.campaign.toLowerCase().replace(/\s+/g, '_')],
        industry: finalIndustry,
        additionalContext: personalizationData.additionalContext
      };

      // Use the actual AI generation API with enhanced context
      const result = await generateCadences(enhancedContext);
      
      // Get the first email from the generated cadence
      if (result.cadences && result.cadences.length > 0) {
        const firstCadence = result.cadences[0];
        const emailStep = firstCadence.steps.find(step => step.channel === 'Email');
        
        if (emailStep) {
          setGeneratedEmail({
            subject: emailStep.subject,
            body: emailStep.body,
            cadenceType: selectedCadence.campaign,
            stepDay: selectedStep.day
          });
        } else {
          throw new Error('No email step found in generated cadence');
        }
      } else {
        throw new Error('No cadences generated');
      }
    } catch (error) {
      console.error('Error generating email:', error);
      // Fallback to template-based generation if AI fails
      let personalizedSubject = selectedStep.subject || '';
      let personalizedBody = selectedStep.body || '';
      
      const firstName = personalizationData.prospectName.split(' ')[0];
      personalizedSubject = personalizedSubject.replace(/\{\{first_name\}\}/g, firstName);
      personalizedBody = personalizedBody
        .replace(/\{\{first_name\}\}/g, firstName)
        .replace(/\{\{company_name\}\}/g, personalizationData.companyName)
        .replace(/\{\{industry\}\}/g, personalizationData.industry || 'your industry')
        .replace(/\{\{sender_name\}\}/g, 'Your Name');
      
      // Integrate additional context naturally into the email body
      if (personalizationData.additionalContext) {
        // Find a natural place to insert the context (after first paragraph)
        const paragraphs = personalizedBody.split('\n\n');
        if (paragraphs.length > 1) {
          // Insert context as a new paragraph after the opening
          paragraphs.splice(1, 0, personalizationData.additionalContext);
          personalizedBody = paragraphs.join('\n\n');
        } else {
          // If only one paragraph, add context before the closing
          const lines = personalizedBody.split('\n');
          lines.splice(lines.length - 2, 0, `\n${personalizationData.additionalContext}\n`);
          personalizedBody = lines.join('\n');
        }
      }
      
      setGeneratedEmail({
        subject: personalizedSubject,
        body: personalizedBody,
        cadenceType: selectedCadence.campaign,
        stepDay: selectedStep.day
      });
    } finally {
      setGeneratingEmail(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!generatedEmail) return;
    
    setSavingEmail(true);
    try {
      const emailData = {
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        prospectName: personalizationData.prospectName,
        companyName: personalizationData.companyName,
        cadenceType: generatedEmail.cadenceType,
        industry: personalizationData.industry || '',
        stepDay: generatedEmail.stepDay,
        cadenceName: selectedCadence.name,
        additionalContext: personalizationData.additionalContext || ''
      };
      
      await saveGeneratedEmail(emailData);
      
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 3000);
    } catch (error) {
      console.error('Error saving email:', error);
      alert('Failed to save email. Please try again.');
    } finally {
      setSavingEmail(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // List View
  if (!selectedCadence) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-text-primary">Cadences</h2>
            <p className="text-base text-text-secondary mt-1 font-light">
              Manage and personalize your sales cadences
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="btn-purple flex items-center space-x-1.5 text-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-1.5 text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Search Bar - Consistent style */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search cadences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 text-sm bg-bg-surface text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 text-sm font-normal border transition-all ${showFilters ? 'bg-ibm-blue/10 text-ibm-blue border-ibm-blue' : 'bg-bg-surface text-text-primary border-border hover:bg-bg-raised'}`}
          >
            <Filter className="w-4 h-4 inline mr-1.5" />
            Filters
          </button>
          {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
            <button onClick={resetFilters} className="text-sm text-text-tertiary hover:text-text-primary transition-colors font-light">
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card">
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All</option>
                  {filterOptions.regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Segment</label>
                <select
                  value={filters.segment}
                  onChange={(e) => handleFilterChange('segment', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All</option>
                  {filterOptions.segments.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Persona</label>
                <select
                  value={filters.persona}
                  onChange={(e) => handleFilterChange('persona', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All</option>
                  {filterOptions.personas.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All</option>
                  {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Campaign</label>
                <select
                  value={filters.campaign}
                  onChange={(e) => handleFilterChange('campaign', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All</option>
                  {filterOptions.campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Cadence List */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Cadence Name
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Steps
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Days
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Total People
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Active People
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Calls Logged
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Emails Delivered
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Reply Rate
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Click Rate
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-2 py-2.5 text-left text-sm font-normal text-text-tertiary tracking-wider">
                    Meeting Ratio
                  </th>
                  <th className="px-2 py-2.5 text-sm font-normal text-text-tertiary tracking-wider">
                    Opp Ratio
                  </th>
                  <th className="px-2 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCadences.map((cadence) => (
                  <tr
                    key={cadence.id}
                    className={`hover:bg-bg-raised cursor-pointer transition-all duration-150 border-b border-border ${cadence.status === 'draft' ? 'bg-text-tertiary/5' : ''}`}
                    onClick={() => setSelectedCadence(cadence)}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-light text-text-primary">{cadence.name}</div>
                        {cadence.status === 'draft' && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-text-tertiary/10 text-text-tertiary border border-text-tertiary/30">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary mt-1 flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-ibm-blue/10 text-ibm-blue border border-border">
                          {cadence.persona}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-ibm-purple/10 text-ibm-purple border border-border">
                          {cadence.campaign}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.steps?.length || 0}</td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.duration}</td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.people_added.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.people_started.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.people_finished.toLocaleString()}</td>
                    <td className="px-2 py-2.5 text-sm font-light text-text-primary">{cadence.bounced.toLocaleString()}</td>
                    <td className={`px-2 py-2.5 text-sm font-light ${cadence.reply_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{cadence.reply_rate.toFixed(2)}%</td>
                    <td className={`px-2 py-2.5 text-sm font-light ${cadence.click_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{cadence.click_rate.toFixed(2)}%</td>
                    <td className={`px-2 py-2.5 text-sm font-light ${cadence.open_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{cadence.open_rate.toFixed(2)}%</td>
                    <td className={`px-2 py-2.5 text-sm font-light ${cadence.meeting_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{cadence.meeting_rate.toFixed(2)}%</td>
                    <td className={`px-2 py-2.5 text-sm font-light ${cadence.success_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{cadence.success_rate.toFixed(2)}%</td>
                    <td className="px-2 py-2.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {cadence.status === 'draft' && (
                          <button
                            onClick={(e) => togglePublishStatus(cadence.id, e)}
                            className="px-2 py-1 text-xs font-medium text-text-tertiary hover:text-text-primary border border-border hover:border-text-tertiary bg-bg-surface hover:bg-bg-raised transition-colors"
                          >
                            Publish
                          </button>
                        )}
                        {cadence.status !== 'draft' && (
                          <button
                            onClick={(e) => togglePublishStatus(cadence.id, e)}
                            className="px-2 py-1 text-xs font-medium text-text-tertiary hover:text-text-primary border border-border hover:border-text-tertiary bg-bg-surface hover:bg-bg-raised transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCadences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-tertiary">No cadences found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button
        onClick={() => setSelectedCadence(null)}
        className="flex items-center space-x-2 text-text-tertiary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Cadences</span>
      </button>

      {/* Cadence Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-light text-text-primary mb-2">
              {selectedCadence.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-text-tertiary">
              <span>{selectedCadence.steps?.length || 0} steps</span>
              <span>•</span>
              <span>{selectedCadence.duration} days</span>
              <span>•</span>
              <span>{selectedCadence.people_added.toLocaleString()} people added</span>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-ibm-blue/10 text-ibm-blue border border-border">
                {selectedCadence.persona}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-ibm-purple/10 text-ibm-purple border border-border">
                {selectedCadence.campaign}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-80/50 text-gray-30 border border-border">
                {selectedCadence.type}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className={`text-xl font-light ${selectedCadence.open_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{selectedCadence.open_rate.toFixed(1)}%</div>
                <div className="text-xs text-text-tertiary mt-1">Open Rate</div>
              </div>
              <div>
                <div className={`text-xl font-light ${selectedCadence.click_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{selectedCadence.click_rate.toFixed(1)}%</div>
                <div className="text-xs text-text-tertiary mt-1">Click Rate</div>
              </div>
              <div>
                <div className={`text-xl font-light ${selectedCadence.reply_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{selectedCadence.reply_rate.toFixed(1)}%</div>
                <div className="text-xs text-text-tertiary mt-1">Reply Rate</div>
              </div>
              <div>
                <div className={`text-xl font-light ${selectedCadence.meeting_rate > 5 ? 'text-ibm-blue' : 'text-text-primary'}`}>{selectedCadence.meeting_rate.toFixed(1)}%</div>
                <div className="text-xs text-text-tertiary mt-1">Meeting Rate</div>
              </div>
            </div>
            <button
              onClick={() => {
                const emailsTab = document.querySelector('[data-tab="emails"]');
                if (emailsTab) emailsTab.click();
              }}
              className="btn-secondary flex items-center space-x-2 text-sm whitespace-nowrap"
            >
              <Mail className="w-4 h-4" />
              <span>View All Emails Generated in This Cadence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="card">
        <div className="pb-4 border-b border-border mb-4">
          <h3 className="text-lg font-light text-text-primary">Cadence Steps</h3>
          <p className="text-sm text-text-secondary mt-1">Click on an email step to personalize it</p>
        </div>
        <div className="space-y-3">
          {selectedCadence.steps?.map((step, index) => (
            <div
              key={index}
              onClick={() => handleStepClick(step)}
              className={`p-4 border border-border ${step.channel.toLowerCase() === 'email' ? 'hover:bg-bg-raised cursor-pointer' : ''} transition-colors`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-bg-raised flex flex-col items-center justify-center px-3 py-2 border border-border">
                    <div className="text-sm text-text-primary font-light">Step {index + 1}</div>
                    <div className="text-sm text-text-primary font-light">Day {step.day}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 text-xs font-medium ${getChannelColor(step.channel)}`}>
                      {getChannelIcon(step.channel)}
                      <span>{step.channel}</span>
                    </span>
                    {step.channel.toLowerCase() === 'email' && (
                      <span className="text-xs text-text-tertiary flex items-center space-x-1">
                        <Edit2 className="w-3 h-3" />
                        <span>Click to personalize</span>
                      </span>
                    )}
                  </div>
                  {step.subject && (
                    <div className="text-sm font-light text-text-primary mb-1">
                      {step.subject}
                    </div>
                  )}
                  <div className="text-sm text-text-secondary line-clamp-2">
                    {step.body}
                  </div>
                  {step.stats && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-xs text-text-tertiary">
                        {step.stats.sent && <span>Sent: {step.stats.sent.toLocaleString()}</span>}
                        {step.stats.opened && <span>Opened: {step.stats.opened.toLocaleString()}</span>}
                        {step.stats.clicked && <span>Clicked: {step.stats.clicked.toLocaleString()}</span>}
                        {step.stats.replied && <span>Replied: {step.stats.replied.toLocaleString()}</span>}
                        {step.stats.attempted && <span>Attempted: {step.stats.attempted.toLocaleString()}</span>}
                        {step.stats.connected && <span>Connected: {step.stats.connected.toLocaleString()}</span>}
                        {step.stats.meetings && <span>Meetings: {step.stats.meetings.toLocaleString()}</span>}
                      </div>
                      {step.channel.toLowerCase() === 'email' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const emailsTab = document.querySelector('[data-tab="emails"]');
                            if (emailsTab) emailsTab.click();
                          }}
                          className="btn-secondary flex items-center space-x-1.5 text-xs py-1 px-2"
                        >
                          <Mail className="w-3 h-3" />
                          <span>View All Emails Generated at This Step</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization Modal */}
      {showPersonalizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-bg-surface border-b border-border px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Personalize Email</h3>
              <button
                onClick={() => setShowPersonalizeModal(false)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Original Template */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Original Template</h4>
                <div className="bg-bg-surface border border-border p-4">
                  {selectedStep?.subject && (
                    <div className="mb-3">
                      <div className="text-xs text-text-tertiary mb-1 font-medium">Subject:</div>
                      <div className="text-sm text-text-primary">{selectedStep.subject}</div>
                    </div>
                  )}
                  <div className="text-xs text-text-tertiary mb-1 font-medium">Body:</div>
                  <div className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{selectedStep?.body}</div>
                </div>
              </div>

              {/* Personalization Form */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Enter Prospect Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Prospect Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalizationData.prospectName}
                      onChange={(e) => setPersonalizationData({...personalizationData, prospectName: e.target.value})}
                      placeholder="e.g., Sarah Chen"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Prospect Title
                    </label>
                    <input
                      type="text"
                      value={personalizationData.prospectTitle}
                      onChange={(e) => setPersonalizationData({...personalizationData, prospectTitle: e.target.value})}
                      placeholder="e.g., VP of IT"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalizationData.companyName}
                      onChange={(e) => setPersonalizationData({...personalizationData, companyName: e.target.value})}
                      placeholder="e.g., Goldman Sachs"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Industry
                    </label>
                    <select
                      value={personalizationData.industry}
                      onChange={(e) => setPersonalizationData({...personalizationData, industry: e.target.value, industryOther: ''})}
                      className="input-field"
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {personalizationData.industry === 'Other' && (
                      <input
                        type="text"
                        value={personalizationData.industryOther}
                        onChange={(e) => setPersonalizationData({...personalizationData, industryOther: e.target.value})}
                        placeholder="Specify industry..."
                        className="input-field mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Company Size
                    </label>
                    <select
                      value={personalizationData.companySize}
                      onChange={(e) => setPersonalizationData({...personalizationData, companySize: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Select company size...</option>
                      {COMPANY_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      list="locations"
                      value={personalizationData.location}
                      onChange={(e) => setPersonalizationData({...personalizationData, location: e.target.value})}
                      placeholder="e.g., New York, NY"
                      className="input-field"
                    />
                    <datalist id="locations">
                      {LOCATIONS.map(loc => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Additional Context
                  </label>
                  <textarea
                    value={personalizationData.additionalContext}
                    onChange={(e) => setPersonalizationData({...personalizationData, additionalContext: e.target.value})}
                    placeholder="Any additional context or personalization..."
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Generated Email */}
              {generatedEmail && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-text-primary">Personalized Email</h4>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                      className="btn-secondary flex items-center space-x-2 text-sm py-1.5 px-3"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-bg-surface border border-border p-4">
                    {generatedEmail.subject && (
                      <div className="mb-3">
                        <div className="text-xs text-text-tertiary mb-1 font-medium">Subject:</div>
                        <div className="text-sm text-text-primary">{generatedEmail.subject}</div>
                      </div>
                    )}
                    <div className="text-xs text-text-tertiary mb-1 font-medium">Body:</div>
                    <div className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{generatedEmail.body}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <button
                  onClick={() => setShowPersonalizeModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  {generatedEmail && (
                    <>
                      <button
                        onClick={handleSaveEmail}
                        disabled={savingEmail || emailSaved}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        {savingEmail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : emailSaved ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save to Database</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleGenerateEmail}
                        disabled={generatingEmail}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        {generatingEmail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Regenerating...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Regenerate</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {!generatedEmail && (
                    <button
                      onClick={handleGenerateEmail}
                      disabled={!personalizationData.prospectName || !personalizationData.companyName || generatingEmail}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {generatingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Personalized Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Cadence Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-bg-surface border-b border-border px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-light text-text-primary">Create New Cadence</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Country <span className="text-ibm-blue">*</span>
                  </label>
                  <select
                    value={createCadenceData.country}
                    onChange={(e) => setCreateCadenceData({...createCadenceData, country: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  >
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Market <span className="text-ibm-blue">*</span>
                  </label>
                  <select
                    value={createCadenceData.market}
                    onChange={(e) => setCreateCadenceData({...createCadenceData, market: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  >
                    {MARKETS.map(market => (
                      <option key={market} value={market}>{market}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Portfolio <span className="text-ibm-blue">*</span>
                  </label>
                  <select
                    value={createCadenceData.portfolio}
                    onChange={(e) => setCreateCadenceData({...createCadenceData, portfolio: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  >
                    {PORTFOLIOS.map(portfolio => (
                      <option key={portfolio} value={portfolio}>{portfolio}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-text-secondary mb-1.5">
                  Recipients <span className="text-ibm-blue">*</span>
                </label>
                <input
                  type="text"
                  value={createCadenceData.recipients}
                  onChange={(e) => setCreateCadenceData({...createCadenceData, recipients: e.target.value})}
                  placeholder="e.g., Head of IT, CTO, VP Infrastructure"
                  className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-normal text-text-secondary mb-1.5">
                  Custom Fields (separated by |)
                </label>
                <input
                  type="text"
                  value={createCadenceData.customFields}
                  onChange={(e) => setCreateCadenceData({...createCadenceData, customFields: e.target.value})}
                  placeholder="e.g., Outbound|Fusion|FY26"
                  className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                />
                <p className="text-xs text-text-tertiary mt-1 font-light">
                  Example: Outbound|Fusion|FY26 will create: {createCadenceData.country}|{createCadenceData.market}|{createCadenceData.portfolio}|{createCadenceData.recipients}|Outbound|Fusion|FY26
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Number of Steps
                  </label>
                  <input
                    type="number"
                    value={createCadenceData.steps}
                    onChange={(e) => setCreateCadenceData({...createCadenceData, steps: e.target.value})}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={createCadenceData.days}
                    onChange={(e) => setCreateCadenceData({...createCadenceData, days: e.target.value})}
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-text-secondary mb-1.5">
                  Description & Context
                </label>
                <textarea
                  value={createCadenceData.description}
                  onChange={(e) => setCreateCadenceData({...createCadenceData, description: e.target.value})}
                  placeholder="Describe the purpose and context of this cadence..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-normal text-text-secondary mb-1.5">
                  Technical Knowledge & Context
                </label>
                <textarea
                  value={createCadenceData.context}
                  onChange={(e) => setCreateCadenceData({...createCadenceData, context: e.target.value})}
                  placeholder="What products/functionality are being sold? What technical knowledge is needed?"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-bg-elevated text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
                />
              </div>

              <div className="bg-bg-elevated border border-border p-4">
                <h4 className="text-sm font-normal text-text-primary mb-2">Preview Cadence Name:</h4>
                <p className="text-sm text-ibm-blue font-light">
                  {createCadenceData.country}|{createCadenceData.market}|{createCadenceData.portfolio}|{createCadenceData.recipients}{createCadenceData.customFields ? `|${createCadenceData.customFields}` : ''}
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-normal text-text-primary bg-bg-elevated border border-border hover:bg-bg-raised transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Cadence creation functionality will generate AI-powered cadence steps based on your inputs. This will be integrated with the backend API.');
                    setShowCreateModal(false);
                  }}
                  disabled={!createCadenceData.recipients}
                  className="px-4 py-2 text-sm font-normal text-white bg-ibm-blue hover:bg-ibm-blue/90 border border-ibm-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Cadence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadenceLibrary;