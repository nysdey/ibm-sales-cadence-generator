import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Star, Mail, Calendar, User, Building2, TrendingUp, Filter, Search, Loader2 } from 'lucide-react';
import { getGeneratedEmails } from '../../services/api';

// Sample generated emails with grades
const SAMPLE_EMAILS = [
  {
    id: 1,
    prospectName: 'Sarah Chen',
    companyName: 'Goldman Sachs',
    cadenceType: 'Client-Intro',
    subject: 'Quick introduction - IBM Infrastructure Solutions',
    body: 'Hi Sarah,\n\nI hope this email finds you well. I\'m reaching out from IBM\'s Infrastructure team because I noticed Goldman Sachs is in a growth phase, and I thought you might be interested in learning how we\'re helping similar organizations modernize their infrastructure.\n\nWe\'ve recently helped companies like yours reduce infrastructure costs by 40% while improving performance. Would you be open to a brief conversation?\n\nBest regards,\nJohn Smith',
    generatedAt: '2024-01-15T10:30:00Z',
    grade: 'A',
    gradeScore: 95,
    feedback: null,
    aiAnalysis: {
      strengths: ['Personalized opening', 'Clear value proposition', 'Specific metrics', 'Soft call-to-action'],
      improvements: ['Could mention specific Goldman Sachs initiatives', 'Add social proof'],
      tone: 'Professional and consultative',
      readability: 'Excellent - Grade 8 reading level'
    }
  },
  {
    id: 2,
    prospectName: 'Michael Rodriguez',
    companyName: 'JPMorgan Chase',
    cadenceType: 'Fusion VMWare',
    subject: 'VMware Alternative: Reduce Costs by 50%',
    body: 'Hi Michael,\n\nWith recent changes in VMware licensing, many IT leaders at financial institutions are exploring alternatives. IBM Fusion offers a compelling path forward for JPMorgan Chase.\n\nKey benefits:\n• 52% cost reduction\n• 40% performance improvement\n• Zero downtime migration\n\nWould you like to see how this could work for your team?\n\nBest,\nJohn Smith',
    generatedAt: '2024-01-15T11:45:00Z',
    grade: 'A-',
    gradeScore: 92,
    feedback: 'positive',
    aiAnalysis: {
      strengths: ['Timely topic', 'Bullet points for clarity', 'Specific metrics', 'Industry-specific'],
      improvements: ['Could be more personalized', 'Add case study link'],
      tone: 'Direct and value-focused',
      readability: 'Very good - Grade 9 reading level'
    }
  },
  {
    id: 3,
    prospectName: 'Jennifer Park',
    companyName: 'Morgan Stanley',
    cadenceType: 'Flash Availability',
    subject: 'IBM FlashSystem - 10x Faster Storage',
    body: 'Hi Jennifer,\n\nI wanted to reach out about IBM FlashSystem - our latest storage innovation that\'s delivering unprecedented performance for enterprise applications at Morgan Stanley.\n\nKey benefits:\n• 10x faster than traditional storage\n• 99.9999% availability\n• AI-powered optimization\n\nInterested in a demo?\n\nBest,\nJohn Smith',
    generatedAt: '2024-01-14T14:20:00Z',
    grade: 'B+',
    gradeScore: 87,
    feedback: null,
    aiAnalysis: {
      strengths: ['Clear product focus', 'Strong technical specs', 'Simple CTA'],
      improvements: ['Too product-focused, needs more personalization', 'Missing context about Morgan Stanley\'s needs', 'Could add social proof'],
      tone: 'Technical and direct',
      readability: 'Good - Grade 10 reading level'
    }
  },
  {
    id: 4,
    prospectName: 'David Thompson',
    companyName: 'Bank of America',
    cadenceType: 'Client-Intro',
    subject: 'Infrastructure Modernization for Bank of America',
    body: 'Hi David,\n\nI noticed Bank of America recently announced expansion plans. As you scale, infrastructure becomes critical.\n\nIBM has helped similar financial institutions:\n• Reduce costs by 35-45%\n• Improve application performance by 50%\n• Achieve 99.99% uptime\n\nI\'d love to share how we can support your growth. Are you available for a 15-minute call next week?\n\nBest regards,\nJohn Smith',
    generatedAt: '2024-01-14T09:15:00Z',
    grade: 'A',
    gradeScore: 94,
    feedback: 'positive',
    aiAnalysis: {
      strengths: ['Personalized with company news', 'Relevant timing', 'Specific metrics', 'Clear CTA with timeframe'],
      improvements: ['Could mention specific expansion details'],
      tone: 'Professional and timely',
      readability: 'Excellent - Grade 8 reading level'
    }
  },
  {
    id: 5,
    prospectName: 'Lisa Wang',
    companyName: 'Citigroup',
    cadenceType: 'Follow-up',
    subject: 'Re: Infrastructure Discussion',
    body: 'Hi Lisa,\n\nFollowing up on my previous email about infrastructure modernization for Citigroup.\n\nI wanted to share a quick case study: A Fortune 500 financial services company reduced their infrastructure spend by 40% while improving performance.\n\nWould next Tuesday or Wednesday work for a brief call?\n\nBest,\nJohn Smith',
    generatedAt: '2024-01-13T16:30:00Z',
    grade: 'B',
    gradeScore: 83,
    feedback: 'negative',
    aiAnalysis: {
      strengths: ['Clear follow-up', 'Includes case study', 'Specific meeting options'],
      improvements: ['Generic case study without details', 'Doesn\'t reference previous conversation', 'Could be more personalized to Citigroup'],
      tone: 'Professional but generic',
      readability: 'Good - Grade 9 reading level'
    }
  },
  {
    id: 6,
    prospectName: 'Robert Martinez',
    companyName: 'Wells Fargo',
    cadenceType: 'Fusion VMWare',
    subject: 'Wells Fargo + IBM Fusion: Perfect Timing',
    body: 'Hi Robert,\n\nGiven the recent VMware licensing changes and Wells Fargo\'s focus on cost optimization, I thought this might be timely.\n\nIBM Fusion offers:\n• 50% reduction in virtualization costs\n• Seamless migration from VMware\n• Enhanced security and compliance\n\nWe\'ve helped 3 major banks make this transition successfully. Would you like to learn more?\n\nBest regards,\nJohn Smith',
    generatedAt: '2024-01-13T11:00:00Z',
    grade: 'A-',
    gradeScore: 90,
    feedback: 'positive',
    aiAnalysis: {
      strengths: ['Timely and relevant', 'Company-specific context', 'Social proof with bank examples', 'Clear benefits'],
      improvements: ['Could name the 3 banks (if allowed)', 'Add specific timeline'],
      tone: 'Consultative and timely',
      readability: 'Very good - Grade 8 reading level'
    }
  },
  {
    id: 7,
    prospectName: 'Amanda Foster',
    companyName: 'Charles Schwab',
    cadenceType: 'Client-Intro',
    subject: 'IBM Infrastructure Solutions',
    body: 'Hi Amanda,\n\nI\'m reaching out from IBM about our infrastructure solutions.\n\nWe help companies improve their IT infrastructure. Would you be interested in learning more?\n\nThanks,\nJohn Smith',
    generatedAt: '2024-01-12T15:45:00Z',
    grade: 'C',
    gradeScore: 72,
    feedback: 'negative',
    aiAnalysis: {
      strengths: ['Brief and to the point'],
      improvements: ['Too generic', 'No personalization', 'No specific value proposition', 'Weak CTA', 'Missing company context', 'No metrics or proof points'],
      tone: 'Generic and impersonal',
      readability: 'Too simple - Grade 6 reading level'
    }
  },
  {
    id: 8,
    prospectName: 'Kevin O\'Brien',
    companyName: 'TD Bank',
    cadenceType: 'Flash Availability',
    subject: 'Solving TD Bank\'s Storage Performance Challenges',
    body: 'Hi Kevin,\n\nI understand TD Bank is experiencing rapid data growth. Storage performance becomes critical as you scale.\n\nIBM FlashSystem has helped similar banks:\n• Handle 3x data growth without performance degradation\n• Reduce storage costs by 60%\n• Achieve sub-millisecond latency\n\nOne of your peers at a major Canadian bank saw ROI in 8 months. Would you like to see their results?\n\nBest regards,\nJohn Smith',
    generatedAt: '2024-01-12T10:20:00Z',
    grade: 'A',
    gradeScore: 96,
    feedback: 'positive',
    aiAnalysis: {
      strengths: ['Identifies specific pain point', 'Relevant metrics', 'Geographic social proof (Canadian bank)', 'Specific ROI timeframe', 'Strong CTA'],
      improvements: ['Could mention specific TD Bank initiatives if known'],
      tone: 'Consultative and solution-focused',
      readability: 'Excellent - Grade 9 reading level'
    }
  }
];

