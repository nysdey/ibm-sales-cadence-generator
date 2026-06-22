import { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, Search, Filter, CheckCircle, XCircle, Clock, Mail, FileText } from 'lucide-react';

// Sample database records
const SAMPLE_RECORDS = [
  {
    id: 1,
    type: 'email',
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
  },
  {
    id: 2,
    type: 'email',
    prospectName: 'Michael Rodriguez',
    companyName: 'JPMorgan Chase',
    cadenceType: 'Fusion VMWare',
    subject: 'VMware Alternative: Reduce Costs by 50%',
    content: 'Hi Michael,\n\nWith recent changes in VMware licensing...',
    status: 'sent',
    createdAt: '2024-01-15T11:45:00Z',
    sentAt: '2024-01-15T11:50:00Z',
    opened: true,
    clicked: true,
    replied: true
  },
  {
    id: 3,
    type: 'email',
    prospectName: 'Jennifer Park',
    companyName: 'Morgan Stanley',
    cadenceType: 'Flash Availability',
    subject: 'IBM FlashSystem - 10x Faster Storage',
    content: 'Hi Jennifer,\n\nI wanted to reach out about IBM FlashSystem...',
    status: 'sent',
    createdAt: '2024-01-14T14:20:00Z',
    sentAt: '2024-01-14T14:25:00Z',
    opened: true,
    clicked: false,
    replied: false
  },
  {
    id: 4,
    type: 'email',
    prospectName: 'David Thompson',
    companyName: 'Bank of America',
    cadenceType: 'Client-Intro',
    subject: 'Infrastructure Modernization for Bank of America',
    content: 'Hi David,\n\nI noticed Bank of America recently announced...',
    status: 'sent',
    createdAt: '2024-01-14T09:15:00Z',
    sentAt: '2024-01-14T09:20:00Z',
    opened: true,
    clicked: true,
    replied: false
  },
  {
    id: 5,
    type: 'email',
    prospectName: 'Lisa Wang',
    companyName: 'Citigroup',
    cadenceType: 'Follow-up',
    subject: 'Re: Infrastructure Discussion',
    content: 'Hi Lisa,\n\nFollowing up on my previous email...',
    status: 'draft',
    createdAt: '2024-01-13T16:30:00Z',
    sentAt: null,
    opened: false,
    clicked: false,
    replied: false
  },
  {
    id: 6,
    type: 'email',
    prospectName: 'Robert Martinez',
    companyName: 'Wells Fargo',
    cadenceType: 'Fusion VMWare',
    subject: 'Wells Fargo + IBM Fusion: Perfect Timing',
    content: 'Hi Robert,\n\nGiven the recent VMware licensing changes...',
    status: 'sent',
    createdAt: '2024-01-13T11:00:00Z',
    sentAt: '2024-01-13T11:05:00Z',
    opened: true,
    clicked: true,
    replied: true
  },
  {
    id: 7,
    type: 'email',
    prospectName: 'Amanda Foster',
    companyName: 'Charles Schwab',
    cadenceType: 'Client-Intro',
    subject: 'IBM Infrastructure Solutions',
    content: 'Hi Amanda,\n\nI\'m reaching out from IBM...',
    status: 'sent',
    createdAt: '2024-01-12T15:45:00Z',
    sentAt: '2024-01-12T15:50:00Z',
    opened: false,
    clicked: false,
    replied: false
  },
  {
    id: 8,
    type: 'email',
    prospectName: 'Kevin O\'Brien',
    companyName: 'TD Bank',
    cadenceType: 'Flash Availability',
    subject: 'Solving TD Bank\'s Storage Performance Challenges',
    content: 'Hi Kevin,\n\nI understand TD Bank is experiencing rapid data growth...',
    status: 'sent',
    createdAt: '2024-01-12T10:20:00Z',
    sentAt: '2024-01-12T10:25:00Z',
    opened: true,
    clicked: true,
    replied: false
  },
  {
    id: 9,
    type: 'email',
    prospectName: 'Maria Garcia',
    companyName: 'PNC Bank',
    cadenceType: 'Client-Intro',
    subject: 'Infrastructure Transformation Opportunity',
    content: 'Hi Maria,\n\nI wanted to reach out about infrastructure modernization...',
    status: 'scheduled',
    createdAt: '2024-01-11T14:00:00Z',
    sentAt: null,
    opened: false,
    clicked: false,
    replied: false
  },
  {
    id: 10,
    type: 'email',
    prospectName: 'James Wilson',
    companyName: 'US Bank',
    cadenceType: 'Fusion VMWare',
    subject: 'VMware Migration Strategy for US Bank',
    content: 'Hi James,\n\nAs VMware licensing costs continue to rise...',
    status: 'draft',
    createdAt: '2024-01-11T09:30:00Z',
    sentAt: null,
    opened: false,
    clicked: false,
    replied: false
  },
  {
    id: 11,
    type: 'template',
    name: 'Client Introduction - Infrastructure',
    cadenceType: 'Client-Intro',
    subject: 'Quick introduction - IBM Infrastructure Solutions',
    content: 'Hi {{first_name}},\n\nI hope this email finds you well...',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    usageCount: 45
  },
  {
    id: 12,
    type: 'template',
    name: 'VMware Alternative Pitch',
    cadenceType: 'Fusion VMWare',
    subject: 'VMware Alternative: Reduce Costs by {{percentage}}%',
    content: 'Hi {{first_name}},\n\nWith recent changes in VMware licensing...',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    usageCount: 32
  },
  {
    id: 13,
    type: 'template',
    name: 'FlashSystem Introduction',
    cadenceType: 'Flash Availability',
    subject: 'IBM FlashSystem - {{benefit}}',
    content: 'Hi {{first_name}},\n\nI wanted to reach out about IBM FlashSystem...',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    usageCount: 28
  },
  {
    id: 14,
    type: 'prospect',
    prospectName: 'Thomas Anderson',
    companyName: 'Capital One',
    title: 'VP of Infrastructure',
    email: 'thomas.anderson@capitalone.com',
    status: 'active',
    createdAt: '2024-01-09T14:20:00Z',
    lastContact: '2024-01-14T10:00:00Z'
  },
  {
    id: 15,
    type: 'prospect',
    prospectName: 'Emily Chen',
    companyName: 'American Express',
    title: 'Director of IT Operations',
    email: 'emily.chen@amex.com',
    status: 'active',
    createdAt: '2024-01-09T11:15:00Z',
    lastContact: null
  }
];

