import { useState } from 'react'
import Layout from '../components/Layout'
import { CheckSquare, Clock, AlertTriangle, Play, Plus, Crown, TrendingUp, BookOpen, PenTool, Megaphone } from 'lucide-react'

const AGENT_COLORS = {
  'Orchestrateur CEO':   '#ffd700',
  'Agent Trader XAUUSD': '#00d68f',
  'Agent Formation':     '#9b59ff',
  'Agent Contenu':       '#00d4ff',
  'Agent Marketing':     '#ff6b6b',
}

const AGENT_ICONS = {
  'Orchestrateur CEO':   Crown,
  'Agent Trader XAUUSD': TrendingUp,
  'Agent Formation':     BookOpen,
  'Agent Contenu':       PenTool,
  'Agent Marketing':     Megaphone,
}

const TASKS = [
  { id: 1,  name: 'Analyse signal H4 XAUUSD',                    agent: 'Agent Trader XAUUSD', status: 'running',   progress: 72,  priority: 'critical', eta: '3m' },
  { id: 2,  name: 'Rédaction exercices Module 4 — Risk Mgmt',     agent: 'Agent Formation',     status: 'running',   progress: 45,  priority: 'high',     eta: '20m' },
  { id: 3,  name: 'Thread Twitter analyse XAUUSD semaine',        agent: 'Agent Contenu',       status: 'running',   progress: 88,  priority: 'high',     eta: '2m' },
  { id: 4,  name: 'Supervision pipeline quotidien',               agent: 'Orchestrateur CEO',   status: 'running',   progress: 60,  priority: 'high',     eta: 'continu' },
  { id: 5,  name: 'Module 3 formation — Psychology du Trading',   agent: 'Agent Formation',     status: 'completed', progress: 100, priority: 'high',     eta: '-' },
  { id: 6,  name: 'Campagne email — liste formation Q2',          agent: 'Agent Marketing',     status: 'completed', progress: 100, priority: 'normal',   eta: '-' },
  { id: 7,  name: 'Post LinkedIn — "IA et trading de l\'or"',    agent: 'Agent Contenu',       status: 'completed', progress: 100, priority: 'normal',   eta: '-' },
  { id: 8,  name: 'Stratégie contenu Mai 2026',                   agent: 'Agent Marketing',     status: 'queued',    progress: 0,   priority: 'normal',   eta: 'pending' },
  { id: 9,  name: 'Module 5 formation — Analyse Technique',       agent: 'Agent Formation',     status: 'queued',    progress: 0,   priority: 'normal',   eta: 'pending' },
  { id: 10, name: 'Rapport hebdomadaire performance agents',       agent: 'Orchestrateur CEO',   status: 'queued',    progress: 0,   priority: 'high',     eta: 'pending' },
  { id: 11, name: 'Backtest stratégie scalping M5',               agent: 'Agent Trader XAUUSD', status: 'failed',    progress: 28,  priority: 'normal',   eta: '-' },
  { id: 12, name: 'Calendrier contenu Juin 2026',                 agent: 'Agent Contenu',       status: 'queued',    progress: 0,   priority: 'low',      eta: 'pending' },
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
  const tasks = filter === 'all' ? TASKS : TASKS.filter((t) => t.status === filter)

  const counts = {
    running:   TASKS.filter((t) => t.status === 'running').length,
    completed: TASKS.filter((t) => t.status === 'completed').length,
    failed:    TASKS.filter((t) => t.status === 'failed').length,
    queued:    TASKS.filter((t) => t.status === 'queued').length,
  }

  return (
    <Layout title="Tâches" subtitle="FILE D'ATTENTE DES AGENTS">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <SummaryCard label="En cours"  value={counts.running}   icon={Play}          color="var(--blue-400)" />
          <SummaryCard label="Terminées" value={counts.completed} icon={CheckSquare}   color="var(--green-500)" />
          <SummaryCard label="En attente"value={counts.queued}    icon={Clock}         color="var(--text-secondary)" />
          <SummaryCard label="Échouées"  value={counts.failed}    icon={AlertTriangle} color="var(--red-500)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['all', 'running', 'completed', 'queued', 'failed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '4px 12px', borderRadius: 4,
              border: `1px solid ${filter === f ? 'var(--blue-500)' : 'var(--border)'}`,
              background: filter === f ? 'rgba(0,102,255,0.15)' : 'transparent',
              color: filter === f ? 'var(--blue-300)' : 'var(--text-muted)',
              fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.15s',
            }}>
              {f === 'all' ? 'TOUTES' : f === 'running' ? 'EN COURS' : f === 'completed' ? 'TERMINÉES' : f === 'queued' ? 'EN ATTENTE' : 'ÉCHOUÉES'}
            </button>
          ))}
          <button style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 4,
            border: '1px solid var(--blue-600)', background: 'rgba(0,102,255,0.12)',
            color: 'var(--blue-300)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
          }}>
            <Plus size={11} /> NOUVELLE TÂCHE
          </button>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {tasks.map((task, i) => {
            const AgentIcon = AGENT_ICONS[task.agent] ?? Crown
            const agentColor = AGENT_COLORS[task.agent] ?? 'var(--blue-400)'
            return (
              <div key={task.id} style={{
                display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 160px 70px 60px',
                alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {task.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <AgentIcon size={10} color={agentColor} />
                    <span style={{ fontSize: 10, color: agentColor, fontFamily: 'var(--font-mono)' }}>
                      {task.agent}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: PRIORITY_COLOR[task.priority],
                  background: `${PRIORITY_COLOR[task.priority]}15`,
                  border: `1px solid ${PRIORITY_COLOR[task.priority]}30`,
                  borderRadius: 3, padding: '2px 6px', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>
                  {task.priority === 'critical' ? 'CRITIQUE' : task.priority === 'high' ? 'HAUTE' : task.priority === 'normal' ? 'NORMALE' : 'BASSE'}
                </span>

                <span style={{
                  fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: STATUS_COLOR[task.status],
                  background: `${STATUS_COLOR[task.status]}15`,
                  border: `1px solid ${STATUS_COLOR[task.status]}30`,
                  borderRadius: 3, padding: '2px 6px', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>
                  {task.status === 'running' ? 'EN COURS' : task.status === 'completed' ? 'TERMINÉ' : task.status === 'queued' ? 'EN ATTENTE' : 'ÉCHOUÉ'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${task.progress}%`,
                      background: task.status === 'failed' ? 'var(--red-500)' : task.status === 'completed' ? 'var(--green-500)' : agentColor,
                      borderRadius: 2,
                      boxShadow: task.status === 'running' ? `0 0 6px ${agentColor}80` : 'none',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {task.progress}%
                  </span>
                </div>

                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textAlign: 'right' }}>
                  {task.eta}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    padding: '3px 8px', borderRadius: 3,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-muted)', cursor: 'pointer',
                  }}>
                    {task.status === 'running' ? 'STOP' : 'RUN'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
      </div>
    </div>
  )
}
