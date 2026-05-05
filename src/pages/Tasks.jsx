import { useState } from 'react'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import { CheckSquare, Clock, AlertTriangle, Play, Plus } from 'lucide-react'

const MOCK_TASKS = [
  { id: 1, name: 'Data ingestion pipeline', agent: 'Alpha-7', status: 'running', progress: 67, priority: 'high', eta: '8m' },
  { id: 2, name: 'Model inference batch', agent: 'Bravo-3', status: 'running', progress: 45, priority: 'high', eta: '15m' },
  { id: 3, name: 'Log aggregation sweep', agent: 'Charlie-1', status: 'completed', progress: 100, priority: 'normal', eta: '-' },
  { id: 4, name: 'Anomaly detection scan', agent: 'Delta-9', status: 'running', progress: 23, priority: 'high', eta: '32m' },
  { id: 5, name: 'Cache warming', agent: 'Echo-5', status: 'completed', progress: 100, priority: 'low', eta: '-' },
  { id: 6, name: 'Report generation Q2', agent: 'Foxtrot-2', status: 'queued', progress: 0, priority: 'normal', eta: 'pending' },
  { id: 7, name: 'Security audit sweep', agent: 'Golf-6', status: 'failed', progress: 34, priority: 'critical', eta: '-' },
  { id: 8, name: 'Embedding computation', agent: 'Hotel-4', status: 'running', progress: 88, priority: 'normal', eta: '2m' },
  { id: 9, name: 'Vector indexing update', agent: 'Alpha-7', status: 'queued', progress: 0, priority: 'low', eta: 'pending' },
  { id: 10, name: 'DB optimization pass', agent: 'Bravo-3', status: 'queued', progress: 0, priority: 'normal', eta: 'pending' },
]

const STATUS_COLOR = {
  running:   'var(--blue-400)',
  completed: 'var(--green-500)',
  queued:    'var(--text-muted)',
  failed:    'var(--red-500)',
}

const PRIORITY_COLOR = {
  critical: 'var(--red-500)',
  high:     'var(--yellow-500)',
  normal:   'var(--blue-400)',
  low:      'var(--text-muted)',
}

export default function Tasks() {
  const [filter, setFilter] = useState('all')
  const tasks = filter === 'all' ? MOCK_TASKS : MOCK_TASKS.filter((t) => t.status === filter)

  const counts = {
    running: MOCK_TASKS.filter((t) => t.status === 'running').length,
    completed: MOCK_TASKS.filter((t) => t.status === 'completed').length,
    failed: MOCK_TASKS.filter((t) => t.status === 'failed').length,
    queued: MOCK_TASKS.filter((t) => t.status === 'queued').length,
  }

  return (
    <Layout title="Tasks" subtitle="TASK QUEUE">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <SummaryCard label="Running" value={counts.running} icon={Play} color="var(--blue-400)" />
          <SummaryCard label="Completed" value={counts.completed} icon={CheckSquare} color="var(--green-500)" />
          <SummaryCard label="Queued" value={counts.queued} icon={Clock} color="var(--text-secondary)" />
          <SummaryCard label="Failed" value={counts.failed} icon={AlertTriangle} color="var(--red-500)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['all', 'running', 'completed', 'queued', 'failed'].map((f) => (
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
          <button style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 4,
            border: '1px solid var(--blue-600)',
            background: 'rgba(0,102,255,0.12)',
            color: 'var(--blue-300)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            <Plus size={11} />
            NEW TASK
          </button>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {tasks.map((task, i) => (
            <div
              key={task.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 140px 80px 60px',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {task.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  → {task.agent}
                </div>
              </div>

              <div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: PRIORITY_COLOR[task.priority],
                  background: `${PRIORITY_COLOR[task.priority]}15`,
                  border: `1px solid ${PRIORITY_COLOR[task.priority]}30`,
                  borderRadius: 3,
                  padding: '2px 6px',
                  letterSpacing: '0.06em',
                }}>
                  {task.priority.toUpperCase()}
                </span>
              </div>

              <div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: STATUS_COLOR[task.status],
                  background: `${STATUS_COLOR[task.status]}15`,
                  border: `1px solid ${STATUS_COLOR[task.status]}30`,
                  borderRadius: 3,
                  padding: '2px 6px',
                  letterSpacing: '0.06em',
                }}>
                  {task.status.toUpperCase()}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: 1,
                    height: 4,
                    background: 'var(--border)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${task.progress}%`,
                      background: task.status === 'failed' ? 'var(--red-500)' :
                                  task.status === 'completed' ? 'var(--green-500)' :
                                  'var(--blue-500)',
                      borderRadius: 2,
                      boxShadow: task.status === 'running' ? '0 0 6px rgba(0,102,255,0.5)' : 'none',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {task.progress}%
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textAlign: 'right' }}>
                {task.eta}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: 3,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}>
                  {task.status === 'running' ? 'STOP' : 'RUN'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: `${color}15`,
        border: `1px solid ${color}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {label}
        </div>
      </div>
    </div>
  )
}
