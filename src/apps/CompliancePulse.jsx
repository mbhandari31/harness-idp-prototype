import { useState } from 'react'
import { Shield, Bot, CheckCircle, AlertTriangle, X, Cpu, ChevronRight, FileText } from 'lucide-react'
import { services } from '../data/mockData'

const STEPS = ['Trigger', 'Scan', 'Findings', 'Remediate', 'Report']
const FRAMEWORKS = ['SOC2', 'PCI-DSS', 'GDPR']

const FINDINGS = [
  { svc: 'banking-application', sev: 'CRITICAL', issue: 'No compliance mapping — service not enrolled in any framework', fix: 'Enroll in SOC2 baseline', effort: '30min', tag: 'A' },
  { svc: 'payment-service',     sev: 'MEDIUM',   issue: 'GDPR: 2 endpoints missing data-classification tags', fix: 'Add @dataclass annotation', effort: '1hr', tag: 'A' },
  { svc: 'cart-service',        sev: 'LOW',      issue: 'SOC2: Audit log retention set to 30d (should be 90d)', fix: 'Update log retention policy', effort: '15min', tag: 'A' },
  { svc: 'inventory-api',       sev: 'LOW',      issue: 'GDPR: Data processor agreement not linked in catalog', fix: 'Add DPA link to service metadata', effort: '10min', tag: 'A' },
]

const AGENT_REASONING = [
  { time: '0.2s', layer: 'Catalog',   text: 'Loading all 47 services from Software Catalog...' },
  { time: '0.5s', layer: 'Policies',  text: 'Reading OPA compliance rules: SOC2 (18 rules), PCI-DSS (31 rules), GDPR (12 rules)...' },
  { time: '0.9s', layer: 'Memories',  text: 'Checking org memories: last audit was Q1 2026. Known recurring: GDPR tagging gaps.' },
  { time: '1.4s', layer: 'Catalog',   text: 'Scanning banking-application: no framework enrollment. Severity: CRITICAL.' },
  { time: '1.8s', layer: 'Policies',  text: 'payment-service: GDPR check — endpoints /v1/checkout and /v1/refund missing data-classification.' },
  { time: '2.2s', layer: 'Policies',  text: 'cart-service: SOC2 audit retention 30d < required 90d. LOW severity.' },
  { time: '2.6s', layer: 'Catalog',   text: 'inventory-api: GDPR data processor agreement not linked. LOW severity.' },
  { time: '3.0s', layer: 'Skills',    text: 'Generating remediation PRs for all PASS-eligible fixes...' },
  { time: '3.4s', layer: 'Skills',    text: 'PRs #260-263 created. 4 findings, 4 fixes ready. 0 require architectural decisions.' },
  { time: '3.7s', layer: null,        text: 'Scan complete. 4 findings across 4 services. Estimated remediation: 2hr total engineering time.' },
]

