import { useState, useEffect } from 'react'
import { Rocket, Bot, CheckCircle, AlertTriangle, ChevronRight, ChevronLeft, X, Cpu } from 'lucide-react'

const STEPS = ['Intent', 'Pre-flight', 'Template', 'Configure', 'Launch']

const TEMPLATES = [
  { id: 'golden', label: '★ Golden Path', sub: 'Python Microservice · PCI-DSS baseline · Recommended', color: '#00ADE4', recommended: true },
  { id: 'fastapi', label: 'FastAPI + PostgreSQL', sub: 'REST API template · Good for data services', color: '#6366f1', recommended: false },
  { id: 'grpc', label: 'gRPC Streaming', sub: 'High-performance · Good for real-time', color: '#7c3aed', recommended: false },
]

const PREFLIGHT_CHECKS = [
  { label: 'Team quota',             status: 'pass', detail: '3 service slots remaining' },
  { label: 'Cost estimate',          status: 'pass', detail: '~$340/mo · within budget' },
  { label: 'Security baseline',      status: 'pass', detail: 'PCI-DSS template applied' },
  { label: 'OPA policy',             status: 'pass', detail: 'No policy violations' },
  { label: 'Name conflict',          status: 'warn', detail: '"recommendation-engine" exists → suggest "reco-v2-svc"' },
]

const AGENT_REASONING = [
  { time: '0.1s',  text: 'Reading Context Fabric — Catalog, Memories, Policies, Cost, Skills...', layer: 'Catalog' },
  { time: '0.4s',  text: 'Intent parsed: Python microservice, AtlasOne platform. Checking team context...', layer: 'Memories' },
  { time: '0.7s',  text: 'Team: "Finance Platform". Has 3 service slots. Budget: $500/mo remaining.', layer: 'Catalog' },
  { time: '1.1s',  text: 'Querying OPA policies for Python service creation in Finance team scope...', layer: 'Policies' },
  { time: '1.5s',  text: 'Policy check: PASS. All conditions met. No blocking rules.', layer: 'Policies' },
  { time: '1.9s',  text: 'Cost estimation: t3.medium × 2 replicas + RDS db.t3.small ≈ $340/mo.', layer: 'Cost' },
  { time: '2.3s',  text: 'Memory: AtlasOne platform uses PCI-DSS baseline for all payment-adjacent services.', layer: 'Memories' },
  { time: '2.6s',  text: 'Applying Golden Path template with PCI-DSS hardening. Checking name registry...', layer: 'Catalog' },
  { time: '2.9s',  text: '⚠ "recommendation-engine" already registered by team/analytics. Suggesting "reco-v2-svc".', layer: 'Catalog' },
  { time: '3.1s',  text: 'Pre-flight complete: 4 PASS, 1 WARNING. Ready for human review.', layer: null },
]

const INTENT_SUGGESTIONS = [
  { label: 'Python recommendations microservice', full: 'A Python recommendations microservice for the AtlasOne finance platform, using collaborative filtering on purchase history. Needs to integrate with inventory-api and payment-service.' },
  { label: 'Go gRPC real-time inventory', full: 'A Go gRPC service for real-time inventory updates with sub-100ms latency. Should consume Kafka events from the warehouse system and expose a streaming API.' },
  { label: 'Node.js event-driven notifications', full: 'A Node.js event-driven notification handler that listens to Kafka topics and dispatches email/SMS/push via SendGrid and Twilio. Replace the current notification-svc v1.' },
  { label: 'FastAPI data aggregation', full: 'A FastAPI data aggregation service with PostgreSQL backend. Will aggregate order analytics across payment-service and inventory-api for the BI dashboard.' },
  { label: 'Auth middleware for checkout', full: 'A lightweight auth middleware service for the checkout flow that handles session validation and rate limiting, fronting payment-service and cart-service.' },
]

const LAUNCH_STEPS = [
  { label: 'Create GitHub repo', tag: 'A', status: null },
  { label: 'Bootstrap CI pipeline',  tag: 'A', status: null },
  { label: 'Register in Catalog', tag: 'A', status: null },
  { label: 'Enroll in Scorecards', tag: 'A', status: null },
  { label: 'Add to service mesh', tag: 'A', status: null },
  { label: 'Notify #platform-team', tag: 'A', status: null },
]

