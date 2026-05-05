import { useAgentStore } from '../store/agentStore'
import { Activity, AlertTriangle, CheckCircle, Play, Save, ArrowRight } from 'lucide-react'

const TYPE_CONFIG = {
  task_start:    { icon: Play,          color: 'var(--blue-400)' },
  task_complete: { icon: CheckCircle,   color: 'var(--green-500)' },
  error:         { icon: AlertTriangle, color: 'var(--red-500)' },
  status_change: { icon: ArrowRight,    color: 'var(--yellow-500)' },
  checkpoint:    { icon: Save,          color: 'var(--purple-500)' },
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return `${Math.floor(diff / 3600000)}h ago`
}

export default function ActivityLog({ limit = 12 }) {
  const activity = useAgentStore((s) => s.activity)
  const entries = activity.slice(0, limit)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Activity size={14} color="var(--blue-400)" />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          ACTIVITY LOG
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 3,
          padding: '1px 6px',
          fontFamily: 'var(--font-mono)',
        }}>
          {activity.length} events
        </span>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 340 }}>
        {entries.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.task_start
          const Icon = cfg.icon
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 16px',
                borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
                <Icon size={11} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {entry.message}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {timeAgo(entry.timestamp)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
