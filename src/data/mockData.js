// ─── SERVICES ────────────────────────────────────────────────────────────────
export const services = [
  {
    id: 'auth-gateway', name: 'auth-gateway', type: 'service', lang: 'Go',
    access: 'read-only',
    team: 'Core Services Engineering', owner: 'rashmi.desai@atlasone.io',
    lifecycle: 'production', securityIssues: 0,
    scores: { overall: 96, security: 100, reliability: 100, compliance: 86 },
    cost: 6200, costTrend: 'stable',
    desc: 'Central authentication & authorization gateway. OAuth 2.0 + OIDC. Zero-trust perimeter. 99.99% SLA.',
    tags: ['critical', 'go', 'oauth', 'zero-trust'],
    deps: { out: 0, in: 47 },
    deployments: [
      { env: 'prod', cluster: 'eks-us-east-1', status: 'healthy', replicas: '8/8', age: '2d ago' },
      { env: 'prod', cluster: 'eks-eu-west-1', status: 'healthy', replicas: '4/4', age: '2d ago' },
    ],
    aiAnalysis: {
      summary: 'Zero-trust API gateway handling all inter-service auth. mTLS everywhere. SOC2 compliant. Compliance gap (86): GDPR data-classification tag missing on 2 endpoints.',
      impact: 'CRITICAL — any outage is a full platform outage. All 47 services depend on this.',
      confidence: 'High',
    },
    topoPos: { x: 340, y: 60 },
  },
  {
    id: 'payment-service', name: 'payment-service', type: 'service', lang: 'Java',
    access: 'read-only',
    team: 'Finance Platform Team', owner: 'vikram.nair@atlasone.io',
    lifecycle: 'production', securityIssues: 0,
    scores: { overall: 93, security: 100, reliability: 80, compliance: 100 },
    cost: 8400, costTrend: 'up',
    desc: 'Core payment processing. PCI-DSS compliant. 12K TPS in peak. Critical checkout dependency.',
    tags: ['pci-dss', 'critical', 'java', 'kafka'],
    deps: { out: 3, in: 8 },
    deployments: [
      { env: 'prod', cluster: 'eks-us-east-1', status: 'rolling', replicas: '3/6', age: 'now' },
      { env: 'staging', cluster: 'eks-us-west-2', status: 'healthy', replicas: '2/2', age: '1d ago' },
    ],
    aiAnalysis: {
      summary: 'PCI-DSS payment processor at 12K TPS. Currently rolling v2.4.1 (3/6 replicas). Reliability 80: retry logic on Kafka consumer missing.',
      impact: 'CRITICAL — checkout conversion is 0% if this goes down.',
      confidence: 'High',
    },
    topoPos: { x: 160, y: 190 },
  },
  {
    id: 'cart-service', name: 'cart-service', type: 'service', lang: 'Node.js',
    team: 'Frontend Systems Team', owner: 'ananya.krishnan@atlasone.io',
    lifecycle: 'production', securityIssues: 0,
    scores: { overall: 87, security: 80, reliability: 100, compliance: 80 },
    cost: 2800, costTrend: 'stable',
    desc: 'Shopping cart & session management. Redis-backed sub-10ms reads. 4 replicas.',
    tags: ['redis', 'session', 'nodejs'],
    deps: { out: 2, in: 5 },
    deployments: [
      { env: 'prod', cluster: 'eks-us-east-1', status: 'healthy', replicas: '4/4', age: '5d ago' },
    ],
    aiAnalysis: {
      summary: 'Redis-backed cart service. Reliable (100). Security gap: secret-scanning not enabled on the repo.',
      impact: 'HIGH — blocks checkout initiation and add-to-cart.',
      confidence: 'High',
    },
    topoPos: { x: 500, y: 190 },
  },
  {
    id: 'inventory-api', name: 'inventory-api', type: 'service', lang: 'Python',
    team: 'Data and Analytics', owner: 'ananya.krishnan@atlasone.io',
    lifecycle: 'production', securityIssues: 0,
    scores: { overall: 74, security: 80, reliability: 67, compliance: 80 },
    cost: 3800, costTrend: 'stable',
    desc: 'Real-time inventory availability API. FastAPI + PostgreSQL. No retry on DB calls.',
    tags: ['python', 'postgresql', 'fastapi'],
    deps: { out: 1, in: 6 },
    deployments: [
      { env: 'prod', cluster: 'eks-us-east-1', status: 'healthy', replicas: '3/3', age: '12d ago' },
    ],
    aiAnalysis: {
      summary: 'Reliability score 67 — missing retry + circuit breaker on PostgreSQL calls. PR #247 in review would fix this. Agent-C generated the fix.',
      impact: 'MEDIUM-HIGH — false out-of-stock errors during DB flakiness.',
      confidence: 'Medium',
    },
    topoPos: { x: 240, y: 330 },
  },
  {
    id: 'notification-svc', name: 'notification-svc', type: 'service', lang: 'Go',
    team: 'Backend Platform Team', owner: 'platform@atlasone.io',
    lifecycle: 'production', securityIssues: 0,
    scores: { overall: 81, security: 80, reliability: 81, compliance: 100 },
    cost: 1600, costTrend: 'stable',
    desc: 'Multi-channel notifications (email, SMS, push). Event-driven via Kafka. 500K/day.',
    tags: ['go', 'kafka', 'async'],
    deps: { out: 4, in: 12 },
    deployments: [
      { env: 'prod', cluster: 'eks-us-east-1', status: 'healthy', replicas: '2/2', age: '8d ago' },
    ],
    aiAnalysis: {
      summary: 'Kafka-driven notification dispatcher. Healthy. Minor: security scan on repo is manual, not automated.',
      impact: 'MEDIUM — non-critical for transactions but essential for fraud alerts.',
      confidence: 'High',
    },
    topoPos: { x: 460, y: 330 },
  },
  {
    id: 'banking-app', name: 'banking-application', type: 'service', lang: 'Java',
    access: 'read-only',
    team: 'SalesEngineers', owner: 'sales@atlasone.io',
    lifecycle: 'experimental', securityIssues: 5,
    scores: { overall: null, security: null, reliability: null, compliance: null },
    cost: 420, costTrend: 'stable',
    desc: 'Experimental banking integration POC. 5 unresolved HIGH security findings. Not production ready.',
    tags: ['experimental', 'poc'],
    deps: { out: 0, in: 0 },
    deployments: [],
    aiAnalysis: {
      summary: '5 HIGH security findings blocking scorecard. No compliance mapping. Recommend halting until resolved. Security Sentinel has PRs #248-252 ready.',
      impact: 'LOW (experimental) — but HIGH risk if promoted to production in current state.',
      confidence: 'High',
    },
    topoPos: { x: 620, y: 330 },
  },
]

