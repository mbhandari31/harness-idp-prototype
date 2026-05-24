import { useState } from 'react'
import { Search, Bot, User, ArrowRight, Zap, Activity, Map, Shield, DollarSign, Star, ChevronRight } from 'lucide-react'
import { activity, stats, sessions, signals } from '../data/mockData'

const QUICK_ACTIONS = [
  { label: 'Provision new service',    tag: 'H+A', icon: Zap,      page: 'app-scout',    color: '#6366f1' },
  { label: 'Run compliance scan',      tag: 'A',   icon: Shield,    page: 'app-compliance', color: '#7c3aed' },
  { label: 'Review pending sessions',  tag: 'H',   icon: Activity,  page: 'sessions',     color: '#f59e0b' },
  { label: 'View topology',            tag: null,  icon: Map,       page: 'topology',     color: '#00ADE4' },
  { label: 'Cost optimizations',       tag: 'A',   icon: DollarSign,page: 'topology',     color: '#22c55e' },
  { label: 'Check scorecards',         tag: 'A',   icon: Star,      page: 'scorecards',   color: '#ec4899' },
]

const SAMPLE_ASKS = [
  'Why is inventory-api reliability score low?',
  'Show all services with security issues',
  'What\'s our cost breakdown this week?',
  'Who owns payment-service?',
]

const TAG_STYLE = {
  'H':   'tag-h',
  'A':   'tag-a',
  'H+A': 'tag-ha',
}

export default function Home({ setPage }) {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState(null)
  const [thinking, setThinking] = useState(false)

  const ANSWERS = {
    'inventory': {
      text: 'Score is 67/100 — missing retry logic on PostgreSQL calls. Agent-C generated PR #247 which would raise it to ~84. Awaiting your review.',
      action: { label: 'Open Session →', page: 'sessions' },
    },
    'security': {
      text: 'banking-application has 5 HIGH findings (STO scan). Security Sentinel has PRs #248-252 ready. Rashmi Desai is co-reviewing.',
      action: { label: 'View Topology →', page: 'topology' },
    },
    'cost': {
      text: '$42,300/mo total. Top spender: payment-service at $8,400/mo. $1,634 saveable across 3 optimizations — 2 need your approval.',
      action: { label: 'Cost Lens →', page: 'topology' },
    },
    'owner': {
      text: 'payment-service is owned by the Finance Platform Team. Primary contact: vikram.nair@atlasone.io.',
      action: { label: 'View Service →', page: 'topology' },
    },
  }

  function handleAsk(q) {
    const text = q || query
    if (!text.trim()) return
    setThinking(true)
    setAnswer(null)
    setTimeout(() => {
      const key = Object.keys(ANSWERS).find(k => text.toLowerCase().includes(k))
      setAnswer(key ? ANSWERS[key] : {
        text: 'Context Fabric searched across Catalog, Memories, Scorecards, Git, and SRM. No specific match — try the Topology view or refine your query.',
        action: { label: 'Open Topology →', page: 'topology' },
      })
      setThinking(false)
    }, 1100)
    setQuery(text)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      {/* Greeting + ask bar */}
      <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
        <p className="text-slate-400 text-sm mb-1">{greeting},</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-5">Ananya Krishnan</h1>

        {/* Ask bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask anything — navigate, explain, or trigger an action..."
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button
              onClick={() => handleAsk()}
              className="flex items-center gap-1.5 bg-[#00ADE4] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0095C8] transition-colors shrink-0"
            >
              <Bot size={12} /> Ask AIDA
            </button>
          </div>

          {/* Answer area */}
          {(thinking || answer) && (
            <div className="px-4 py-3 bg-[#f0faff] border-b border-[#00ADE4]/15">
              {thinking ? (
                <div className="flex items-center gap-2 text-[#0077A8]">
                  <div className="w-3 h-3 border-2 border-[#00ADE4] border-t-transparent rounded-full animate-spin-slow" />
                  <span className="text-xs">Searching Context Fabric — Catalog · Memories · Scorecards · Git · SRM...</span>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot size={11} className="text-[#00ADE4]" />
                    <span className="text-[10px] font-semibold text-[#0077A8] uppercase tracking-wide">AIDA</span>
                    <span className="text-[10px] text-slate-400">via Context Fabric</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">{answer.text}</p>
                  <button onClick={() => setPage(answer.action.page)} className="text-xs text-[#00ADE4] font-semibold hover:underline flex items-center gap-1">
                    {answer.action.label} <ArrowRight size={11} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sample asks */}
          <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400 shrink-0">Try:</span>
            {SAMPLE_ASKS.map(q => (
              <button
                key={q}
                onClick={() => { setQuery(q); handleAsk(q) }}
                className="text-[10px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
        {/* Sessions needing action */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-up delay-1">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={13} className="text-amber-500" />
              <span className="text-sm font-semibold text-slate-800">Needs Your Input</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">2</span>
            </div>
            <button onClick={() => setPage('sessions')} className="text-[10px] text-[#00ADE4] font-medium hover:underline flex items-center gap-0.5">
              All sessions <ChevronRight size={10} />
            </button>
          </div>
          {sessions.filter(s => s.status === 'awaiting-human').map((s, i) => (
            <div key={s.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${i > 0 ? 'border-t border-slate-50' : ''}`} onClick={() => setPage('sessions')}>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-base shrink-0">{s.agentEmoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{s.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.agent} → awaiting you · {s.started}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{s.why}</p>
              </div>
              <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5">Waiting</span>
            </div>
          ))}
        </div>

        {/* Platform health */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-up delay-2">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Platform Health</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Services', value: stats.services, sub: '47 registered', color: '#00ADE4' },
              { label: 'Avg Score', value: `${stats.avgScore}%`, sub: '+4% this month', color: '#22c55e' },
              { label: 'Active Agents', value: stats.agents, sub: '1 idle', color: '#7c3aed' },
              { label: 'Workflows Today', value: stats.workflowsToday, sub: '34% agent-run', color: '#f59e0b' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{m.label}</p>
                  <p className="text-[10px] text-slate-400">{m.sub}</p>
                </div>
                <span className="text-base font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-up delay-3">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Quick Actions</span>
          </div>
          <div className="p-3 grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <button
                  key={a.label}
                  onClick={() => setPage(a.page)}
                  className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.color}18` }}>
                      <Icon size={13} style={{ color: a.color }} />
                    </div>
                    {a.tag && <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${TAG_STYLE[a.tag]}`}>{a.tag}</span>}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 group-hover:text-slate-900 leading-tight">{a.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-up delay-4">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Live Activity</span>
          </div>
          <div className="divide-y divide-slate-50">
            {activity.slice(0, 5).map(a => (
              <div key={a.id} className="px-4 py-2.5 flex items-start gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${a.type === 'agent' ? 'bg-[#00ADE4]/10' : 'bg-violet-100'}`}>
                  {a.type === 'agent' ? <Bot size={9} className="text-[#00ADE4]" /> : <User size={9} className="text-violet-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-700 truncate">{a.actor}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{a.action}</p>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
