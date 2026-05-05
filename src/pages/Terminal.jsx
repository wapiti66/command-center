import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { Terminal as TermIcon } from 'lucide-react'

const MOTD = [
  '  ██████╗ ██████╗ ███╗   ███╗███╗   ███╗ █████╗ ███╗   ██╗██████╗',
  ' ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔══██╗████╗  ██║██╔══██╗',
  ' ██║     ██║   ██║██╔████╔██║██╔████╔██║███████║██╔██╗ ██║██║  ██║',
  ' ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║  ██║',
  ' ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝',
  '  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝',
  '',
  '  COMMAND CENTER v2.4 — Multi-Agent Control Interface',
  '  Type "help" for available commands.',
  '',
]

const COMMANDS = {
  help: () => [
    'Available commands:',
    '  status          — show agent fleet status',
    '  agents          — list all agents',
    '  clear           — clear terminal',
    '  uptime          — system uptime',
    '  version         — show version info',
  ],
  status: () => [
    'Fleet Status:',
    '  Active agents : 5/8',
    '  Tasks running : 4',
    '  Errors        : 1',
    '  Avg CPU       : 42%',
  ],
  agents: () => [
    'Agent     Model         Status   CPU    MEM',
    '──────────────────────────────────────────',
    'Alpha-7   Claude 3.5    ACTIVE   58%   342MB',
    'Bravo-3   GPT-4o        ACTIVE   71%   512MB',
    'Charlie-1 Gemini 1.5   IDLE      3%   128MB',
    'Delta-9   Llama 3.1    ACTIVE   45%   298MB',
    'Echo-5    Mistral 7B   IDLE      2%   210MB',
    'Foxtrot-2 GPT-4o       ERROR    --    --',
    'Golf-6    Claude 3.5   ACTIVE   63%   445MB',
    'Hotel-4   Gemini 1.5   ACTIVE   38%   380MB',
  ],
  uptime: () => [`System uptime: ${Math.floor(Math.random() * 100)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`],
  version: () => [
    'Command Center v2.4.1',
    'React 19 + Vite 6',
    'Agent Runtime: v3.2.0',
  ],
  clear: () => null,
}

export default function Terminal() {
  const [lines, setLines] = useState([...MOTD, 'operator@command-center:~$ '])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function runCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase()
    const fn = COMMANDS[trimmed]
    const newLines = [...lines.slice(0, -1), `operator@command-center:~$ ${cmd}`]

    if (trimmed === 'clear') {
      setLines([...MOTD, 'operator@command-center:~$ '])
    } else if (fn) {
      const output = fn()
      setLines([...newLines, ...output, '', 'operator@command-center:~$ '])
    } else if (trimmed === '') {
      setLines([...newLines, 'operator@command-center:~$ '])
    } else {
      setLines([...newLines, `bash: ${trimmed}: command not found`, 'operator@command-center:~$ '])
    }

    setHistory((h) => [cmd, ...h].slice(0, 50))
    setHistIdx(-1)
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      runCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    }
  }

  return (
    <Layout title="Terminal" subtitle="COMMAND INTERFACE">
      <div
        style={{
          background: '#020408',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.7,
          height: 'calc(100vh - 130px)',
          overflow: 'auto',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} style={{
            color: line.startsWith('operator@') ? 'var(--green-500)' :
                   line.startsWith('  ██') || line.startsWith(' ██') || line.startsWith('  ╚') ? 'var(--blue-400)' :
                   line.startsWith('  COMMAND CENTER') ? 'var(--cyan-500)' :
                   line.startsWith('bash:') ? 'var(--red-500)' :
                   line.startsWith('  Type') || line.startsWith('Available') ? 'var(--text-secondary)' :
                   'var(--text-primary)',
            whiteSpace: 'pre',
          }}>
            {i === lines.length - 1 ? (
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {line}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    caretColor: 'var(--green-500)',
                    width: Math.max(input.length * 8, 4),
                  }}
                  spellCheck={false}
                  autoComplete="off"
                />
              </span>
            ) : line}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </Layout>
  )
}
