import { useState } from 'react'
import {
  BookOpen, Target, Zap, TrendingUp, TrendingDown,
  Clock, AlertTriangle, CheckSquare, BarChart2, Layers,
} from 'lucide-react'
import {
  CORRELATIONS, KILL_ZONES, MARKET_STRUCTURE, OTE, FVG,
  ORDER_BLOCKS, AIMC, SUPPLY_DEMAND, VOLUME_PROFILE,
  ENTRY_CHECKLIST, RISK_MANAGEMENT, SETUPS,
} from '../data/traderKnowledge'

const SECTIONS = [
  { id: 'correlations',    label: 'Corrélations',       icon: TrendingUp },
  { id: 'killzones',       label: 'Kill Zones',          icon: Clock },
  { id: 'structure',       label: 'Structure Marché',    icon: Layers },
  { id: 'ote',             label: 'OTE + OPR',           icon: Target },
  { id: 'fvg',             label: 'FVG + OB',            icon: Zap },
  { id: 'aimc',            label: 'AIMC + S/D',          icon: BarChart2 },
  { id: 'volume',          label: 'Volume Profile',      icon: BarChart2 },
  { id: 'setups',          label: 'Setups Prioritaires', icon: BookOpen },
  { id: 'checklist',       label: 'Checklist + Risk',    icon: CheckSquare },
]

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

function Card({ children, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderLeft: accent ? `3px solid ${accent}` : '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 14,
    }}>
      {children}
    </div>
  )
}

function Badge({ children, color }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
      padding: '2px 8px', borderRadius: 3,
      background: `${color}18`, border: `1px solid ${color}40`,
      color,
    }}>
      {children}
    </span>
  )
}

