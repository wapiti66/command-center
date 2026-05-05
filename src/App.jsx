import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Agents from './pages/Agents'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Terminal from './pages/Terminal'
import Settings from './pages/Settings'
import TraderKnowledge from './pages/TraderKnowledge'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/knowledge" element={<TraderKnowledge />} />
      </Routes>
    </BrowserRouter>
  )
}
