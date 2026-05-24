import { useState } from 'react'
import { Star, TrendingUp, CheckCircle, XCircle, AlertCircle, Bot, ChevronRight, Filter, Lock } from 'lucide-react'
import { services } from '../data/mockData'

function Tooltip({ text, children }) {
  return (
    <div className="relative group/tip inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tip:block z-50 pointer-events-none">
        <div className="bg-slate-800 text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {text}
        </div>
        <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1" />
      </div>
    </div>
  )
}

const CHECKS = [
  { id: 'docs',        label: 'Documentation',       desc: 'Has TechDocs page with >500 words',         weight: 15 },
  { id: 'owner',       label: 'Ownership',            desc: 'Has owner group + oncall rotation',         weight: 20 },
  { id: 'slo',         label: 'SLO Defined',          desc: 'Has error budget & latency SLO defined',    weight: 20 },
  { id: 'retry',       label: 'Retry / Circuit Break', desc: 'Implements retry logic on downstream calls', weight: 15 },
  { id: 'security',    label: 'Security Scan Pass',   desc: 'No CRITICAL/HIGH findings in last 7 days',  weight: 20 },
  { id: 'pagerduty',   label: 'Alerting Wired',       desc: 'Has PagerDuty or equivalent integration',   weight: 10 },
]

const MOCK_SCORES = {
  'inventory-api':  { docs: true,  owner: true,  slo: false, retry: false, security: true,  pagerduty: true  },
  'payment-service':{ docs: true,  owner: true,  slo: true,  retry: true,  security: false, pagerduty: true  },
  'banking-app':    { docs: false, owner: true,  slo: false, retry: true,  security: false, pagerduty: false },
  'auth-gateway':   { docs: true,  owner: true,  slo: true,  retry: true,  security: true,  pagerduty: true  },
  'notification-svc':{ docs: true, owner: false, slo: true,  retry: true,  security: true,  pagerduty: false },
  'cart-service':   { docs: true,  owner: true,  slo: true,  retry: true,  security: true,  pagerduty: true  },
}

function calcScore(svcId) {
  const checks = MOCK_SCORES[svcId] || {}
  return CHECKS.reduce((sum, c) => sum + (checks[c.id] ? c.weight : 0), 0)
}

function ScoreCircle({ score, size = 48 }) {
  const r = (size / 2) - 5
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" style={{ transform: `rotate(90deg) translate(0, 0)`, fontSize: '11px', fontWeight: 700, fill: color, transformOrigin: `${size/2}px ${size/2}px` }}>
        {score}
      </text>
    </svg>
  )
}

