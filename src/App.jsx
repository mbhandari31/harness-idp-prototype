import { useState } from 'react'
import Sidebar from './components/Sidebar'
import SignalsRail from './components/SignalsRail'
import Home from './pages/Home'
import Topology from './pages/Topology'
import ContextView from './pages/ContextView'
import Sessions from './pages/Sessions'
import AgentDuties from './pages/AgentDuties'
import Scorecards from './pages/Scorecards'
import ServiceScout from './apps/ServiceScout'
import CompliancePulse from './apps/CompliancePulse'

export default function App() {
  const [page, setPage] = useState('home')

  function renderPage() {
    if (page === 'home')            return <Home setPage={setPage} />
    if (page === 'topology')        return <Topology setPage={setPage} />
    if (page === 'sessions')        return <Sessions />
    if (page === 'duties')          return <AgentDuties />
    if (page === 'scorecards')      return <Scorecards />
    if (page === 'app-scout')       return <ServiceScout setPage={setPage} />
    if (page === 'app-compliance')  return <CompliancePulse setPage={setPage} />
    if (page?.startsWith('ctx-'))   return <ContextView layerId={page} />
    return <Home setPage={setPage} />
  }

  // Signals rail is hidden inside the mini-apps (they have their own reasoning panel)
  const hideRail = page === 'app-scout' || page === 'app-compliance'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 flex overflow-hidden">
        {renderPage()}
      </main>
      {!hideRail && <SignalsRail setPage={setPage} />}
    </div>
  )
}
