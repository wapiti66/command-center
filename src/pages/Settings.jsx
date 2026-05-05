import Layout from '../components/Layout'
import { Settings as SettingsIcon, Sliders, Bell, Shield, Palette } from 'lucide-react'

function Section({ title, icon: Icon, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <Icon size={13} color="var(--blue-400)" />
        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '8px 0' }}>{children}</div>
    </div>
  )
}

function Row({ label, description, children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ defaultChecked = false }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <input type="checkbox" defaultChecked={defaultChecked} style={{ display: 'none' }} />
      <div style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: defaultChecked ? 'var(--blue-600)' : 'var(--border)',
        position: 'relative',
        transition: 'background 0.2s',
        boxShadow: defaultChecked ? '0 0 8px rgba(0,102,255,0.3)' : 'none',
      }}>
        <div style={{
          position: 'absolute',
          top: 3,
          left: defaultChecked ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>
    </label>
  )
}

function Select({ options, defaultValue }) {
  return (
    <select
      defaultValue={defaultValue}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        color: 'var(--text-primary)',
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        padding: '4px 8px',
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function Settings() {
  return (
    <Layout title="Settings" subtitle="CONFIGURATION">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>

        <Section title="GENERAL" icon={Sliders}>
          <Row label="Auto-refresh interval" description="How often to update agent metrics">
            <Select options={['1s', '2s', '5s', '10s', '30s']} defaultValue="2s" />
          </Row>
          <Row label="Default agent model" description="Model for new agent deployments">
            <Select options={['Claude 3.5', 'GPT-4o', 'Gemini 1.5', 'Llama 3.1']} defaultValue="Claude 3.5" />
          </Row>
          <Row label="Max concurrent agents" description="Hard cap on simultaneously running agents">
            <Select options={['4', '8', '16', '32', '64']} defaultValue="8" />
          </Row>
        </Section>

        <Section title="NOTIFICATIONS" icon={Bell}>
          <Row label="Agent error alerts" description="Alert when an agent enters error state">
            <Toggle defaultChecked={true} />
          </Row>
          <Row label="Task completion notifications" description="Notify on task complete">
            <Toggle defaultChecked={false} />
          </Row>
          <Row label="High CPU threshold alerts" description="Alert when CPU exceeds 90%">
            <Toggle defaultChecked={true} />
          </Row>
        </Section>

        <Section title="APPEARANCE" icon={Palette}>
          <Row label="Theme" description="Color scheme">
            <Select options={['Dark Blue', 'Dark Cyan', 'Dark Mono']} defaultValue="Dark Blue" />
          </Row>
          <Row label="Compact mode" description="Reduce card padding and spacing">
            <Toggle defaultChecked={false} />
          </Row>
          <Row label="Show agent animations" description="Pulse animations on active agents">
            <Toggle defaultChecked={true} />
          </Row>
        </Section>

        <Section title="SECURITY" icon={Shield}>
          <Row label="API key rotation" description="Auto-rotate API keys every 30 days">
            <Toggle defaultChecked={true} />
          </Row>
          <Row label="Audit logging" description="Log all agent actions to audit trail">
            <Toggle defaultChecked={true} />
          </Row>
          <Row label="Require confirmation for stop/start" description="Confirm before toggling agent state">
            <Toggle defaultChecked={false} />
          </Row>
        </Section>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}>
            RESET DEFAULTS
          </button>
          <button style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: '1px solid var(--blue-600)',
            background: 'rgba(0,102,255,0.15)',
            color: 'var(--blue-300)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(0,102,255,0.2)',
          }}>
            SAVE CHANGES
          </button>
        </div>
      </div>
    </Layout>
  )
}
