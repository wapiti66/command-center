import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Bot, CheckSquare, BarChart3,
  Terminal, Settings, Zap, ChevronRight, BookOpen,
} from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge' },
]

const SECONDARY = [
  { to: '/terminal', icon: Terminal, label: 'Terminal' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      height: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, var(--blue-600), var(--blue-400))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(0,102,255,0.4)',
        }}>
          <Zap size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            COMMAND
          </div>
          <div style={{ fontSize: 10, color: 'var(--cyan-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
            CENTER v2.4
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        <SectionLabel>NAVIGATION</SectionLabel>
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <SectionLabel style={{ marginTop: 20 }}>TOOLS</SectionLabel>
        {SECONDARY.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e3a6e, var(--blue-600))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: '#fff',
          flexShrink: 0,
        }}>
          OP
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Operator</div>
          <div style={{ fontSize: 10, color: 'var(--cyan-500)', fontFamily: 'var(--font-mono)' }}>● ONLINE</div>
        </div>
        <ChevronRight size={14} color="var(--text-muted)" />
      </div>
    </aside>
  )
}

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)',
      padding: '4px 8px 6px',
      fontFamily: 'var(--font-mono)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 6,
        marginBottom: 2,
        fontSize: 13,
        fontWeight: 500,
        color: isActive ? '#fff' : 'var(--text-secondary)',
        background: isActive ? 'rgba(0,102,255,0.15)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--blue-500)' : '2px solid transparent',
        textDecoration: 'none',
        transition: 'all 0.15s',
        cursor: 'pointer',
      })}
    >
      {({ isActive }) => (
        <>
          <Icon size={16} color={isActive ? 'var(--blue-400)' : 'var(--text-muted)'} />
          {label}
        </>
      )}
    </NavLink>
  )
}
