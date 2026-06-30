import { useState } from 'react'
import {
  Activity, Zap, TrendingUp, TrendingDown, AlertTriangle,
  Briefcase, UserPlus, BarChart3, Clock, Building2,
  ExternalLink, ChevronRight, Filter, RefreshCw, ArrowUpRight
} from 'lucide-react'
import { MOCK_ISC_SIGNALS, MOCK_LISN_SIGNALS } from './mockSignals'
import { MOCK_ACCOUNTS } from '../accounts/mockData'

// ─── helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_META = {
  critical: { label: 'Critical', border: 'border-red-400',    text: 'text-red-400',    dot: 'bg-red-400' },
  high:     { label: 'High',     border: 'border-yellow-400', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  medium:   { label: 'Medium',   border: 'border-ibm-blue',   text: 'text-ibm-blue',   dot: 'bg-ibm-blue' },
  low:      { label: 'Low',      border: 'border-gray-50',    text: 'text-text-tertiary', dot: 'bg-gray-50' },
}

const ISC_TYPE_META = {
  opportunity_update: { label: 'Opportunity',    icon: <Briefcase className="w-3.5 h-3.5" />,  border: 'border-ibm-blue',   text: 'text-ibm-blue' },
  activity_logged:    { label: 'Activity',       icon: <Activity className="w-3.5 h-3.5" />,   border: 'border-gray-50',    text: 'text-text-secondary' },
  meeting_booked:     { label: 'Meeting',        icon: <Clock className="w-3.5 h-3.5" />,      border: 'border-green-400',  text: 'text-green-400' },
  new_contact:        { label: 'New Contact',    icon: <UserPlus className="w-3.5 h-3.5" />,   border: 'border-ibm-purple', text: 'text-ibm-purple' },
  competitive_alert:  { label: 'Competitive',   icon: <AlertTriangle className="w-3.5 h-3.5" />, border: 'border-red-400', text: 'text-red-400' },
}

const LISN_TYPE_META = {
  intent_spike:       { label: 'Intent Spike',   icon: <Zap className="w-3.5 h-3.5" />,        border: 'border-yellow-400', text: 'text-yellow-400' },
  job_change:         { label: 'Job Change',     icon: <UserPlus className="w-3.5 h-3.5" />,   border: 'border-green-400',  text: 'text-green-400' },
  content_engagement: { label: 'Engagement',     icon: <Activity className="w-3.5 h-3.5" />,   border: 'border-ibm-blue',   text: 'text-ibm-blue' },
}

