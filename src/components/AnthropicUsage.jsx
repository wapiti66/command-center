import { useAnthropicUsage } from '../hooks/useAnthropicUsage'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import { Zap, DollarSign, RefreshCw, ExternalLink, AlertTriangle, Key } from 'lucide-react'

function fmt(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

function fmtCost(cents) {
  if (cents === 0) return '$0.00'
  if (cents < 1) return `$${(cents / 100).toFixed(4)}`
  return `$${(cents / 100).toFixed(2)}`
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
        <div key={p.name} style={{ color: p.color ?? 'var(--blue-300)' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error, refresh }) {
  const isKeyMissing = error === 'CLE_INVALIDE' || error === 'PAS_ADMIN' || error?.includes('401') || error?.includes('403')

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 24,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      textAlign: 'center',
    }}>
      {isKeyMissing ? <Key size={28} color="var(--yellow-500)" /> : <AlertTriangle size={28} color="var(--red-500)" />}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          {isKeyMissing ? 'Clé Admin Anthropic requise' : 'Erreur de connexion'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', maxWidth: 340 }}>
          {isKeyMissing
            ? 'Crée une clé Admin sur console.anthropic.com/settings/admin-keys puis ajoute-la dans le fichier .env à la racine du projet.'
            : `Erreur : ${error}. Vérifie ta connexion et ta clé Admin.`}
        </div>
      </div>
      {isKeyMissing && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '10px 14px', fontFamily: 'var(--font-mono)',
          fontSize: 11, color: 'var(--cyan-500)', textAlign: 'left',
        }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}># .env (à la racine du projet)</div>
          ANTHROPIC_ADMIN_KEY=sk-ant-admin-...
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href="https://console.anthropic.com/settings/admin-keys"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 4,
            border: '1px solid var(--blue-600)', background: 'rgba(0,102,255,0.12)',
            color: 'var(--blue-300)', fontSize: 11, fontFamily: 'var(--font-mono)',
            textDecoration: 'none', fontWeight: 600,
          }}
        >
          <ExternalLink size={11} /> Console Anthropic
        </a>
        <button
          onClick={refresh}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 4,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={11} /> Réessayer
        </button>
      </div>
    </div>
  )
}

export default function AnthropicUsage() {
  const {
    loading, error, refresh,
    totalInputTokens, totalOutputTokens, totalCacheRead,
    costTodayCents, byModel, byHour, lastUpdated,
  } = useAnthropicUsage(60000)

  const totalTokens = totalInputTokens + totalOutputTokens + totalCacheRead

  if (error) return (
    <div>
      <SectionHeader lastUpdated={lastUpdated} refresh={refresh} loading={loading} />
      <ErrorState error={error} refresh={refresh} />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader lastUpdated={lastUpdated} refresh={refresh} loading={loading} />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <UsageStat
          icon={Zap} label="Tokens Aujourd'hui"
          value={loading ? '...' : fmt(totalTokens)}
          sub="input + output + cache"
          color="var(--blue-400)"
        />
        <UsageStat
          icon={Zap} label="Input Tokens"
          value={loading ? '...' : fmt(totalInputTokens)}
          sub={`Cache hit: ${fmt(totalCacheRead)}`}
          color="var(--cyan-500)"
        />
        <UsageStat
          icon={Zap} label="Output Tokens"
          value={loading ? '...' : fmt(totalOutputTokens)}
          sub="tokens générés"
          color="var(--purple-500)"
        />
        <UsageStat
          icon={DollarSign} label="Coût Aujourd'hui"
          value={loading ? '...' : fmtCost(costTodayCents)}
          sub={
            <a
              href="https://console.anthropic.com/settings/billing"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--blue-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
            >
              Voir solde <ExternalLink size={9} />
            </a>
          }
          color="var(--green-500)"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Consommation par heure */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 12 }}>
            TOKENS / HEURE (AUJOURD'HUI)
          </div>
          {loading || byHour.length === 0 ? (
            <Placeholder />
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={byHour} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokHourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0066ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tokens" name="Tokens" stroke="#0066ff" strokeWidth={2} fill="url(#tokHourGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Consommation par modèle */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 12 }}>
            CONSOMMATION PAR MODÈLE
          </div>
          {loading || byModel.length === 0 ? (
            <Placeholder />
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={byModel} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="#131c30" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#3d4a5c', fontFamily: 'monospace' }} tickFormatter={(v) => fmt(v)} />
                <YAxis type="category" dataKey="model" tick={{ fontSize: 9, fill: '#8892a4', fontFamily: 'monospace' }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="input"     name="Input"      fill="#0066ff" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="output"    name="Output"     fill="#00d4ff" stackId="a" />
                <Bar dataKey="cacheRead" name="Cache Read" fill="#9b59ff" stackId="a" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Détail par modèle */}
      {!loading && byModel.length > 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['MODÈLE', 'INPUT', 'OUTPUT', 'CACHE READ', 'TOTAL', 'COÛT'].map((h) => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byModel.map((row, i) => (
                <tr key={row.model} style={{
                  borderBottom: i < byModel.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{row.model}</td>
                  <td style={{ padding: '8px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#0066ff' }}>{fmt(row.input)}</td>
                  <td style={{ padding: '8px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#00d4ff' }}>{fmt(row.output)}</td>
                  <td style={{ padding: '8px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#9b59ff' }}>{fmt(row.cacheRead)}</td>
                  <td style={{ padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>{fmt(row.total)}</td>
                  <td style={{ padding: '8px 14px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--green-500)', fontWeight: 700 }}>{fmtCost(row.costCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SectionHeader({ lastUpdated, refresh, loading }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{
        width: 20, height: 20, borderRadius: 4,
        background: 'rgba(255,97,0,0.15)', border: '1px solid rgba(255,97,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11 }}>🔶</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        CONSOMMATION ANTHROPIC API
      </span>
      {lastUpdated && (
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          màj {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      )}
      <button
        onClick={refresh}
        disabled={loading}
        style={{
          marginLeft: 'auto',
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 8px', borderRadius: 4,
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)',
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.5 : 1,
        }}
      >
        <RefreshCw size={10} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        ACTUALISER
      </button>
    </div>
  )
}

function UsageStat({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderTop: `2px solid ${color}`,
      borderRadius: 'var(--radius-lg)', padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {label.toUpperCase()}
        </span>
        <Icon size={13} color={color} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {sub}
      </div>
    </div>
  )
}

function Placeholder() {
  return (
    <div style={{
      height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)',
    }}>
      Aucune donnée pour aujourd'hui
    </div>
  )
}
