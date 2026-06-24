import { useState } from 'react';
import { Database, Download, Trash2, Search, Building2, Briefcase, Cpu, FileText, Edit2, X, Plus, Users, MoreVertical, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';

// Sample database records with expanded industry data
const SAMPLE_RECORDS = {
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
    },
    {
      id: 3,
      name: 'Citibank',
      industry: 'Banking',
      size: 'Enterprise',
      revenue: '$75B+',
      headquarters: 'New York, NY',
      techStack: ['IBM Power', 'VMware', 'NetApp'],
      painPoints: ['Power Systems modernization', 'Cloud strategy', 'Cost optimization'],
      recentNews: 'Cloud modernization initiative announced',
      keyContacts: 4,
      lastContact: '2024-01-16T09:20:00Z'
    },
    {
      id: 4,
      name: 'Mayo Clinic',
      industry: 'Healthcare',
      size: 'Enterprise',
      revenue: '$15B+',
      headquarters: 'Rochester, MN',
      techStack: ['Epic', 'IBM Power', 'VMware'],
      painPoints: ['EHR modernization', 'HIPAA compliance', 'Patient data security'],
      recentNews: 'Investing in AI-powered diagnostics',
      keyContacts: 2,
      lastContact: '2024-01-17T14:15:00Z'
    },
    {
      id: 5,
      name: 'Walmart',
      industry: 'Retail',
      size: 'Enterprise',
      revenue: '$600B+',
      headquarters: 'Bentonville, AR',
      techStack: ['VMware', 'Oracle', 'SAP'],
      painPoints: ['Omnichannel experience', 'Supply chain optimization', 'E-commerce scalability'],
      recentNews: 'Expanding cloud-native e-commerce platform',
      keyContacts: 6,
      lastContact: '2024-01-18T10:00:00Z'
    },
    {
      id: 6,
      name: 'Delta Airlines',
      industry: 'Travel & Transportation',
      size: 'Enterprise',
      revenue: '$50B+',
      headquarters: 'Atlanta, GA',
      techStack: ['IBM Power', 'VMware', 'Oracle'],
      painPoints: ['Real-time operations', 'Legacy reservation systems', 'Customer experience'],
      recentNews: 'Modernizing reservation and booking systems',
      keyContacts: 3,
      lastContact: '2024-01-19T09:30:00Z'
    },
    {
      id: 7,
      name: 'Verizon',
      industry: 'Telecommunications',
      size: 'Enterprise',
      revenue: '$135B+',
      headquarters: 'New York, NY',
      techStack: ['VMware', 'Red Hat', 'IBM Z'],
      painPoints: ['5G deployment', 'Network modernization', 'Edge computing'],
      recentNews: '5G network expansion across major cities',
      keyContacts: 4,
      lastContact: '2024-01-20T11:00:00Z'
    },
    {
      id: 8,
      name: 'ExxonMobil',
      industry: 'Energy & Utilities',
      size: 'Enterprise',
      revenue: '$400B+',
      headquarters: 'Irving, TX',
      techStack: ['SAP', 'IBM Power', 'Oracle'],
      painPoints: ['Process optimization', 'Safety systems', 'Environmental compliance'],
      recentNews: 'Investing in renewable energy infrastructure',
      keyContacts: 2,
      lastContact: '2024-01-21T13:45:00Z'
    }
  ],
  industries: [
    { 
      id: 1, 
      name: 'Wholesale Distribution & Services',
      summary: 'Companies that distribute products to retailers and businesses',
      examples: ['Sysco', 'McKesson', 'Cardinal Health', 'AmerisourceBergen'],
      painPoints: ['Supply chain visibility', 'Inventory optimization', 'Legacy ERP systems', 'Real-time tracking'],
      solutions: ['IBM Fusion for hybrid cloud', 'FlashSystem for data analytics', 'PowerVS for SAP workloads']
    },
    { 
      id: 2, 
      name: 'Travel & Transportation',
      summary: 'Airlines, logistics, and transportation companies',
      examples: ['Delta Airlines', 'FedEx', 'UPS', 'American Airlines'],
      painPoints: ['Real-time operations', 'Customer experience', 'Legacy reservation systems', 'Peak demand scaling'],
      solutions: ['IBM Fusion for scalability', 'FlashSystem for transaction processing', 'PowerVS for mission-critical apps']
    },
    { 
      id: 3, 
      name: 'Retail',
      summary: 'Consumer-facing retail and e-commerce businesses',
      examples: ['Walmart', 'Target', 'Home Depot', 'Best Buy'],
      painPoints: ['Omnichannel experience', 'Seasonal scalability', 'POS modernization', 'Supply chain integration'],
      solutions: ['IBM Fusion for e-commerce platforms', 'FlashSystem for real-time inventory', 'PowerVS for core systems']
    },
    { 
      id: 4, 
      name: 'Consumer Products',
      summary: 'Manufacturing and distribution of consumer goods',
      examples: ['Procter & Gamble', 'Unilever', 'Coca-Cola', 'PepsiCo'],
      painPoints: ['Supply chain optimization', 'Demand forecasting', 'Manufacturing efficiency', 'Sustainability tracking'],
      solutions: ['IBM Fusion for IoT integration', 'FlashSystem for analytics', 'PowerVS for SAP S/4HANA']
    },
    { 
      id: 5, 
      name: 'Industrial Products',
      summary: 'Heavy machinery and industrial equipment manufacturers',
      examples: ['Caterpillar', 'Deere & Company', '3M', 'Honeywell'],
      painPoints: ['OT/IT convergence', 'Predictive maintenance', 'Legacy systems', 'Edge computing'],
      solutions: ['IBM Fusion for edge workloads', 'FlashSystem for IoT data', 'PowerVS for core ERP']
    },
    { 
      id: 6, 
      name: 'Media & Entertainment',
      summary: 'Content creation, distribution, and streaming services',
      examples: ['Disney', 'Warner Bros', 'Netflix', 'Paramount'],
      painPoints: ['Content delivery', 'Storage costs', 'Rendering performance', 'Rights management'],
      solutions: ['IBM Fusion for content platforms', 'FlashSystem for media storage', 'PowerVS for rendering farms']
    },
    { 
      id: 7, 
      name: 'Computer Services',
      summary: 'IT services, consulting, and managed services providers',
      examples: ['Accenture', 'Cognizant', 'Infosys', 'Wipro'],
      painPoints: ['Multi-tenant infrastructure', 'Cost optimization', 'Service delivery', 'Client data security'],
      solutions: ['IBM Fusion for service delivery', 'FlashSystem for multi-tenancy', 'PowerVS for client workloads']
    },
    { 
      id: 8, 
      name: 'Professional Services',
      summary: 'Consulting, legal, accounting, and advisory firms',
      examples: ['Deloitte', 'PwC', 'EY', 'KPMG'],
      painPoints: ['Data security', 'Collaboration tools', 'Client confidentiality', 'Regulatory compliance'],
      solutions: ['IBM Fusion for secure workloads', 'FlashSystem for document management', 'PowerVS for compliance apps']
    },
    { 
      id: 9, 
      name: 'Energy & Utilities',
      summary: 'Power generation, distribution, and utility companies',
      examples: ['Duke Energy', 'NextEra Energy', 'Southern Company', 'Exelon'],
      painPoints: ['Grid modernization', 'SCADA systems', 'Regulatory compliance', 'Renewable integration'],
      solutions: ['IBM Fusion for smart grid', 'FlashSystem for real-time monitoring', 'PowerVS for legacy SCADA']
    },
    { 
      id: 10, 
      name: 'Financial Markets',
      summary: 'Investment banks, trading firms, and asset managers',
      examples: ['Morgan Stanley', 'BlackRock', 'Fidelity', 'Charles Schwab'],
      painPoints: ['Low-latency trading', 'Risk analytics', 'Regulatory reporting', 'Market data processing'],
      solutions: ['IBM Fusion for trading platforms', 'FlashSystem for ultra-low latency', 'PowerVS for risk systems']
    },
    { 
      id: 11, 
      name: 'Healthcare',
      summary: 'Hospitals, health systems, and medical device companies',
      examples: ['Mayo Clinic', 'Cleveland Clinic', 'Kaiser Permanente', 'HCA Healthcare'],
      painPoints: ['EHR modernization', 'HIPAA compliance', 'Interoperability', 'Patient data security'],
      solutions: ['IBM Fusion for EHR platforms', 'FlashSystem for medical imaging', 'PowerVS for Epic/Cerner']
    },
    { 
      id: 12, 
      name: 'Electronics',
      summary: 'Consumer electronics and semiconductor manufacturers',
      examples: ['Apple', 'Samsung', 'Intel', 'Qualcomm'],
      painPoints: ['Supply chain complexity', 'Design automation', 'Manufacturing precision', 'Time to market'],
      solutions: ['IBM Fusion for design tools', 'FlashSystem for CAD/CAM', 'PowerVS for EDA workloads']
    },
    { 
      id: 13, 
      name: 'Life Sciences',
      summary: 'Pharmaceutical, biotech, and medical research companies',
      examples: ['Pfizer', 'Johnson & Johnson', 'Merck', 'AbbVie'],
      painPoints: ['Drug discovery', 'Clinical trials', 'FDA compliance', 'Research data management'],
      solutions: ['IBM Fusion for research platforms', 'FlashSystem for genomics', 'PowerVS for clinical systems']
    },
    { 
      id: 14, 
      name: 'Banking',
      summary: 'Commercial and retail banking institutions',
      examples: ['Bank of America', 'Wells Fargo', 'Citibank', 'US Bank'],
      painPoints: ['Core banking modernization', 'Digital transformation', 'Fraud detection', 'Regulatory compliance'],
      solutions: ['IBM Fusion for digital banking', 'FlashSystem for transaction processing', 'PowerVS for core banking']
    },
    { 
      id: 15, 
      name: 'Chemicals & Petroleum',
      summary: 'Chemical manufacturing and petroleum refining companies',
      examples: ['ExxonMobil', 'Chevron', 'Dow Chemical', 'DuPont'],
      painPoints: ['Process optimization', 'Safety systems', 'Environmental compliance', 'Supply chain'],
      solutions: ['IBM Fusion for process control', 'FlashSystem for sensor data', 'PowerVS for SAP']
    },
    { 
      id: 16, 
      name: 'Automotive',
      summary: 'Vehicle manufacturers and automotive suppliers',
      examples: ['Ford', 'GM', 'Tesla', 'Toyota'],
      painPoints: ['Connected vehicles', 'Manufacturing automation', 'Supply chain', 'EV infrastructure'],
      solutions: ['IBM Fusion for connected car platforms', 'FlashSystem for manufacturing data', 'PowerVS for PLM systems']
    },
    { 
      id: 17, 
      name: 'Telecommunications',
      summary: 'Telecom carriers and network infrastructure providers',
      examples: ['Verizon', 'AT&T', 'T-Mobile', 'Comcast'],
      painPoints: ['5G deployment', 'Network modernization', 'Customer experience', 'Edge computing'],
      solutions: ['IBM Fusion for NFV', 'FlashSystem for CDN', 'PowerVS for OSS/BSS']
    },
    { 
      id: 18, 
      name: 'Insurance',
      summary: 'Property, casualty, life, and health insurance companies',
      examples: ['State Farm', 'Allstate', 'Progressive', 'MetLife'],
      painPoints: ['Claims processing', 'Underwriting automation', 'Legacy policy systems', 'Fraud detection'],
      solutions: ['IBM Fusion for digital insurance', 'FlashSystem for claims data', 'PowerVS for policy administration']
    },
    { 
      id: 19, 
      name: 'Government',
      summary: 'Federal, state, and local government agencies',
      examples: ['Federal agencies', 'State governments', 'Municipalities', 'Defense contractors'],
      painPoints: ['Legacy modernization', 'Cybersecurity', 'Citizen services', 'Budget constraints'],
      solutions: ['IBM Fusion for cloud migration', 'FlashSystem for secure storage', 'PowerVS for mission-critical apps']
    },
    { 
      id: 20, 
      name: 'Aerospace & Defense',
      summary: 'Aircraft manufacturers and defense contractors',
      examples: ['Boeing', 'Lockheed Martin', 'Northrop Grumman', 'Raytheon'],
      painPoints: ['Security clearances', 'Complex supply chain', 'Engineering simulation', 'Compliance'],
      solutions: ['IBM Fusion for secure workloads', 'FlashSystem for CAE/CFD', 'PowerVS for classified systems']
    }
  ],
  techKnowledge: [
    {
      id: 1,
      useCase: 'Upgrading Legacy Power Systems',
      description: 'Modernizing aging IBM Power infrastructure to cloud-based PowerVS',
      targetIndustries: ['Financial Services', 'Healthcare', 'Manufacturing'],
      products: ['IBM PowerVS', 'IBM Power Systems'],
      painPoints: ['End of support', 'High maintenance costs', 'Limited scalability'],
      solution: 'Migrate AIX/IBM i workloads to PowerVS for cloud flexibility with enterprise reliability',
      roi: '40% cost reduction, 3x faster provisioning',
      cadencesUsing: ['Power Systems Modernization', 'Infrastructure Transformation']
    },
    {
      id: 2,
      useCase: 'VMware Cost Reduction & Migration',
      description: 'Reducing VMware licensing costs by migrating to IBM Fusion',
      targetIndustries: ['All Industries'],
      products: ['IBM Fusion', 'Red Hat OpenShift'],
      painPoints: ['VMware licensing changes', 'Rising costs', 'Vendor lock-in'],
      solution: 'Migrate VMware workloads to IBM Fusion with OpenShift for 50% cost savings',
      roi: '50% cost reduction, improved performance',
      cadencesUsing: ['Virtualization Focus', 'Infrastructure Transformation']
    },
    {
      id: 3,
      useCase: 'Ransomware Protection & Cyber Resilience',
      description: 'Protecting critical data from ransomware attacks with immutable storage',
      targetIndustries: ['Financial Services', 'Healthcare', 'Government'],
      products: ['IBM FlashSystem', 'IBM Storage Defender'],
      painPoints: ['Ransomware threats', 'Data loss', 'Compliance requirements'],
      solution: 'Deploy FlashSystem with cyber vault capabilities for immutable backups',
      roi: '99.9999% availability, instant recovery',
      cadencesUsing: ['Storage Modernization', 'Flash Availability']
    },
    {
      id: 4,
      useCase: 'Hybrid Cloud for On-Prem Clients',
      description: 'Extending on-premises infrastructure to hybrid cloud',
      targetIndustries: ['Banking', 'Insurance', 'Manufacturing'],
      products: ['IBM Fusion', 'IBM PowerVS', 'Red Hat OpenShift'],
      painPoints: ['Data sovereignty', 'Compliance', 'Legacy applications'],
      solution: 'Build hybrid cloud with IBM Fusion connecting on-prem and cloud workloads',
      roi: 'Cloud agility with on-prem control',
      cadencesUsing: ['Infrastructure Transformation', 'Application Modernization']
    },
    {
      id: 5,
      useCase: 'AI Infrastructure Deployment',
      description: 'Building GPU-accelerated infrastructure for AI/ML workloads',
      targetIndustries: ['Technology', 'Financial Services', 'Healthcare'],
      products: ['IBM Fusion', 'Red Hat OpenShift AI'],
      painPoints: ['GPU availability', 'AI platform complexity', 'Cost'],
      solution: 'Deploy AI-ready infrastructure with IBM Fusion and GPU support',
      roi: 'Faster model training, simplified operations',
      cadencesUsing: ['Generative AI', 'Infrastructure Transformation']
    },
    {
      id: 6,
      useCase: 'Storage Performance Optimization',
      description: 'Improving database and application performance with flash storage',
      targetIndustries: ['Financial Services', 'Retail', 'Telecommunications'],
      products: ['IBM FlashSystem'],
      painPoints: ['Slow application performance', 'Database bottlenecks', 'User complaints'],
      solution: 'Replace spinning disk with FlashSystem for 10x performance improvement',
      roi: '10x faster, 60% cost reduction',
      cadencesUsing: ['Storage Modernization', 'Flash Availability']
    }
  ],
  trainingData: [
    {
      id: 1,
      type: 'good',
      prompt: 'Generate email for Goldman Sachs CIO about VMware cost reduction',
      subject: 'Goldman Sachs + IBM Fusion: 50% VMware Cost Reduction',
      body: `Hi [Name],

Given the recent VMware licensing changes, I wanted to reach out about how IBM Fusion can help Goldman Sachs reduce infrastructure costs by 50% while maintaining performance.

We've helped 3 major financial institutions migrate from VMware with zero downtime. Would you be open to a brief conversation?

Best regards`,
      tags: ['Personalized', 'Timely', 'Specific metrics', 'Social proof'],
      notes: 'Strong opening with relevant context, specific value prop, social proof'
    },
    {
      id: 2,
      type: 'good',
      prompt: 'Generate email for healthcare CTO about EHR modernization',
      subject: 'Mayo Clinic: Epic on IBM PowerVS - 40% Cost Reduction',
      body: `Hi [Name],

I noticed Mayo Clinic's recent announcement about EHR optimization. For your Epic workloads, IBM PowerVS offers:

• Cloud flexibility without re-platforming
• 40% lower TCO vs. on-prem
• HIPAA-compliant infrastructure

Would you be interested in a brief discussion about your Epic strategy?

Best regards`,
      tags: ['Research-based', 'Industry-specific', 'Compliance focus', 'Clear benefits'],
      notes: 'Shows research, addresses compliance, specific to healthcare'
    },
    {
      id: 3,
      type: 'bad',
      prompt: 'Generate email for IT leader about infrastructure',
      subject: 'IBM Infrastructure Solutions',
      body: `Hi,

I'm reaching out from IBM about our infrastructure solutions. We help companies improve their IT infrastructure.

Would you be interested in learning more?

Thanks`,
      tags: ['Too generic', 'No personalization', 'No value prop', 'Weak CTA'],
      notes: 'Avoid: Generic messaging, no research, weak value proposition'
    },
    {
      id: 4,
      type: 'bad',
      prompt: 'Generate email about storage',
      subject: 'Storage Solutions from IBM',
      body: `Hello,

IBM has great storage solutions that can help your company. Our FlashSystem is very fast and reliable.

Let me know if you want to learn more.

Best`,
      tags: ['Product-focused', 'No context', 'Generic claims', 'No urgency'],
      notes: 'Avoid: Product-centric instead of outcome-focused, no specific value'
    }
  ]
};

