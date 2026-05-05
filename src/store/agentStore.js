import { create } from 'zustand'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// ─── Agents réels ────────────────────────────────────────────────────────────

const INITIAL_AGENTS = [
  {
    id: 0,
    name: 'Orchestrateur CEO',
    type: 'orchestrator',
    role: 'Coordination & Stratégie',
    model: 'Claude Opus 4',
    modelId: 'claude-opus-4',
    status: 'active',
    color: '#ffd700',
    tasksDelegated: 247,
    decisionsToday: 34,
    agentsSupervised: 4,
    efficiency: 94,
    uptimePct: 99.8,
    tokensInput: 341000,
    tokensOutput: 146000,
    currentDirective: 'Supervision pipeline contenu + trading',
  },
  {
    id: 1,
    name: 'Agent Trader XAUUSD',
    type: 'trader',
    role: 'Trading Gold XAU/USD',
    model: 'GPT-4o',
    modelId: 'gpt-4o',
    status: 'active',
    color: '#00d68f',
    position: 'Long',
    entryPrice: 2312.50,
    currentPrice: 2318.75,
    pnlToday: 847,
    pnlTotal: 12450,
    winRate: 67,
    tradesToday: 8,
    tradesTotal: 342,
    drawdown: 2.3,
    stopLoss: 2305.00,
    takeProfit: 2330.00,
    tokensInput: 198000,
    tokensOutput: 54000,
    currentTask: 'Analyse signal H4 — résistance 2325',
  },
  {
    id: 2,
    name: 'Agent Formation',
    type: 'formation',
    role: 'Création de Formations',
    model: 'Claude Sonnet 4.6',
    modelId: 'claude-sonnet-4-6',
    status: 'active',
    color: '#9b59ff',
    currentModule: 'Module 4 — Risk Management',
    modulesCreated: 12,
    totalPages: 847,
    completionRate: 78,
    wordsGenerated: 124500,
    exercicesCreated: 67,
    tokensInput: 284000,
    tokensOutput: 187000,
    currentTask: 'Rédaction exercices Module 4',
  },
  {
    id: 3,
    name: 'Agent Contenu',
    type: 'content',
    role: 'Création de Contenu',
    model: 'Claude Sonnet 4.6',
    modelId: 'claude-sonnet-4-6',
    status: 'active',
    color: '#00d4ff',
    currentTask: 'Thread Twitter — Analyse XAUUSD semaine',
    postsCreated: 47,
    wordsToday: 8420,
    wordsTotal: 125000,
    platforms: ['Twitter', 'LinkedIn', 'Instagram'],
    engagementRate: 4.2,
    scheduledPosts: 12,
    tokensInput: 156000,
    tokensOutput: 98000,
  },
  {
    id: 4,
    name: 'Agent Marketing',
    type: 'marketing',
    role: 'Stratégie Marketing',
    model: 'GPT-4o',
    modelId: 'gpt-4o',
    status: 'idle',
    color: '#ff6b6b',
    currentTask: null,
    campaignsActive: 3,
    reach: 12400,
    conversions: 87,
    roi: 340,
    leadsGenerated: 124,
    emailsSent: 2400,
    conversionRate: 2.8,
    tokensInput: 87000,
    tokensOutput: 31000,
  },
]

// ─── Activités réelles ───────────────────────────────────────────────────────

const INITIAL_ACTIVITY = [
  { id: '1', type: 'trade',    agent: 'Agent Trader XAUUSD',  message: 'Position Long ouverte à 2312.50 — SL 2305 / TP 2330', timestamp: Date.now() - 600000 },
  { id: '2', type: 'content',  agent: 'Agent Contenu',        message: 'Thread Twitter publié — "3 signaux clés sur XAUUSD cette semaine"', timestamp: Date.now() - 1200000 },
  { id: '3', type: 'ceo',      agent: 'Orchestrateur CEO',    message: 'Directive envoyée à Agent Marketing : lancer campagne email liste formation', timestamp: Date.now() - 1800000 },
  { id: '4', type: 'formation',agent: 'Agent Formation',      message: 'Module 3 complété — 68 pages, 12 exercices générés', timestamp: Date.now() - 2400000 },
  { id: '5', type: 'trade',    agent: 'Agent Trader XAUUSD',  message: 'Trade clôturé +127$ — TP atteint sur signal M15', timestamp: Date.now() - 3000000 },
  { id: '6', type: 'marketing',agent: 'Agent Marketing',      message: 'Campagne email envoyée — 2400 destinataires, taux ouverture 34%', timestamp: Date.now() - 3600000 },
  { id: '7', type: 'content',  agent: 'Agent Contenu',        message: 'Article LinkedIn publié — "Comment j\'utilise l\'IA pour trader l\'or"', timestamp: Date.now() - 7200000 },
  { id: '8', type: 'ceo',      agent: 'Orchestrateur CEO',    message: 'Rapport quotidien généré — PnL +847$ / 3 modules en cours / 47 posts publiés', timestamp: Date.now() - 10800000 },
  { id: '9', type: 'trade',    agent: 'Agent Trader XAUUSD',  message: 'Analyse H4 complétée — biais haussier confirmé, zone achat 2310-2315', timestamp: Date.now() - 14400000 },
  { id: '10', type: 'formation',agent: 'Agent Formation',     message: 'Module 4 démarré — thème : Risk Management & position sizing', timestamp: Date.now() - 18000000 },
  { id: '11', type: 'marketing',agent: 'Agent Marketing',     message: '3 nouveaux leads qualifiés — source : Thread Twitter Agent Contenu', timestamp: Date.now() - 21600000 },
  { id: '12', type: 'content', agent: 'Agent Contenu',        message: 'Calendrier contenu semaine S19 planifié — 12 posts schedulés', timestamp: Date.now() - 25200000 },
]

