import { useState } from 'react'
import { Bot, X, ExternalLink, GitBranch, Clock, Cpu, Shield, DollarSign, Zap, CheckCircle, AlertTriangle, Lock } from 'lucide-react'
import { services, topoEdges } from '../data/mockData'

const LENSES = [
  { id: 'health',     label: '● Health',     color: '#22c55e' },
  { id: 'cost',       label: '💰 Cost',      color: '#f59e0b' },
  { id: 'security',   label: '🛡 Security',  color: '#ef4444' },
  { id: 'deploy',     label: '🚀 Deploy',    color: '#00ADE4' },
  { id: 'compliance', label: '✓ Compliance', color: '#7c3aed' },
]

function nodeClass(svc, lens) {
  if (lens === 'health') {
    if (!svc.scores.overall) return 'node-critical'
    if (svc.scores.overall >= 85) return 'node-healthy'
    if (svc.scores.overall >= 70) return 'node-at-risk'
    return 'node-critical'
  }
  if (lens === 'cost') {
    if (svc.costTrend === 'up') return 'node-cost-spike'
    if (svc.cost > 5000) return 'node-cost-high'
    return 'node-cost-low'
  }
  if (lens === 'security') {
    if (svc.securityIssues > 0) return 'node-sec-risk'
    if (svc.scores.security && svc.scores.security >= 90) return 'node-sec-clean'
    return 'node-at-risk'
  }
  if (lens === 'deploy') {
    const hasDep = svc.deployments.some(d => d.status === 'rolling')
    if (hasDep) return 'node-deploying'
    if (svc.deployments.length > 0) return 'node-stable'
    return 'node-critical'
  }
  if (lens === 'compliance') {
    if (!svc.scores.compliance) return 'node-critical'
    if (svc.scores.compliance >= 90) return 'node-sec-clean'
    if (svc.scores.compliance >= 75) return 'node-at-risk'
    return 'node-sec-risk'
  }
  return 'node-stable'
}

function nodeLabel(svc, lens) {
  if (lens === 'cost') return `$${(svc.cost/1000).toFixed(1)}K`
  if (lens === 'health') return svc.scores.overall ? `${svc.scores.overall}` : '—'
  if (lens === 'security') return svc.securityIssues > 0 ? `⚠${svc.securityIssues}` : '✓'
  if (lens === 'deploy') return svc.deployments.length > 0 ? (svc.deployments[0].status === 'rolling' ? '↻' : '✓') : '—'
  if (lens === 'compliance') return svc.scores.compliance ? `${svc.scores.compliance}` : '—'
  return ''
}

function ScoreCircle({ score, size = 36 }) {
  if (!score) return <span className="text-xs text-slate-400">N/A</span>
  const c = score >= 90 ? '#22c55e' : score >= 75 ? '#f59e0b' : '#ef4444'
  const r = (size - 5) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={circ - (score/100)*circ}
          strokeLinecap="round" className="score-ring" />
      </svg>
      <span className="absolute text-[9px] font-bold" style={{ color: c }}>{score}</span>
    </div>
  )
}