function ScoreDetail({ selected }) {
  const checks = MOCK_SCORES[selected?.id] || {}
  const score = calcScore(selected?.id)
  const isReadOnly = selected?.access === 'read-only'
  const failing = CHECKS.filter(c => !checks[c.id])
  const passing = CHECKS.filter(c => checks[c.id])

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 animate-fade-in">
      <div className="max-w-2xl">
        {/* Read-only banner */}
        {isReadOnly && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
            <Lock size={12} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Read-only</span> · You are not a member of <span className="font-semibold">{selected.team}</span>. Contact the owner to request access.
            </p>
          </div>
        )}
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="flex items-center gap-4">
            <ScoreCircle score={score} size={64} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800">{selected.name}</h1>
                {isReadOnly && <Lock size={13} className="text-amber-500" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selected.team} · {selected.lang}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-green-600 font-semibold">{passing.length} passing</span>
                <span className="text-slate-300">·</span>
                <span className="text-[10px] text-red-500 font-semibold">{failing.length} failing</span>
                {score >= 80 && <span className="text-[9px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Gold Tier</span>}
                {score >= 60 && score < 80 && <span className="text-[9px] bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Silver Tier</span>}
                {score < 60 && <span className="text-[9px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Needs Work</span>}
              </div>
            </div>
            {failing.length > 0 && (
              <div className={`bg-[#060C18] rounded-xl p-3 text-center shrink-0 ${isReadOnly ? 'opacity-50' : ''}`}>
                <Bot size={14} className="text-[#00ADE4] mx-auto mb-1" />
                <p className="text-[9px] text-white/70 mb-1">Agent can fix</p>
                <p className="text-[10px] font-bold text-white">{failing.length} issues</p>
                {isReadOnly ? (
                  <Tooltip text="Read-only · Request access from owner">
                    <button disabled className="mt-2 text-[9px] bg-slate-600 text-white/50 font-semibold px-2 py-1 rounded-lg cursor-not-allowed flex items-center gap-1 mx-auto">
                      <Lock size={8} /> Auto-fix
                    </button>
                  </Tooltip>
                ) : (
                  <button className="mt-2 text-[9px] bg-[#00ADE4] text-white font-semibold px-2 py-1 rounded-lg hover:bg-[#0095C8] transition-colors">
                    Auto-fix
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Trend bar */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={11} className="text-slate-400" />
              <span className="text-[10px] text-slate-500 font-medium">Score trend (last 8 weeks)</span>
            </div>
            <div className="flex items-end gap-1 h-8">
              {[52, 58, 63, 60, 67, 71, 74, score].map((v, i) => (
                <div key={i} className="flex-1 rounded-t transition-all"
                  style={{ height: `${(v / 100) * 32}px`, backgroundColor: i === 7 ? (score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444') : '#e2e8f0' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Failing checks */}
        {failing.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
            <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <XCircle size={12} className="text-red-500" /> Failing Checks
            </p>
            <div className="space-y-2.5">
              {failing.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle size={10} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-700">{c.label}</p>
                      <span className="text-[9px] text-slate-400">−{c.weight} pts</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{c.desc}</p>
                  </div>
                  {isReadOnly ? (
                    <Tooltip text="Read-only · Request access from owner">
                      <button disabled className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 shrink-0 cursor-not-allowed">
                        <Lock size={8} /> Fix
                      </button>
                    </Tooltip>
                  ) : (
                    <button className="text-[10px] text-[#00ADE4] font-semibold hover:underline flex items-center gap-0.5 shrink-0">
                      Fix <ChevronRight size={9} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passing checks */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle size={12} className="text-green-500" /> Passing Checks
          </p>
          <div className="space-y-2">
            {passing.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-1">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle size={10} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600">{c.label}</p>
                </div>
                <span className="text-[9px] text-green-600 font-semibold">+{c.weight} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Scorecards() {
  const [selected, setSelected] = useState(services[0])
  const [filter, setFilter] = useState('all')

  const svcList = services.map(s => ({ ...s, score: calcScore(s.id) }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Service list */}
      <div className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#00ADE4]" />
            <h2 className="text-sm font-bold text-slate-800">Scorecards</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Service quality gates</p>
        </div>
        {/* Filter */}
        <div className="px-3 py-2 border-b border-slate-100 flex gap-1">
          {['all', 'failing', 'passing'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-[9px] font-semibold py-1 rounded-lg capitalize transition-colors ${filter === f ? 'bg-[#00ADE4] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {svcList
            .filter(s => filter === 'all' || (filter === 'failing' && s.score < 80) || (filter === 'passing' && s.score >= 80))
            .map(s => {
              const color = s.score >= 80 ? 'text-green-600' : s.score >= 60 ? 'text-amber-600' : 'text-red-500'
              const isReadOnly = s.access === 'read-only'
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 ${selected?.id === s.id ? 'bg-[#00ADE4]/5 border-l-2 border-[#00ADE4]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-semibold truncate ${isReadOnly ? 'text-slate-500' : 'text-slate-800'}`}>{s.name}</p>
                      {isReadOnly && <Lock size={9} className="text-slate-400 shrink-0" />}
                    </div>
                    <p className="text-[9px] text-slate-400">{s.team}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold ${isReadOnly ? 'text-slate-400' : color}`}>{s.score}</span>
                    <span className="text-[9px] text-slate-400">/100</span>
                  </div>
                </button>
              )
            })}
        </div>
      </div>

      {/* Scorecard detail */}
      {selected && <ScoreDetail selected={selected} />}
    </div>
  )
}
