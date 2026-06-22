import { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, Search, Filter, CheckCircle, XCircle, Clock, Mail, FileText, Building2, Briefcase, Cpu, Plus } from 'lucide-react';

// Sample database records
const SAMPLE_RECORDS = {
  emails: [
    {
      id: 1,
      prospectName: 'Sarah Chen',
      companyName: 'Goldman Sachs',
      cadenceType: 'Client-Intro',
      subject: 'Quick introduction - IBM Infrastructure Solutions',
      content: 'Hi Sarah,\n\nI hope this email finds you well...',
      status: 'sent',
      createdAt: '2024-01-15T10:30:00Z',
      sentAt: '2024-01-15T10:35:00Z',
      opened: true,
      clicked: false,
      replied: false
    }
  ],
  companies: [
    {
      id: 1,
      name: 'Goldman Sachs',
      industry: 'Financial Services',
      size: 'Enterprise',
      revenue: '$50B+',
      headquarters: 'New York, NY',
      techStack: ['VMware', 'Oracle', 'IBM Power'],
      painPoints: ['Legacy infrastructure costs', 'Cloud migration complexity', 'Regulatory compliance'],
      recentNews: 'Announced $2B technology modernization initiative',
      keyContacts: 3,
      lastContact: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'JPMorgan Chase',
      industry: 'Financial Services',
      size: 'Enterprise',
      revenue: '$120B+',
      headquarters: 'New York, NY',
      techStack: ['VMware', 'IBM Z', 'Red Hat'],
      painPoints: ['VMware licensing costs', 'Data center consolidation', 'AI infrastructure'],
      recentNews: 'Expanding AI capabilities across trading platforms',
      keyContacts: 5,
      lastContact: '2024-01-14T11:45:00Z'
    }
  ],
  industries: [
    {
      id: 1,
      name: 'Financial Services',
      description: 'Banking, investment, and insurance companies',
      keyTrends: ['AI/ML adoption', 'Cloud migration', 'Regulatory compliance', 'Real-time processing'],
      commonPainPoints: ['Legacy system modernization', 'Security and compliance', 'Cost optimization'],
      ibmSolutions: ['IBM Fusion', 'IBM FlashSystem', 'IBM Z', 'Watsonx'],
      marketSize: '$500B+',
      growthRate: '12% YoY'
    },
    {
      id: 2,
      name: 'Healthcare',
      description: 'Hospitals, health systems, and medical device companies',
      keyTrends: ['Electronic health records', 'Telemedicine', 'AI diagnostics', 'Data privacy'],
      commonPainPoints: ['Data silos', 'HIPAA compliance', 'System integration'],
      ibmSolutions: ['IBM FlashSystem', 'IBM Cloud', 'Watsonx Health'],
      marketSize: '$200B+',
      growthRate: '15% YoY'
    }
  ],
  techKnowledge: [
    {
      id: 1,
      technology: 'VMware vSphere',
      category: 'Virtualization',
      description: 'Industry-leading virtualization platform',
      ibmAlternative: 'IBM Fusion',
      migrationPath: 'Lift-and-shift with minimal downtime',
      costComparison: '50% cost reduction with IBM Fusion',
      keyBenefits: ['Lower licensing costs', 'Better performance', 'Simplified management'],
      commonObjections: ['Migration complexity', 'Training requirements'],
      responses: ['Automated migration tools', 'Comprehensive training program', '24/7 support']
    },
    {
      id: 2,
      technology: 'Traditional SAN Storage',
      category: 'Storage',
      description: 'Legacy storage area network systems',
      ibmAlternative: 'IBM FlashSystem',
      migrationPath: 'Phased migration with data replication',
      costComparison: '60% cost reduction with FlashSystem',
      keyBenefits: ['10x faster performance', '99.9999% availability', 'AI-powered optimization'],
      commonObjections: ['Upfront investment', 'Compatibility concerns'],
      responses: ['ROI in 8-12 months', 'Seamless integration with existing infrastructure']
    }
  ]
};