// ─── TOPOLOGY EDGES ───────────────────────────────────────────────────────────
export const topoEdges = [
  { from: 'auth-gateway',   to: 'payment-service' },
  { from: 'auth-gateway',   to: 'cart-service' },
  { from: 'payment-service',to: 'inventory-api' },
  { from: 'cart-service',   to: 'inventory-api' },
  { from: 'payment-service',to: 'notification-svc' },
  { from: 'cart-service',   to: 'notification-svc' },
]

// ─── AGENTS ───────────────────────────────────────────────────────────────────
export const agents = [
  {
    id: 'agent-c', name: 'Agent-C', emoji: '🤖', status: 'active',
    type: 'Development Assistant',
    desc: 'IDE-integrated coding agent. Reads catalog context, proposes fixes, creates dev services and PRs via MCP.',
    task: 'Analyzing inventory-api reliability gap (67→85). PR #247 in review.',
    tasksToday: 23, mcpConnected: true,
    autonomy: { 'Catalog Read': 5, 'Create (dev)': 3, 'Create (prod)': 1, 'Run Workflow': 3, 'Modify Policy': 1, 'Deploy (prod)': 1 },
    contextLayers: ['Catalog', 'Git History', 'Scorecards', 'CI Results', 'TechDocs'],
    skills: ['code-analysis', 'service-creation', 'dependency-resolution', 'pr-creation'],
  },
  {
    id: 'release-herald', name: 'Release Herald', emoji: '📣', status: 'active',
    type: 'Release Orchestrator',
    desc: 'Monitors pipelines, posts Slack updates, tracks rollout health, auto-rolls back on failure.',
    task: 'Monitoring payment-service v2.4.1 rollout — 3/6 replicas healthy.',
    tasksToday: 7, mcpConnected: true,
    autonomy: { 'Catalog Read': 5, 'Create (dev)': 1, 'Create (prod)': 1, 'Run Workflow': 4, 'Modify Policy': 1, 'Deploy (prod)': 2 },
    contextLayers: ['Catalog', 'CD Pipelines', 'SRM Metrics', 'Deployment History'],
    skills: ['release-monitoring', 'slack-notifications', 'rollback-detection'],
  },
  {
    id: 'sec-sentinel', name: 'Security Sentinel', emoji: '🛡️', status: 'active',
    type: 'Security Automation',
    desc: 'Scans for policy violations, rotates credentials at L3, escalates critical findings to humans.',
    task: 'banking-application: 5 HIGH findings → PRs ready for Rashmi.',
    tasksToday: 156, mcpConnected: true,
    autonomy: { 'Catalog Read': 5, 'Create (dev)': 1, 'Create (prod)': 1, 'Run Workflow': 3, 'Modify Policy': 2, 'Deploy (prod)': 1 },
    contextLayers: ['Catalog', 'STO Results', 'OPA Policies', 'Vault', 'Compliance Rules'],
    skills: ['vulnerability-scan', 'policy-enforcement', 'credential-rotation'],
  },
  {
    id: 'onboarding-guide', name: 'Onboarding Guide', emoji: '🎓', status: 'idle',
    type: 'Developer Experience',
    desc: 'Guides new developers through onboarding, sets up environments, answers questions via TechDocs.',
    task: null,
    tasksToday: 3, mcpConnected: false,
    autonomy: { 'Catalog Read': 4, 'Create (dev)': 3, 'Create (prod)': 1, 'Run Workflow': 3, 'Modify Policy': 1, 'Deploy (prod)': 1 },
    contextLayers: ['TechDocs', 'Catalog', 'Team Directory'],
    skills: ['techdocs-search', 'environment-setup', 'team-introduction'],
  },
]

