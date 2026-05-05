import { useState } from 'react'
import { Search, Bell, RefreshCw } from 'lucide-react'
import { useAgentStore } from '../store/agentStore'

export default function Header({ title, subtitle }) {
  const [search, setSearch] = useState('')
  const agents = useAgentStore((s) => s.agents)
  const stats = {
    active: agents.filter((a) => a.status === 'active').length,
    idle:   agents.filter((a) => a.status === 'idle').length,
    error:  agents.filter((a) => a.status === 'error').length,
  }

  return (
    <header style={{
      height: 56,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{subtitle}</div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '0 10px',
        gap: 8,
        width: 200,
      }}>
        <Search size={13} color="var(--text-muted)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: 12,
            width: '100%',
            fontFamily: 'var(--font-sans)',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Chip color="var(--green-500)">{stats.active} Active</Chip>
        <Chip color="var(--yellow-500)">{stats.idle} Idle</Chip>
        <Chip color="var(--red-500)">{stats.error} Error</Chip>
      </div>

      <button
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'border-color 0.15s',
        }}
        onClick={() => window.location.reload()}
        title="Refresh"
      >
        <RefreshCw size={13} />
      </button>

      <button
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          position: 'relative',
        }}
        title="Notifications"
      >
        <Bell size={13} />
        {stats.error > 0 && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--red-500)',
          }} />
        )}
      </button>
    </header>
  )
}

function Chip({ children, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      color,
      fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: color,
        animation: 'pulse-dot 2s ease-in-out infinite',
        display: 'inline-block',
      }} />
      {children}
    </div>
  )
}
