import { useState, useEffect } from 'react';
import { Mail, Calendar, User, Building2, Search, ChevronDown, ChevronRight, Copy, Check, ArrowLeft, TrendingUp, BarChart3, Star, Send, X } from 'lucide-react';
import { getGeneratedEmails } from '../../services/api';

// Mock generated emails data
const MOCK_EMAILS = [
  {
    id: 1,
    subject: 'Goldman Sachs + IBM Fusion: 50% VMware Cost Reduction',
    body: 'Hi Sarah,\n\nGiven the recent VMware licensing changes, I wanted to reach out about how IBM Fusion can help Goldman Sachs reduce infrastructure costs by 50% while maintaining performance.\n\nWe\'ve helped 3 major financial institutions migrate from VMware with zero downtime. Would you be open to a brief conversation?\n\nBest regards,\nJohn Smith',
    prospectName: 'Sarah Chen',
    companyName: 'Goldman Sachs',
    cadenceName: 'US | Select | Infrastructure | Outbound | Fusion',
    cadenceType: 'Fusion',
    industry: 'Financial Services',
    stepDay: 1,
    generatedAt: '2024-01-15T10:30:00Z',
    grade: 'A',
    gradeReason: 'Highly personalized, timely context, specific value proposition, social proof'
  },
  {
    id: 2,
    subject: 'Re: IBM Fusion - Follow up',
    body: 'Hi Sarah,\n\nI wanted to follow up on my previous email about IBM Fusion. I understand you\'re busy, so I\'ll keep this brief.\n\nI\'d love to share a quick case study of how we helped a company in Financial Services reduce their infrastructure spend by 35% while improving application performance by 50%.\n\nWould next Tuesday or Wednesday work for a 15-minute call?\n\nBest,\nJohn Smith',
    prospectName: 'Sarah Chen',
    companyName: 'Goldman Sachs',
    cadenceName: 'US | Select | Infrastructure | Outbound | Fusion',
    cadenceType: 'Fusion',
    industry: 'Financial Services',
    stepDay: 3,
    generatedAt: '2024-01-15T10:32:00Z',
    grade: 'B+',
    gradeReason: 'Good follow-up, specific metrics, clear CTA'
  },
  {
    id: 3,
    subject: 'Mayo Clinic: Epic on IBM PowerVS - 40% Cost Reduction',
    body: 'Hi Dr. Johnson,\n\nI noticed Mayo Clinic\'s recent announcement about EHR optimization. For your Epic workloads, IBM PowerVS offers:\n\n• Cloud flexibility without re-platforming\n• 40% lower TCO vs. on-prem\n• HIPAA-compliant infrastructure\n\nWould you be interested in a brief discussion about your Epic strategy?\n\nBest regards,\nJane Doe',
    prospectName: 'Dr. Michael Johnson',
    companyName: 'Mayo Clinic',
    cadenceName: 'US | Select | Infrastructure | Power Modernization',
    cadenceType: 'Power Systems Modernization',
    industry: 'Healthcare',
    stepDay: 1,
    generatedAt: '2024-01-16T09:15:00Z',
    grade: 'A-',
    gradeReason: 'Research-based, industry-specific, compliance focus, clear benefits'
  },
  {
    id: 4,
    subject: 'IBM FlashSystem - Storage Performance Breakthrough',
    body: 'Hi David,\n\nI wanted to reach out about IBM FlashSystem - our latest storage innovation that\'s delivering unprecedented performance for enterprise applications.\n\nKey benefits:\n• 10x faster than traditional storage\n• 99.9999% availability\n• AI-powered optimization\n\nWould you be interested in a demo?\n\nBest,\nMike Wilson',
    prospectName: 'David Martinez',
    companyName: 'JPMorgan Chase',
    cadenceName: 'US | Select | Infrastructure | Flash Availability',
    cadenceType: 'Storage Modernization',
    industry: 'Banking',
    stepDay: 1,
    generatedAt: '2024-01-17T14:20:00Z',
    grade: 'B',
    gradeReason: 'Clear value prop, specific benefits, but could be more personalized'
  },
  {
    id: 5,
    subject: 'FlashSystem ROI Calculator for JPMorgan',
    body: 'Hi David,\n\nI wanted to share our FlashSystem ROI calculator with you. Based on typical deployments in Banking, organizations see:\n\n• 60% reduction in storage costs\n• 5x improvement in application performance\n• ROI in under 12 months\n\nWould you like me to run a custom analysis for JPMorgan Chase?\n\nBest,\nMike Wilson',
    prospectName: 'David Martinez',
    companyName: 'JPMorgan Chase',
    cadenceName: 'US | Select | Infrastructure | Flash Availability',
    cadenceType: 'Storage Modernization',
    industry: 'Banking',
    stepDay: 5,
    generatedAt: '2024-01-17T14:25:00Z',
    grade: 'A-',
    gradeReason: 'Specific ROI metrics, industry-focused, actionable CTA'
  },
  {
    id: 6,
    subject: 'Walmart: Hybrid Cloud Strategy with IBM Power',
    body: 'Hi Jennifer,\n\nI noticed Walmart\'s recent cloud initiatives. For your mission-critical SAP workloads, IBM Power on Cloud offers:\n\n• Seamless hybrid cloud integration\n• 99.999% uptime SLA\n• 30% better price-performance than x86\n\nWould you be interested in discussing your hybrid cloud roadmap?\n\nBest regards,\nRobert Chen',
    prospectName: 'Jennifer Williams',
    companyName: 'Walmart',
    cadenceName: 'US | Select | Infrastructure | Outbound | Client-Intro',
    cadenceType: 'Infrastructure Modernization',
    industry: 'Retail',
    stepDay: 1,
    generatedAt: '2024-01-18T11:45:00Z',
    grade: 'B+',
    gradeReason: 'Good personalization, specific benefits, but could include more social proof'
  },
  {
    id: 7,
    subject: 'Re: Hybrid Cloud Follow-up',
    body: 'Hi Jennifer,\n\nFollowing up on my previous email about IBM Power for your SAP environment. I\'d love to share a case study from Target showing:\n\n• 40% cost reduction\n• Zero downtime migration\n• Improved disaster recovery\n\nDo you have 20 minutes this week?\n\nBest,\nRobert Chen',
    prospectName: 'Jennifer Williams',
    companyName: 'Walmart',
    cadenceName: 'US | Select | Infrastructure | Outbound | Client-Intro',
    cadenceType: 'Infrastructure Modernization',
    industry: 'Retail',
    stepDay: 3,
    generatedAt: '2024-01-18T11:50:00Z',
    grade: 'A',
    gradeReason: 'Excellent follow-up with competitor case study, specific metrics, clear CTA'
  },
  {
    id: 8,
    subject: 'Boeing: AI-Powered Infrastructure Optimization',
    body: 'Hi Thomas,\n\nGiven Boeing\'s focus on digital transformation, I wanted to introduce IBM\'s AI-powered infrastructure management:\n\n• Predictive maintenance reducing downtime by 45%\n• Automated optimization saving 25% on infrastructure costs\n• Real-time performance insights\n\nWould you be open to a brief demo?\n\nBest regards,\nLisa Anderson',
    prospectName: 'Thomas Brown',
    companyName: 'Boeing',
    cadenceName: 'US | Enterprise | AI & Automation | CTO | Outbound | watsonx | FY26',
    cadenceType: 'AI Infrastructure',
    industry: 'Manufacturing',
    stepDay: 1,
    generatedAt: '2024-01-19T09:30:00Z',
    grade: 'A-',
    gradeReason: 'Strong value proposition, industry-relevant, specific metrics'
  },
  {
    id: 9,
    subject: 'Citibank: Storage Modernization ROI',
    body: 'Hi Amanda,\n\nI wanted to reach out about IBM FlashSystem for Citibank\'s growing data needs:\n\n• 10x faster than traditional storage\n• 60% reduction in storage footprint\n• Built-in cyber resilience\n\nInterested in seeing how this could work for your environment?\n\nBest,\nKevin Park',
    prospectName: 'Amanda Rodriguez',
    companyName: 'Citibank',
    cadenceName: 'US | Select | Infrastructure | Flash Availability',
    cadenceType: 'Storage Modernization',
    industry: 'Banking',
    stepDay: 1,
    generatedAt: '2024-01-20T13:15:00Z',
    grade: 'B',
    gradeReason: 'Clear benefits but lacks personalization and specific use case'
  },
  {
    id: 10,
    subject: 'Kaiser Permanente: Epic on IBM Cloud',
    body: 'Hi Dr. Patel,\n\nI noticed Kaiser Permanente\'s commitment to healthcare innovation. For your Epic EHR system, IBM Cloud offers:\n\n• HIPAA-compliant infrastructure\n• 99.99% uptime guarantee\n• 35% lower TCO than on-premises\n• Seamless Epic integration\n\nWould you like to discuss your cloud strategy?\n\nBest regards,\nMaria Garcia',
    prospectName: 'Dr. Raj Patel',
    companyName: 'Kaiser Permanente',
    cadenceName: 'US | Select | Infrastructure | Power Modernization',
    cadenceType: 'Healthcare Cloud',
    industry: 'Healthcare',
    stepDay: 1,
    generatedAt: '2024-01-21T10:00:00Z',
    grade: 'A',
    gradeReason: 'Excellent personalization, compliance focus, specific to Epic, clear value'
  }
];

