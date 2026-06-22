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
  const [personalizationData, setPersonalizationData] = useState({
    prospectName: '',
    companyName: '',
    industry: '',
    additionalContext: ''
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
      case 'email': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'call': return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'linkedin': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default: return 'bg-white/5 text-gray-300 border-border';
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
      const enhancedContext = {
        prospectName: personalizationData.prospectName,
        companyName: personalizationData.companyName,
        cadenceTypes: [selectedCadence.campaign.toLowerCase().replace(/\s+/g, '_')],
        industry: personalizationData.industry,
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
    setSavingEmail(true);
    try {
      await saveGeneratedEmail({
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        prospectName: personalizationData.prospectName,
        companyName: personalizationData.companyName,
        cadenceType: generatedEmail.cadenceType,
        industry: personalizationData.industry,
        stepDay: generatedEmail.stepDay,
        cadenceName: selectedCadence.name
      });
      
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Cadences</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and personalize your sales cadences
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import from Salesloft</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Cadence</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-bg-surface rounded-2xl border border-border p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search cadences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input pl-11"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-blue-500/10 border-ibm-blue-light text-ibm-blue-light' : ''}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-100">
                Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
                >
                  <option value="all">All</option>
                  {filterOptions.regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Segment</label>
                <select
                  value={filters.segment}
                  onChange={(e) => handleFilterChange('segment', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
                >
                  <option value="all">All</option>
                  {filterOptions.segments.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Persona</label>
                <select
                  value={filters.persona}
                  onChange={(e) => handleFilterChange('persona', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
                >
                  <option value="all">All</option>
                  {filterOptions.personas.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
                >
                  <option value="all">All</option>
                  {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Campaign</label>
                <select
                  value={filters.campaign}
                  onChange={(e) => handleFilterChange('campaign', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
                >
                  <option value="all">All</option>
                  {filterOptions.campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Cadence List */}
        <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Steps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    People
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Rate
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-bg-surface divide-y divide-white/10">
                {filteredCadences.map((cadence) => (
                  <tr 
                    key={cadence.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedCadence(cadence)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-100">{cadence.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {cadence.persona}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/30">
                          {cadence.campaign}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">{cadence.steps?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-100">{cadence.people_added.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${cadence.success_rate > 0.5 ? 'text-green-400' : 'text-gray-100'}`}>
                        {cadence.success_rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${cadence.open_rate > 5 ? 'text-green-400' : 'text-gray-100'}`}>
                        {cadence.open_rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${cadence.reply_rate > 1 ? 'text-green-400' : 'text-gray-100'}`}>
                        {cadence.reply_rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${cadence.meeting_rate > 1 ? 'text-green-400' : 'text-gray-100'}`}>
                        {cadence.meeting_rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCadences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No cadences found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedCadence(null)}
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Cadences</span>
      </button>

      {/* Cadence Header */}
      <div className="bg-bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-100 mb-2">
              {selectedCadence.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{selectedCadence.steps?.length || 0} steps</span>
              <span>•</span>
              <span>{selectedCadence.duration} days</span>
              <span>•</span>
              <span>{selectedCadence.people_added.toLocaleString()} people added</span>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {selectedCadence.persona}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-300 border border-green-500/30">
                {selectedCadence.campaign}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {selectedCadence.type}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold text-gray-100">{selectedCadence.open_rate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Open Rate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-100">{selectedCadence.click_rate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Click Rate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-100">{selectedCadence.reply_rate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Reply Rate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-green-400">{selectedCadence.meeting_rate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">Meeting Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-bg-surface rounded-2xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-gray-100">Cadence Steps</h3>
          <p className="text-sm text-gray-500 mt-1">Click on an email step to personalize it</p>
        </div>
        <div className="divide-y divide-white/10">
          {selectedCadence.steps?.map((step, index) => (
            <div
              key={index}
              onClick={() => handleStepClick(step)}
              className={`px-6 py-4 ${step.channel.toLowerCase() === 'email' ? 'hover:bg-white/5 cursor-pointer' : ''} transition-colors`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-gray-300">
                    {step.day}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getChannelColor(step.channel)}`}>
                      {getChannelIcon(step.channel)}
                      <span>{step.channel}</span>
                    </span>
                    {step.channel.toLowerCase() === 'email' && (
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <Edit2 className="w-3 h-3" />
                        <span>Click to personalize</span>
                      </span>
                    )}
                  </div>
                  {step.subject && (
                    <div className="text-sm font-medium text-gray-100 mb-1">
                      {step.subject}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {step.body}
                  </div>
                  {step.stats && (
                    <div className="mt-3 flex items-center space-x-6 text-xs text-gray-500">
                      {step.stats.sent && <span>Sent: {step.stats.sent.toLocaleString()}</span>}
                      {step.stats.opened && <span>Opened: {step.stats.opened.toLocaleString()}</span>}
                      {step.stats.clicked && <span>Clicked: {step.stats.clicked.toLocaleString()}</span>}
                      {step.stats.replied && <span>Replied: {step.stats.replied.toLocaleString()}</span>}
                      {step.stats.attempted && <span>Attempted: {step.stats.attempted.toLocaleString()}</span>}
                      {step.stats.connected && <span>Connected: {step.stats.connected.toLocaleString()}</span>}
                      {step.stats.meetings && <span>Meetings: {step.stats.meetings.toLocaleString()}</span>}
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Personalize Email</h3>
              <button
                onClick={() => setShowPersonalizeModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Original Template */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Original Template</h4>
                <div className="bg-white/5 border border-border rounded-lg p-4">
                  {selectedStep?.subject && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Subject:</div>
                      <div className="text-sm font-medium text-gray-100">{selectedStep.subject}</div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mb-1">Body:</div>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">{selectedStep?.body}</div>
                </div>
              </div>

              {/* Personalization Form */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Enter Prospect Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Prospect Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalizationData.prospectName}
                      onChange={(e) => setPersonalizationData({...personalizationData, prospectName: e.target.value})}
                      placeholder="e.g., John Smith"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalizationData.companyName}
                      onChange={(e) => setPersonalizationData({...personalizationData, companyName: e.target.value})}
                      placeholder="e.g., Acme Corporation"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={personalizationData.industry}
                      onChange={(e) => setPersonalizationData({...personalizationData, industry: e.target.value})}
                      placeholder="e.g., Financial Services"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
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
              </div>

              {/* Generated Email */}
              {generatedEmail && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-300">Personalized Email</h4>
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
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    {generatedEmail.subject && (
                      <div className="mb-3">
                        <div className="text-xs text-green-300 mb-1">Subject:</div>
                        <div className="text-sm font-medium text-gray-100">{generatedEmail.subject}</div>
                      </div>
                    )}
                    <div className="text-xs text-green-300 mb-1">Body:</div>
                    <div className="text-sm text-gray-100 whitespace-pre-wrap">{generatedEmail.body}</div>
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
    </div>
  );
};

export default CadenceLibrary;