const DatabaseManager = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const tabs = [
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'industries', label: 'Industries', icon: Briefcase },
    { id: 'techKnowledge', label: 'Use Cases', icon: Cpu },
    { id: 'trainingData', label: 'Training Data', icon: FileText }
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

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      console.log('Delete item:', id);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = filteredData.map(item => item.id);
    setSelectedItems(allIds);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      console.log('Bulk delete:', selectedItems);
      setSelectedItems([]);
      setSelectMode(false);
    }
  };

  const handleBulkPublish = () => {
    console.log('Bulk publish:', selectedItems);
    alert(`Published ${selectedItems.length} items`);
  };

  const handleBulkUnpublish = () => {
    console.log('Bulk unpublish:', selectedItems);
    alert(`Unpublished ${selectedItems.length} items`);
  };

  const handleBulkExport = () => {
    console.log('Bulk export:', selectedItems);
    alert(`Exported ${selectedItems.length} items`);
  };

  const renderCompaniesTable = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredData.map((company) => (
        <div key={company.id} className="bg-bg-surface border border-border p-6 hover:border-ibm-blue transition-all cursor-pointer relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {selectMode && (
                <button
                  onClick={() => toggleSelectItem(company.id)}
                  className="flex-shrink-0"
                >
                  {selectedItems.includes(company.id) ? (
                    <CheckSquare className="w-5 h-5 text-ibm-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-text-tertiary" />
                  )}
                </button>
              )}
               <div className="flex-1">
                 <div className="flex items-center space-x-3 mb-2">
                   <h3 className="text-xl font-light text-text-primary">{company.name}</h3>
                   <span className="px-2.5 py-1 bg-ibm-blue/10 text-ibm-blue text-xs font-normal border border-border">
                     {company.keyContacts} contacts
                   </span>
                   <span className="px-2.5 py-1 bg-ibm-purple/10 text-ibm-purple text-xs font-normal border border-border">
                     {company.industry}
                   </span>
                 </div>
                 <p className="text-base text-text-secondary font-light">{company.size} • {company.revenue}</p>
               </div>
             </div>
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(showActionsMenu === company.id ? null : company.id)}
                className="p-2 hover:bg-bg-raised transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-text-tertiary" />
              </button>
              {showActionsMenu === company.id && (
                <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => { handleEdit(company); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { handleDelete(company.id); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-text-tertiary mb-2 font-normal">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {company.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-bg-raised text-text-secondary text-sm border border-border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-2 font-normal">Pain Points</p>
              <ul className="text-sm text-text-secondary space-y-1 font-light">
                {company.painPoints.slice(0, 2).map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {company.recentNews && (
            <div className="bg-bg-raised border border-border p-3">
              <p className="text-sm text-text-primary font-light">📰 {company.recentNews}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderIndustriesTable = () => {
    if (selectedIndustry) {
      const industry = filteredData.find(i => i.id === selectedIndustry);
      if (!industry) return null;

      return (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedIndustry(null)}
            className="flex items-center space-x-2 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-normal">Back to all industries</span>
          </button>

          <div className="bg-bg-surface border border-border p-6">
            <h3 className="text-2xl font-light text-text-primary mb-4">{industry.name}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-text-tertiary mb-2 font-normal">Summary</h4>
                <p className="text-base text-text-primary font-light">{industry.summary}</p>
              </div>

              <div>
                <h4 className="text-sm text-text-tertiary mb-2 font-normal">Example Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {industry.examples.map((example, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-bg-raised text-text-primary text-sm border border-border">
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-text-tertiary mb-2 font-normal">Common Pain Points</h4>
                <ul className="text-sm text-text-secondary space-y-2 font-light">
                  {industry.painPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-ibm-blue mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm text-text-tertiary mb-2 font-normal">IBM Solutions</h4>
                <ul className="text-sm text-text-secondary space-y-2 font-light">
                  {industry.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-ibm-purple mr-2">•</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {filteredData.map((industry) => (
          <div
            key={industry.id}
            className="bg-bg-surface border border-border p-5 hover:bg-bg-raised hover:border-ibm-blue transition-all relative cursor-pointer"
            onClick={() => !selectMode && setSelectedIndustry(industry.id)}
          >
            {selectMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectItem(industry.id);
                }}
                className="absolute top-3 right-3"
              >
                {selectedItems.includes(industry.id) ? (
                  <CheckSquare className="w-5 h-5 text-ibm-blue" />
                ) : (
                  <Square className="w-5 h-5 text-text-tertiary" />
                )}
              </button>
            )}
            
            <h3 className="text-base font-normal text-text-primary mb-3">{industry.name}</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-tertiary mb-1.5 font-normal">Summary</p>
                <p className="text-xs text-text-secondary font-light line-clamp-2">{industry.summary}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-tertiary mb-1.5 font-normal">Example Companies</p>
                <div className="flex flex-wrap gap-1">
                  {industry.examples.slice(0, 3).map((example, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-bg-raised text-text-secondary text-xs border border-border">
                      {example}
                    </span>
                  ))}
                  {industry.examples.length > 3 && (
                    <span className="px-2 py-0.5 text-text-tertiary text-xs">
                      +{industry.examples.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-text-tertiary mb-1.5 font-normal">Key Pain Points</p>
                <ul className="text-xs text-text-secondary space-y-0.5 font-light">
                  {industry.painPoints.slice(0, 2).map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-xs text-ibm-blue hover:text-ibm-blue/80 font-normal">
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTechKnowledgeTable = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredData.map((tech) => (
        <div key={tech.id} className="bg-bg-surface border border-border p-5 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {selectMode && (
                <button
                  onClick={() => toggleSelectItem(tech.id)}
                  className="flex-shrink-0"
                >
                  {selectedItems.includes(tech.id) ? (
                    <CheckSquare className="w-5 h-5 text-ibm-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-text-tertiary" />
                  )}
                </button>
              )}
               <div className="flex-1">
                 <h3 className="text-lg font-light text-text-primary mb-1">{tech.useCase}</h3>
                 <p className="text-sm text-text-secondary font-light">{tech.description}</p>
               </div>
             </div>
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(showActionsMenu === tech.id ? null : tech.id)}
                className="p-2 hover:bg-bg-raised transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-text-tertiary" />
              </button>
              {showActionsMenu === tech.id && (
                <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => { handleEdit(tech); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { handleDelete(tech.id); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-text-tertiary mb-2 font-normal">Target Industries</p>
              <div className="flex flex-wrap gap-1.5">
                {tech.targetIndustries.map((industry, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-ibm-purple/10 text-ibm-purple text-xs border border-border">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2 font-normal">Products</p>
              <div className="flex flex-wrap gap-1.5">
                {tech.products.map((product, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-ibm-blue/10 text-ibm-blue text-xs border border-border">
                    {product}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-2 font-normal">ROI</p>
              <p className="text-xs text-text-primary font-light">{tech.roi}</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mb-4">
            <p className="text-xs text-text-tertiary mb-2 font-normal">Pain Points</p>
            <ul className="text-xs text-text-secondary space-y-1 font-light">
              {tech.painPoints.map((point, idx) => (
                <li key={idx}>• {point}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-xs text-text-tertiary mb-2 font-normal">Solution</p>
            <p className="text-xs text-text-primary font-light">{tech.solution}</p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-text-tertiary mb-2 font-normal">Used in Cadences</p>
            <div className="flex flex-wrap gap-2">
              {tech.cadencesUsing.map((cadence, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-ibm-blue/10 text-ibm-blue text-xs border border-border">
                  {cadence}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrainingDataTable = () => (
    <div className="space-y-4">
      {filteredData.map((example) => (
        <div key={example.id} className="bg-bg-surface border border-border p-5 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {selectMode && (
                <button
                  onClick={() => toggleSelectItem(example.id)}
                  className="flex-shrink-0"
                >
                  {selectedItems.includes(example.id) ? (
                    <CheckSquare className="w-5 h-5 text-ibm-blue" />
                  ) : (
                    <Square className="w-5 h-5 text-text-tertiary" />
                  )}
                </button>
              )}
              <span className={`px-2.5 py-1 text-xs font-normal border ${
                example.type === 'good'
                  ? 'bg-ibm-blue/10 text-ibm-blue border-ibm-blue/30'
                  : 'bg-gray-70 text-gray-30 border-gray-60'
              }`}>
                {example.type === 'good' ? '✓ Good Example' : '✗ Avoid This'}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(showActionsMenu === example.id ? null : example.id)}
                className="p-2 hover:bg-bg-raised transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-text-tertiary" />
              </button>
              {showActionsMenu === example.id && (
                <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => { handleEdit(example); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { handleDelete(example.id); setShowActionsMenu(null); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-bg-raised flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-text-tertiary font-normal">Prompt:</span>
              <p className="text-sm text-text-primary mt-1 font-light">{example.prompt}</p>
            </div>
            <div>
              <span className="text-xs text-text-tertiary font-normal">Subject:</span>
              <p className="text-sm text-text-primary mt-1 font-light">{example.subject}</p>
            </div>
            <div>
              <span className="text-xs text-text-tertiary font-normal">Body:</span>
              <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap font-light">{example.body}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {example.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-bg-raised text-text-tertiary text-xs border border-border">
                  {tag}
                </span>
              ))}
            </div>
            {example.notes && (
              <div className="bg-bg-raised border border-border p-3">
                <p className="text-xs text-text-secondary font-light">{example.notes}</p>
              </div>
            )}
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
          <h2 className="text-3xl font-light text-text-primary">Knowledge Base</h2>
          <p className="text-base text-text-secondary mt-1.5 font-light">
            Manage companies, industries, and technical knowledge for AI personalization
          </p>
        </div>
        <div className="flex space-x-3">
          {!selectMode ? (
            <>
              <button
                onClick={toggleSelectMode}
                className="bg-ibm-blue/10 hover:bg-ibm-blue/20 text-ibm-blue font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-ibm-blue/30"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Select</span>
              </button>
              <button className="bg-ibm-blue hover:bg-ibm-blue/90 text-white font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
              <button onClick={handleExportCSV} className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleSelectMode}
                className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={selectAll}
                className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Select All</span>
              </button>
              {selectedItems.length > 0 && (
                <>
                  <button
                    onClick={deselectAll}
                    className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border"
                  >
                    <Square className="w-4 h-4" />
                    <span>Deselect All</span>
                  </button>
                  <div className="h-6 w-px bg-border"></div>
                  
                  {/* Training Data tab: Publish/Unpublish/Export/Delete */}
                  {activeTab === 'trainingData' && (
                    <>
                      <button
                        onClick={handleBulkPublish}
                        className="bg-ibm-blue hover:bg-ibm-blue/90 text-white font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Publish ({selectedItems.length})</span>
                      </button>
                      <button
                        onClick={handleBulkUnpublish}
                        className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border"
                      >
                        <EyeOff className="w-4 h-4" />
                        <span>Unpublish</span>
                      </button>
                      <button
                        onClick={handleBulkExport}
                        className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </>
                  )}
                  
                  {/* All tabs: Delete button */}
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </>
          )}
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
                className={`py-4 px-1 border-b-2 font-normal text-sm transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-ibm-blue text-ibm-blue'
                    : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search - Consistent style */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 pl-10 text-sm bg-bg-surface text-text-primary placeholder-text-tertiary border border-border focus:ring-2 focus:ring-ibm-blue outline-none font-light"
        />
      </div>

      {/* Content */}
      <div className="bg-bg-surface border border-border p-5">
        {activeTab === 'companies' && renderCompaniesTable()}
        {activeTab === 'industries' && renderIndustriesTable()}
        {activeTab === 'techKnowledge' && renderTechKnowledgeTable()}
        {activeTab === 'trainingData' && renderTrainingDataTable()}

        {filteredData.length === 0 && !selectedIndustry && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary font-light">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;

// Made with Bob