export default function ServiceScout() {
  const [step, setStep] = useState(0)
  const [intent, setIntent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('golden')
  const [serviceName, setServiceName] = useState('reco-v2-svc')
  const [reasoning, setReasoning] = useState([])
  const [reasoningRunning, setReasoningRunning] = useState(false)
  const [preflightDone, setPreflightDone] = useState(false)
  const [launchSteps, setLaunchSteps] = useState(LAUNCH_STEPS)
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [showReasoning, setShowReasoning] = useState(true)

  function runPreflight() {
    setReasoningRunning(true)
    setReasoning([])
    AGENT_REASONING.forEach((r, i) => {
      setTimeout(() => {
        setReasoning(prev => [...prev, r])
        if (i === AGENT_REASONING.length - 1) {
          setPreflightDone(true)
          setReasoningRunning(false)
        }
      }, i * 320)
    })
  }

  function handleNext() {
    if (step === 0 && intent.trim()) { setStep(1); setTimeout(runPreflight, 400) }
    else if (step === 1 && preflightDone) setStep(2)
    else if (step === 2) setStep(3)
    else if (step === 3) setStep(4)
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  function handleLaunch() {
    setLaunching(true)
    LAUNCH_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setLaunchSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s))
        if (i === LAUNCH_STEPS.length - 1) { setLaunching(false); setLaunched(true) }
      }, (i + 1) * 700)
    })
  }

  const LAYER_COLOR = { 'Catalog': '#00ADE4', 'Memories': '#7c3aed', 'Policies': '#ef4444', 'Cost': '#f59e0b', 'Skills': '#22c55e' }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00ADE4]/10 flex items-center justify-center">
            <Rocket size={15} className="text-[#00ADE4]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Service Scout</h1>
            <p className="text-xs text-slate-400">Guided new service creation · Agent-powered · Context-aware</p>
          </div>
          {/* Step progress */}
          <div className="ml-auto flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-[#00ADE4] text-white' :
                  'bg-slate-100 text-slate-400'
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

      <div className="flex-1 flex overflow-hidden">
        {/* Main content — flex-1 min-w-0 ensures it fills space without overflow */}
        <div className="flex-1 min-w-0 overflow-y-auto p-6">
          {/* Back button */}
          {step > 0 && step < 5 && !launched && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-4 transition-colors group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to {STEPS[step - 1]}
            </button>
          )}

          {/* Step 0: Intent */}
          {step === 0 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">What do you want to build?</h2>
              <p className="text-sm text-slate-500 mb-4">Describe your service in plain language. Agent-C will read your org context to suggest the best path.</p>

              {/* Prompt suggestions */}
              <div className="mb-3">
                <p className="text-[10px] text-slate-400 mb-2 font-medium uppercase tracking-wide">Quick start — click to use</p>
                <div className="flex flex-wrap gap-2">
                  {INTENT_SUGGESTIONS.map(s => (
                    <button
                      key={s.label}
                      onClick={() => setIntent(s.full)}
                      className="text-[10px] text-slate-600 bg-white border border-slate-200 hover:border-[#00ADE4] hover:text-[#0077A8] px-2.5 py-1.5 rounded-lg transition-colors text-left leading-tight"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={intent}
                onChange={e => setIntent(e.target.value)}
                placeholder="e.g. A Python recommendations microservice for the AtlasOne platform..."
                className="w-full h-28 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none focus:border-[#00ADE4] transition-colors"
              />
              <div className="mt-3 bg-[#f0faff] border border-[#00ADE4]/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Bot size={11} className="text-[#00ADE4]" />
                  <span className="text-[10px] font-semibold text-[#0077A8]">Context Fabric will be searched</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Catalog (47 services)', 'Memories (1,247)', 'OPA Policies (23)', 'Cost Budget', 'Team Quotas', 'Skills (24)'].map(l => (
                    <span key={l} className="text-[9px] bg-white text-[#0077A8] border border-[#00ADE4]/20 px-2 py-0.5 rounded-full">{l}</span>
                  ))}
                </div>
              </div>
              <button onClick={handleNext} disabled={!intent.trim()} className="mt-4 bg-[#00ADE4] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0095C8] transition-colors flex items-center gap-2">
                <Bot size={14} /> Analyze with Agent-C →
              </button>
            </div>
          )}

          {/* Step 1: Pre-flight */}
          {step === 1 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Pre-flight Check</h2>
              <p className="text-sm text-slate-500 mb-5">Agent-C is verifying your request against org policies, budget, and catalog. Runs automatically as you type.</p>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {PREFLIGHT_CHECKS.map((c, i) => (
                  <div key={c.label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    {reasoningRunning && reasoning.length <= i * 2 ? (
                      <div className="w-4 h-4 border-2 border-[#00ADE4] border-t-transparent rounded-full animate-spin-slow shrink-0" />
                    ) : c.status === 'pass' ? (
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700">{c.label}</p>
                      {(preflightDone || reasoning.length > i * 2) && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{c.detail}</p>
                      )}
                    </div>
                    <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full">A</span>
                  </div>
                ))}
              </div>
              {preflightDone && (
                <button onClick={handleNext} className="mt-4 bg-[#00ADE4] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0095C8] transition-colors flex items-center gap-2 animate-slide-up">
                  Choose Template → <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

          {/* Step 2: Template */}
          {step === 2 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Choose a Template</h2>
              <p className="text-sm text-slate-500 mb-5">Agent-C suggests based on your intent, team context, and org memories.</p>
              <div className="space-y-3">
                {TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-sm ${
                      selectedTemplate === t.id ? 'border-[#00ADE4]' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{t.sub}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.recommended && <span className="text-[9px] bg-[#00ADE4]/10 text-[#0077A8] font-semibold px-2 py-0.5 rounded-full">AI Suggested</span>}
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${selectedTemplate === t.id ? 'border-[#00ADE4] bg-[#00ADE4]' : 'border-slate-300'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleNext} className="mt-4 bg-[#00ADE4] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0095C8] transition-colors flex items-center gap-2">
                Configure → <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Step 3: Configure */}
          {step === 3 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Configure</h2>
              <p className="text-sm text-slate-500 mb-5">Defaults are pre-filled by Agent-C from your context. Change only what you need.</p>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {[
                  { label: 'Service name', value: serviceName, onChange: setServiceName, hint: 'Suggested by Agent-C (name conflict resolved)' },
                  { label: 'Team',         value: 'Finance Platform Team', readonly: true },
                  { label: 'Owner',        value: 'ananya.krishnan@atlasone.io', readonly: true },
                  { label: 'Language',     value: 'Python 3.12', readonly: true },
                  { label: 'Est. cost',    value: '~$340/mo', readonly: true, tag: 'A' },
                  { label: 'Lifecycle',    value: 'development', readonly: true },
                ].map((f, i) => (
                  <div key={f.label} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    <span className="text-xs text-slate-500 w-28 shrink-0">{f.label}</span>
                    {f.readonly ? (
                      <span className="text-xs font-medium text-slate-700 flex-1">{f.value}</span>
                    ) : (
                      <input value={f.value} onChange={e => f.onChange(e.target.value)} className="flex-1 text-xs font-medium text-slate-700 outline-none border-b border-dashed border-slate-300 pb-0.5 bg-transparent" />
                    )}
                    {f.hint && <span className="text-[9px] text-[#0077A8]">{f.hint}</span>}
                    {f.tag && <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full">{f.tag}</span>}
                  </div>
                ))}
              </div>
              <button onClick={handleNext} className="mt-4 bg-[#00ADE4] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0095C8] transition-colors flex items-center gap-2">
                Review & Launch → <span className="tag-h text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">H</span>
              </button>
            </div>
          )}

          {/* Step 4: Launch */}
          {step === 4 && (
            <div className="max-w-2xl animate-slide-up">
              <h2 className="text-lg font-bold text-slate-800 mb-1">{launched ? '✓ Service Launched!' : 'Ready to Launch'}</h2>
              <p className="text-sm text-slate-500 mb-5">
                {launched ? `${serviceName} is live. Agent-C completed all setup in 4m 23s.` : 'Agent-C will execute all steps. You approved the plan — agent takes it from here.'}
              </p>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {launchSteps.map((s, i) => (
                  <div key={s.label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    {s.status === 'done' ? (
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                    ) : launching && launchSteps.filter(x => x.status === 'done').length === i ? (
                      <div className="w-4 h-4 border-2 border-[#00ADE4] border-t-transparent rounded-full animate-spin-slow shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                    )}
                    <span className={`text-xs flex-1 ${s.status === 'done' ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{s.label}</span>
                    <span className="tag-a text-[9px] font-semibold px-1.5 py-0.5 rounded-full">{s.tag}</span>
                  </div>
                ))}
              </div>
              {!launched && !launching && (
                <button onClick={handleLaunch} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                  <Rocket size={14} /> Launch Service <span className="tag-h text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">H</span>
                </button>
              )}
              {launched && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 animate-slide-up">
                  <p className="text-sm font-semibold text-green-800 mb-1">Service live in 4m 23s</p>
                  <p className="text-xs text-green-700">Catalog registered · CI pipeline active · Scorecards enrolled · Service mesh configured · Team notified</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agent Reasoning panel — flex sibling, always at the right edge */}
        <div className={`shrink-0 bg-[#060C18] border-l border-white/10 flex flex-col transition-all duration-200 ${showReasoning ? 'w-72' : 'w-10'}`}>
          {showReasoning ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
                <div className="flex items-center gap-2">
                  <Cpu size={11} className="text-[#00ADE4]" />
                  <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">Agent Reasoning</span>
                </div>
                <button onClick={() => setShowReasoning(false)} className="text-white/30 hover:text-white/70 transition-colors">
                  <X size={12} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {reasoning.length === 0 && (
                  <p className="text-[10px] text-white/30 mt-4 text-center">Agent reasoning will appear here...</p>
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
                {reasoningRunning && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-[#00ADE4] rounded-full animate-pulse-dot" />
                    <div className="w-1.5 h-1.5 bg-[#00ADE4] rounded-full animate-pulse-dot delay-1" />
                    <div className="w-1.5 h-1.5 bg-[#00ADE4] rounded-full animate-pulse-dot delay-2" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowReasoning(true)}
              className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors"
            >
              <Cpu size={11} className="text-[#00ADE4]" />
              <span className="text-[8px] text-white/40 [writing-mode:vertical-rl] tracking-widest uppercase">Reasoning</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
