import { useAgentStore } from '../store/agentStore'
import StatusBadge from './StatusBadge'
import {
  TrendingUp, TrendingDown, BookOpen, PenTool,
  Megaphone, Crown, Zap, Target, Users, FileText,
} from 'lucide-react'

function fmt(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

function fmtPnl(n) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(0)}$`
}

// ─── Layout commun ────────────────────────────────────────────────────────────

function Card({ agent, children, metrics }) {
  const toggleAgent = useAgentStore((s) => s.toggleAgent)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${agent.color}`,
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'slide-in 0.3s ease-out',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${agent.color}15`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {agent.name}
            </span>
            <StatusBadge status={agent.status} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {agent.role} · {agent.model}
          </div>
        </div>
        <button
          onClick={() => toggleAgent(agent.id)}
          style={{
            fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
            padding: '4px 8px', borderRadius: 4,
            border: `1px solid ${agent.color}40`,
            background: `${agent.color}12`,
            color: agent.color,
            cursor: 'pointer', letterSpacing: '0.05em',
          }}
        >
          {agent.status === 'active' ? 'PAUSE' : 'START'}
        </button>
      </div>

      {/* Tâche courante */}
      {agent.currentTask && (
        <div style={{
          fontSize: 11, color: agent.color, fontFamily: 'var(--font-mono)',
          background: `${agent.color}08`,
          border: `1px solid ${agent.color}20`,
          borderRadius: 4, padding: '5px 8px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Zap size={10} />
          {agent.currentTask}
        </div>
      )}

      {/* Métriques spécifiques */}
      {children}

      {/* Stats pills */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 6 }}>
          {metrics.map((m) => (
            <StatPill key={m.label} {...m} color={agent.color} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatPill({ icon: Icon, label, value, color, highlight }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '7px 4px',
      background: highlight ? `${color}12` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${highlight ? color + '30' : 'var(--border)'}`,
      borderRadius: 6,
    }}>
      {Icon && <Icon size={11} color={highlight ? color : 'var(--text-muted)'} />}
      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: highlight ? color : 'var(--text-primary)' }}>
        {value}
      </span>
      <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textAlign: 'center' }}>
        {label.toUpperCase()}
      </span>
    </div>
  )
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
      <div style={{
        height: '100%', width: `${Math.min((value / max) * 100, 100)}%`,
        background: color, borderRadius: 2,
        boxShadow: `0 0 6px ${color}80`,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

// ─── Orchestrateur CEO ────────────────────────────────────────────────────────

function OrchestratorCard({ agent }) {
  return (
    <Card agent={agent} metrics={[
      { icon: Crown,  label: 'Décisions',  value: agent.decisionsToday, highlight: true },
      { icon: Target, label: 'Délégués',   value: agent.tasksDelegated },
      { icon: Zap,    label: 'Efficacité', value: `${agent.efficiency}%` },
      { icon: Users,  label: 'Agents',     value: agent.agentsSupervised },
    ]}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="TOKENS UTILISÉS" value={fmt(agent.tokensUsed)} color={agent.color} />
        <MetricBox label="UPTIME" value={`${agent.uptimePct}%`} color={agent.color} bar={agent.uptimePct} />
      </div>
    </Card>
  )
}

// ─── Trader XAUUSD ────────────────────────────────────────────────────────────

function TraderCard({ agent }) {
  const isProfit = agent.pnlToday >= 0
  const pnlColor = isProfit ? 'var(--green-500)' : 'var(--red-500)'
  const PnlIcon = isProfit ? TrendingUp : TrendingDown

  return (
    <Card agent={agent} metrics={[
      { icon: PnlIcon,    label: 'PnL Jour',  value: fmtPnl(agent.pnlToday),   highlight: true },
      { icon: Target,     label: 'Win Rate',   value: `${agent.winRate}%` },
      { icon: TrendingUp, label: 'Trades/J',   value: agent.tradesToday },
      { icon: FileText,   label: 'Total',      value: agent.tradesTotal },
    ]}>
      {/* Prix & position */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>XAUUSD</span>
          <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
            padding: '2px 8px', borderRadius: 3,
            background: agent.position === 'Long' ? 'rgba(0,214,143,0.12)' : 'rgba(255,51,102,0.12)',
            color: agent.position === 'Long' ? 'var(--green-500)' : 'var(--red-500)',
            border: `1px solid ${agent.position === 'Long' ? 'rgba(0,214,143,0.3)' : 'rgba(255,51,102,0.3)'}`,
          }}>
            {agent.position?.toUpperCase() ?? 'FLAT'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <PriceBox label="ENTRÉE"  value={agent.entryPrice?.toFixed(2)} color="var(--text-secondary)" />
          <PriceBox label="ACTUEL"  value={agent.currentPrice?.toFixed(2)} color={pnlColor} bold />
          <PriceBox label="TP"      value={agent.takeProfit?.toFixed(2)} color="var(--green-500)" />
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SL {agent.stopLoss?.toFixed(2)}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DRAWDOWN {agent.drawdown}%</span>
          </div>
          <MiniBar
            value={agent.currentPrice - agent.stopLoss}
            max={agent.takeProfit - agent.stopLoss}
            color="var(--green-500)"
          />
        </div>
      </div>
    </Card>
  )
}

function PriceBox({ label, value, color, bold }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: bold ? 700 : 500, fontFamily: 'var(--font-mono)', color }}>{value}</div>
    </div>
  )
}

