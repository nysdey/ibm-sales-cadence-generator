import { useState, useRef } from 'react'
import {
  Plus, Upload, List, Building2, Search,
  ChevronRight, X,
  CheckSquare, Square, Trash2,
  Clock, Zap, ArrowUpRight, Download, Users,
  Send, Mail, Phone, Linkedin, ExternalLink, Loader2
} from 'lucide-react'
import { MOCK_ACCOUNTS, MOCK_LISTS } from './mockData'
import { MOCK_CONTACTS, MOCK_SALESLOFT_CADENCES } from '../intelligence/mockSignals'

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_META = {
  'Active Opportunity': { color: 'text-green-400',  border: 'border-green-400',  dot: 'bg-green-400' },
  'No Recent Activity': { color: 'text-yellow-400', border: 'border-yellow-400', dot: 'bg-yellow-400' },
  'New Logo':           { color: 'text-ibm-blue',   border: 'border-ibm-blue',   dot: 'bg-ibm-blue' },
  'Churned':            { color: 'text-red-400',    border: 'border-red-400',    dot: 'bg-red-400' },
}

const LIST_COLORS = {
  blue:   { ring: 'border-ibm-blue',   bg: 'bg-ibm-blue/10',   text: 'text-ibm-blue' },
  purple: { ring: 'border-ibm-purple', bg: 'bg-ibm-purple/10', text: 'text-ibm-purple' },
  orange: { ring: 'border-orange-400', bg: 'bg-orange-400/10', text: 'text-orange-400' },
  green:  { ring: 'border-green-400',  bg: 'bg-green-400/10',  text: 'text-green-400' },
}

const intentLabel = (score) => {
  if (score >= 80) return { label: 'High', color: 'text-green-400' }
  if (score >= 55) return { label: 'Medium', color: 'text-yellow-400' }
  return { label: 'Low', color: 'text-red-400' }
}

const parseNames = (raw) =>
  raw
    .split(/[\n,\t]+/)
    .map((s) => s.trim())
    .filter(Boolean)

// ─── sub-components ──────────────────────────────────────────────────────────

function IntentBar({ score }) {
  const { color } = intentLabel(score)
  const width = `${score}%`
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1 bg-bg-raised rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? 'bg-green-400' : score >= 55 ? 'bg-yellow-400' : 'bg-red-400'
          }`}
          style={{ width }}
        />
      </div>
      <span className={`text-xs font-mono ${color}`}>{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['No Recent Activity']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border bg-bg-surface text-white ${meta.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {status}
    </span>
  )
}

function AccountRow({ account, selected, onToggle, onSelect }) {
  return (
    <tr
      className={`border-b border-border hover:bg-bg-raised/50 transition-colors cursor-pointer ${
        selected ? 'bg-ibm-blue/5' : ''
      }`}
    >
      <td className="py-3 px-3 w-8">
        <button onClick={(e) => { e.stopPropagation(); onToggle(account.id) }} className="text-text-tertiary hover:text-ibm-blue">
          {selected ? <CheckSquare className="w-4 h-4 text-ibm-blue" /> : <Square className="w-4 h-4" />}
        </button>
      </td>
      <td className="py-3 px-3" onClick={() => onSelect(account)}>
        <div className="font-medium text-text-primary text-sm">{account.name}</div>
        <div className="text-xs text-text-tertiary mt-0.5">{account.location}</div>
      </td>
      <td className="py-3 px-3 text-sm text-text-secondary">{account.industry}</td>
      <td className="py-3 px-3">
        <StatusBadge status={account.status} />
      </td>
      <td className="py-3 px-3">
        {account.installedBase.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {account.installedBase.map((p) => (
              <span key={p} className="text-xs px-1.5 py-0.5 bg-bg-surface text-white border border-ibm-blue/50">
                {p.replace('IBM ', '')}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-text-tertiary">—</span>
        )}
      </td>
      <td className="py-3 px-3">
        <IntentBar score={account.intentScore} />
      </td>
      <td className="py-3 px-3 text-xs text-text-tertiary">
        {account.lastContact ?? <span className="italic">Never</span>}
      </td>
    </tr>
  )
}

function ListCard({ list, accounts, onSelect, active }) {
  const listAccounts = accounts.filter((a) => list.accountIds.includes(a.id))
  const avgIntent = listAccounts.length
    ? Math.round(listAccounts.reduce((s, a) => s + a.intentScore, 0) / listAccounts.length)
    : 0
  const colors = LIST_COLORS[list.color] || LIST_COLORS.blue

  return (
    <button
      onClick={() => onSelect(list)}
      className={`w-full text-left p-4 bg-bg-surface border transition-all hover:bg-bg-raised ${
        active ? `${colors.ring} border` : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium truncate ${active ? colors.text : 'text-text-primary'}`}>
            {list.name}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{list.description}</div>
        </div>
        <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active ? colors.text : 'text-text-tertiary'}`} />
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1 text-xs text-text-tertiary">
          <Building2 className="w-3 h-3" />
          <span>{listAccounts.length} accounts</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-tertiary">
          <Zap className="w-3 h-3" />
          <span>Avg intent {avgIntent}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-tertiary">
          <Clock className="w-3 h-3" />
          <span>{list.updatedAt}</span>
        </div>
      </div>
    </button>
  )
}