// ─── CONTEXT FABRIC ───────────────────────────────────────────────────────────
export const contextLayers = [
  {
    id: 'catalog', name: 'Software Catalog', icon: '📦', active: true,
    desc: 'All 47 registered services — owners, lifecycle, dependencies, metadata, tech stack.',
    stats: '47 services · 12 teams · 234 components',
    agentsUsing: ['agent-c', 'release-herald', 'sec-sentinel'],
    examples: ['Get service owner before raising a PR', 'Find all Java services on JDK 11', 'Trace dependency chain for checkout flow'],
  },
  {
    id: 'memories', name: 'Org Memories', icon: '🧠', active: true,
    desc: 'Learned patterns from past incidents, deployments, and decisions. Agents never repeat the same mistake.',
    stats: '1,247 memories · 38 incident learnings · 92 deployment patterns',
    agentsUsing: ['agent-c', 'sec-sentinel'],
    examples: ['Last time inventory-api had a DB spike, retries fixed it', 'payment-service v2.x rollouts need 15min stabilization window', 'Team prefers squash-merge for hotfixes'],
  },
  {
    id: 'skills', name: 'Agent Skills', icon: '⚡', active: true,
    desc: 'Reusable capabilities agents can invoke — code analysis, PR creation, compliance checks, cost queries.',
    stats: '24 skills installed · 8 custom · 3 external',
    agentsUsing: ['agent-c', 'release-herald', 'sec-sentinel', 'onboarding-guide'],
    examples: ['create-golden-path-service', 'rotate-vault-secret', 'generate-compliance-report', 'scan-sast'],
  },
  {
    id: 'git', name: 'Git History', icon: '🔀', active: true,
    desc: 'Full commit history, PR metadata, blame data, and change frequency per service.',
    stats: '12,489 commits indexed · 892 PRs · 47 repos',
    agentsUsing: ['agent-c', 'sec-sentinel'],
    examples: ['What changed in inventory-api last 7 days?', 'Who last touched auth-gateway?', 'Find PRs that touched the payment flow'],
  },
  {
    id: 'ci', name: 'CI Results', icon: '🔄', active: true,
    desc: 'Build history, test coverage, flaky test tracking, pipeline health per service.',
    stats: '98.2% build success rate · 847 pipelines · 4.1min avg build',
    agentsUsing: ['agent-c', 'release-herald'],
    examples: ['Is cart-service test coverage above 80%?', 'Which services have flaky tests?'],
  },
  {
    id: 'srm', name: 'SRM Metrics', icon: '📊', active: true,
    desc: 'Live SLOs, error budgets, incident history, and MTTR per service.',
    stats: '31 SLOs tracked · 99.94% avg uptime · 18min avg MTTR',
    agentsUsing: ['release-herald', 'agent-c'],
    examples: ['Is inventory-api within SLO budget?', 'MTTR trend for payment-service last quarter'],
  },
  {
    id: 'policies', name: 'OPA Policies', icon: '🛡️', active: true,
    desc: 'Open Policy Agent rules governing what agents and humans can do. Version-controlled in Git.',
    stats: '23 policies · 5 categories · 2 exceptions pending',
    agentsUsing: ['sec-sentinel', 'agent-c'],
    examples: ['Can agent-c create a prod service without approval?', 'Does banking-app violate any data policies?'],
  },
  {
    id: 'cost', name: 'Cost & Cloud', icon: '💰', active: true,
    desc: 'Live cloud spend per service, optimization recommendations, budget tracking.',
    stats: '$42,300/mo total · $1,634 saveable · 3 anomalies',
    agentsUsing: ['sec-sentinel'],
    examples: ['What\'s the estimated cost of a new Python service?', 'Which services have gp2 EBS volumes?'],
  },
  {
    id: 'techdocs', name: 'TechDocs', icon: '📄', active: true,
    desc: 'All internal technical documentation, runbooks, ADRs, and onboarding guides.',
    stats: '312 docs · 47 runbooks · 23 ADRs',
    agentsUsing: ['onboarding-guide', 'agent-c'],
    examples: ['How do I add a new service to the mesh?', 'What\'s the incident response runbook for payment-service?'],
  },
  {
    id: 'integrations', name: 'Integrations', icon: '🔌', active: true,
    desc: 'Connected external systems — Slack, GitHub, Jira, PagerDuty, AWS, Vault.',
    stats: '8 connected · AWS, GCP, GitHub, Slack, Jira, PagerDuty, Vault, Kubernetes',
    agentsUsing: ['agent-c', 'release-herald', 'sec-sentinel', 'onboarding-guide'],
    examples: ['Post to #platform-team when score drops', 'Create Jira ticket on policy violation'],
  },
]

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
export const sessions = [
  {
    id: 's1', title: 'inventory-api Reliability Fix', service: 'inventory-api',
    agent: 'Agent-C', agentEmoji: '🤖', human: 'Ananya Krishnan', humanInitials: 'AK',
    scenario: 'agent-to-human', status: 'awaiting-human', started: '14m ago',
    why: 'Production code change requires human review — Autonomy L1 rule for prod changes.',
    timeline: [
      { actor: 'agent', label: 'Agent-C', time: '14m ago', tag: 'A', text: 'Analyzed scorecard gap (67/100). Root cause: missing retry logic on PostgreSQL calls under high load.' },
      { actor: 'agent', label: 'Agent-C', time: '11m ago', tag: 'A', text: 'Generated PR #247 — adds RetryTemplate (3 attempts, exponential backoff) and CircuitBreaker at 50% threshold.', artifact: 'PR #247: retry-circuit-breaker' },
      { actor: 'agent', label: 'Agent-C', time: '8m ago',  tag: 'A', text: 'Tests pass: 98% coverage. Estimated scorecard impact: 67 → 84. Awaiting human review.' },
      { actor: 'human', label: 'You', time: 'Now', tag: 'H', text: 'Review PR #247 and approve or request changes.', action: { approve: 'Approve & Merge', reject: 'Request changes' } },
    ],
  },
  {
    id: 's2', title: 'payment-service v2.4.1 Rollout', service: 'payment-service',
    agent: 'Release Herald', agentEmoji: '📣', human: 'Vikram Nair', humanInitials: 'VN',
    scenario: 'human-to-agent', status: 'agent-working', started: '2h ago',
    why: null,
    timeline: [
      { actor: 'human', label: 'Vikram Nair', time: '2h ago',  tag: 'H', text: 'Approved deployment plan for payment-service v2.4.1 to production.' },
      { actor: 'agent', label: 'Release Herald', time: '2h ago', tag: 'A', text: 'Pre-flight gates: all green. Starting staged rollout — 2 replicas first.' },
      { actor: 'agent', label: 'Release Herald', time: '1h ago', tag: 'A', text: 'Wave 1 healthy (2/6 replicas). Error rate: 0.01%. Proceeding.' },
      { actor: 'agent', label: 'Release Herald', time: '25m ago', tag: 'A', text: 'Rolling update in progress: 3/6 replicas updated. Error rate stable at 0.02%. p99 latency: 142ms (within SLO). ETA 8 minutes.' },
    ],
  },
  {
    id: 's3', title: 'banking-app Security Remediation', service: 'banking-app',
    agent: 'Security Sentinel', agentEmoji: '🛡️', human: 'Rashmi Desai', humanInitials: 'RD',
    scenario: 'co-review', status: 'awaiting-human', started: '30m ago',
    why: 'CRITICAL security findings require joint review — agent cannot auto-remediate per policy.',
    timeline: [
      { actor: 'agent', label: 'Security Sentinel', time: '30m ago', tag: 'A', text: 'STO scan completed. Found 5 HIGH findings: 2× SQL injection, 2× hardcoded secrets, 1× broken auth.' },
      { actor: 'agent', label: 'Security Sentinel', time: '22m ago', tag: 'A', text: 'Classified against OWASP Top 10. Risk-ranked. Created remediation PRs #248–252 for each finding.', artifact: 'PRs #248–252: security remediations' },
      { actor: 'human', label: 'Rashmi Desai', time: '15m ago', tag: 'H', text: 'Reviewing PRs. PR #248 looks good. Flagging #251 (auth fix) for deeper review.' },
      { actor: 'human', label: 'You', time: 'Now', tag: 'H', text: 'Co-review PR #251 (broken auth fix) and decide: approve, revise, or escalate.', action: { approve: 'Approve PR #251', reject: 'Request revision' } },
    ],
  },
]

