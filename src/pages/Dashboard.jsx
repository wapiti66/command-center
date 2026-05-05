import { useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import AgentCard from '../components/AgentCard'
import ActivityLog from '../components/ActivityLog'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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

export default function Dashboard() {
  const agents = useAgentStore((s) => s.agents)
  const metrics = useAgentStore((s) => s.metrics)
  const updateAgents = useAgentStore((s) => s.updateAgents)
  const addActivity = useAgentStore((s) => s.addActivity)

  const trader = agents.find((a) => a.type === 'trader')
  const content = agents.find((a) => a.type === 'content')
  const formation = agents.find((a) => a.type === 'formation')
  const marketing = agents.find((a) => a.type === 'marketing')

  const stats = {
    active: agents.filter((a) => a.status === 'active').length,
    pnlToday: trader?.pnlToday ?? 0,
    postsCreated: content?.postsCreated ?? 0,
    modulesCreated: formation?.modulesCreated ?? 0,
    leadsGenerated: marketing?.leadsGenerated ?? 0,
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateAgents()
      if (Math.random() > 0.65) addActivity()
    }, 2000)
    return () => clearInterval(interval)
  }, [updateAgents, addActivity])

  const isPnlPositive = stats.pnlToday >= 0

  const STAT_CARDS = [
    {
      icon: TrendingUp,
      label: 'PnL XAUUSD Jour',
      value: `${isPnlPositive ? '+' : ''}${stats.pnlToday.toFixed(0)}$`,
      sub: `Win rate ${trader?.winRate ?? 0}% · ${trader?.tradesToday ?? 0} trades`,
      color: isPnlPositive ? '#00d68f' : '#ff3366',
    },
    {
      icon: PenTool,
      label: 'Posts Publiés',
      value: stats.postsCreated,
      sub: `${content?.wordsToday?.toLocaleString() ?? 0} mots aujourd'hui`,
      color: '#00d4ff',
    },
    {
      icon: BookOpen,
      label: 'Modules Formation',
      value: stats.modulesCreated,
      sub: `${formation?.totalPages ?? 0} pages · ${formation?.exercicesCreated ?? 0} exercices`,
      color: '#9b59ff',
    },
    {
      icon: Users,
      label: 'Leads Générés',
      value: stats.leadsGenerated,
      sub: `ROI ${marketing?.roi ?? 0}% · ${marketing?.campaignsActive ?? 0} campagnes actives`,
      color: '#ff6b6b',
    },
  ]

  return (
    <Layout title="Dashboard" subtitle="COMMAND CENTER — SYSTÈME MULTI-AGENTS">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Graphique + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} color="#00d68f" />
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                PnL XAUUSD 24H
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)',
                color: isPnlPositive ? '#00d68f' : '#ff3366', fontWeight: 700,
              }}>
                {isPnlPositive ? '+' : ''}{stats.pnlToday.toFixed(0)}$ aujourd'hui
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={metrics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d68f" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00d68f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pnl" name="PnL ($)" stroke="#00d68f" strokeWidth={2} fill="url(#pnlGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <ActivityLog limit={8} />
        </div>

        {/* Agents fleet */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              AGENTS ACTIFS
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-mono)',
              padding: '2px 8px', borderRadius: 3,
              background: 'rgba(0,214,143,0.12)', border: '1px solid rgba(0,214,143,0.3)',
              color: '#00d68f',
            }}>
              {stats.active}/{agents.length} en ligne
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          {label.toUpperCase()}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: `${color}15`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {sub}
      </div>
    </div>
  )
}
