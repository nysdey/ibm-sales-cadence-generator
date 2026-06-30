import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User, Loader2, Building2, ChevronDown,
  X, Sparkles, RefreshCw, List, Plus
} from 'lucide-react'
import { MOCK_ACCOUNTS } from '../accounts/mockData'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// ─── suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Profile this account based on ISC history and installed base',
  'What IBM products should I lead with for this account?',
  'Draft a cold outreach sequence for the CIO',
  'What are the top re-engagement accounts in my territory this week?',
  'Which accounts have the highest buyer intent right now?',
  'Summarize the last 12 months of activity for this account',
  'Identify cross-sell opportunities across my active opportunities',
  'What competitive threats should I be aware of for this account?',
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatAccountContext(account) {
  if (!account) return ''
  const lines = [
    `Account: ${account.name}`,
    `Industry: ${account.industry} — ${account.subIndustry || ''}`,
    `Size: ${account.size} | Location: ${account.location}`,
    `Coverage ID: ${account.coverageId}`,
    `Status: ${account.status}`,
    `IBM Spend (23–26): $${account.ibmSpend?.toLocaleString() ?? '0'}`,
    `Global Revenue: $${account.globalRevenue ? (account.globalRevenue / 1e9).toFixed(1) + 'B' : 'N/A'}`,
    `Installed Base: ${account.installedBase.length ? account.installedBase.join(', ') : 'None'}`,
    `Buyer Intent Score: ${account.intentScore}/100`,
    `Last Contact: ${account.lastContact ?? 'Never'}`,
    `ISC Notes: ${account.iscNotes || 'No notes available'}`,
  ]
  return lines.join('\n')
}

const SYSTEM_PROMPT = `You are IBM Seller Studio's AI assistant — a specialist in IBM Infrastructure sales for the Select Territory. You help BTSSs (Brand Technical Sales Specialists) prioritize accounts, profile buyers, draft outreach, and BUILD ACCOUNT LISTS.

You have deep knowledge of:
- IBM Fusion (data fabric, storage virtualization)
- IBM PowerVS (Power Virtual Server, cloud)
- IBM FlashSystem (enterprise all-flash storage)
- BTSS Core Motions: Territory Prioritization, Technical Sales Execution, Lead Management, Business Partner Enablement, Technology Enablement & Data Hygiene
- Tools: ISC, RevTech, LinkedIn Sales Navigator, SalesLoft, TechZone, Seismic

IMPORTANT — LIST BUILDING:
When a user asks you to "build a list", "create a list", "add accounts to a list", or "save as a list" based on signals or criteria, you MUST respond with a special JSON block at the END of your response in this exact format (no markdown fences):
BUILD_LIST_JSON:{"name":"<list name>","description":"<description>","accountIds":[<array of account IDs from the territory>],"color":"<blue|green|purple|orange>"}

The available account IDs and names in the territory are:
acc-001=UNILEVER, acc-002=CAMPBELL SOUP CO., acc-003=CHURCH & DWIGHT CO INC, acc-004=CHANEL, acc-005=BOOKING HOLDINGS, acc-006=SHIFT4 CORPORATION, acc-007=WAWA INC, acc-008=FIVE BELOW, acc-009=CLARIVATE, acc-010=LUTRON ELECTRONICS, acc-011=PENN NATIONAL GAMING, acc-012=IBERDROLA SA, acc-013=ARTS & ENTERTAINMENT NET, acc-014=TALEN ENERGY CORPORATION, acc-015=DIAGEO GRAND MET, acc-016=GRUPO BIMBO, acc-017=REALOGY CORP, acc-018=XPO LOGISTICS, acc-019=ASCENA RETAIL GROUP, acc-020=CHEF'S WAREHOUSE, acc-021=GOYA FOODS INC, acc-022=SNCF (GEODIS), acc-023=VITAMIN SHOPPE, acc-024=ENDURANCE REINSURANCE CORP, acc-025=IMPERIAL BRANDS

When given account context, use it to give specific, actionable guidance. Be direct and concise — sellers are busy. Format responses with bullet points where helpful.`

