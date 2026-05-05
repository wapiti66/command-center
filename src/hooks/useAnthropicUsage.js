import { useState, useEffect, useCallback } from 'react'

function todayUTC() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

function nowUTC() {
  return new Date().toISOString()
}

const MODEL_LABEL = {
  'claude-opus-4-5':              'Claude Opus 4',
  'claude-opus-4-7':              'Claude Opus 4',
  'claude-sonnet-4-5':            'Claude Sonnet 4',
  'claude-sonnet-4-6':            'Claude Sonnet 4.6',
  'claude-haiku-4-5-20251001':    'Claude Haiku 4.5',
  'claude-3-5-sonnet-20241022':   'Claude 3.5 Sonnet',
  'claude-3-5-haiku-20241022':    'Claude 3.5 Haiku',
  'claude-3-opus-20240229':       'Claude 3 Opus',
}

function labelModel(model) {
  for (const [key, label] of Object.entries(MODEL_LABEL)) {
    if (model?.startsWith(key)) return label
  }
  return model ?? 'Inconnu'
}

async function fetchUsage() {
  const params = new URLSearchParams({
    starting_at: todayUTC(),
    ending_at: nowUTC(),
    bucket_width: '1h',
  })
  params.append('group_by[]', 'model')

  const res = await fetch(`/api/anthropic/v1/organizations/usage_report/messages?${params}`)
  if (res.status === 401) throw new Error('CLE_INVALIDE')
  if (res.status === 403) throw new Error('PAS_ADMIN')
  if (!res.ok) throw new Error(`HTTP_${res.status}`)
  return res.json()
}

async function fetchCosts() {
  const params = new URLSearchParams({
    starting_at: todayUTC(),
    ending_at: nowUTC(),
    bucket_width: '1d',
  })
  params.append('group_by[]', 'model')

  const res = await fetch(`/api/anthropic/v1/organizations/cost_report?${params}`)
  if (!res.ok) throw new Error(`HTTP_${res.status}`)
  return res.json()
}

function aggregateUsage(data) {
  const byModel = {}
  for (const bucket of data) {
    for (const result of bucket.results ?? []) {
      const model = labelModel(result.model)
      if (!byModel[model]) byModel[model] = { input: 0, output: 0, cacheRead: 0, cacheCreate: 0 }
      byModel[model].input       += result.uncached_input_tokens ?? 0
      byModel[model].output      += result.output_tokens ?? 0
      byModel[model].cacheRead   += result.cache_read_input_tokens ?? 0
      byModel[model].cacheCreate += result.cache_creation?.ephemeral_1h ?? 0
    }
  }

  const byHour = {}
  for (const bucket of data) {
    const hour = bucket.starting_at?.slice(11, 16) ?? '??:??'
    if (!byHour[hour]) byHour[hour] = 0
    for (const result of bucket.results ?? []) {
      byHour[hour] += (result.uncached_input_tokens ?? 0) + (result.output_tokens ?? 0)
    }
  }

  return { byModel, byHour }
}

function aggregateCosts(data) {
  let totalCents = 0
  const byModel = {}
  for (const bucket of data) {
    for (const result of bucket.results ?? []) {
      const cents = parseFloat(result.amount ?? '0')
      totalCents += cents
      const model = labelModel(result.model)
      byModel[model] = (byModel[model] ?? 0) + cents
    }
  }
  return { totalCents, byModel }
}

export function useAnthropicUsage(refreshInterval = 60000) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCacheRead: 0,
    costTodayCents: 0,
    byModel: [],
    byHour: [],
    lastUpdated: null,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const [usageRes, costRes] = await Promise.all([fetchUsage(), fetchCosts()])
      const { byModel: usageByModel, byHour } = aggregateUsage(usageRes.data ?? [])
      const { totalCents, byModel: costByModel } = aggregateCosts(costRes.data ?? [])

      const models = Object.keys(usageByModel)
      const byModel = models.map((model) => ({
        model,
        input:       usageByModel[model].input,
        output:      usageByModel[model].output,
        cacheRead:   usageByModel[model].cacheRead,
        total:       usageByModel[model].input + usageByModel[model].output + usageByModel[model].cacheRead,
        costCents:   costByModel[model] ?? 0,
      })).sort((a, b) => b.total - a.total)

      const hourData = Object.entries(byHour)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([hour, tokens]) => ({ hour, tokens }))

      setState({
        loading: false,
        error: null,
        totalInputTokens:  models.reduce((s, m) => s + usageByModel[m].input, 0),
        totalOutputTokens: models.reduce((s, m) => s + usageByModel[m].output, 0),
        totalCacheRead:    models.reduce((s, m) => s + usageByModel[m].cacheRead, 0),
        costTodayCents:    totalCents,
        byModel,
        byHour: hourData,
        lastUpdated: new Date(),
      })
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }))
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, refreshInterval)
    return () => clearInterval(interval)
  }, [load, refreshInterval])

  return { ...state, refresh: load }
}
