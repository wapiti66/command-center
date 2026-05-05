import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, PenTool, BookOpen, Users } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-blue)',
      borderRadius: 6, padding: '8px 12px', fontSize: 11, fontFamily: 'var(--font-mono)',
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

  const trader    = agents.find((a) => a.type === 'trader')
  const formation = agents.find((a) => a.type === 'formation')
  const content   = agents.find((a) => a.type === 'content')
  const marketing = agents.find((a) => a.type === 'marketing')
  const ceo       = agents.find((a) => a.type === 'orchestrator')

  const agentKpis = [
    { name: 'Trader',     kpi: trader?.pnlToday ?? 0,           label: 'PnL ($)' },
    { name: 'Formation',  kpi: formation?.modulesCreated ?? 0,  label: 'Modules' },
    { name: 'Contenu',    kpi: content?.postsCreated ?? 0,       label: 'Posts' },
    { name: 'Marketing',  kpi: marketing?.leadsGenerated ?? 0,   label: 'Leads' },
    { name: 'CEO',        kpi: ceo?.decisionsToday ?? 0,         label: 'Décisions' },
  ]

  return (
    <Layout title="Analytics" subtitle="PERFORMANCE GLOBALE DU SYSTÈME">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          <KpiCard label="PnL Total XAUUSD"  value={`+${trader?.pnlTotal?.toLocaleString() ?? 0}$`}   color="#00d68f" />
          <KpiCard label="Win Rate"          value={`${trader?.winRate ?? 0}%`}                        color="#00d68f" />
          <KpiCard label="Mots Générés"      value={`${((formation?.wordsGenerated ?? 0) / 1000).toFixed(0)}K`} color="#9b59ff" />
          <KpiCard label="Engagement Moyen"  value={`${content?.engagementRate ?? 0}%`}                color="#00d4ff" />
          <KpiCard label="ROI Marketing"     value={`${marketing?.roi ?? 0}%`}                         color="#ff6b6b" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ChartCard title="PnL XAUUSD 24H ($)" icon={TrendingUp} color="#00d68f">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pnlG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d68f" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00d68f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pnl" name="PnL ($)" stroke="#00d68f" strokeWidth={2} fill="url(#pnlG)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Leads Générés 24H" icon={Users} color="#ff6b6b">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#ff6b6b" strokeWidth={2} fill="url(#leadG)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <ChartCard title="POSTS PUBLIÉS 24H" icon={PenTool} color="#00d4ff">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="posts" name="Posts" fill="#00d4ff" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="KPI PAR AGENT" icon={BookOpen} color="#9b59ff">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agentKpis} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8892a4', fontFamily: 'monospace' }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="kpi" name="KPI" fill="#9b59ff" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </Layout>
  )
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${color}25`,
      borderTop: `2px solid ${color}`,
      borderRadius: 'var(--radius-lg)', padding: '12px 14px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color }}>
        {value}
      </div>
    </div>
  )
}

function ChartCard({ title, icon: Icon, color, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon size={13} color={color} />
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}
