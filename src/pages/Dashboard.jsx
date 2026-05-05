import { useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import AgentCard from '../components/AgentCard'
import ActivityLog from '../components/ActivityLog'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Bot, Zap, CheckCircle, TrendingUp } from 'lucide-react'

function formatTokens(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-blue)',
      borderRadius: 6,
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const agents = useAgentStore((s) => s.agents)
  const metrics = useAgentStore((s) => s.metrics)
  const updateAgents = useAgentStore((s) => s.updateAgents)
  const addActivity = useAgentStore((s) => s.addActivity)
  const stats = {
    total:          agents.length,
    active:         agents.filter((a) => a.status === 'active').length,
    idle:           agents.filter((a) => a.status === 'idle').length,
    error:          agents.filter((a) => a.status === 'error').length,
    totalTokens:    agents.reduce((s, a) => s + a.tokens, 0),
    avgCpu:         Math.round(agents.reduce((s, a) => s + a.cpu, 0) / agents.length),
    tasksCompleted: agents.reduce((s, a) => s + a.tasksCompleted, 0),
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateAgents()
      if (Math.random() > 0.6) addActivity()
    }, 2000)
    return () => clearInterval(interval)
  }, [updateAgents, addActivity])

  const STAT_CARDS = [
    { icon: Bot, label: 'Total Agents', value: stats.total, sub: `${stats.active} active`, color: 'var(--blue-400)' },
    { icon: Zap, label: 'Tokens Processed', value: formatTokens(stats.totalTokens), sub: 'all agents', color: 'var(--cyan-500)' },
    { icon: CheckCircle, label: 'Tasks Completed', value: stats.tasksCompleted.toLocaleString(), sub: 'total', color: 'var(--green-500)' },
    { icon: TrendingUp, label: 'Avg CPU', value: `${stats.avgCpu}%`, sub: 'across fleet', color: 'var(--yellow-500)' },
  ]

  return (
    <Layout title="Dashboard" subtitle="MULTI-AGENT COMMAND CENTER">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} color="var(--blue-400)" />
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                TOKEN THROUGHPUT — 24H
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={metrics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0066ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'var(--font-mono)' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'var(--font-mono)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tokens" name="Tokens" stroke="#0066ff" strokeWidth={2} fill="url(#blueGrad)" />
                <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#00d4ff" strokeWidth={1.5} fill="url(#cyanGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <ActivityLog limit={8} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Bot size={14} color="var(--blue-400)" />
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              AGENT FLEET
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {agents.length} agents
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          {label.toUpperCase()}
        </span>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: `${color}15`,
          border: `1px solid ${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {sub}
      </div>
    </div>
  )
}
