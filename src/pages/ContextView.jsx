import { useState } from 'react'
import { Bot, CheckCircle, Database } from 'lucide-react'
import { contextLayers, agents } from '../data/mockData'

const LAYER_ICONS = {
  catalog:'📦', memories:'🧠', skills:'⚡', git:'🔀', ci:'🔄', srm:'📊',
  policies:'🛡️', cost:'💰', techdocs:'📄', integrations:'🔌',
}

export default function ContextView({ layerId }) {
  const [selected, setSelected] = useState(
    contextLayers.find(l => l.id === (layerId?.replace('ctx-','') || 'catalog'))
  )

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Layer list */}
      <div className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-[#00ADE4]" />
            <h2 className="text-sm font-bold text-slate-800">Context Fabric</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">What agents can read and reason over</p>
        </div>
        <div className="p-2 space-y-0.5">
          {contextLayers.map(l => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                selected?.id === l.id ? 'bg-[#00ADE4]/10 text-[#00ADE4]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base leading-none">{LAYER_ICONS[l.id]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${selected?.id === l.id ? 'text-[#00ADE4]' : 'text-slate-700'}`}>{l.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{l.stats.split('·')[0].trim()}</p>
              </div>
              {l.active && <div className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 animate-fade-in">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{LAYER_ICONS[selected.id]}</span>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{selected.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{selected.stats}</p>
              </div>
              {selected.active && (
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot" /> Active
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{selected.desc}</p>

            {/* Agents using this */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                <Bot size={13} className="text-[#00ADE4]" /> Agents using this context
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.agentsUsing.map(id => {
                  const a = agents.find(ag => ag.id === id)
                  return a ? (
                    <div key={id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                      <span className="text-sm">{a.emoji}</span>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-700">{a.name}</p>
                        <p className="text-[9px] text-slate-400">{a.type}</p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ml-1 ${a.status === 'active' ? 'bg-green-400' : 'bg-slate-300'}`} />
                    </div>
                  ) : null
                })}
              </div>
            </div>

            {/* Example queries */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">Example agent queries</p>
              <div className="space-y-2">
                {selected.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2">
                    <CheckCircle size={11} className="text-[#00ADE4] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 leading-relaxed">{ex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MCP Tool */}
            <div className="mt-4 bg-[#060C18] rounded-xl p-4">
              <p className="text-[10px] text-white/50 mb-2 font-mono">MCP Tool · {selected.id}</p>
              <pre className="text-[10px] text-green-300 font-mono overflow-x-auto">{`idp.context.${selected.id}.query({
  agent: "agent-c",
  query: "...",
  filters: {},
})`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
