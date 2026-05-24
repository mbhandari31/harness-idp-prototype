import { useState } from 'react'
import { Bot, User, CheckCircle, Clock, MessageSquare, ChevronRight, GitPullRequest, Shield, Zap, ArrowRight, Send } from 'lucide-react'
import { sessions } from '../data/mockData'

const SCENARIO_STYLE = {
  'agent-to-human': { label: 'Agent → You', bg: 'bg-amber-100', text: 'text-amber-700' },
  'human-to-agent': { label: 'You → Agent', bg: 'bg-blue-100', text: 'text-blue-700' },
  'co-review':      { label: 'Co-Review',   bg: 'bg-violet-100', text: 'text-violet-700' },
}

const STATUS_STYLE = {
  'awaiting-human':   { label: 'Needs You',   dot: 'bg-amber-400',  ring: 'ring-amber-200' },
  'agent-working':    { label: 'Agent Working', dot: 'bg-blue-400',  ring: 'ring-blue-200' },
  'complete':         { label: 'Complete',    dot: 'bg-green-400', ring: 'ring-green-200' },
}

function TimelineItem({ item, isLast }) {
  const isAgent = item.actor === 'agent'
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isAgent ? 'bg-[#00ADE4]/10' : 'bg-violet-100'}`}>
          {isAgent ? <Bot size={13} className="text-[#00ADE4]" /> : <User size={13} className="text-violet-600" />}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 mt-1" />}
      </div>
      <div className={`pb-5 flex-1 min-w-0 ${isLast ? '' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold text-slate-700">{item.label}</span>
          <span className="text-[9px] text-slate-400">{item.time}</span>
          {item.tag && (
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.tag === 'H' ? 'tag-h' : item.tag === 'A' ? 'tag-a' : 'tag-ha'}`}>{item.tag}</span>
          )}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">{item.text}</p>
        {item.artifact && (
          <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-fit">
            <GitPullRequest size={11} className="text-[#00ADE4]" />
            <span className="text-[10px] font-semibold text-slate-700">{item.artifact}</span>
          </div>
        )}
        {item.action && (
          <div className="mt-2 flex gap-2">
            <button className="text-[11px] bg-[#00ADE4] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0095C8] transition-colors flex items-center gap-1.5">
              <CheckCircle size={11} /> {item.action.approve}
            </button>
            {item.action.reject && (
              <button className="text-[11px] bg-white border border-slate-200 text-slate-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {item.action.reject}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sessions() {
  const [selected, setSelected] = useState(sessions[0])
  const [msg, setMsg] = useState('')

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Session list */}
      <div className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-[#00ADE4]" />
            <h2 className="text-sm font-bold text-slate-800">Shared Sessions</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Human–agent collaboration workspace</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {sessions.map(s => {
            const st = STATUS_STYLE[s.status]
            const sc = SCENARIO_STYLE[s.scenario]
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected?.id === s.id ? 'bg-[#00ADE4]/5 border-l-2 border-[#00ADE4]' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base shrink-0">{s.agentEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-xs font-semibold text-slate-800 truncate">{s.title}</p>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot} ring-2 ${st.ring}`} />
                    </div>
                    <p className="text-[9px] text-slate-400">{s.agent} · {s.started}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${s.status === 'awaiting-human' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{st.label}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Session detail */}
      {selected && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">{selected.agentEmoji}</div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">{selected.title}</h1>
                <p className="text-[10px] text-slate-400">{selected.agent} · Session started {selected.started}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${SCENARIO_STYLE[selected.scenario].bg} ${SCENARIO_STYLE[selected.scenario].text}`}>
                  {SCENARIO_STYLE[selected.scenario].label}
                </span>
                {selected.status === 'awaiting-human' && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse-dot" /> Awaiting You
                  </span>
                )}
              </div>
            </div>
            {selected.why && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <Clock size={11} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-800 leading-relaxed">{selected.why}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-2xl">
              {selected.timeline.map((item, i) => (
                <TimelineItem key={i} item={item} isLast={i === selected.timeline.length - 1} />
              ))}
            </div>
          </div>

          {/* Reply bar */}
          <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
            <div className="max-w-2xl flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <User size={13} className="text-slate-400 shrink-0" />
                <input
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Reply to agent, provide context, or give approval..."
                  className="flex-1 text-xs text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
              <button className="flex items-center gap-1.5 bg-[#00ADE4] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0095C8] transition-colors shrink-0">
                <Send size={12} /> Send
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 max-w-2xl">
              <span className="tag-h text-[9px]">H</span> Replies are recorded in session memory · Agent will resume autonomously after your input
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
