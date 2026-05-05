const CONFIG = {
  active:  { color: 'var(--green-500)',  label: 'ACTIVE',   pulse: true },
  idle:    { color: 'var(--yellow-500)', label: 'IDLE',     pulse: false },
  error:   { color: 'var(--red-500)',    label: 'ERROR',    pulse: true },
  pending: { color: 'var(--blue-400)',   label: 'PENDING',  pulse: true },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = CONFIG[status] ?? CONFIG.idle
  const small = size === 'sm'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: small ? 4 : 6,
      padding: small ? '2px 7px' : '3px 10px',
      background: `${cfg.color}18`,
      border: `1px solid ${cfg.color}35`,
      borderRadius: 4,
      fontSize: small ? 10 : 11,
      fontWeight: 600,
      color: cfg.color,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.06em',
    }}>
      <span style={{
        width: small ? 5 : 6,
        height: small ? 5 : 6,
        borderRadius: '50%',
        background: cfg.color,
        flexShrink: 0,
        animation: cfg.pulse ? 'pulse-dot 2s ease-in-out infinite' : 'none',
      }} />
      {cfg.label}
    </span>
  )
}