const DatabaseManager = () => {
  const [records, setRecords] = useState(SAMPLE_RECORDS);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const filteredRecords = records.filter(record => {
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesSearch = searchTerm === '' ||
      (record.prospectName && record.prospectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.companyName && record.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.subject && record.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(r => r.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedRecords.length} selected records?`)) {
      setRecords(records.filter(r => !selectedRecords.includes(r.id)));
      setSelectedRecords([]);
    }
  };

  const handleExportCSV = () => {
    const recordsToExport = selectedRecords.length > 0
      ? records.filter(r => selectedRecords.includes(r.id))
      : filteredRecords;

    if (recordsToExport.length === 0) {
      alert('No records to export');
      return;
    }

    // Define CSV headers based on record type
    const headers = ['ID', 'Type', 'Name/Prospect', 'Company', 'Subject', 'Cadence Type', 'Status', 'Created At', 'Sent At', 'Opened', 'Clicked', 'Replied'];
    
    // Convert records to CSV rows
    const csvRows = [
      headers.join(','),
      ...recordsToExport.map(record => {
        const row = [
          record.id,
          record.type,
          record.prospectName || record.name || '',
          record.companyName || '',
          record.subject || '',
          record.cadenceType || '',
          record.status,
          record.createdAt || '',
          record.sentAt || '',
          record.opened ? 'Yes' : 'No',
          record.clicked ? 'Yes' : 'No',
          record.replied ? 'Yes' : 'No'
        ];
        // Escape commas and quotes in CSV
        return row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',');
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleOpenEmail = (record) => {
    if (record.type !== 'email') return;
    
    // Create a modal or new window to display the email
    const emailWindow = window.open('', '_blank', 'width=800,height=600');
    if (emailWindow) {
      emailWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email: ${record.subject}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
                background: #f9fafb;
              }
              .email-container {
                background: white;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .email-header {
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 16px;
                margin-bottom: 16px;
              }
              .email-meta {
                display: grid;
                gap: 8px;
                margin-bottom: 16px;
                font-size: 14px;
              }
              .email-meta-row {
                display: flex;
              }
              .email-meta-label {
                font-weight: 600;
                color: #374151;
                width: 100px;
              }
              .email-meta-value {
                color: #6b7280;
              }
              .email-subject {
                font-size: 24px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 16px;
              }
              .email-content {
                white-space: pre-wrap;
                line-height: 1.6;
                color: #374151;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              }
              .status-sent {
                background: #d1fae5;
                color: #065f46;
              }
              .status-draft {
                background: #f3f4f6;
                color: #374151;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <div class="email-subject">${record.subject}</div>
                <div class="email-meta">
                  <div class="email-meta-row">
                    <span class="email-meta-label">To:</span>
                    <span class="email-meta-value">${record.prospectName} (${record.companyName})</span>
                  </div>
                  <div class="email-meta-row">
                    <span class="email-meta-label">Cadence:</span>
                    <span class="email-meta-value">${record.cadenceType}</span>
                  </div>
                  <div class="email-meta-row">
                    <span class="email-meta-label">Status:</span>
                    <span class="email-meta-value">
                      <span class="status-badge status-${record.status}">${record.status.toUpperCase()}</span>
                    </span>
                  </div>
                  <div class="email-meta-row">
                    <span class="email-meta-label">Created:</span>
                    <span class="email-meta-value">${new Date(record.createdAt).toLocaleString()}</span>
                  </div>
                  ${record.sentAt ? `
                  <div class="email-meta-row">
                    <span class="email-meta-label">Sent:</span>
                    <span class="email-meta-value">${new Date(record.sentAt).toLocaleString()}</span>
                  </div>
                  ` : ''}
                  ${record.status === 'sent' ? `
                  <div class="email-meta-row">
                    <span class="email-meta-label">Engagement:</span>
                    <span class="email-meta-value">
                      ${record.opened ? '✓ Opened' : '✗ Not opened'}
                      ${record.clicked ? ' • ✓ Clicked' : ''}
                      ${record.replied ? ' • ✓ Replied' : ''}
                    </span>
                  </div>
                  ` : ''}
                </div>
              </div>
              <div class="email-content">${record.content}</div>
            </div>
          </body>
        </html>
      `);
      emailWindow.document.close();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sent
        </span>;
      case 'draft':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Draft
        </span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </span>;
      case 'active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          {status}
        </span>;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      email: 'bg-blue-50 text-blue-700 border-blue-200',
      template: 'bg-purple-50 text-purple-700 border-purple-200',
      prospect: 'bg-green-50 text-green-700 border-green-200',
      cadence: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[type] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const stats = {
    total: records.length,
    emails: records.filter(r => r.type === 'email').length,
    templates: records.filter(r => r.type === 'template').length,
    prospects: records.filter(r => r.type === 'prospect').length,
    sent: records.filter(r => r.status === 'sent').length,
    drafts: records.filter(r => r.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Database Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage emails, templates, prospects, and cadences
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Records</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-blue-600">{stats.emails}</div>
          <div className="text-xs text-gray-500 mt-1">Emails</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-purple-600">{stats.templates}</div>
          <div className="text-xs text-gray-500 mt-1">Templates</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-green-600">{stats.prospects}</div>
          <div className="text-xs text-gray-500 mt-1">Prospects</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-green-600">{stats.sent}</div>
          <div className="text-xs text-gray-500 mt-1">Sent</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-semibold text-gray-600">{stats.drafts}</div>
          <div className="text-xs text-gray-500 mt-1">Drafts</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-blue-50 border-ibm-blue text-ibm-blue' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {selectedRecords.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="btn-secondary flex items-center space-x-2 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4" />
                <span>Export Selected ({selectedRecords.length})</span>
              </button>
              <button
                onClick={handleDeleteSelected}
                className="btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedRecords.length})</span>
              </button>
            </>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="email">Emails</option>
                <option value="template">Templates</option>
                <option value="prospect">Prospects</option>
                <option value="cadence">Cadences</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-ibm-blue focus:ring-ibm-blue"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="rounded border-gray-300 text-ibm-blue focus:ring-ibm-blue"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(record.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {record.prospectName || record.name || record.subject || 'N/A'}
                      </div>
                      <div className="text-gray-500">
                        {record.companyName || record.cadenceType || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {record.type === 'email' && record.status === 'sent' && (
                      <div className="flex items-center space-x-2 text-xs">
                        {record.opened && <span className="text-green-600">✓ Opened</span>}
                        {record.clicked && <span className="text-blue-600">✓ Clicked</span>}
                        {record.replied && <span className="text-purple-600">✓ Replied</span>}
                        {!record.opened && !record.clicked && !record.replied && (
                          <span className="text-gray-400">No engagement</span>
                        )}
                      </div>
                    )}
                    {record.type === 'template' && record.usageCount !== undefined && (
                      <div className="text-xs text-gray-500">
                        Used {record.usageCount} times
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {record.type === 'email' && (
                      <button
                        onClick={() => handleOpenEmail(record)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-ibm-blue hover:bg-blue-50 rounded-md transition-colors"
                        title="Open email"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1" />
                        Open
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;

// Made with Bob