const GeneratedEmails = () => {
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCadences, setExpandedCadences] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [emailToRate, setEmailToRate] = useState(null);
  const [ratings, setRatings] = useState({
    relevance: 0,
    personalization: 0,
    clarity: 0,
    callToAction: 0,
    tone: 0
  });
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Load emails from database on mount
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await getGeneratedEmails();
        if (data.emails && data.emails.length > 0) {
          // Merge with mock data
          setEmails([...MOCK_EMAILS, ...data.emails]);
        }
      } catch (error) {
        console.error('Error loading emails:', error);
      }
    };
    
    loadEmails();
  }, []);

  // Group emails by cadence and step
  const groupedEmails = emails.reduce((acc, email) => {
    const cadenceName = email.cadenceName || 'Unknown Cadence';
    const stepDay = email.stepDay || 0;
    
    if (!acc[cadenceName]) {
      acc[cadenceName] = {};
    }
    if (!acc[cadenceName][stepDay]) {
      acc[cadenceName][stepDay] = [];
    }
    acc[cadenceName][stepDay].push(email);
    return acc;
  }, {});

  // Filter emails
  const filteredGroupedEmails = Object.entries(groupedEmails).reduce((acc, [cadenceName, steps]) => {
    if (searchTerm) {
      const matchesCadence = cadenceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchingSteps = Object.entries(steps).reduce((stepAcc, [stepDay, stepEmails]) => {
        const matchingEmails = stepEmails.filter(email =>
          email.prospectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingEmails.length > 0) {
          stepAcc[stepDay] = matchingEmails;
        }
        return stepAcc;
      }, {});
      
      if (matchesCadence || Object.keys(matchingSteps).length > 0) {
        acc[cadenceName] = matchesCadence ? steps : matchingSteps;
      }
    } else {
      acc[cadenceName] = steps;
    }
    return acc;
  }, {});

  const toggleCadence = (cadenceName) => {
    setExpandedCadences(prev => ({
      ...prev,
      [cadenceName]: !prev[cadenceName]
    }));
  };

  const toggleStep = (cadenceName, stepDay) => {
    const key = `${cadenceName}-${stepDay}`;
    setExpandedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary">Loading emails...</div>
      </div>
    );
  }

  // Detail view for selected email
  if (selectedEmail) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setSelectedEmail(null)}
          className="flex items-center space-x-2 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to All Emails</span>
        </button>

        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-light text-text-primary mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center space-x-4 text-sm text-text-tertiary">
                <div className="flex items-center space-x-1.5">
                  <User className="w-4 h-4" />
                  <span>{selectedEmail.prospectName}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{selectedEmail.companyName}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedEmail.generatedAt)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-ibm-blue/10 text-ibm-blue border border-border">
                  {selectedEmail.cadenceName}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium bg-gray-80/50 text-gray-30 border border-border">
                  Day {selectedEmail.stepDay}
                </span>
                {selectedEmail.industry && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-ibm-purple/10 text-ibm-purple border border-border">
                    {selectedEmail.industry}
                  </span>
                )}
                {selectedEmail.grade && (
                  <span className={`px-2.5 py-1 text-xs font-medium border ${
                    ['A', 'A-'].includes(selectedEmail.grade) ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    ['B+', 'B'].includes(selectedEmail.grade) ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                  }`}>
                    Grade: {selectedEmail.grade}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(`Subject: ${selectedEmail.subject}\n\n${selectedEmail.body}`, selectedEmail.id)}
              className="btn-secondary flex items-center space-x-1.5 text-sm"
            >
              {copiedId === selectedEmail.id ? (
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
            <div className="mb-4">
              <div className="text-xs text-text-tertiary mb-1.5 font-medium">Subject:</div>
              <div className="text-sm text-text-primary">{selectedEmail.subject}</div>
            </div>
            <div>
              <div className="text-xs text-text-tertiary mb-1.5 font-medium">Body:</div>
              <div className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{selectedEmail.body}</div>
            </div>
          </div>

          {selectedEmail.additionalContext && (
            <div className="bg-bg-surface border border-border p-4 mt-4">
              <div className="text-xs text-text-tertiary mb-1.5 font-medium">Additional Context Used:</div>
              <div className="text-sm text-text-primary">{selectedEmail.additionalContext}</div>
            </div>
          )}
          
          {selectedEmail.gradeReason && (
            <div className="bg-bg-surface border border-border p-4 mt-4">
              <div className="text-xs text-text-tertiary mb-1.5 font-medium">Quality Assessment:</div>
              <div className="text-sm text-text-primary">{selectedEmail.gradeReason}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalEmails = emails.length;
  const gradeDistribution = emails.reduce((acc, email) => {
    const grade = email.grade || 'N/A';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});
  const avgGrade = emails.filter(e => e.grade).length > 0
    ? (emails.filter(e => ['A', 'A-', 'B+', 'B'].includes(e.grade)).length / emails.filter(e => e.grade).length * 100).toFixed(0)
    : 0;

  // List view
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-text-primary">Generated Emails</h2>
          <p className="text-sm text-text-secondary mt-1 font-light">
            Review and rate AI-generated emails to improve model performance
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Mail className="w-8 h-8 text-ibm-blue" />
            <div>
              <div className="text-2xl font-light text-text-primary">{totalEmails}</div>
              <div className="text-xs text-text-tertiary mt-0.5">Total Emails</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-ibm-blue" />
            <div>
              <div className="text-2xl font-light text-text-primary">{avgGrade}%</div>
              <div className="text-xs text-text-tertiary mt-0.5">Quality Score</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-ibm-blue" />
            <div>
              <div className="text-2xl font-light text-text-primary">{Object.keys(groupedEmails).length}</div>
              <div className="text-xs text-text-tertiary mt-0.5">Cadences</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-ibm-blue" />
            <div>
              <div className="text-2xl font-light text-text-primary">{new Set(emails.map(e => e.companyName)).size}</div>
              <div className="text-xs text-text-tertiary mt-0.5">Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search - Consistent style */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by prospect, company, cadence, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 pl-10 text-sm bg-bg-surface text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none"
        />
      </div>

      {/* Grouped Emails */}
      <div className="space-y-3">
        {Object.entries(filteredGroupedEmails).map(([cadenceName, steps]) => (
          <div key={cadenceName} className="card">
            {/* Cadence Header */}
            <button
              onClick={() => toggleCadence(cadenceName)}
              className="w-full flex items-center justify-between text-left hover:bg-bg-raised p-3 -m-3 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {expandedCadences[cadenceName] ? (
                  <ChevronDown className="w-5 h-5 text-ibm-blue" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-ibm-blue" />
                )}
                <div>
                  <h3 className="text-base font-light text-ibm-blue">{cadenceName}</h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {Object.keys(steps).length} steps • {Object.values(steps).flat().length} emails
                  </p>
                </div>
              </div>
            </button>

            {/* Steps */}
            {expandedCadences[cadenceName] && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {Object.entries(steps)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([stepDay, stepEmails]) => {
                    const stepKey = `${cadenceName}-${stepDay}`;
                    return (
                      <div key={stepKey} className="border border-border">
                        {/* Step Header */}
                        <button
                          onClick={() => toggleStep(cadenceName, stepDay)}
                          className="w-full flex items-center justify-between text-left hover:bg-bg-raised p-3 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedSteps[stepKey] ? (
                              <ChevronDown className="w-4 h-4 text-ibm-purple" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-ibm-purple" />
                            )}
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 text-xs font-medium bg-ibm-purple/10 text-ibm-purple border border-ibm-purple/30">
                                Day {stepDay}
                              </span>
                              <span className="text-sm text-text-secondary">
                                {stepEmails.length} {stepEmails.length === 1 ? 'email' : 'emails'}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Emails in Step */}
                        {expandedSteps[stepKey] && (
                          <div className="border-t border-border">
                            {stepEmails.map((email) => (
                              <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className="p-3 hover:bg-bg-raised cursor-pointer transition-colors border-b border-border last:border-b-0"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                                      {email.subject}
                                    </h4>
                                    <div className="flex items-center space-x-3 text-xs text-text-tertiary mb-2">
                                      <span>{email.prospectName}</span>
                                      <span>•</span>
                                      <span>{email.companyName}</span>
                                      <span>•</span>
                                      <span>{formatDate(email.generatedAt)}</span>
                                    </div>
                                    <p className="text-xs text-text-secondary line-clamp-2">
                                      {email.body}
                                    </p>
                                  </div>
                                  <Mail className="w-4 h-4 text-text-tertiary ml-3 flex-shrink-0" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(filteredGroupedEmails).length === 0 && (
        <div className="card text-center py-12">
          <Mail className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-tertiary">No emails found matching your criteria</p>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && emailToRate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-text-primary">Rate Email Quality</h3>
                  <p className="text-sm text-text-secondary mt-1 font-light">
                    Your feedback helps improve AI-generated emails
                  </p>
                </div>
                <button
                  onClick={closeRatingModal}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Preview */}
              <div className="bg-bg-raised border border-border p-4 mb-6">
                <div className="text-xs text-text-tertiary mb-2 font-medium">Email Subject:</div>
                <div className="text-sm text-text-primary font-light">{emailToRate.subject}</div>
              </div>

              {/* Rating Aspects */}
              <div className="space-y-1 mb-6">
                <RatingStars
                  label="Relevance to Prospect"
                  value={ratings.relevance}
                  onChange={(value) => handleRatingChange('relevance', value)}
                />
                <RatingStars
                  label="Personalization Quality"
                  value={ratings.personalization}
                  onChange={(value) => handleRatingChange('personalization', value)}
                />
                <RatingStars
                  label="Clarity & Conciseness"
                  value={ratings.clarity}
                  onChange={(value) => handleRatingChange('clarity', value)}
                />
                <RatingStars
                  label="Call-to-Action Strength"
                  value={ratings.callToAction}
                  onChange={(value) => handleRatingChange('callToAction', value)}
                />
                <RatingStars
                  label="Professional Tone"
                  value={ratings.tone}
                  onChange={(value) => handleRatingChange('tone', value)}
                />
              </div>

              {/* Feedback Text */}
              <div className="mb-6">
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="Share specific suggestions for improvement..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-bg-base text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeRatingModal}
                  disabled={submittingRating}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={submittingRating || Object.values(ratings).every(r => r === 0)}
                  className="btn-primary flex items-center space-x-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingRating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for Retraining</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedEmails;

// Made with Bob