const GeneratedEmails = () => {
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterFeedback, setFilterFeedback] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load emails from database on mount
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await getGeneratedEmails();
        if (data.emails && data.emails.length > 0) {
          // Merge with sample emails, prioritizing database emails
          const dbEmails = data.emails.map(email => ({
            ...email,
            grade: email.grade || 'B',
            gradeScore: email.gradeScore || 85,
            aiAnalysis: email.aiAnalysis || {
              strengths: ['Personalized content'],
              improvements: ['Could add more details'],
              tone: 'Professional',
              readability: 'Good'
            }
          }));
          setEmails([...dbEmails, ...SAMPLE_EMAILS]);
        }
      } catch (error) {
        console.error('Error loading emails:', error);
        // Keep sample emails if loading fails
      } finally {
        setLoading(false);
      }
    };
    
    loadEmails();
  }, []);

  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
      email.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = filterGrade === 'all' || email.grade.startsWith(filterGrade);
    const matchesFeedback = filterFeedback === 'all' || 
      (filterFeedback === 'positive' && email.feedback === 'positive') ||
      (filterFeedback === 'negative' && email.feedback === 'negative') ||
      (filterFeedback === 'none' && email.feedback === null);
    
    return matchesSearch && matchesGrade && matchesFeedback;
  });

  const handleFeedback = (emailId, feedbackType) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, feedback: feedbackType } : email
    ));
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (grade.startsWith('B')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (grade.startsWith('C')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getGradeLabel = (grade) => {
    if (grade.startsWith('A')) return 'Excellent';
    if (grade.startsWith('B')) return 'Good';
    if (grade.startsWith('C')) return 'Needs Improvement';
    return 'Poor';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (selectedEmail) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedEmail(null)}
          className="text-gray-500 hover:text-gray-100 text-sm font-medium"
        >
          ← Back to All Emails
        </button>

        <div className="bg-bg-surface rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(selectedEmail.grade)}`}>
                  Grade: {selectedEmail.grade}
                </span>
                <span className="text-sm text-gray-500">{getGradeLabel(selectedEmail.grade)}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Score: {selectedEmail.gradeScore}/100</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{selectedEmail.subject}</h2>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{selectedEmail.prospectName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>{selectedEmail.companyName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedEmail.generatedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFeedback(selectedEmail.id, 'positive')}
                className={`p-2 rounded-lg border transition-colors ${
                  selectedEmail.feedback === 'positive'
                    ? 'bg-green-500/10 border-green-500/60 text-green-400'
                    : 'border-white/15 text-gray-500 hover:text-green-400 hover:border-green-500/60'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFeedback(selectedEmail.id, 'negative')}
                className={`p-2 rounded-lg border transition-colors ${
                  selectedEmail.feedback === 'negative'
                    ? 'bg-red-500/10 border-red-500/60 text-red-400'
                    : 'border-white/15 text-gray-500 hover:text-red-400 hover:border-red-500/60'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-border rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Email Content</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Subject:</div>
                <div className="text-sm font-medium text-gray-100">{selectedEmail.subject}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Body:</div>
                <div className="text-sm text-gray-300 whitespace-pre-wrap">{selectedEmail.body}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>AI Analysis</span>
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-300 mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  {selectedEmail.aiAnalysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-300 mb-2">Areas for Improvement:</h4>
                <ul className="space-y-1">
                  {selectedEmail.aiAnalysis.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="text-yellow-500 mt-0.5">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/30">
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-1">Tone:</h4>
                  <p className="text-sm text-gray-300">{selectedEmail.aiAnalysis.tone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-1">Readability:</h4>
                  <p className="text-sm text-gray-300">{selectedEmail.aiAnalysis.readability}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue" />
        <span className="ml-3 text-text-secondary">Loading emails...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Generated Emails</h2>
          <p className="text-sm text-text-secondary mt-1">
            Review AI-generated emails with quality grades and feedback
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-text-secondary">
            <span className="font-semibold">{filteredEmails.length}</span> of {emails.length} emails
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by prospect, company, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-blue-500/10 border-ibm-blue-light text-ibm-blue-light' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
              >
                <option value="all">All Grades</option>
                <option value="A">A (Excellent)</option>
                <option value="B">B (Good)</option>
                <option value="C">C (Needs Improvement)</option>
                <option value="D">D (Poor)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Feedback</label>
              <select
                value={filterFeedback}
                onChange={(e) => setFilterFeedback(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-bg-raised text-gray-100 focus:ring-2 focus:ring-ibm-blue-light focus:border-ibm-blue-light outline-none"
              >
                <option value="all">All Feedback</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="none">No Feedback</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className="bg-bg-surface rounded-xl border border-border p-6 hover:border-ibm-blue-light hover:shadow-elevated transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getGradeColor(email.grade)}`}>
                    {email.grade}
                  </span>
                  <span className="text-xs text-gray-500">{email.gradeScore}/100</span>
                  {email.feedback === 'positive' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/30">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Positive
                    </span>
                  )}
                  {email.feedback === 'negative' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/30">
                      <ThumbsDown className="w-3 h-3 mr-1" />
                      Negative
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{email.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{email.prospectName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>{email.companyName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(email.generatedAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{email.body}</p>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {email.cadenceType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-12 bg-bg-surface rounded-xl border border-border">
          <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500">No emails found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedEmails;

// Made with Bob