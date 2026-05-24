import { useState } from 'react'
import { Zap, Clock, CheckCircle, AlertCircle, Play, Settings, ChevronRight, Bot, Shield, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { duties, agents } from '../data/mockData'

const TRIGGER_ICON = {
  schedule: Clock,
  event:    Zap,
  manual:   Play,
}

const AUTONOMY_LABELS = ['Human Required', 'Human Approval', 'Human Notified', 'Agent-First', 'Fully Autonomous']
const AUTONOMY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e']

function AutonomyBar({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-4 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i <= level ? AUTONOMY_COLORS[level - 1] : '#e2e8f0' }}
          />
        ))}
      </div>
      <span className="text-[9px] font-semibold" style={{ color: AUTONOMY_COLORS[level - 1] }}>
        L{level} — {AUTONOMY_LABELS[level - 1]}
      </span>
    </div>
  )
}

const MOCK_RUNS = [
  { id: 1, label: 'Completed', time: '2h ago', duration: '4m 12s', findings: '2 issues found, PRs auto-created', ok: true },
  { id: 2, label: 'Completed', time: '1d ago', duration: '3m 47s', findings: 'No issues found', ok: true },
  { id: 3, label: 'Skipped', time: '2d ago', duration: '—', findings: 'Policy gate: feature freeze active', ok: false },
  { id: 4, label: 'Completed', time: '3d ago', duration: '5m 02s', findings: '1 HIGH severity finding escalated', ok: true },
]

export default function AgentDuties() {
  const [selected, setSelected] = useState(duties[0])
  const [running, setRunning] = useState(false)
  const [runDone, setRunDone] = useState(false)

  function handleRun() {
    setRunning(true)
    setRunDone(false)
    setTimeout(() => { setRunning(false); setRunDone(true) }, 2800)
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Duties list */}
      <div className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-[#00ADE4]" />
            <h2 className="text-sm font-bold text-slate-800">Agent Duties</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Recurring autonomous tasks with guardrails</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {duties.map(d => {
            const TIcon = TRIGGER_ICON[d.trigger] || Clock
            const ag = agents.find(a => a.id === d.agentId)
            return (
              <button
                key={d.id}
                onClick={() => { setSelected(d); setRunDone(false) }}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected?.id === d.id ? 'bg-[#00ADE4]/5 border-l-2 border-[#00ADE4]' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: `${AUTONOMY_COLORS[d.autonomyLevel - 1]}18` }}>
                    {ag?.emoji || '🤖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate mb-0.5">{d.name}</p>
                    <div className="flex items-center gap-1.5">
                      <TIcon size={9} className="text-slate-400" />
                      <p className="text-[9px] text-slate-400">{d.schedule}</p>
                    </div>
                    <AutonomyBar level={d.autonomyLevel} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        {/* Add duty */}
        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-1.5 bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-xs font-medium py-2 rounded-lg hover:bg-slate-100 transition-colors">
            + New Duty
          </button>
        </div>
      </div>

      {/* Duty detail */}
      {selected && (() => {
        const ag = agents.find(a => a.id === selected.agentId)
        const TIcon = TRIGGER_ICON[selected.trigger] || Clock
        return (
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 animate-fade-in">
            <div className="max-w-2xl">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${AUTONOMY_COLORS[selected.autonomyLevel - 1]}18` }}>
                  {ag?.emoji || '🤖'}
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-slate-800 mb-0.5">{selected.name}</h1>
                  <p className="text-xs text-slate-500">{selected.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <TIcon size={11} className="text-slate-400" />
                      <span className="text-[10px] text-slate-500">{selected.schedule}</span>
                    </div>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] text-slate-500">Agent: {ag?.name}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleRun}
                    disabled={running}
                    className="flex items-center gap-1.5 bg-[#00ADE4] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0095C8] transition-colors disabled:opacity-60"
                  >
                    {running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                    {running ? 'Running…' : 'Run Now'}
                  </button>
                  <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Settings size={12} /> Configure
                  </button>
                </div>
              </div>

              {/* Run feedback */}
              {runDone && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 animate-slide-up">
                  <CheckCircle size={14} className="text-green-600 shrink-0" />
                  <p className="text-xs text-green-800 font-medium">Duty completed successfully — findings logged to session memory</p>
                </div>
              )}

              {/* Autonomy level */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">Autonomy Configuration</p>
                <div className="flex items-center justify-between mb-3">
                  <AutonomyBar level={selected.autonomyLevel} />
                  <span className="text-[10px] text-slate-400">Level {selected.autonomyLevel} of 5</span>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2 text-[10px] text-slate-600 leading-relaxed">
                  {selected.autonomyLevel === 1 && 'Every action requires explicit human approval before execution. Agent drafts, human executes.'}
                  {selected.autonomyLevel === 2 && 'Agent executes with human approval gate for high-risk actions. Low-risk actions proceed autonomously.'}
                  {selected.autonomyLevel === 3 && 'Agent executes autonomously and notifies humans of all actions taken. Humans can roll back within 24h.'}
                  {selected.autonomyLevel === 4 && 'Agent executes autonomously. Humans are notified only on exceptions or anomalies.'}
                  {selected.autonomyLevel === 5 && 'Fully autonomous — agent executes, monitors, and self-corrects. No human in the loop unless escalation threshold met.'}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Adjust trust level:</span>
                  {[1, 2, 3, 4, 5].map(l => (
                    <button
                      key={l}
                      className={`w-6 h-6 rounded-full text-[9px] font-bold border transition-colors ${l === selected.autonomyLevel ? 'text-white border-transparent' : 'text-slate-400 border-slate-200 hover:border-slate-400'}`}
                      style={l === selected.autonomyLevel ? { backgroundColor: AUTONOMY_COLORS[l - 1] } : {}}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context sources */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Bot size={12} className="text-[#00ADE4]" /> Context Fabric Sources
                </p>
                <div className="flex flex-wrap gap-2">
                  {(selected.contextSources || ['catalog', 'git', 'ci', 'policies']).map(src => (
                    <div key={src} className="flex items-center gap-1.5 bg-[#00ADE4]/8 border border-[#00ADE4]/20 rounded-lg px-2.5 py-1">
                      <div className="w-1.5 h-1.5 bg-[#00ADE4] rounded-full" />
                      <span className="text-[10px] font-medium text-[#0077A8] capitalize">{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule info */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">Schedule</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] text-slate-400 mb-0.5">Last ran</p>
                    <p className="text-xs font-semibold text-slate-700">{selected.lastRan || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 mb-0.5">Next run</p>
                    <p className="text-xs font-semibold text-slate-700">{selected.nextRun || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 mb-0.5">Trigger type</p>
                    <p className="text-xs font-semibold text-slate-700 capitalize">{selected.trigger}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 mb-0.5">Runs in 30d</p>
                    <p className="text-xs font-semibold text-slate-700">14 runs</p>
                  </div>
                </div>
              </div>

              {/* Run history */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">Recent Run History</p>
                <div className="space-y-2">
                  {MOCK_RUNS.map(r => (
                    <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${r.ok ? 'bg-green-100' : 'bg-slate-100'}`}>
                        {r.ok ? <CheckCircle size={10} className="text-green-600" /> : <AlertCircle size={10} className="text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-600 truncate">{r.findings}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-slate-500">{r.time}</p>
                        <p className="text-[9px] text-slate-400">{r.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