const DatabaseManager = () => {
  const [activeTab, setActiveTab] = useState('emails');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const tabs = [
    { id: 'emails', label: 'Generated Emails', icon: Mail },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'industries', label: 'Industries', icon: Briefcase },
    { id: 'techKnowledge', label: 'Tech Knowledge', icon: Cpu }
  ];

  const getCurrentData = () => {
    return SAMPLE_RECORDS[activeTab] || [];
  };

  const filteredData = getCurrentData().filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return JSON.stringify(record).toLowerCase().includes(searchLower);
  });

  const handleExportCSV = () => {
    alert('Export CSV functionality');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderEmailsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-bg-elevated">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Prospect
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Engagement
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filteredData.map((record) => (
            <tr key={record.id} className="hover:bg-bg-elevated transition-colors">
              <td className="px-6 py-4 text-sm text-text-primary">{record.prospectName}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{record.companyName}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{record.subject}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                  record.status === 'sent' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-text-tertiary">
                {record.opened && <span className="text-green-400">✓ Opened</span>}
                {record.clicked && <span className="text-blue-400 ml-2">✓ Clicked</span>}
                {record.replied && <span className="text-purple-400 ml-2">✓ Replied</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCompaniesTable = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredData.map((company) => (
        <div key={company.id} className="bg-bg-elevated rounded-xl border border-border p-6 hover:border-ibm-blue transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{company.name}</h3>
              <p className="text-sm text-text-secondary mt-1">{company.industry} • {company.size} • {company.revenue}</p>
            </div>
            <span className="px-3 py-1 bg-ibm-blue/10 text-ibm-blue text-xs font-medium rounded-lg border border-ibm-blue/30">
              {company.keyContacts} contacts
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-text-tertiary mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {company.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-bg-raised text-text-secondary text-xs rounded border border-border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2">Pain Points</p>
              <ul className="text-xs text-text-secondary space-y-1">
                {company.painPoints.slice(0, 2).map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {company.recentNews && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-300">📰 {company.recentNews}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderIndustriesTable = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredData.map((industry) => (
        <div key={industry.id} className="bg-bg-elevated rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{industry.name}</h3>
              <p className="text-sm text-text-secondary mt-1">{industry.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">{industry.marketSize}</p>
              <p className="text-xs text-green-400">{industry.growthRate}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-text-tertiary mb-2">Key Trends</p>
              <ul className="text-xs text-text-secondary space-y-1">
                {industry.keyTrends.map((trend, idx) => (
                  <li key={idx}>• {trend}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2">Common Pain Points</p>
              <ul className="text-xs text-text-secondary space-y-1">
                {industry.commonPainPoints.map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2">IBM Solutions</p>
              <div className="flex flex-wrap gap-2">
                {industry.ibmSolutions.map((solution, idx) => (
                  <span key={idx} className="px-2 py-1 bg-ibm-blue/10 text-ibm-blue text-xs rounded border border-ibm-blue/30">
                    {solution}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTechKnowledgeTable = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredData.map((tech) => (
        <div key={tech.id} className="bg-bg-elevated rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{tech.technology}</h3>
              <p className="text-sm text-text-secondary mt-1">{tech.category} • {tech.description}</p>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg border border-green-500/30">
              {tech.costComparison}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-xs text-text-tertiary mb-2">IBM Alternative</p>
              <p className="text-sm font-semibold text-ibm-blue">{tech.ibmAlternative}</p>
              <p className="text-xs text-text-secondary mt-1">{tech.migrationPath}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2">Key Benefits</p>
              <ul className="text-xs text-text-secondary space-y-1">
                {tech.keyBenefits.map((benefit, idx) => (
                  <li key={idx}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-bg-raised rounded-lg p-4 border border-border">
            <p className="text-xs text-text-tertiary mb-2">Common Objections & Responses</p>
            <div className="space-y-2">
              {tech.commonObjections.map((objection, idx) => (
                <div key={idx}>
                  <p className="text-xs text-red-400">❌ {objection}</p>
                  <p className="text-xs text-green-400 ml-4">✓ {tech.responses[idx]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Knowledge Base</h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage companies, industries, and technical knowledge for AI personalization
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
          <button onClick={handleExportCSV} className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-ibm-blue text-ibm-blue'
                    : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="bg-bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-11"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        {activeTab === 'emails' && renderEmailsTable()}
        {activeTab === 'companies' && renderCompaniesTable()}
        {activeTab === 'industries' && renderIndustriesTable()}
        {activeTab === 'techKnowledge' && renderTechKnowledgeTable()}

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;

// Made with Bob