// ─── Métriques graphiques 24h ────────────────────────────────────────────────

const INITIAL_METRICS = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  pnl: i < 9 ? 0 : rand(-200, 400),
  posts: rand(0, 4),
  leads: rand(0, 8),
  tokens: rand(5000, 40000),
}))

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAgentStore = create((set, get) => ({
  agents: INITIAL_AGENTS,
  activity: INITIAL_ACTIVITY,
  metrics: INITIAL_METRICS,

  updateAgents: () => set((state) => ({
    agents: state.agents.map((agent) => {
      if (agent.type === 'trader' && agent.status === 'active') {
        const priceMove = randFloat(-1.5, 1.5)
        const newPrice = parseFloat((agent.currentPrice + priceMove).toFixed(2))
        const newPnl = agent.pnlToday + rand(-30, 50)
        return { ...agent, currentPrice: newPrice, pnlToday: newPnl }
      }
      if (agent.type === 'formation' && agent.status === 'active') {
        return { ...agent, wordsGenerated: agent.wordsGenerated + rand(0, 80), totalPages: agent.totalPages + (Math.random() > 0.9 ? 1 : 0) }
      }
      if (agent.type === 'content' && agent.status === 'active') {
        return { ...agent, wordsToday: agent.wordsToday + rand(0, 60), wordsTotal: agent.wordsTotal + rand(0, 60) }
      }
      if (agent.type === 'orchestrator') {
        return { ...agent, tokensInput: agent.tokensInput + rand(0, 300), tokensOutput: agent.tokensOutput + rand(0, 150), decisionsToday: agent.decisionsToday + (Math.random() > 0.95 ? 1 : 0) }
      }
      if (agent.status === 'active') {
        return { ...agent, tokensInput: agent.tokensInput + rand(0, 100), tokensOutput: agent.tokensOutput + rand(0, 50) }
      }
      return agent
    }),
  })),

  addActivity: () => {
    const NEWS = [
      { type: 'trade',    agent: 'Agent Trader XAUUSD',  message: 'Signal détecté — croisement EMA 20/50 sur M30' },
      { type: 'content',  agent: 'Agent Contenu',        message: 'Post Instagram schedulé pour 18h00' },
      { type: 'formation',agent: 'Agent Formation',      message: 'Nouveau chapitre rédigé — 4 pages, 2 exercices' },
      { type: 'ceo',      agent: 'Orchestrateur CEO',    message: 'Synchronisation agents — statut optimal' },
      { type: 'marketing',agent: 'Agent Marketing',      message: 'Nouveau lead qualifié — source organique' },
      { type: 'trade',    agent: 'Agent Trader XAUUSD',  message: 'Stop loss ajusté en break-even' },
    ]
    const entry = { ...NEWS[rand(0, NEWS.length - 1)], id: Math.random().toString(36).slice(2), timestamp: Date.now() }
    set((state) => ({ activity: [entry, ...state.activity].slice(0, 50) }))
  },

  toggleAgent: (id) => set((state) => ({
    agents: state.agents.map((a) =>
      a.id === id ? { ...a, status: a.status === 'active' ? 'idle' : 'active' } : a
    ),
  })),

  getStats: () => {
    const { agents } = get()
    const trader = agents.find((a) => a.type === 'trader')
    const content = agents.find((a) => a.type === 'content')
    const formation = agents.find((a) => a.type === 'formation')
    const marketing = agents.find((a) => a.type === 'marketing')
    return {
      active: agents.filter((a) => a.status === 'active').length,
      idle: agents.filter((a) => a.status === 'idle').length,
      error: agents.filter((a) => a.status === 'error').length,
      total: agents.length,
      pnlToday: trader?.pnlToday ?? 0,
      postsCreated: content?.postsCreated ?? 0,
      modulesCreated: formation?.modulesCreated ?? 0,
      leadsGenerated: marketing?.leadsGenerated ?? 0,
    }
  },
}))