const SEV_CONFIG = {
  CRITICAL: { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200' },
  HIGH:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  MEDIUM:   { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200' },
  LOW:      { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-200' },
}

const LAYER_COLOR = { Catalog: '#00ADE4', Memories: '#7c3aed', Policies: '#ef4444', Skills: '#22c55e' }

export default function CompliancePulse() {
  const [step, setStep]             = useState(0)
  const [scanning, setScanning]     = useState(false)
  const [scanDone, setScanDone]     = useState(false)
  const [reasoning, setReasoning]   = useState([])
  const [approved, setApproved]     = useState({})
  const [reportDone, setReportDone] = useState(false)
  const [showReasoning, setShowReasoning] = useState(true)

  function startScan() {
    setStep(1)
    setScanning(true)
    setReasoning([])
    AGENT_REASONING.forEach((r, i) => {
      setTimeout(() => {
        setReasoning(prev => [...prev, r])
        if (i === AGENT_REASONING.length - 1) { setScanning(false); setScanDone(true) }
      }, i * 380)
    })
  }

  function approve(id) { setApproved(p => ({ ...p, [id]: true })) }

  function generateReport() {
    setTimeout(() => setReportDone(true), 1200)
  }

  const allApproved = FINDINGS.every((_, i) => approved[i])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <Shield size={15} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Compliance Pulse</h1>
            <p className="text-xs text-slate-400">Autonomous compliance drift detection & remediation · SOC2 · PCI-DSS · GDPR</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {i < step ? <CheckCircle size={12} /> : i + 1}
                </div>
                <span className={`text-[10px] ${i === step ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={10} className="text-slate-300 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 0: Trigger */}
          {step === 0 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Run Compliance Scan</h2>
              <p className="text-sm text-slate-500 mb-5">Security Sentinel will scan all 47 services against your compliance frameworks using Context Fabric.</p>
              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-3">Frameworks to check</p>
                <div className="flex gap-3">
                  {FRAMEWORKS.map(f => (
                    <div key={f} className="flex-1 border border-[#00ADE4]/30 bg-[#f0faff] rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-[#0077A8]">{f}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{f === 'SOC2' ? '18 rules' : f === 'PCI-DSS' ? '31 rules' : '12 rules'}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Context Fabric to be used</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Catalog (47 services)', 'OPA Policies', 'Org Memories', 'STO Results', 'Audit History', 'Skills (scan, PR-create)'].map(l => (
                      <span key={l} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={startScan} className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                <Bot size={14} /> Start Autonomous Scan <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">A</span>
              </button>
            </div>
          )}

          {/* Step 1: Scanning */}
          {step === 1 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Scanning…</h2>
              <p className="text-sm text-slate-500 mb-5">Security Sentinel is checking all 47 services across 3 frameworks. Watch the reasoning panel →</p>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {services.map((svc, i) => (
                  <div key={svc.id} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    {scanning && i >= (reasoning.length / 2) ? (
                      <div className="w-3.5 h-3.5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin-slow shrink-0" />
                    ) : (
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                    )}
                    <span className="text-xs text-slate-600 flex-1">{svc.name}</span>
                    {!scanning || i < reasoning.length / 2 ? (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        FINDINGS.find(f => f.svc === svc.id) ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {FINDINGS.find(f => f.svc === svc.id) ? 'Findings' : 'Clean'}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              {scanDone && (
                <button onClick={() => setStep(2)} className="mt-4 bg-violet-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 animate-slide-up">
                  View Findings → <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

          {/* Step 2: Findings */}
          {step === 2 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Findings — {FINDINGS.length} issues across {new Set(FINDINGS.map(f => f.svc)).size} services</h2>
              <p className="text-sm text-slate-500 mb-5">Agent-C has prepared remediation PRs for all fixable issues. Review and approve.</p>
              <div className="space-y-3">
                {FINDINGS.map((f, i) => {
                  const sc = SEV_CONFIG[f.sev]
                  return (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{f.svc}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{f.issue}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text} border ${sc.border}`}>
                          {f.sev}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500">Fix: <span className="text-slate-700 font-medium">{f.fix}</span></p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Est. effort: {f.effort} · PR ready</p>
                        </div>
                        <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full">A</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={() => setStep(3)} className="mt-4 bg-violet-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2">
                Review Remediations → <span className="tag-h text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">H</span>
              </button>
            </div>
          )}

          {/* Step 3: Remediate */}
          {step === 3 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Approve Remediations</h2>
              <p className="text-sm text-slate-500 mb-5">Agent-C prepared PRs for each fix. Approve to merge — agent will handle everything after.</p>
              <div className="space-y-3">
                {FINDINGS.map((f, i) => (
                  <div key={i} className={`bg-white rounded-xl border-2 p-4 transition-all ${approved[i] ? 'border-green-300' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{f.svc}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{f.fix}</p>
                      </div>
                      {approved[i] ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle size={14} />
                          <span className="text-[10px] font-semibold">Approved</span>
                        </div>
                      ) : (
                        <button onClick={() => approve(i)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0">
                          <CheckCircle size={11} /> Approve PR <span className="tag-h text-[9px] font-semibold px-1 py-0.5 rounded-full ml-1 bg-white/20">H</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {allApproved && (
                <button onClick={() => setStep(4)} className="mt-4 bg-violet-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 animate-slide-up">
                  Generate Report → <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">A</span>
                </button>
              )}
            </div>
          )}

          {/* Step 4: Report */}
          {step === 4 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Compliance Report</h2>
              <p className="text-sm text-slate-500 mb-5">Security Sentinel generated an audit-ready evidence package.</p>
              {!reportDone ? (
                <button onClick={generateReport} className="bg-violet-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2">
                  <FileText size={14} /> Generate Audit Package <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">A</span>
                </button>
              ) : (
                <div className="space-y-4 animate-slide-up">
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[['47', 'Services scanned'], ['4', 'Findings'], ['4', 'Remediations merged']].map(([v, l]) => (
                        <div key={l} className="text-center">
                          <p className="text-2xl font-bold text-slate-800">{v}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {[['SOC2', '100%', 'green'], ['PCI-DSS', '96%', 'green'], ['GDPR', '91%', 'amber']].map(([f, s, c]) => (
                        <div key={f} className="flex-1 text-center bg-slate-50 rounded-lg py-2">
                          <p className="text-xs font-bold text-slate-700">{f}</p>
                          <p className={`text-base font-bold ${c === 'green' ? 'text-green-600' : 'text-amber-600'}`}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-800">Audit-ready package generated in 2h 14min</p>
                    <p className="text-xs text-green-700 mt-1">Previous manual process: 2–3 weeks. Posted to #compliance-audit. Delta report vs Q1 included.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agent Reasoning panel */}
        <div className={`shrink-0 bg-[#060C18] border-l border-white/8 flex flex-col transition-all ${showReasoning ? 'w-72' : 'w-8'}`}>
          {showReasoning ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
                <div className="flex items-center gap-2">
                  <Cpu size={11} className="text-violet-400" />
                  <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">Agent Reasoning</span>
                </div>
                <button onClick={() => setShowReasoning(false)} className="text-white/30 hover:text-white/70"><X size={12} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {reasoning.length === 0 && (
                  <p className="text-[10px] text-white/30 mt-4 text-center">Scan reasoning will appear here...</p>
                )}
                {reasoning.map((r, i) => (
                  <div key={i} className="animate-slide-up">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] text-white/30 font-mono">{r.time}</span>
                      {r.layer && (
                        <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${LAYER_COLOR[r.layer]}20`, color: LAYER_COLOR[r.layer] }}>
                          {r.layer}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/70 leading-relaxed">{r.text}</p>
                  </div>
                ))}
                {scanning && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot" />
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot delay-1" />
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot delay-2" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={() => setShowReasoning(true)} className="flex-1 flex items-center justify-center">
              <span className="text-white/30 text-[9px] [writing-mode:vertical-rl] tracking-widest uppercase">Agent Reasoning</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