function TypeBadge({ meta }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-bg-surface border ${meta.border} ${meta.text}`}>
      {meta.icon}
      {meta.label}
    </span>
  )
}

function PriorityDot({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
}

function StatCard({ label, value, sub, trend, color = 'text-text-primary' }) {
  return (
    <div className="bg-bg-surface border border-border px-4 py-3">
      <div className={`text-2xl font-light leading-none ${color}`}>{value}</div>
      <div className="text-xs text-text-tertiary mt-1">{label}</div>
      {sub && <div className="text-xs text-text-tertiary mt-0.5 opacity-70">{sub}</div>}
    </div>
  )
}

function ISCSignalRow({ signal, onAccountClick }) {
  const typeMeta = ISC_TYPE_META[signal.type] || ISC_TYPE_META.activity_logged
  const priorityMeta = PRIORITY_META[signal.priority] || PRIORITY_META.medium
  return (
    <div className="flex gap-3 p-3 border-b border-border last:border-0 hover:bg-bg-raised/50 transition-colors">
      <PriorityDot priority={signal.priority} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <TypeBadge meta={typeMeta} />
          <button
            onClick={() => onAccountClick && onAccountClick(signal.accountId)}
            className="text-xs text-ibm-blue hover:underline font-medium"
          >
            {signal.accountName}
          </button>
          <span className="text-xs text-text-tertiary ml-auto">{signal.date}</span>
        </div>
        <div className="text-sm font-medium text-text-primary mb-0.5">{signal.title}</div>
        <div className="text-xs text-text-tertiary leading-relaxed">{signal.detail}</div>
        {signal.owner !== 'System' && (
          <div className="text-xs text-text-tertiary mt-1 opacity-70">Owner: {signal.owner}</div>
        )}
      </div>
    </div>
  )
}

function LISNSignalRow({ signal, onAccountClick }) {
  const typeMeta = LISN_TYPE_META[signal.type] || LISN_TYPE_META.intent_spike
  const deltaPositive = signal.intentDelta > 0
  return (
    <div className="flex gap-3 p-3 border-b border-border last:border-0 hover:bg-bg-raised/50 transition-colors">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
        signal.intentDelta >= 15 ? 'bg-green-400' : signal.intentDelta >= 0 ? 'bg-yellow-400' : 'bg-red-400'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <TypeBadge meta={typeMeta} />
          <button
            onClick={() => onAccountClick && onAccountClick(signal.accountId)}
            className="text-xs text-ibm-blue hover:underline font-medium"
          >
            {signal.accountName}
          </button>
          <div className={`ml-auto flex items-center gap-1 text-xs font-medium ${
            deltaPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {deltaPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {deltaPositive ? '+' : ''}{signal.intentDelta} pts → {signal.currentScore}
          </div>
        </div>
        <div className="text-sm font-medium text-text-primary mb-0.5">{signal.title}</div>
        <div className="text-xs text-text-tertiary leading-relaxed mb-1">{signal.detail}</div>
        <div className="flex flex-wrap gap-1">
          {signal.topics.map(t => (
            <span key={t} className="text-xs px-1.5 py-0.5 bg-bg-surface border border-border text-text-tertiary">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function IntentLeaderboard({ accounts }) {
  const sorted = [...accounts].sort((a, b) => b.intentScore - a.intentScore).slice(0, 8)
  return (
    <div className="space-y-2">
      {sorted.map((account, i) => (
        <div key={account.id} className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary w-4 text-right flex-shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-primary truncate">{account.name}</span>
              <span className={`text-xs font-mono ml-2 flex-shrink-0 ${
                account.intentScore >= 80 ? 'text-green-400' : account.intentScore >= 55 ? 'text-yellow-400' : 'text-red-400'
              }`}>{account.intentScore}</span>
            </div>
            <div className="h-1 bg-bg-raised rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  account.intentScore >= 80 ? 'bg-green-400' : account.intentScore >= 55 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${account.intentScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs px-1.5 py-0.5 bg-bg-surface border flex-shrink-0 ${
            account.status === 'Active Opportunity' ? 'border-green-400 text-green-400' :
            account.status === 'New Logo' ? 'border-ibm-blue text-ibm-blue' :
            account.status === 'Churned' ? 'border-red-400 text-red-400' :
            'border-yellow-400 text-yellow-400'
          }`}>
            {account.status === 'Active Opportunity' ? 'Active' :
             account.status === 'New Logo' ? 'New Logo' :
             account.status === 'Churned' ? 'Churned' : 'Inactive'}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function IntelligenceDashboard({ onOpenChat }) {
  const [iscFilter, setIscFilter] = useState('all')
  const [lisnFilter, setLisnFilter] = useState('all')
  const [lastRefreshed] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  const filteredISC = iscFilter === 'all'
    ? MOCK_ISC_SIGNALS
    : MOCK_ISC_SIGNALS.filter(s => s.type === iscFilter || s.priority === iscFilter)

  const filteredLISN = lisnFilter === 'all'
    ? MOCK_LISN_SIGNALS
    : MOCK_LISN_SIGNALS.filter(s => s.type === lisnFilter)

  const criticalCount = MOCK_ISC_SIGNALS.filter(s => s.priority === 'critical').length
  const highIntentCount = MOCK_ACCOUNTS.filter(a => a.intentScore >= 80).length
  const jobChanges = MOCK_LISN_SIGNALS.filter(s => s.type === 'job_change').length
  const intentSpikes = MOCK_LISN_SIGNALS.filter(s => s.type === 'intent_spike').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-text-primary">Intelligence Dashboard</h2>
          <p className="text-sm text-text-tertiary mt-1">
            Live signals from ISC and LinkedIn Sales Navigator across your territory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Refreshed {lastRefreshed}
          </span>
          <button className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {onOpenChat && (
            <button
              onClick={() => onOpenChat('Analyze my top buyer intent signals this week and recommend which accounts to prioritize for outbound')}
              className="btn-primary flex items-center gap-1.5 text-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Analyze with AI
            </button>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="ISC Signals (7d)"   value={MOCK_ISC_SIGNALS.length}  color="text-text-primary" />
        <StatCard label="Critical Alerts"     value={criticalCount}             color="text-red-400" />
        <StatCard label="LinSN Signals (7d)" value={MOCK_LISN_SIGNALS.length}  color="text-text-primary" />
        <StatCard label="High Intent Accounts" value={highIntentCount}          color="text-green-400" />
        <StatCard label="New Job Changes"     value={jobChanges}                color="text-ibm-blue" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* ISC feed */}
        <div className="col-span-1 bg-bg-surface border border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-ibm-blue" />
              <span className="text-sm font-medium text-text-primary">ISC Activity</span>
              <span className="text-xs text-text-tertiary">{filteredISC.length}</span>
            </div>
            <select
              value={iscFilter}
              onChange={e => setIscFilter(e.target.value)}
              className="text-xs bg-bg-raised border border-border text-text-secondary px-2 py-1 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High Priority</option>
              <option value="competitive_alert">Competitive</option>
              <option value="opportunity_update">Opportunities</option>
              <option value="meeting_booked">Meetings</option>
              <option value="new_contact">New Contacts</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px]">
            {filteredISC.map(s => (
              <ISCSignalRow key={s.id} signal={s} />
            ))}
          </div>
        </div>

        {/* LinSN feed */}
        <div className="col-span-1 bg-bg-surface border border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-text-primary">Buyer Signals</span>
              <span className="text-xs text-text-tertiary">LinkedIn Sales Navigator</span>
            </div>
            <select
              value={lisnFilter}
              onChange={e => setLisnFilter(e.target.value)}
              className="text-xs bg-bg-raised border border-border text-text-secondary px-2 py-1 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="intent_spike">Intent Spikes</option>
              <option value="job_change">Job Changes</option>
              <option value="content_engagement">Engagements</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px]">
            {filteredLISN.map(s => (
              <LISNSignalRow key={s.id} signal={s} />
            ))}
          </div>
        </div>

        {/* Right column: leaderboard + quick actions */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Intent leaderboard */}
          <div className="bg-bg-surface border border-border flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-ibm-blue" />
                <span className="text-sm font-medium text-text-primary">Intent Leaderboard</span>
              </div>
            </div>
            <div className="p-4">
              <IntentLeaderboard accounts={MOCK_ACCOUNTS} />
            </div>
          </div>

          {/* Weekly focus recommendations */}
          <div className="bg-bg-surface border border-border">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-text-primary">This Week's Focus</span>
                <span className="text-xs text-text-tertiary">AI-recommended</span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {[
                { account: 'SNCF (GEODIS)', action: 'Prep QBR with AI ops expansion proposal', urgency: 'Today' },
                { account: 'CLARIVATE', action: 'Counter Pure Storage — send FlashSystem TCO', urgency: 'Today' },
                { account: 'WAWA INC', action: 'Advance POC sign-off for FlashSystem', urgency: 'This week' },
                { account: 'CHANEL', action: 'Schedule intro call with Marc Dubois (new SVP)', urgency: 'This week' },
                { account: 'C&D Co. / CAMPBELL', action: 'Reach out to new IT Director Sarah Langford', urgency: 'This week' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 hover:bg-bg-raised transition-colors">
                  <span className="text-xs text-ibm-blue font-mono mt-0.5 flex-shrink-0">{item.urgency}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary">{item.account}</div>
                    <div className="text-xs text-text-tertiary leading-snug">{item.action}</div>
                  </div>
                </div>
              ))}
              {onOpenChat && (
                <button
                  onClick={() => onOpenChat('Build me a prioritized action list for this week based on the current buyer signals and ISC activity')}
                  className="w-full mt-2 py-2 text-xs text-ibm-blue border border-ibm-blue/30 hover:bg-ibm-blue/5 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Generate full action plan in AI Assistant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