// ─── message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, onCreateList }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border ${
        isUser ? 'bg-bg-raised border-border' : 'bg-ibm-blue/10 border-ibm-blue/30'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-text-secondary" />
          : <Bot className="w-3.5 h-3.5 text-ibm-blue" />}
      </div>
      {/* Bubble + list card */}
      <div className="flex-1 max-w-[78%]">
        <div className={`px-4 py-3 text-sm leading-relaxed border ${
          isUser
            ? 'bg-bg-raised border-border text-text-primary ml-auto'
            : 'bg-bg-surface border-border text-text-secondary'
        }`}>
          {msg.content.split('\n').map((line, i) => (
            <p key={i} className={line === '' ? 'mt-2' : ''}>{line}</p>
          ))}
          {msg.timestamp && (
            <div className="text-xs text-text-tertiary mt-2 opacity-60">{msg.timestamp}</div>
          )}
        </div>
        {/* List-building action card */}
        {msg.listPayload && onCreateList && (
          <div className="mt-2 border border-ibm-blue/40 bg-ibm-blue/5 p-3">
            <div className="text-xs text-ibm-blue font-medium mb-1 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5" />
              AI wants to create a list
            </div>
            <div className="text-sm text-text-primary font-medium">{msg.listPayload.name}</div>
            <div className="text-xs text-text-tertiary mt-0.5 mb-2">{msg.listPayload.description}</div>
            <div className="text-xs text-text-tertiary mb-3">{msg.listPayload.accountIds?.length ?? 0} accounts</div>
            <button
              onClick={() => onCreateList(msg.listPayload)}
              className="btn-primary text-xs py-1.5 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Save to Accounts tab
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ChatAssistant({ initialPrompt, onCreateList }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi — I'm your IBM Seller Studio AI assistant.\n\nI can help you profile accounts, prioritize your territory, identify cross-sell opportunities, draft outreach, build account lists, and more.\n\nSelect an account from the dropdown to load its context, or just ask me anything.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [accountSearch, setAccountSearch] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const selectedAccount = MOCK_ACCOUNTS.find(a => a.id === selectedAccountId) || null

  const filteredAccounts = MOCK_ACCOUNTS.filter(a =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
    a.industry.toLowerCase().includes(accountSearch.toLowerCase())
  )

  // Auto-send initialPrompt when provided (from Dashboard "Analyze with AI" button)
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { role: 'user', content, timestamp: ts }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // Build context-aware message history for the API
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT + (selectedAccount
          ? `\n\n--- CURRENT ACCOUNT CONTEXT ---\n${formatAccountContext(selectedAccount)}\n---`
          : '') },
        // send last 10 turns (keep context window reasonable)
        ...newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      ]

      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      let assistantContent
      if (!res.ok) {
        throw new Error(`API ${res.status}`)
      }
      const data = await res.json()
      assistantContent = data.response || data.content || 'No response received.'

      // Check for BUILD_LIST_JSON in the response
      let displayContent = assistantContent
      let listPayload = null
      const listMatch = assistantContent.match(/BUILD_LIST_JSON:(\{.*\})/s)
      if (listMatch) {
        try {
          listPayload = JSON.parse(listMatch[1])
          displayContent = assistantContent.replace(/BUILD_LIST_JSON:\{.*\}/s, '').trim()
        } catch {}
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: displayContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        listPayload,
      }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I couldn't reach the AI service right now. (${err.message})\n\nMake sure the backend is running and WATSONX_API_KEY is configured.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared. How can I help you?${selectedAccount ? `\n\nI still have context loaded for **${selectedAccount.name}**.` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  const loadAccountContext = (account) => {
    setSelectedAccountId(account.id)
    setShowAccountDropdown(false)
    setAccountSearch('')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Account context loaded: **${account.name}**\n\nI now have access to their ISC history, installed base, IBM spend ($${account.ibmSpend?.toLocaleString()}), intent score (${account.intentScore}/100), and status (${account.status}).\n\nWhat would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
      {/* Page header */}
      <div className="mb-4">
        <h2 className="text-2xl font-light text-text-primary">AI Assistant</h2>
        <p className="text-sm text-text-tertiary mt-1">
          Powered by Watsonx.ai — context-aware sales intelligence for your territory.
        </p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── Left panel: context + suggestions ── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
          {/* Account context selector */}
          <div>
            <div className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Account Context</div>
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 bg-bg-surface border border-border text-sm hover:border-ibm-blue/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                  <span className={`truncate ${selectedAccount ? 'text-text-primary' : 'text-text-tertiary'}`}>
                    {selectedAccount ? selectedAccount.name : 'Select account...'}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {selectedAccount && (
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedAccountId('') }}
                      className="text-text-tertiary hover:text-text-primary"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
                </div>
              </button>

              {showAccountDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 bg-bg-surface border border-border shadow-elevated mt-1 max-h-64 overflow-y-auto">
                  <div className="p-2 border-b border-border">
                    <input
                      className="w-full px-2 py-1 text-xs bg-bg-raised border border-border text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-ibm-blue"
                      placeholder="Search accounts..."
                      value={accountSearch}
                      onChange={e => setAccountSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {filteredAccounts.map(account => (
                    <button
                      key={account.id}
                      onClick={() => loadAccountContext(account)}
                      className="w-full text-left px-3 py-2.5 hover:bg-bg-raised transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="text-xs font-medium text-text-primary truncate">{account.name}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{account.industry} • {account.status}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account snapshot */}
            {selectedAccount && (
              <div className="mt-2 p-3 bg-bg-surface border border-ibm-blue/20 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">Status</span>
                  <span className="text-white">{selectedAccount.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">IBM Spend</span>
                  <span className="text-ibm-blue font-medium">${selectedAccount.ibmSpend?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">Intent Score</span>
                  <span className={`font-medium ${selectedAccount.intentScore >= 80 ? 'text-green-400' : selectedAccount.intentScore >= 55 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {selectedAccount.intentScore}/100
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">Installed Base</span>
                  <span className="text-white text-right max-w-[110px]">
                    {selectedAccount.installedBase.length ? selectedAccount.installedBase.map(p => p.replace('IBM ', '')).join(', ') : 'None'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Suggested
            </div>
            <div className="space-y-1.5">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 text-xs text-text-secondary bg-bg-surface border border-border hover:border-ibm-blue/40 hover:text-text-primary transition-colors disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div className="flex-1 flex flex-col min-h-0 border border-border bg-bg-surface">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-ibm-blue" />
              <span className="text-sm font-medium text-text-primary">IBM Seller Studio AI</span>
              <span className="text-xs text-text-tertiary">Watsonx.ai</span>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onCreateList={onCreateList} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-ibm-blue/10 border border-ibm-blue/30">
                  <Bot className="w-3.5 h-3.5 text-ibm-blue" />
                </div>
                <div className="px-4 py-3 bg-bg-surface border border-border">
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <Loader2 className="w-4 h-4 animate-spin text-ibm-blue" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                className="flex-1 px-3 py-2 text-sm bg-bg-raised border border-border text-text-primary placeholder-text-tertiary focus:ring-1 focus:ring-ibm-blue outline-none resize-none"
                placeholder={selectedAccount
                  ? `Ask about ${selectedAccount.name}...`
                  : 'Ask anything about your territory, accounts, or strategy...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn-primary px-4 self-end disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-text-tertiary mt-1.5">
              Press Enter to send • Shift+Enter for new line
              {selectedAccount && (
                <span className="ml-2 text-ibm-blue/70">• Context: {selectedAccount.name}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
