// Prix publics Anthropic & OpenAI ($ par million de tokens)
export const MODEL_PRICING = {
  'claude-opus-4':    { input: 15.00, output: 75.00, label: 'Claude Opus 4',    color: '#ffd700', provider: 'Anthropic' },
  'claude-sonnet-4-6':{ input: 3.00,  output: 15.00, label: 'Claude Sonnet 4.6',color: '#9b59ff', provider: 'Anthropic' },
  'claude-haiku-4-5': { input: 0.80,  output: 4.00,  label: 'Claude Haiku 4.5', color: '#00d4ff', provider: 'Anthropic' },
  'gpt-4o':           { input: 2.50,  output: 10.00, label: 'GPT-4o',           color: '#00d68f', provider: 'OpenAI' },
}

export function calcCost(modelId, tokensInput, tokensOutput) {
  const pricing = MODEL_PRICING[modelId] ?? { input: 3.00, output: 15.00 }
  return (tokensInput / 1e6) * pricing.input + (tokensOutput / 1e6) * pricing.output
}