function Row({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '6px 0', borderBottom: '1px solid var(--border)',
      gap: 12,
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: color ?? 'var(--text-primary)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )
}

function BulletList({ items, color }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 11, color: color ?? 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// ─── Section Correlations ─────────────────────────────────────────────────────

function Correlations() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>CORRÉLATIONS XAUUSD</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#ff3366">
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ff3366', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            CORRÉLATIONS NÉGATIVES (inverse)
          </div>
          {CORRELATIONS.negative.map((c) => (
            <div key={c.pair} style={{ marginBottom: 8 }}>
              <Badge color="#ff3366">{c.pair}</Badge>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                {c.description}
              </div>
            </div>
          ))}
        </Card>
        <Card accent="#00d68f">
          <div style={{ fontSize: 12, fontWeight: 700, color: '#00d68f', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            CORRÉLATIONS POSITIVES
          </div>
          {CORRELATIONS.positive.map((c) => (
            <div key={c.pair} style={{ marginBottom: 8 }}>
              <Badge color="#00d68f">{c.pair}</Badge>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                {c.description}
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          NOTES IMPORTANTES
        </div>
        <BulletList items={CORRELATIONS.notes} color="var(--text-secondary)" />
      </Card>
    </div>
  )
}

// ─── Section Kill Zones ───────────────────────────────────────────────────────

function KillZones() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>KILL ZONES — HEURES OPTIMALES (PARIS CET/CEST)</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Object.values(KILL_ZONES).map((kz) => (
          <Card key={kz.label} accent={kz.color}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Clock size={12} color={kz.color} />
              <span style={{ fontSize: 12, fontWeight: 700, color: kz.color, fontFamily: 'var(--font-mono)' }}>
                {kz.label}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: 6 }}>
              {kz.start} → {kz.end}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
              {kz.role}
            </div>
            <div style={{
              fontSize: 11, color: kz.color, fontFamily: 'var(--font-mono)',
              background: `${kz.color}0a`, border: `1px solid ${kz.color}20`,
              borderRadius: 4, padding: '6px 8px',
            }}>
              {kz.action}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Section Market Structure ─────────────────────────────────────────────────

function Structure() {
  const { concepts, liquidity } = MARKET_STRUCTURE
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>STRUCTURE DE MARCHÉ — SMC</SectionTitle>
      <Card accent="#ffd700">
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd700', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          CYCLE DE BASE
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {concepts.cycle}
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#00d68f">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00d68f', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>BSL — BUY SIDE LIQUIDITY</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            {liquidity.BSL.definition}
          </div>
          <BulletList items={liquidity.BSL.levels} color="#00d68f" />
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            → {liquidity.BSL.action}
          </div>
        </Card>
        <Card accent="#ff3366">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff3366', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>SSL — SELL SIDE LIQUIDITY</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            {liquidity.SSL.definition}
          </div>
          <BulletList items={liquidity.SSL.levels} color="#ff3366" />
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            → {liquidity.SSL.action}
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd700', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          STOP HUNT / LIQUIDITY SWEEP
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
          {liquidity.stopHunt.definition}
        </div>
        <div style={{ fontSize: 11, color: '#00d68f', fontFamily: 'var(--font-mono)' }}>
          Confirmation : {liquidity.stopHunt.confirmation}
        </div>
      </Card>
    </div>
  )
}

// ─── Section OTE + OPR ────────────────────────────────────────────────────────

function OTESection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>OTE — OPTIMAL TRADE ENTRY (Fibonacci)</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#9b59ff">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9b59ff', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            NIVEAUX FIBONACCI
          </div>
          {Object.entries(OTE.fibLevels).map(([lvl, desc]) => (
            <div key={lvl} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <span style={{
                fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)',
                color: lvl === '0.705' ? '#9b59ff' : 'var(--text-primary)',
                minWidth: 40,
              }}>{lvl}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{desc}</span>
            </div>
          ))}
          <Row label="SL" value={OTE.sl} color="#ff3366" />
          <Row label="TP" value={OTE.tp} color="#00d68f" />
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            MÉTHODE
          </div>
          <BulletList items={OTE.howTo} />
          <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            CONFLUENCES OTE
          </div>
          {OTE.confluence.map((c) => <div key={c}><Badge color="#9b59ff">{c}</Badge></div>)}
        </Card>
      </div>

      <SectionTitle>OPR — OPEN PRICE RANGE (15 premières minutes)</SectionTitle>
      <Card accent="#00d4ff">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
              {OPR.definition}
            </div>
            <Row label="SL" value={OPR.sl} color="#ff3366" />
            <Row label="TP" value={OPR.tp} color="#00d68f" />
            <Row label="Entrée" value={OPR.entry} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>RÈGLES</div>
            <BulletList items={OPR.rules} />
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Section FVG + OB ─────────────────────────────────────────────────────────

function FVGSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>FAIR VALUE GAP (FVG)</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#00d4ff">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00d4ff', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>FORMATION FVG</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{FVG.definition}</div>
          <BulletList items={FVG.formation} />
          <div style={{ marginTop: 8 }}>
            <Row label="FVG Haussier" value={FVG.bullishFVG} color="#00d68f" />
            <Row label="FVG Baissier" value={FVG.bearishFVG} color="#ff3366" />
            <Row label="Entrée" value={FVG.entry} />
            <Row label="SL" value={FVG.sl} color="#ff3366" />
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>RÈGLES FVG</div>
          <BulletList items={FVG.rules} />
        </Card>
      </div>

      <SectionTitle>ORDER BLOCKS</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#00d68f">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00d68f', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>OB HAUSSIER</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{ORDER_BLOCKS.bullishOB.definition}</div>
          <Row label="Entrée" value={ORDER_BLOCKS.bullishOB.entry} />
          <Row label="SL" value={ORDER_BLOCKS.bullishOB.sl} color="#ff3366" />
          <Row label="TP" value={ORDER_BLOCKS.bullishOB.tp} color="#00d68f" />
        </Card>
        <Card accent="#ff3366">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff3366', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>OB BAISSIER</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{ORDER_BLOCKS.bearishOB.definition}</div>
          <Row label="Entrée" value={ORDER_BLOCKS.bearishOB.entry} />
          <Row label="SL" value={ORDER_BLOCKS.bearishOB.sl} color="#ff3366" />
          <Row label="TP" value={ORDER_BLOCKS.bearishOB.tp} color="#00d68f" />
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>RÈGLES ORDER BLOCKS</div>
        <BulletList items={ORDER_BLOCKS.rules} />
      </Card>
    </div>
  )
}

// ─── Section AIMC + S/D ───────────────────────────────────────────────────────

function AIMCSection() {
  const steps = Object.values(AIMC.steps)
  const colors = ['#ffd700', '#0066ff', '#9b59ff', '#00d68f']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>STRATÉGIE AIMC</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {steps.map((step, i) => (
          <Card key={step.label} accent={colors[i]}>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors[i], fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
              {step.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
              {step.description}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              → {step.action}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Card><Row label="Entrée" value={AIMC.entry} /><Row label="SL" value={AIMC.sl} color="#ff3366" /><Row label="TP" value={AIMC.tp} color="#00d68f" /></Card>
        <Card><div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{AIMC.notes}</div></Card>
      </div>

      <SectionTitle>SUPPLY & DEMAND ZONES</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card accent="#00d68f">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00d68f', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{SUPPLY_DEMAND.demandZone.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{SUPPLY_DEMAND.demandZone.definition}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>Formation : {SUPPLY_DEMAND.demandZone.formation}</div>
          <Row label="Entrée" value={SUPPLY_DEMAND.demandZone.entry} />
          <Row label="SL" value={SUPPLY_DEMAND.demandZone.sl} color="#ff3366" />
          <Row label="Invalidation" value={SUPPLY_DEMAND.demandZone.invalidation} color="#ff3366" />
        </Card>
        <Card accent="#ff3366">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff3366', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{SUPPLY_DEMAND.supplyZone.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{SUPPLY_DEMAND.supplyZone.definition}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>Formation : {SUPPLY_DEMAND.supplyZone.formation}</div>
          <Row label="Entrée" value={SUPPLY_DEMAND.supplyZone.entry} />
          <Row label="SL" value={SUPPLY_DEMAND.supplyZone.sl} color="#ff3366" />
          <Row label="Invalidation" value={SUPPLY_DEMAND.supplyZone.invalidation} color="#ff3366" />
        </Card>
      </div>
      <Card>
        <BulletList items={SUPPLY_DEMAND.rules} />
      </Card>
    </div>
  )
}

// ─── Section Volume Profile ────────────────────────────────────────────────────

function VolumeSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>VOLUME PROFILE</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[VOLUME_PROFILE.POC, VOLUME_PROFILE.valueArea, VOLUME_PROFILE.HVN, VOLUME_PROFILE.LVN].map((item) => (
          <Card key={item.label}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd700', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {item.definition ?? item.usage}
            </div>
          </Card>
        ))}
      </div>
      <Card accent="#ffd700">
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd700', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          UTILISATION VOLUME PROFILE POUR XAUUSD
        </div>
        <BulletList items={VOLUME_PROFILE.usage} />
      </Card>
    </div>
  )
}

// ─── Section Setups ────────────────────────────────────────────────────────────

function SetupsSection() {
  const priorityColors = ['#ffd700', '#9b59ff', '#00d4ff', '#ff6b6b']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>SETUPS PRIORITAIRES XAUUSD</SectionTitle>
      {SETUPS.map((setup, i) => (
        <Card key={setup.id} accent={priorityColors[i]}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)',
              padding: '2px 8px', borderRadius: 3,
              background: `${priorityColors[i]}18`, color: priorityColors[i],
            }}>
              #{setup.priority}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {setup.label}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>ÉTAPES</div>
              <BulletList items={setup.steps} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>CONDITIONS</div>
              {setup.conditions.map((c) => (
                <div key={c} style={{ marginBottom: 4 }}><Badge color={priorityColors[i]}>{c}</Badge></div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Section Checklist + Risk ──────────────────────────────────────────────────

function ChecklistSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle>CHECKLIST D'ENTRÉE</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {[
          { key: 'pre_session', label: 'PRÉ-SESSION', color: '#ffd700' },
          { key: 'kill_zone',   label: 'KILL ZONE',   color: '#0066ff' },
          { key: 'entry',       label: 'ENTRÉE',       color: '#9b59ff' },
          { key: 'management',  label: 'GESTION',      color: '#00d68f' },
        ].map(({ key, label, color }) => (
          <Card key={key} accent={color}>
            <div style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{label}</div>
            <BulletList items={ENTRY_CHECKLIST[key]} />
          </Card>
        ))}
      </div>

      <SectionTitle>GESTION DES RISQUES</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <Card accent="#ff3366">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>RISQUE MAX/TRADE</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ff3366' }}>{RISK_MANAGEMENT.maxRiskPerTrade}</div>
        </Card>
        <Card accent="#ffd700">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>RATIO MIN</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffd700' }}>{RISK_MANAGEMENT.minRiskReward}</div>
        </Card>
        <Card accent="#00d68f">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>RATIO IDÉAL</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#00d68f' }}>{RISK_MANAGEMENT.idealRiskReward}</div>
        </Card>
        <Card accent="#ff6b6b">
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>PERTE JOUR MAX</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ff6b6b' }}>{RISK_MANAGEMENT.maxDailyLoss}</div>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Card>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>PLACEMENT SL</div>
          <BulletList items={RISK_MANAGEMENT.slPlacement} />
        </Card>
        <Card>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>STRATÉGIE TP</div>
          <BulletList items={RISK_MANAGEMENT.tpStrategy} />
        </Card>
        <Card>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, fontWeight: 600 }}>RÈGLES FONDAMENTALES</div>
          <BulletList items={RISK_MANAGEMENT.rules} />
        </Card>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const SECTION_COMPONENTS = {
  correlations: Correlations,
  killzones:    KillZones,
  structure:    Structure,
  ote:          OTESection,
  fvg:          FVGSection,
  aimc:         AIMCSection,
  volume:       VolumeSection,
  setups:       SetupsSection,
  checklist:    ChecklistSection,
}

export default function TraderKnowledge() {
  const [active, setActive] = useState('correlations')
  const ActiveSection = SECTION_COMPONENTS[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderLeft: '3px solid #00d68f',
        borderRadius: 'var(--radius-lg)', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <BookOpen size={16} color="#00d68f" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            BASE DE CONNAISSANCE — AGENT TRADER XAUUSD
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            SMC · ICT · OlinVest · TradingSociety — 11 modules de formation analysés
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Badge color="#00d68f">SMC</Badge>
          <Badge color="#9b59ff">ICT</Badge>
          <Badge color="#ffd700">XAUUSD</Badge>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              border: `1px solid ${active === id ? '#00d68f' : 'var(--border)'}`,
              background: active === id ? 'rgba(0,214,143,0.1)' : 'var(--bg-card)',
              color: active === id ? '#00d68f' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ActiveSection />
      </div>
    </div>
  )
}
