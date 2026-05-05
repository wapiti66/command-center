import { useEffect, useState } from 'react'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import AgentCard from '../components/AgentCard'
import StatusBadge from '../components/StatusBadge'
import { Bot, Filter, Cpu, MemoryStick, Zap, AlertCircle } from 'lucide-react'

const FILTERS = ['all', 'active', 'idle', 'error', 'pending']

export default function Agents() {
  const agents = useAgentStore((s) => s.agents)
  const updateAgents = useAgentStore((s) => s.updateAgents)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const interval = setInterval(updateAgents, 2000)
    return () => clearInterval(interval)
  }, [updateAgents])

  const filtered = filter === 'all' ? agents : agents.filter((a) => a.status === filter)

  return (
    <Layout title="Agents" subtitle="FLEET MANAGEMENT">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={13} color="var(--text-muted)" />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FILTER:</span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 12px',
                borderRadius: 4,
                border: `1px solid ${filter === f ? 'var(--blue-500)' : 'var(--border)'}`,
                background: filter === f ? 'rgba(0,102,255,0.15)' : 'transparent',
                color: filter === f ? 'var(--blue-300)' : 'var(--text-muted)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filtered.length} agents
          </span>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['AGENT', 'STATUS', 'MODEL', 'CPU', 'MEMORY', 'TOKENS', 'TASKS', 'LATENCY'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((agent, i) => (
                <tr
                  key={agent.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {agent.name}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <StatusBadge status={agent.status} />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {agent.model}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <BarCell value={agent.cpu} max={100} unit="%" color="var(--blue-500)" />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <BarCell value={agent.memory} max={900} unit="MB" color="var(--cyan-500)" />
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {(agent.tokens / 1000).toFixed(0)}K
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green-500)' }}>
                      {agent.tasksCompleted}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: agent.latency > 400 ? 'var(--red-500)' : agent.latency > 200 ? 'var(--yellow-500)' : 'var(--green-500)',
                    }}>
                      {agent.latency}ms
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}>
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

function BarCell({ value, max, unit, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 50,
        height: 4,
        background: 'var(--border)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
          boxShadow: `0 0 4px ${color}80`,
        }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {value}{unit}
      </span>
    </div>
  )
}
