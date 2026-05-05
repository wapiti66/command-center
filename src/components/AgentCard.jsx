import { Cpu, MemoryStick, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useAgentStore } from '../store/agentStore'

function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function formatTokens(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

export default function AgentCard({ agent }) {
  const toggleAgent = useAgentStore((s) => s.toggleAgent)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'default',
        animation: 'slide-in 0.3s ease-out',
        borderLeft: `3px solid ${
          agent.status === 'active' ? 'var(--blue-500)' :
          agent.status === 'error' ? 'var(--red-500)' :
          agent.status === 'pending' ? 'var(--cyan-500)' :
          'var(--border)'
        }`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-blue)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,102,255,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
            }}>
              {agent.name}
            </span>
            <StatusBadge status={agent.status} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {agent.model}
          </div>
        </div>
        <button
          onClick={() => toggleAgent(agent.id)}
          style={{
            fontSize: 10,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid var(--border-blue)',
            background: 'rgba(0,102,255,0.08)',
            color: 'var(--blue-300)',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'background 0.15s',
          }}
        >
          {agent.status === 'active' ? 'PAUSE' : 'START'}
        </button>
      </div>

      {agent.task && (
        <div style={{
          fontSize: 11,
          color: 'var(--cyan-500)',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 4,
          padding: '5px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <Zap size={10} />
          {agent.task}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Metric icon={Cpu} label="CPU" value={`${agent.cpu}%`} bar={agent.cpu} barColor="var(--blue-500)" />
        <Metric icon={MemoryStick} label="MEM" value={`${agent.memory}MB`} bar={(agent.memory / 900) * 100} barColor="var(--cyan-500)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <StatPill icon={Zap} label="Tokens" value={formatTokens(agent.tokens)} />
        <StatPill icon={Clock} label="Uptime" value={formatUptime(agent.uptime)} />
        <StatPill icon={agent.errors > 0 ? AlertCircle : CheckCircle} label="Done" value={agent.tasksCompleted} />
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value, bar, barColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '8px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon size={10} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {value}
        </span>
      </div>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(bar, 100)}%`,
          background: barColor,
          borderRadius: 2,
          transition: 'width 0.5s ease',
          boxShadow: `0 0 6px ${barColor}80`,
        }} />
      </div>
    </div>
  )
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      padding: '6px 4px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: 6,
    }}>
      <Icon size={11} color="var(--text-muted)" />
      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
        {label.toUpperCase()}
      </span>
    </div>
  )
}
