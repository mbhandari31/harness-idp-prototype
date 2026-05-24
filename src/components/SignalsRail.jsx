import { useState } from 'react'
import { ChevronRight, ChevronLeft, Heart, DollarSign, Shield, CheckSquare, Bot, Activity, AlertTriangle } from 'lucide-react'
import { signals, agents, sessions } from '../data/mockData'

function Signal({ icon: Icon, title, color, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`border-b border-slate-100 px-4 py-3 ${onClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={11} style={{ color }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function MiniBar({ value, max = 100, color }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value/max)*100}%`, backgroundColor: color }} />
    </div>
  )
}

export default function SignalsRail({ setPage }) {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <div className="w-8 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-4 shrink-0">
        <button onClick={() => setCollapsed(false)} className="text-slate-400 hover:text-slate-700">
          <ChevronLeft size={14} />
        </button>
        {[Heart, DollarSign, Shield, CheckSquare, Bot, Activity].map((Icon, i) => (
          <Icon key={i} size={13} className="text-slate-300" />
        ))}
      </div>
    )
  }

  return (
    <div className="w-60 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Live Signals</span>
        <button onClick={() => setCollapsed(true)} className="text-slate-300 hover:text-slate-600 transition-colors">
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Health */}
      <Signal icon={Heart} title="Health" color="#22c55e">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-800">{signals.health.score}%</span>
          <span className="text-[10px] text-slate-400">platform avg</span>
        </div>
        <MiniBar value={signals.health.score} color="#22c55e" />
        <p className="text-[10px] text-slate-500 mt-1">{signals.health.atRisk} services at risk</p>
      </Signal>

      {/* Cost */}
      <Signal icon={DollarSign} title="Cost (30d)" color="#f59e0b" onClick={() => setPage('topology')}>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-slate-800">${(signals.cost.total/1000).toFixed(1)}K</span>
          <span className="text-[10px] text-amber-500 font-semibold">{signals.cost.trend}</span>
        </div>
        <div className="mt-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1">
          <p className="text-[10px] text-amber-700 font-medium">
            ${signals.cost.saveable.toLocaleString()} saveable <span className="font-normal text-amber-600">· 3 actions</span>
          </p>
        </div>
      </Signal>

      {/* Security */}
      <Signal icon={Shield} title="Security" color="#ef4444" onClick={() => setPage('topology')}>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-red-500" />
          <span className="text-sm font-bold text-red-600">{signals.security.criticalFindings} HIGH</span>
          <span className="text-[10px] text-slate-400">findings</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">banking-application</p>
        <p className="text-[10px] text-[#00ADE4] font-medium mt-0.5 cursor-pointer hover:underline">
          {signals.security.prsReady} PRs ready → review
        </p>
      </Signal>

      {/* Compliance */}
      <Signal icon={CheckSquare} title="Compliance" color="#7c3aed">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-800">{signals.compliance.score}%</span>
          <span className="text-[10px] text-slate-400">passing</span>
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {signals.compliance.frameworks.map(f => (
            <span key={f} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
              f.includes('⚠') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>{f}</span>
          ))}
        </div>
        {signals.compliance.exceptions > 0 && (
          <p className="text-[10px] text-slate-500 mt-1">{signals.compliance.exceptions} exceptions pending [H]</p>
        )}
      </Signal>

      {/* Agents */}
      <Signal icon={Bot} title="Agents Now" color="#00ADE4">
        <div className="space-y-2">
          {agents.filter(a => a.status === 'active').map(a => (
            <div key={a.id} className="flex items-start gap-2">
              <span className="text-xs mt-0.5">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-700">{a.name}</p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">{a.task}</p>
              </div>
            </div>
          ))}
        </div>
      </Signal>

      {/* Sessions needing input */}
      <Signal icon={Activity} title="Sessions" color="#7c3aed" onClick={() => setPage('sessions')}>
        <p className="text-[10px] text-amber-600 font-semibold mb-1.5">⚡ 2 need your input</p>
        {sessions.filter(s => s.status === 'awaiting-human').map(s => (
          <div key={s.id} className="mb-1.5">
            <p className="text-[10px] font-medium text-slate-700 leading-tight">{s.title}</p>
            <p className="text-[10px] text-slate-400">{s.agentEmoji} {s.agent} → You</p>
          </div>
        ))}
        <p className="text-[10px] text-[#00ADE4] font-medium mt-1 cursor-pointer hover:underline">View all sessions →</p>
      </Signal>
    </div>
  )
}
