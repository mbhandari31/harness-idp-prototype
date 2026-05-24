import { useState } from 'react'
import {
  LayoutGrid, Map, Bot, Activity, Star, Cpu, ChevronDown, ChevronRight,
  Package, Brain, Zap, Plug, Shield, BookOpen, Code, Settings, HelpCircle,
  Layers, Rocket, Search
} from 'lucide-react'

const NAV = [
  { id: 'home',     icon: Search,      label: 'Ask / Home' },
  { id: 'topology', icon: Map,         label: 'Topology' },
  { id: 'sessions', icon: Activity,    label: 'Sessions',    badge: '3' },
  { id: 'duties',   icon: Cpu,         label: 'Agent Duties' },
  { id: 'scorecards',icon: Star,       label: 'Scorecards' },
]

const CONTEXT_ITEMS = [
  { id: 'ctx-catalog',   icon: Package, label: 'Catalog',       sub: '47 services' },
  { id: 'ctx-memories',  icon: Brain,   label: 'Memories',       sub: '1,247 stored' },
  { id: 'ctx-skills',    icon: Zap,     label: 'Skills',         sub: '24 installed' },
  { id: 'ctx-integrations', icon: Plug, label: 'Integrations',  sub: '8 connected' },
  { id: 'ctx-policies',  icon: Shield,  label: 'Policies',       sub: '23 rules' },
]

const APPS = [
  { id: 'app-scout',      icon: Rocket,  label: 'Service Scout',    sub: 'New service creator' },
  { id: 'app-compliance', icon: Shield,  label: 'Compliance Pulse', sub: 'Drift detector' },
]

export default function Sidebar({ page, setPage }) {
  const [contextOpen, setContextOpen] = useState(true)
  const [appsOpen, setAppsOpen]       = useState(true)

  const item = (id, icon, label, badge, sub) => {
    const Icon = icon
    const active = page === id
    return (
      <button
        key={id}
        onClick={() => setPage(id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group text-left ${
          active ? 'bg-[#00ADE4]/15 text-[#00ADE4]' : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={14} className="shrink-0" />
        <span className="flex-1 truncate">{label}</span>
        {sub && !badge && <span className="text-[9px] text-slate-600 shrink-0">{sub}</span>}
        {badge && (
          <span className="bg-[#00ADE4] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
            {badge}
          </span>
        )}
      </button>
    )
  }

  const section = (label, open, toggle) => (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-1.5 px-3 py-1.5 mt-3 mb-0.5 text-left"
    >
      {open ? <ChevronDown size={10} className="text-slate-600" /> : <ChevronRight size={10} className="text-slate-600" />}
      <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">{label}</span>
    </button>
  )

  return (
    <div className="flex flex-col w-52 shrink-0 bg-[#060C18] h-screen overflow-y-auto border-r border-white/5">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00ADE4] to-[#0077A8] flex items-center justify-center shrink-0">
            <Layers size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold leading-tight">Internal Developer</p>
            <p className="text-white/50 text-[10px] leading-tight">Portal · AtlasOne</p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="px-2 pt-3 space-y-0.5">
        {NAV.map(n => item(n.id, n.icon, n.label, n.badge))}
      </nav>

      {/* Applications section */}
      {section('Applications', appsOpen, () => setAppsOpen(o => !o))}
      {appsOpen && (
        <div className="px-2 space-y-0.5 animate-slide-right">
          {APPS.map(a => item(a.id, a.icon, a.label, null, a.sub))}
        </div>
      )}

      {/* Context section */}
      {section('Context Fabric', contextOpen, () => setContextOpen(o => !o))}
      {contextOpen && (
        <div className="px-2 space-y-0.5 animate-slide-right">
          {CONTEXT_ITEMS.map(c => item(c.id, c.icon, c.label, null, c.sub))}
        </div>
      )}

      {/* Spacer + bottom */}
      <div className="flex-1" />
      <div className="px-2 pb-3 pt-2 border-t border-white/5 space-y-0.5 mt-2">
        {item('docs',     BookOpen,  'Docs')}
        {item('settings', Settings,  'Configure')}
        {item('help',     HelpCircle,'Help')}
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/8 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          MB
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-medium truncate">Manan Bhandari</p>
          <p className="text-slate-500 text-[10px] truncate">Senior Developer</p>
        </div>
      </div>
    </div>
  )
}