// ─── SIGNALS ──────────────────────────────────────────────────────────────────
export const signals = {
  health: { score: 84, atRisk: 6, label: '84% healthy' },
  cost: { total: 42300, trend: '+12%', saveable: 1634 },
  security: { criticalFindings: 5, service: 'banking-application', prsReady: 3 },
  compliance: { score: 87, exceptions: 2, frameworks: ['SOC2 ✓', 'PCI ✓', 'GDPR ⚠'] },
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export const activity = [
  { id: 1, actor: 'Agent-C',          type: 'agent',  action: 'Generated PR #247 for inventory-api reliability fix',        time: '14m ago', svc: 'inventory-api' },
  { id: 2, actor: 'Release Herald',   type: 'agent',  action: 'Monitoring payment-service v2.4.1 — 3/6 replicas ✓',        time: '25m ago', svc: 'payment-service' },
  { id: 3, actor: 'Vikram Nair',      type: 'human',  action: 'Approved deployment plan for payment-service v2.4.1',        time: '2h ago',  svc: 'payment-service' },
  { id: 4, actor: 'Security Sentinel',type: 'agent',  action: 'Rotated 12 service credentials autonomously (L3)',           time: '45m ago', svc: null },
  { id: 5, actor: 'Ananya Krishnan',  type: 'human',  action: 'Registered new service: recommendation-engine',             time: '1h ago',  svc: 'recommendation-engine' },
  { id: 6, actor: 'Security Sentinel',type: 'agent',  action: 'Escalated 5 HIGH findings on banking-app to Rashmi',        time: '2h ago',  svc: 'banking-app' },
  { id: 7, actor: 'Onboarding Guide', type: 'agent',  action: 'Completed dev environment setup for priya.sharma',          time: '3h ago',  svc: null },
]

// ─── DUTIES ───────────────────────────────────────────────────────────────────
export const duties = [
  {
    id: 'd1', name: 'Credential Rotation Watch', agentId: 'sec-sentinel', agentEmoji: '🛡️',
    autonomyLevel: 3, trigger: 'schedule', schedule: 'Every Monday 06:00 UTC',
    desc: 'Scans all services for credentials expiring in <14 days. Rotates at L3, escalates to human for prod secrets.',
    lastRan: 'May 19 · 06:00 UTC', nextRun: 'May 26 · 06:00 UTC',
    contextSources: ['catalog', 'vault', 'policies'],
  },
  {
    id: 'd2', name: 'Scorecard Drift Monitor', agentId: 'agent-c', agentEmoji: '🤖',
    autonomyLevel: 4, trigger: 'event', schedule: 'On every merged PR',
    desc: 'Re-scores affected service after merge. If score drops >5pts, creates a session and pings service owner.',
    lastRan: 'May 24 · 09:11 UTC', nextRun: 'On next PR merge',
    contextSources: ['catalog', 'git', 'ci', 'srm'],
  },
  {
    id: 'd3', name: 'Cost Anomaly Detection', agentId: 'sec-sentinel', agentEmoji: '🛡️',
    autonomyLevel: 3, trigger: 'schedule', schedule: 'Daily 08:00 UTC',
    desc: 'Compares spend vs 7-day average. If >15% spike, posts to #platform-alerts and creates cost signal.',
    lastRan: 'May 24 · 08:00 UTC', nextRun: 'May 25 · 08:00 UTC',
    contextSources: ['cost', 'catalog', 'integrations'],
  },
  {
    id: 'd4', name: 'Developer Onboarding', agentId: 'onboarding-guide', agentEmoji: '🎓',
    autonomyLevel: 2, trigger: 'event', schedule: 'On new user added to org',
    desc: 'Creates GitHub + Slack access, provisions dev environment, assigns first service, creates learning path.',
    lastRan: 'May 22 · priya.sharma@atlasone.io', nextRun: 'On next new hire',
    contextSources: ['catalog', 'techdocs', 'integrations', 'skills'],
  },
]

// ─── PLATFORM STATS ───────────────────────────────────────────────────────────
export const stats = {
  services: 47, agents: 3, avgScore: 84, activeSessions: 3,
  workflowsToday: 89, goldenPath: 78,
  dora: { deployFreq: '4.2/day', leadTime: '1.4hrs', changeFail: '2.1%', mttr: '18min' },
}
