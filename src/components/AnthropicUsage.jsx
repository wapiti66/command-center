import { useAgentStore } from '../store/agentStore'
import { MODEL_PRICING, calcCost } from '../hooks/useAnthropicUsage'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts'
import { Zap, DollarSign, ExternalLink, TrendingUp, Info } from 'lucide-react'

function fmt(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

function fmtCost(usd) {
  if (usd === 0) return '$0.000'
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(3)}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-blue)',
      borderRadius: 6, padding: '8px 12px', fontSize: 11, fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.fill ?? 'var(--blue-300)' }}>
          {p.name}: {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

export default function AnthropicUsage() {
  const agents = useAgentStore((s) => s.agents)

  // Calcul par agent
  const agentData = agents.map((a) => {
    const cost = calcCost(a.modelId, a.tokensInput ?? 0, a.tokensOutput ?? 0)
    const pricing = MODEL_PRICING[a.modelId]
    return {
      name:        a.name.replace('Agent ', '').replace('Orchestrateur ', ''),
      fullName:    a.name,
      model:       a.model,
      modelId:     a.modelId,
      color:       a.color,
      tokensInput:  a.tokensInput ?? 0,
      tokensOutput: a.tokensOutput ?? 0,
      total:        (a.tokensInput ?? 0) + (a.tokensOutput ?? 0),
      cost,
      provider:    pricing?.provider ?? 'Anthropic',
    }
  }).sort((a, b) => b.cost - a.cost)

  // Agrégation par modèle
  const byModel = Object.values(
    agentData.reduce((acc, a) => {
      if (!acc[a.modelId]) {
        acc[a.modelId] = {
          model: a.model, modelId: a.modelId,
          color: MODEL_PRICING[a.modelId]?.color ?? '#0066ff',
          provider: a.provider,
          tokensInput: 0, tokensOutput: 0, total: 0, cost: 0,
        }
      }
      acc[a.modelId].tokensInput  += a.tokensInput
      acc[a.modelId].tokensOutput += a.tokensOutput
      acc[a.modelId].total        += a.total
      acc[a.modelId].cost         += a.cost
      return acc
    }, {})
  ).sort((a, b) => b.cost - a.cost)

  const totalTokens = agentData.reduce((s, a) => s + a.total, 0)
  const totalInput  = agentData.reduce((s, a) => s + a.tokensInput, 0)
  const totalOutput = agentData.reduce((s, a) => s + a.tokensOutput, 0)
  const totalCost   = agentData.reduce((s, a) => s + a.cost, 0)
  const anthropicCost = agentData.filter((a) => a.provider === 'Anthropic').reduce((s, a) => s + a.cost, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
          background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
        }}>
          🔶
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          CONSOMMATION TOKENS & COÛTS API
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6,
          padding: '2px 8px', borderRadius: 3,
          background: 'rgba(255,170,0,0.1)', border: '1px solid rgba(255,170,0,0.25)',
        }}>
          <Info size={10} color="var(--yellow-500)" />
          <span style={{ fontSize: 10, color: 'var(--yellow-500)', fontFamily: 'var(--font-mono)' }}>
            Estimation basée sur les prix publics
          </span>
        </div>
        <a
          href="https://console.anthropic.com/settings/billing"
          target="_blank"
          rel="noreferrer"
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 4,
            border: '1px solid var(--border-blue)', background: 'rgba(0,102,255,0.1)',
            color: 'var(--blue-300)', fontSize: 10, fontFamily: 'var(--font-mono)',
            textDecoration: 'none', fontWeight: 600,
          }}
        >
          <ExternalLink size={10} /> Voir solde réel
        </a>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KpiCard icon={Zap}        label="Total Tokens"    value={fmt(totalTokens)}   sub={`${fmt(totalInput)} in · ${fmt(totalOutput)} out`} color="var(--blue-400)" />
        <KpiCard icon={DollarSign} label="Coût Estimé Total" value={fmtCost(totalCost)}  sub="tous modèles" color="var(--green-500)" />
        <KpiCard icon={DollarSign} label="Coût Anthropic"   value={fmtCost(anthropicCost)} sub="Claude Opus + Sonnet" color="#ffd700" />
        <KpiCard icon={TrendingUp} label="Modèle + Coûteux" value={byModel[0]?.model ?? '-'} sub={fmtCost(byModel[0]?.cost ?? 0)} color={byModel[0]?.color ?? 'var(--blue-400)'} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Tokens par agent */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 12 }}>
            TOKENS PAR AGENT
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={agentData} layout="vertical" margin={{ top: 0, right: 50, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8892a4', fontFamily: 'monospace' }} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokensInput" name="Input" stackId="a" radius={[0,0,0,0]}>
                {agentData.map((a) => <Cell key={a.name} fill={a.color} fillOpacity={0.9} />)}
              </Bar>
              <Bar dataKey="tokensOutput" name="Output" stackId="a" radius={[0,3,3,0]}>
                {agentData.map((a) => <Cell key={a.name} fill={a.color} fillOpacity={0.45} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Coût par agent */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 12 }}>
            COÛT ESTIMÉ PAR AGENT ($)
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={agentData} layout="vertical" margin={{ top: 0, right: 50, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#8892a4', fontFamily: 'monospace' }} width={65} />
              <Tooltip formatter={(v) => fmtCost(v)} content={<CustomTooltip />} />
              <Bar dataKey="cost" name="Coût ($)" radius={[0,3,3,0]}>
                {agentData.map((a) => <Cell key={a.name} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table détail */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['AGENT', 'MODÈLE', 'PROVIDER', 'INPUT', 'OUTPUT', 'TOTAL', 'PRIX/MTok', 'COÛT ESTIMÉ'].map((h) => (
                <th key={h} style={{
                  padding: '8px 14px', textAlign: 'left',
                  fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agentData.map((row, i) => {
              const pricing = MODEL_PRICING[row.modelId]
              return (
                <tr key={row.fullName} style={{
                  borderBottom: i < agentData.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '9px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {row.fullName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.model}</td>
                  <td style={{ padding: '9px 14px' }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                      padding: '2px 6px', borderRadius: 3,
                      background: row.provider === 'Anthropic' ? 'rgba(255,140,0,0.1)' : 'rgba(0,214,143,0.1)',
                      border: `1px solid ${row.provider === 'Anthropic' ? 'rgba(255,140,0,0.3)' : 'rgba(0,214,143,0.3)'}`,
                      color: row.provider === 'Anthropic' ? '#ff8c00' : 'var(--green-500)',
                    }}>
                      {row.provider}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--blue-300)' }}>{fmt(row.tokensInput)}</td>
                  <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan-500)' }}>{fmt(row.tokensOutput)}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{fmt(row.total)}</td>
                  <td style={{ padding: '9px 14px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ${pricing?.input}/M · ${pricing?.output}/M
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--green-500)', fontWeight: 700 }}>
                    {fmtCost(row.cost)}
                  </td>
                </tr>
              )
            })}
            {/* Total row */}
            <tr style={{ borderTop: '1px solid var(--border-blue)', background: 'rgba(0,102,255,0.04)' }}>
              <td colSpan={3} style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</td>
              <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--blue-300)', fontWeight: 700 }}>{fmt(totalInput)}</td>
              <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan-500)', fontWeight: 700 }}>{fmt(totalOutput)}</td>
              <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>{fmt(totalTokens)}</td>
              <td />
              <td style={{ padding: '9px 14px', fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--green-500)', fontWeight: 800 }}>{fmtCost(totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderTop: `2px solid ${color}`,
      borderRadius: 'var(--radius-lg)', padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.06em' }}>
          {label.toUpperCase()}
        </span>
        <Icon size={13} color={color} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sub}</div>
    </div>
  )
}