function AccountDetailPanel({ account, onClose }) {
  if (!account) return null
  const intent = intentLabel(account.intentScore)
  return (
    <div className="border-l border-border bg-bg-surface w-80 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-text-primary">{account.name}</span>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Status */}
        <div>
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Status</div>
          <StatusBadge status={account.status} />
        </div>
        {/* Details */}
        <div className="space-y-2">
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Details</div>
          <div className="flex justify-between">
            <span className="text-text-tertiary">Industry</span>
            <span className="text-text-primary text-right max-w-[160px]">{account.industry}</span>
          </div>
          {account.subIndustry && (
            <div className="flex justify-between">
              <span className="text-text-tertiary">Sub-Industry</span>
              <span className="text-text-primary text-right max-w-[160px] text-xs">{account.subIndustry}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-tertiary">Size</span>
            <span className="text-text-primary">{account.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-tertiary">Location</span>
            <span className="text-text-primary">{account.location}</span>
          </div>
          {account.coverageId && (
            <div className="flex justify-between">
              <span className="text-text-tertiary">Coverage ID</span>
              <span className="text-text-primary font-mono text-xs">{account.coverageId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-tertiary">Last Contact</span>
            <span className="text-text-primary">{account.lastContact ?? 'Never'}</span>
          </div>
          {account.ibmSpend != null && account.ibmSpend > 0 && (
            <div className="flex justify-between">
              <span className="text-text-tertiary">IBM Spend 23–26</span>
              <span className="text-ibm-blue font-medium">${account.ibmSpend.toLocaleString()}</span>
            </div>
          )}
          {account.globalRevenue != null && account.globalRevenue > 0 && (
            <div className="flex justify-between">
              <span className="text-text-tertiary">Global Revenue</span>
              <span className="text-text-primary text-xs">${(account.globalRevenue / 1e9).toFixed(1)}B</span>
            </div>
          )}
        </div>
        {/* Intent */}
        <div>
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Buyer Intent</div>
          <div className="flex items-center gap-3">
            <IntentBar score={account.intentScore} />
            <span className={`text-xs font-medium ${intent.color}`}>{intent.label}</span>
          </div>
          <div className="text-xs text-text-tertiary mt-1">Score from LinkedIn Sales Navigator</div>
        </div>
        {/* Installed Base */}
        <div>
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Installed Base</div>
          {account.installedBase.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {account.installedBase.map((p) => (
                <span key={p} className="text-xs px-2 py-1 bg-bg-surface text-white border border-ibm-blue/50">
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-text-tertiary">No IBM products installed</span>
          )}
        </div>
        {/* ISC Notes */}
        <div>
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
            ISC History
          </div>
          {account.iscNotes ? (
            <p className="text-xs text-text-secondary leading-relaxed bg-bg-raised border border-border p-3">
              {account.iscNotes}
            </p>
          ) : (
            <p className="text-xs text-text-tertiary italic">No ISC records found.</p>
          )}
        </div>
        {/* Actions */}
        <div className="pt-2 border-t border-border space-y-2">
          <button className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Open in Chat
          </button>
          <button className="w-full btn-secondary text-xs">Add to List</button>
        </div>
      </div>
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

export default function AccountsManager({ sharedLists, setSharedLists }) {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS)
  const [internalLists, setInternalLists] = useState(MOCK_LISTS)
  const lists = sharedLists ?? internalLists
  const setLists = setSharedLists ?? setInternalLists
  const [view, setView] = useState('lists') // 'lists' | 'all'
  const [activeList, setActiveList] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Add accounts modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [addMode, setAddMode] = useState('paste') // 'paste' | 'csv'
  const [pasteText, setPasteText] = useState('')
  const [csvFile, setCsvFile] = useState(null)
  const [csvPreview, setCsvPreview] = useState([])
  const fileRef = useRef()

  // Create list modal
  const [showCreateList, setShowCreateList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDesc, setNewListDesc] = useState('')
  const [newListColor, setNewListColor] = useState('blue')

  // SalesLoft modal
  const [showSalesLoftModal, setShowSalesLoftModal] = useState(false)
  const [slStep, setSlStep] = useState('contacts')   // 'contacts' | 'cadence' | 'confirm'
  const [slSelectedCadence, setSlSelectedCadence] = useState(null)
  const [slSelectedContacts, setSlSelectedContacts] = useState(new Set())
  const [slExporting, setSlExporting] = useState(false)
  const [slExported, setSlExported] = useState(false)

  // ── derived data ──
  const displayAccounts = view === 'lists' && activeList
    ? accounts.filter((a) => activeList.accountIds.includes(a.id))
    : accounts

  const filtered = displayAccounts.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  // ── selection ──
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)))
    }
  }

  // ── add accounts ──
  const handleCsvUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFile(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      setCsvPreview(lines.slice(0, 5))
    }
    reader.readAsText(file)
  }

  const handleAddAccounts = () => {
    const names = addMode === 'paste' ? parseNames(pasteText) : csvPreview
    const newAccounts = names
      .filter((name) => !accounts.find((a) => a.name.toLowerCase() === name.toLowerCase()))
      .map((name, i) => ({
        id: `acc-new-${Date.now()}-${i}`,
        name,
        industry: 'Unknown',
        size: 'Unknown',
        location: '—',
        status: 'New Logo',
        lastContact: null,
        installedBase: [],
        intentScore: 0,
        iscNotes: '',
      }))
    setAccounts((prev) => [...prev, ...newAccounts])
    setPasteText('')
    setCsvFile(null)
    setCsvPreview([])
    setShowAddModal(false)
  }

  // ── create list ──
  const handleCreateList = () => {
    if (!newListName.trim()) return
    const newList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      description: newListDesc.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      accountIds: [...selectedIds],
      color: newListColor,
    }
    setLists((prev) => [newList, ...prev])
    setSelectedIds(new Set())
    setNewListName('')
    setNewListDesc('')
    setNewListColor('blue')
    setShowCreateList(false)
  }

  // ── remove from list ──
  const handleRemoveFromList = () => {
    if (!activeList) return
    setLists((prev) =>
      prev.map((l) =>
        l.id === activeList.id
          ? { ...l, accountIds: l.accountIds.filter((id) => !selectedIds.has(id)) }
          : l
      )
    )
    setActiveList((prev) =>
      prev ? { ...prev, accountIds: prev.accountIds.filter((id) => !selectedIds.has(id)) } : prev
    )
    setSelectedIds(new Set())
  }

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length

  // ── CSV export ──
  const exportListToCsv = (list) => {
    const listAccounts = list
      ? accounts.filter(a => list.accountIds.includes(a.id))
      : accounts
    const headers = ['Name','Industry','Sub-Industry','Size','Location','Status','IBM Spend','Global Revenue','Intent Score','Installed Base','Last Contact','ISC Notes']
    const rows = listAccounts.map(a => [
      a.name,
      a.industry,
      a.subIndustry || '',
      a.size,
      a.location,
      a.status,
      a.ibmSpend ?? 0,
      a.globalRevenue ?? 0,
      a.intentScore,
      a.installedBase.join('; '),
      a.lastContact ?? '',
      `"${(a.iscNotes || '').replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${list ? list.name.replace(/[^a-z0-9]/gi, '_') : 'all_accounts'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── SalesLoft export ──
  const openSalesLoftModal = () => {
    setSlStep('contacts')
    setSlSelectedCadence(null)
    setSlSelectedContacts(new Set())
    setSlExported(false)
    setShowSalesLoftModal(true)
  }

  const handleSlExport = async () => {
    setSlExporting(true)
    await new Promise(r => setTimeout(r, 1800)) // mock API call
    setSlExporting(false)
    setSlExported(true)
  }

  // ── contacts for selected accounts ──
  const selectedAccountContacts = [...selectedIds].flatMap(id => MOCK_CONTACTS[id] || [])

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* ── Page header ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-light text-text-primary">Accounts</h2>
        <p className="text-sm text-text-tertiary mt-1">
          Manage your territory, build working lists, and track account intelligence.
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Left sidebar: Lists ── */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Lists</span>
            <button
              onClick={() => setShowCreateList(true)}
              className="flex items-center gap-1 text-xs text-ibm-blue hover:text-ibm-blue-light transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New List
            </button>
          </div>

          <div className="space-y-2">
            {/* All Accounts tile */}
            <div className={`flex items-center border transition-all ${view === 'all' ? 'border-ibm-blue bg-ibm-blue/5' : 'border-border bg-bg-surface'}`}>
              <button
                onClick={() => { setView('all'); setActiveList(null) }}
                className="flex-1 text-left p-3 hover:bg-bg-raised transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-text-tertiary" />
                    <span className={`text-sm ${view === 'all' ? 'text-ibm-blue' : 'text-text-primary'}`}>
                      All Accounts
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary">{accounts.length}</span>
                </div>
              </button>
              <button
                onClick={() => exportListToCsv(null)}
                title="Export all accounts to CSV"
                className="px-2 py-3 text-text-tertiary hover:text-ibm-blue transition-colors border-l border-border"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {lists.map((list) => (
              <div key={list.id} className="flex">
                <div className="flex-1 min-w-0">
                  <ListCard
                    list={list}
                    accounts={accounts}
                    onSelect={(l) => { setActiveList(l); setView('lists') }}
                    active={activeList?.id === list.id}
                  />
                </div>
                <button
                  onClick={() => exportListToCsv(list)}
                  title="Export list to CSV"
                  className="px-2 bg-bg-surface border border-l-0 border-border text-text-tertiary hover:text-ibm-blue transition-colors flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-5 p-3 bg-bg-surface border border-border space-y-2">
            <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Territory Stats</div>
            {[
              { label: 'Active Opportunities', count: accounts.filter(a => a.status === 'Active Opportunity').length, color: 'text-green-400' },
              { label: 'New Logo Targets',     count: accounts.filter(a => a.status === 'New Logo').length,           color: 'text-ibm-blue' },
              { label: 'No Recent Activity',   count: accounts.filter(a => a.status === 'No Recent Activity').length, color: 'text-yellow-400' },
              { label: 'Churned',              count: accounts.filter(a => a.status === 'Churned').length,            color: 'text-red-400' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className="text-text-tertiary">{label}</span>
                <span className={`font-medium ${color}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                className="input-field pl-9 text-sm"
                placeholder="Search accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto text-sm"
            >
              {['All', 'Active Opportunity', 'New Logo', 'No Recent Activity', 'Churned'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {/* Add accounts */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Accounts
            </button>
          </div>

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-ibm-blue/10 border border-ibm-blue/30 text-sm">
              <span className="text-ibm-blue font-medium">{selectedIds.size} selected</span>
              <div className="h-4 w-px bg-border" />
              <button
                onClick={() => { setShowCreateList(true) }}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <List className="w-3.5 h-3.5" />
                Save as List
              </button>
              <button
                onClick={openSalesLoftModal}
                className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Add to SalesLoft Cadence
              </button>
              <button
                onClick={() => exportListToCsv(activeList)}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              {activeList && (
                <button
                  onClick={handleRemoveFromList}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove from List
                </button>
              )}
              <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-text-tertiary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Context label */}
          {activeList && (
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-sm font-medium ${LIST_COLORS[activeList.color]?.text || 'text-ibm-blue'}`}>
                {activeList.name}
              </span>
              <span className="text-xs text-text-tertiary">— {activeList.description}</span>
            </div>
          )}

          {/* Table + detail panel */}
          <div className="flex gap-0 border border-border overflow-hidden">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-raised text-left">
                    <th className="py-2.5 px-3 w-8">
                      <button onClick={toggleAll} className="text-text-tertiary hover:text-ibm-blue">
                        {allSelected
                          ? <CheckSquare className="w-4 h-4 text-ibm-blue" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Account</th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Industry</th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Installed Base</th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Intent</th>
                    <th className="py-2.5 px-3 text-xs text-text-tertiary font-medium uppercase tracking-wider">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-text-tertiary text-sm">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((account) => (
                      <AccountRow
                        key={account.id}
                        account={account}
                        selected={selectedIds.has(account.id)}
                        onToggle={toggleSelect}
                        onSelect={(a) => setSelectedAccount(selectedAccount?.id === a.id ? null : a)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Detail panel */}
            {selectedAccount && (
              <AccountDetailPanel
                account={selectedAccount}
                onClose={() => setSelectedAccount(null)}
              />
            )}
          </div>

          <div className="mt-2 text-xs text-text-tertiary">
            {filtered.length} of {displayAccounts.length} accounts
          </div>
        </div>
      </div>

      {/* ── Add Accounts Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-bg-surface border border-border w-full max-w-lg shadow-elevated">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-medium text-text-primary">Add Accounts</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Mode tabs */}
            <div className="flex border-b border-border">
              {[
                { id: 'paste', label: 'Paste Names' },
                { id: 'csv', label: 'Upload CSV' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAddMode(m.id)}
                  className={`flex-1 py-2.5 text-sm transition-colors ${
                    addMode === m.id
                      ? 'text-ibm-blue border-b-2 border-ibm-blue -mb-px'
                      : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {addMode === 'paste' ? (
                <div>
                  <label className="block text-xs text-text-tertiary mb-2">
                    Paste account names — one per line, comma-separated, or tab-separated (spreadsheet paste)
                  </label>
                  <textarea
                    className="input-field h-40 resize-none font-mono text-xs"
                    placeholder={"Citibank\nJPMorgan Chase\nDelta Air Lines"}
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                  />
                  {pasteText && (
                    <div className="mt-2 text-xs text-text-tertiary">
                      {parseNames(pasteText).length} account(s) parsed
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-text-tertiary mb-2">
                    Upload a CSV file. First column should be account name.
                  </label>
                  <div
                    className="border-2 border-dashed border-border hover:border-ibm-blue/50 p-8 text-center cursor-pointer transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                    {csvFile ? (
                      <p className="text-sm text-ibm-blue">{csvFile}</p>
                    ) : (
                      <p className="text-sm text-text-tertiary">Click to upload or drag & drop</p>
                    )}
                    <p className="text-xs text-text-tertiary mt-1">.csv only</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCsvUpload}
                    />
                  </div>
                  {csvPreview.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-text-tertiary mb-1">Preview (first 5 rows):</div>
                      {csvPreview.map((row, i) => (
                        <div key={i} className="text-xs text-text-secondary py-0.5 border-b border-border/50">{row}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end px-5 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleAddAccounts}
                disabled={addMode === 'paste' ? !pasteText.trim() : !csvFile}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create List Modal ── */}
      {showCreateList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-bg-surface border border-border w-full max-w-md shadow-elevated">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-medium text-text-primary">Create New List</h3>
              <button onClick={() => setShowCreateList(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 text-xs text-ibm-blue bg-ibm-blue/10 border border-ibm-blue/30 px-3 py-2">
                  <CheckSquare className="w-3.5 h-3.5" />
                  {selectedIds.size} selected accounts will be added
                </div>
              )}
              <div>
                <label className="block text-xs text-text-tertiary mb-1">List Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Q3 Top Targets — FSS"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Description</label>
                <input
                  className="input-field"
                  placeholder="Short description of this list's purpose"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-2">Color</label>
                <div className="flex gap-2">
                  {Object.entries(LIST_COLORS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setNewListColor(key)}
                      className={`w-7 h-7 border-2 transition-all ${val.ring} ${val.bg} ${
                        newListColor === key ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end px-5 py-4 border-t border-border">
              <button onClick={() => setShowCreateList(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SalesLoft Cadence Modal ── */}
      {showSalesLoftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-bg-surface border border-border w-full max-w-2xl shadow-elevated max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div>
                <h3 className="text-base font-medium text-text-primary flex items-center gap-2">
                  <Send className="w-4 h-4 text-green-400" />
                  Add to SalesLoft Cadence
                </h3>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {selectedIds.size} account(s) selected · Step {slStep === 'contacts' ? '1' : slStep === 'cadence' ? '2' : '3'} of 3
                </p>
              </div>
              <button onClick={() => setShowSalesLoftModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step tabs */}
            <div className="flex border-b border-border flex-shrink-0">
              {[
                { id: 'contacts', label: '1 · Select Contacts' },
                { id: 'cadence',  label: '2 · Choose Cadence' },
                { id: 'confirm',  label: '3 · Confirm & Export' },
              ].map(tab => (
                <div
                  key={tab.id}
                  className={`px-4 py-2.5 text-xs border-b-2 transition-colors ${
                    slStep === tab.id ? 'border-ibm-blue text-ibm-blue' : 'border-transparent text-text-tertiary'
                  }`}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {/* Step 1: Contacts */}
              {slStep === 'contacts' && (
                <div className="space-y-3">
                  <div className="text-sm text-text-secondary mb-3">
                    Contacts found via LinkedIn Sales Navigator + ZoomInfo enrichment for the selected accounts.
                    Select the people you want to add to the cadence.
                  </div>
                  {selectedAccountContacts.length === 0 ? (
                    <div className="text-center py-8 text-text-tertiary text-sm">
                      No enriched contacts found for the selected accounts.
                      <div className="text-xs mt-1">Try selecting accounts with contact data (WAWA, Chanel, GEODIS, Clarivate).</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => setSlSelectedContacts(new Set(selectedAccountContacts.map(c => c.id)))}
                          className="text-xs text-ibm-blue hover:underline"
                        >Select all</button>
                        <span className="text-text-tertiary">·</span>
                        <button
                          onClick={() => setSlSelectedContacts(new Set())}
                          className="text-xs text-text-tertiary hover:underline"
                        >Clear</button>
                        <span className="ml-auto text-xs text-text-tertiary">{slSelectedContacts.size} selected</span>
                      </div>
                      {selectedAccountContacts.map(contact => (
                        <div
                          key={contact.id}
                          onClick={() => setSlSelectedContacts(prev => {
                            const n = new Set(prev)
                            n.has(contact.id) ? n.delete(contact.id) : n.add(contact.id)
                            return n
                          })}
                          className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                            slSelectedContacts.has(contact.id) ? 'border-ibm-blue bg-ibm-blue/5' : 'border-border hover:bg-bg-raised'
                          }`}
                        >
                          {slSelectedContacts.has(contact.id)
                            ? <CheckSquare className="w-4 h-4 text-ibm-blue flex-shrink-0 mt-0.5" />
                            : <Square className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text-primary">{contact.name}</span>
                              <span className="text-xs bg-bg-surface border border-border text-white px-1.5 py-0.5">{contact.title}</span>
                              <span className={`ml-auto text-xs px-1.5 py-0.5 bg-bg-surface border ${
                                contact.source === 'ZoomInfo' ? 'border-ibm-blue text-ibm-blue' : 'border-ibm-purple text-ibm-purple'
                              }`}>{contact.source}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-text-tertiary">
                              {contact.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />{contact.email}
                                  {contact.verified && <span className="text-green-400">✓</span>}
                                </span>
                              )}
                              {contact.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />{contact.phone}
                                </span>
                              )}
                              {contact.linkedin && (
                                <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-ibm-purple hover:underline"
                                  onClick={e => e.stopPropagation()}>
                                  <Linkedin className="w-3 h-3" />LinkedIn
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Cadence */}
              {slStep === 'cadence' && (
                <div className="space-y-3">
                  <div className="text-sm text-text-secondary mb-3">
                    Select the SalesLoft cadence to add the {slSelectedContacts.size} contact(s) to.
                  </div>
                  {MOCK_SALESLOFT_CADENCES.map(cadence => (
                    <div
                      key={cadence.id}
                      onClick={() => setSlSelectedCadence(cadence)}
                      className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                        slSelectedCadence?.id === cadence.id ? 'border-ibm-blue bg-ibm-blue/5' : 'border-border hover:bg-bg-raised'
                      }`}
                    >
                      {slSelectedCadence?.id === cadence.id
                        ? <CheckSquare className="w-4 h-4 text-ibm-blue flex-shrink-0" />
                        : <Square className="w-4 h-4 text-text-tertiary flex-shrink-0" />}
                      <div className="flex-1">
                        <div className="text-sm text-text-primary">{cadence.name}</div>
                        <div className="text-xs text-text-tertiary mt-0.5">{cadence.steps} steps</div>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 bg-bg-surface border ${
                        cadence.active ? 'border-green-400 text-green-400' : 'border-gray-50 text-text-tertiary'
                      }`}>{cadence.active ? 'Active' : 'Draft'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Confirm */}
              {slStep === 'confirm' && (
                <div className="space-y-4">
                  {slExported ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">✓</div>
                      <div className="text-base font-medium text-green-400">Export successful!</div>
                      <div className="text-sm text-text-tertiary mt-2">
                        {slSelectedContacts.size} contact(s) added to <span className="text-text-primary">{slSelectedCadence?.name}</span>
                      </div>
                      <button
                        onClick={() => setShowSalesLoftModal(false)}
                        className="mt-4 btn-secondary text-sm"
                      >Close</button>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-bg-raised border border-border space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">Cadence</span>
                          <span className="text-text-primary text-right max-w-xs">{slSelectedCadence?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">Contacts</span>
                          <span className="text-text-primary">{slSelectedContacts.size} people</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-tertiary">From Accounts</span>
                          <span className="text-text-primary">{selectedIds.size} accounts</span>
                        </div>
                      </div>
                      <div className="text-xs text-text-tertiary">
                        Contacts will be added to the cadence at Step 1. Verified emails will be used where available.
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!slExported && (
              <div className="flex gap-3 justify-between px-5 py-4 border-t border-border flex-shrink-0">
                <button
                  onClick={() => {
                    if (slStep === 'contacts') setShowSalesLoftModal(false)
                    else if (slStep === 'cadence') setSlStep('contacts')
                    else if (slStep === 'confirm') setSlStep('cadence')
                  }}
                  className="btn-secondary"
                >
                  {slStep === 'contacts' ? 'Cancel' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    if (slStep === 'contacts' && slSelectedContacts.size > 0) setSlStep('cadence')
                    else if (slStep === 'cadence' && slSelectedCadence) setSlStep('confirm')
                    else if (slStep === 'confirm') handleSlExport()
                  }}
                  disabled={
                    (slStep === 'contacts' && slSelectedContacts.size === 0) ||
                    (slStep === 'cadence' && !slSelectedCadence) ||
                    slExporting
                  }
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {slExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {slStep === 'contacts' ? `Continue with ${slSelectedContacts.size} contact(s)` :
                   slStep === 'cadence' ? 'Continue to Confirm' :
                   slExporting ? 'Exporting...' : 'Export to SalesLoft'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Made with Bob
