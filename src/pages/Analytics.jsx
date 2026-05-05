import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { BarChart3, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

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
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const metrics = useAgentStore((s) => s.metrics)
  const agents = useAgentStore((s) => s.agents)

  const agentPerf = agents.map((a) => ({
    name: a.name,
    tokens: Math.floor(a.tokens / 1000),
    tasks: a.tasksCompleted,
    latency: a.latency,
  }))

  return (
    <Layout title="Analytics" subtitle="PERFORMANCE METRICS">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ChartCard title="TOKEN THROUGHPUT" icon={Zap}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0066ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tokens" name="Tokens" stroke="#0066ff" strokeWidth={2} fill="url(#tokGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="LATENCY TREND (ms)" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="latency" name="Latency (ms)" stroke="#00d4ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <ChartCard title="AGENT PERFORMANCE" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={agentPerf} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', color: '#8892a4' }} />
                <Bar dataKey="tokens" name="Tokens (K)" fill="#0066ff" radius={[3, 3, 0, 0]} />
                <Bar dataKey="tasks" name="Tasks" fill="#00d4ff" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="ERROR RATE" icon={AlertTriangle}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3366" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff3366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="errors" name="Errors" stroke="#ff3366" strokeWidth={2} fill="url(#errGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="TASK COMPLETION OVER TIME" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d68f" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d68f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tasks" name="Tasks Completed" stroke="#00d68f" strokeWidth={2} fill="url(#taskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </Layout>
  )
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon size={13} color="var(--blue-400)" />
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}