function TAG({ label }) {
  const cls = label === 'H' ? 'tag-h' : label === 'A' ? 'tag-a' : 'tag-ha'
  return <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${cls}`}>{label}</span>
}

function Tooltip({ text, children }) {
  return (
    <div className="relative group/tip">
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

function Workbench({ svc, onClose }) {
  const isReadOnly = svc.access === 'read-only'
  return (
    <div className="w-80 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-y-auto animate-slide-right">
      {/* Read-only banner */}
      {isReadOnly && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200">
          <Lock size={11} className="text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-800 font-medium">
            Read-only · You are not a member of <span className="font-semibold">{svc.team}</span>
          </p>
        </div>
      )}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">{svc.name}</h2>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${svc.lifecycle === 'production' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {svc.lifecycle}
            </span>
            {isReadOnly && <Lock size={10} className="text-amber-500" />}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{svc.type} · {svc.lang} · {svc.team}</p>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-slate-300 hover:text-slate-600"><ExternalLink size={12} /></button>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600"><X size={13} /></button>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="mx-3 mt-3 rounded-xl border border-[#00ADE4]/25 bg-[#f0faff] p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Bot size={11} className="text-[#00ADE4]" />
          <span className="text-[10px] font-semibold text-[#0077A8]">AI Analysis</span>
          <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
            svc.aiAnalysis.confidence === 'High' ? 'bg-green-100 text-green-700' :
            svc.aiAnalysis.confidence === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
          }`}>{svc.aiAnalysis.confidence}</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-relaxed">{svc.aiAnalysis.summary}</p>
        <div className="mt-2 pt-2 border-t border-[#00ADE4]/15">
          <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Impact if down</p>
          <p className="text-[10px] text-slate-600">{svc.aiAnalysis.impact}</p>
        </div>
        <div className="mt-2 pt-1.5 border-t border-[#00ADE4]/15">
          <p className="text-[9px] text-slate-400 mb-1">Context used:</p>
          <div className="flex flex-wrap gap-1">
            {['Catalog','Git','Scorecards','SRM','TechDocs'].map(l => (
              <span key={l} className="text-[8px] bg-[#00ADE4]/8 text-[#0077A8] px-1.5 py-0.5 rounded-full">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scorecards */}
      <div className="px-3 mt-3">
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Scorecards</p>
        <div className="flex gap-3">
          {[['Security', svc.scores.security], ['Reliability', svc.scores.reliability], ['Compliance', svc.scores.compliance]].map(([l, s]) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <ScoreCircle score={s} size={38} />
              <span className="text-[9px] text-slate-400">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deployments */}
      <div className="px-3 mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Deployments</p>
          <TAG label="H+A" />
        </div>
        {svc.deployments.length === 0 ? (
          <p className="text-[10px] text-slate-400 py-2">No deployments</p>
        ) : svc.deployments.map((d, i) => (
          <div key={i} className="mb-1.5 bg-slate-50 rounded-lg border border-slate-200 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${d.status === 'healthy' ? 'bg-green-400' : d.status === 'rolling' ? 'bg-[#00ADE4] animate-pulse-dot' : 'bg-red-400'}`} />
              <span className="text-[10px] font-mono font-semibold text-slate-700 flex-1 truncate">{d.cluster}</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">{d.env}</span>
            </div>
            <div className="flex gap-3 mt-1 text-[9px] text-slate-400">
              <span>Replicas: <b className="text-slate-600">{d.replicas}</b></span>
              <span className="flex items-center gap-0.5"><Clock size={8} />{d.age}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dependencies */}
      <div className="px-3 mt-3">
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Dependencies</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-700">{svc.deps.out}</p>
            <p className="text-[9px] text-slate-400">outgoing</p>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-700">{svc.deps.in}</p>
            <p className="text-[9px] text-slate-400">incoming</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-3 mt-3 mb-4">
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Quick Actions</p>
        <div className="space-y-1.5">
          {[
            { label: 'Edit service details',    tag: 'H',   needsWrite: true  },
            { label: 'Run workflow',             tag: 'H+A', needsWrite: true  },
            { label: 'Rotate credentials',       tag: 'A',   needsWrite: true  },
            { label: 'Check OPA policy',         tag: 'A',   needsWrite: false },
            { label: 'Analyze cost',             tag: 'A',   needsWrite: false },
          ].map(a => {
            const locked = isReadOnly && a.needsWrite
            const btn = (
              <button
                key={a.label}
                disabled={locked}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all text-left
                  ${locked
                    ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-1.5">
                  {locked && <Lock size={9} className="text-slate-400 shrink-0" />}
                  <span className={`text-[11px] ${locked ? 'text-slate-400' : 'text-slate-700'}`}>{a.label}</span>
                </div>
                <TAG label={a.tag} />
              </button>
            )
            return locked ? (
              <Tooltip key={a.label} text="Read-only · Request access from service owner">
                {btn}
              </Tooltip>
            ) : btn
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="px-3 pb-4">
        <div className="flex flex-wrap gap-1">
          {svc.tags.map(t => (
            <span key={t} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Topology() {
  const [lens, setLens] = useState('health')
  const [selected, setSelected] = useState(null)

  // Build position lookup
  const posOf = id => services.find(s => s.id === id)?.topoPos

  // Canvas dimensions
  const W = 760, H = 420

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Lens bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mr-1">Lens</span>
        {LENSES.map(l => (
          <button
            key={l.id}
            onClick={() => setLens(l.id)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              lens === l.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {l.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-400">
          <span>● healthy</span><span className="text-amber-500">◐ at-risk</span><span className="text-red-500">✕ critical</span>
          <span className="text-[#00ADE4]">⬡ agent active</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-hidden bg-slate-50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width={W} height={H} className="absolute inset-0" style={{ left: '50%', transform: 'translateX(-50%)' }}>
              {topoEdges.map((e, i) => {
                const f = posOf(e.from), t = posOf(e.to)
                if (!f || !t) return null
                return (
                  <line key={i}
                    x1={f.x + 52} y1={f.y + 22}
                    x2={t.x + 52} y2={t.y + 22}
                    className={`topo-edge ${selected?.id === e.from || selected?.id === e.to ? 'active' : ''}`}
                  />
                )
              })}
            </svg>

            <div className="relative" style={{ width: W, height: H }}>
              {services.map(svc => {
                const nc = nodeClass(svc, lens)
                const nl = nodeLabel(svc, lens)
                const isSelected = selected?.id === svc.id
                const hasAgent = ['payment-service', 'inventory-api', 'banking-app'].includes(svc.id)
                const isReadOnly = svc.access === 'read-only'
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelected(isSelected ? null : svc)}
                    style={{ left: svc.topoPos.x, top: svc.topoPos.y }}
                    className={`absolute group ${isReadOnly ? 'cursor-pointer' : 'cursor-pointer'}`}
                  >
                    {/* Read-only tooltip on hover */}
                    {isReadOnly && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-800 text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg pointer-events-none">
                        <Lock size={8} /> Read-only · not your team
                      </div>
                    )}
                    <div className={`${nc} rounded-xl border-2 px-3 py-2 transition-all duration-200 min-w-[104px]
                      ${isSelected ? 'shadow-lg scale-105' : 'hover:shadow-md hover:scale-105'}
                      ${isReadOnly ? 'opacity-50 grayscale' : ''}
                      border-[var(--node-ring)] bg-[var(--node-bg)]`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isReadOnly
                          ? <Lock size={9} className="shrink-0 text-slate-400" />
                          : <GitBranch size={9} className="shrink-0" style={{ color: 'var(--node-text)' }} />
                        }
                        <span className="text-[10px] font-bold truncate" style={{ color: 'var(--node-text)' }} title={svc.name}>
                          {svc.name.replace('-service','').replace('-api','').replace('-app','').replace('-gateway','gw').replace('-svc','')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold" style={{ color: 'var(--node-ring)' }}>{nl}</span>
                        {hasAgent && !isReadOnly && <span className="text-[10px]">⬡</span>}
                      </div>
                    </div>
                    {svc.securityIssues > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">{svc.securityIssues}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 px-3 py-2">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">Context Fabric Active</p>
            <div className="flex flex-wrap gap-1">
              {['Catalog','Memories','Git','CI','SRM','Policies','Cost'].map(l => (
                <span key={l} className="text-[9px] bg-[#00ADE4]/8 text-[#0077A8] px-1.5 py-0.5 rounded-full">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Workbench panel */}
        {selected && <Workbench svc={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
