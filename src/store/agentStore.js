import { create } from 'zustand'

const AGENT_NAMES = [
  'Alpha-7', 'Bravo-3', 'Charlie-1', 'Delta-9', 'Echo-5',
  'Foxtrot-2', 'Golf-6', 'Hotel-4',
]

const TASK_POOL = [
  'Data ingestion pipeline', 'Model inference batch', 'Log aggregation',
  'API health monitoring', 'Cache warming', 'Anomaly detection scan',
  'Report generation', 'DB optimization', 'Security audit sweep',
  'Embedding computation', 'Vector indexing', 'Synthetic data gen',
]

const MODELS = ['GPT-4o', 'Claude 3.5', 'Gemini 1.5', 'Llama 3.1', 'Mistral 7B']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateAgent(id) {
  const status = pickRandom(['active', 'active', 'active', 'idle', 'error', 'pending'])
  return {
    id,
    name: AGENT_NAMES[id % AGENT_NAMES.length],
    status,
    model: pickRandom(MODELS),
    task: status === 'active' ? pickRandom(TASK_POOL) : null,
    cpu: status === 'active' ? rand(15, 85) : rand(0, 10),
    memory: rand(120, 800),
    tokens: rand(5000, 250000),
    tokensPerSec: status === 'active' ? rand(20, 120) : 0,
    uptime: rand(60, 86400),
    tasksCompleted: rand(0, 500),
    errors: rand(0, 20),
    latency: rand(80, 600),
    createdAt: Date.now() - rand(3600000, 86400000 * 7),
  }
}

function generateActivity(agents) {
  const types = ['task_start', 'task_complete', 'error', 'status_change', 'checkpoint']
  const msgs = {
    task_start: (a) => `${a.name} started: ${pickRandom(TASK_POOL)}`,
    task_complete: (a) => `${a.name} completed task in ${rand(2, 120)}s`,
    error: (a) => `${a.name} encountered rate limit error`,
    status_change: (a) => `${a.name} transitioned to ${pickRandom(['active', 'idle'])}`,
    checkpoint: (a) => `${a.name} saved checkpoint at step ${rand(100, 9999)}`,
  }
  const type = pickRandom(types)
  const agent = pickRandom(agents)
  return {
    id: Math.random().toString(36).slice(2),
    type,
    message: msgs[type](agent),
    agentId: agent.id,
    agentName: agent.name,
    timestamp: Date.now() - rand(0, 3600000),
  }
}

const initialAgents = Array.from({ length: 8 }, (_, i) => generateAgent(i))
const initialActivity = Array.from({ length: 20 }, () => generateActivity(initialAgents))
  .sort((a, b) => b.timestamp - a.timestamp)

const initialMetrics = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  tokens: rand(10000, 80000),
  tasks: rand(5, 40),
  errors: rand(0, 5),
  latency: rand(100, 500),
}))

export const useAgentStore = create((set, get) => ({
  agents: initialAgents,
  activity: initialActivity,
  metrics: initialMetrics,
  selectedAgent: null,
  filter: 'all',

  setFilter: (filter) => set({ filter }),
  selectAgent: (id) => set({ selectedAgent: id }),

  updateAgents: () => set((state) => ({
    agents: state.agents.map((agent) => {
      if (agent.status === 'active') {
        return {
          ...agent,
          cpu: Math.max(5, Math.min(99, agent.cpu + rand(-8, 8))),
          memory: Math.max(50, Math.min(900, agent.memory + rand(-20, 20))),
          tokensPerSec: Math.max(0, agent.tokensPerSec + rand(-10, 10)),
          tokens: agent.tokens + agent.tokensPerSec,
          latency: Math.max(50, Math.min(800, agent.latency + rand(-30, 30))),
        }
      }
      return agent
    }),
  })),

  addActivity: () => {
    const { agents } = get()
    const entry = generateActivity(agents)
    set((state) => ({
      activity: [entry, ...state.activity].slice(0, 50),
    }))
  },

  toggleAgent: (id) => set((state) => ({
    agents: state.agents.map((a) =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'idle' : 'active' }
        : a
    ),
  })),

  getFilteredAgents: () => {
    const { agents, filter } = get()
    if (filter === 'all') return agents
    return agents.filter((a) => a.status === filter)
  },

  getStats: () => {
    const { agents } = get()
    return {
      total: agents.length,
      active: agents.filter((a) => a.status === 'active').length,
      idle: agents.filter((a) => a.status === 'idle').length,
      error: agents.filter((a) => a.status === 'error').length,
      totalTokens: agents.reduce((s, a) => s + a.tokens, 0),
      avgCpu: Math.round(agents.reduce((s, a) => s + a.cpu, 0) / agents.length),
      tasksCompleted: agents.reduce((s, a) => s + a.tasksCompleted, 0),
    }
  },
}))