// ─── Agent Formation ──────────────────────────────────────────────────────────

function FormationCard({ agent }) {
  return (
    <Card agent={agent} metrics={[
      { icon: BookOpen, label: 'Modules',    value: agent.modulesCreated, highlight: true },
      { icon: FileText, label: 'Pages',      value: agent.totalPages },
      { icon: PenTool,  label: 'Exercices',  value: agent.exercicesCreated },
      { icon: Zap,      label: 'Complétion', value: `${agent.completionRate}%` },
    ]}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="MOTS GÉNÉRÉS" value={fmt(agent.wordsGenerated)} color={agent.color} />
        <MetricBox label="MODULE EN COURS" value={`M${agent.modulesCreated + 1}`} color={agent.color} bar={agent.completionRate} />
      </div>
    </Card>
  )
}

// ─── Agent Contenu ────────────────────────────────────────────────────────────

function ContentCard({ agent }) {
  return (
    <Card agent={agent} metrics={[
      { icon: PenTool,   label: 'Posts',       value: agent.postsCreated, highlight: true },
      { icon: FileText,  label: 'Mots/Jour',   value: fmt(agent.wordsToday) },
      { icon: Zap,       label: 'Engagement',  value: `${agent.engagementRate}%` },
      { icon: Target,    label: 'Schedulés',   value: agent.scheduledPosts },
    ]}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {agent.platforms?.map((p) => (
          <span key={p} style={{
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '2px 8px', borderRadius: 3,
            background: `${agent.color}12`, border: `1px solid ${agent.color}30`,
            color: agent.color,
          }}>{p}</span>
        ))}
      </div>
    </Card>
  )
}

// ─── Agent Marketing ──────────────────────────────────────────────────────────

function MarketingCard({ agent }) {
  return (
    <Card agent={agent} metrics={[
      { icon: Megaphone, label: 'Leads',       value: agent.leadsGenerated, highlight: true },
      { icon: Users,     label: 'Reach',       value: fmt(agent.reach) },
      { icon: Target,    label: 'ROI',         value: `${agent.roi}%` },
      { icon: Zap,       label: 'Campagnes',   value: agent.campaignsActive },
    ]}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricBox label="EMAILS ENVOYÉS" value={fmt(agent.emailsSent)} color={agent.color} />
        <MetricBox label="CONV. RATE" value={`${agent.conversionRate}%`} color={agent.color} bar={agent.conversionRate * 10} />
      </div>
    </Card>
  )
}

// ─── MetricBox helper ─────────────────────────────────────────────────────────

function MetricBox({ label, value, color, bar }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
      borderRadius: 6, padding: '8px 10px',
    }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{value}</div>
      {bar !== undefined && <MiniBar value={bar} max={100} color={color} />}
    </div>
  )
}

// ─── Export principal ─────────────────────────────────────────────────────────

const CARD_MAP = {
  orchestrator: OrchestratorCard,
  trader:       TraderCard,
  formation:    FormationCard,
  content:      ContentCard,
  marketing:    MarketingCard,
}

export default function AgentCard({ agent }) {
  const Component = CARD_MAP[agent.type] ?? Card
  return <Component agent={agent} />
}
