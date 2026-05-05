import { useEffect } from 'react'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import AgentCard from '../components/AgentCard'
import { Crown, TrendingUp, BookOpen, PenTool, Megaphone } from 'lucide-react'

const TYPE_ICON = {
  orchestrator: Crown,
  trader:       TrendingUp,
  formation:    BookOpen,
  content:      PenTool,
  marketing:    Megaphone,
}

function AgentRow({ agent }) {
  const Icon = TYPE_ICON[agent.type] ?? Crown

  const primaryMetric = () => {
    switch (agent.type) {
      case 'trader':       return { label: 'PnL Jour', value: `${agent.pnlToday >= 0 ? '+' : ''}${agent.pnlToday?.toFixed(0)}$`, color: agent.pnlToday >= 0 ? 'var(--green-500)' : 'var(--red-500)' }
      case 'formation':    return { label: 'Modules',  value: agent.modulesCreated,   color: agent.color }
      case 'content':      return { label: 'Posts',    value: agent.postsCreated,      color: agent.color }
      case 'marketing':    return { label: 'Leads',    value: agent.leadsGenerated,    color: agent.color }
      case 'orchestrator': return { label: 'Décisions',value: agent.decisionsToday,    color: agent.color }
      default: return { label: '-', value: '-', color: 'var(--text-muted)' }
    }
  }

  const secondary = () => {
    switch (agent.type) {
      case 'trader':       return `Win rate ${agent.winRate}% · ${agent.tradesToday} trades/j`
      case 'formation':    return `${agent.totalPages} pages · ${(agent.wordsGenerated / 1000).toFixed(0)}K mots`
      case 'content':      return `${(agent.wordsToday / 1000).toFixed(1)}K mots/j · ${agent.engagementRate}% engagement`
      case 'marketing':    return `ROI ${agent.roi}% · ${agent.campaignsActive} campagnes`
      case 'orchestrator': return `${agent.tasksDelegated} délégués · ${agent.efficiency}% efficacité`
      default: return ''
    }
  }

  const pm = primaryMetric()

  return (
    <tr
      style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: `${agent.color}15`, border: `1px solid ${agent.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} color={agent.color} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {agent.role}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          padding: '2px 8px', borderRadius: 3,
          background: 'rgba(100,100,100,0.1)',
          color: 'var(--text-secondary)', border: '1px solid var(--border)',
        }}>
          {agent.model}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 8px', borderRadius: 4,
          background: `${agent.status === 'active' ? 'rgba(0,214,143,0.12)' : 'rgba(100,100,100,0.1)'}`,
          border: `1px solid ${agent.status === 'active' ? 'rgba(0,214,143,0.3)' : 'var(--border)'}`,
          color: agent.status === 'active' ? 'var(--green-500)' : 'var(--text-muted)',
          fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: agent.status === 'active' ? 'var(--green-500)' : 'var(--text-muted)',
            animation: agent.status === 'active' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          }} />
          {agent.status.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: pm.color }}>
          {pm.value}
        </span>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{pm.label}</div>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {secondary()}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{
          fontSize: 11, color: agent.color, fontFamily: 'var(--font-mono)',
          maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {agent.currentTask ?? agent.currentDirective ?? '—'}
        </div>
      </td>
    </tr>
  )
}

export default function Agents() {
  const agents = useAgentStore((s) => s.agents)
  const updateAgents = useAgentStore((s) => s.updateAgents)

  useEffect(() => {
    const interval = setInterval(updateAgents, 2000)
    return () => clearInterval(interval)
  }, [updateAgents])

  return (
    <Layout title="Agents" subtitle="GESTION DE LA FLOTTE">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Table */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['AGENT', 'MODÈLE', 'STATUT', 'KPI PRINCIPAL', 'MÉTRIQUES', 'TÂCHE EN COURS'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => <AgentRow key={agent.id} agent={agent} />)}
            </tbody>
          </table>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>
    </Layout>
  )
}
