// localStorage 工具：模型配置存浏览器本地

export interface ModelConfig {
  id: string
  name: string
  provider: string
  apiKey: string
  baseUrl: string
  modelId: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'app_model_configs'
const ACTIVE_KEY = 'app_active_model_id'

export function loadModels(): ModelConfig[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveModels(models: ModelConfig[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models))
}

export function addOrUpdateModel(
  models: ModelConfig[],
  data: { id?: string; name: string; provider: string; apiKey: string; baseUrl: string; modelId: string }
): ModelConfig[] {
  const now = new Date().toISOString()
  if (data.id) {
    // 更新
    return models.map((m) =>
      m.id === data.id
        ? { ...m, name: data.name, provider: data.provider, apiKey: data.apiKey, baseUrl: data.baseUrl, modelId: data.modelId, updatedAt: now }
        : m
    )
  } else {
    // 新增
    const newModel: ModelConfig = {
      id: `model-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name,
      provider: data.provider,
      apiKey: data.apiKey,
      baseUrl: data.baseUrl,
      modelId: data.modelId,
      createdAt: now,
      updatedAt: now,
    }
    return [newModel, ...models]
  }
}

export function removeModel(models: ModelConfig[], id: string): ModelConfig[] {
  return models.filter((m) => m.id !== id)
}

export function loadActiveModelId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ACTIVE_KEY) || ''
}

export function saveActiveModelId(id: string) {
  if (typeof window === 'undefined') return
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id)
  } else {
    localStorage.removeItem(ACTIVE_KEY)
  }
}
