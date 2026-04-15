// localStorage 工具：历史文章记录

export interface ArticleHistory {
  id: string
  title: string
  content: string
  style: string
  wordCount: number
  topic: string
  outline: {
    style: string
    title: string
    summary: string
    sections: { heading: string; description: string }[]
  }
  createdAt: string
}

const HISTORY_KEY = 'app_article_history'
const MAX_HISTORY_COUNT = 50 // 最多保留 50 条记录

export function loadHistory(): ArticleHistory[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistory(history: ArticleHistory[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function addHistoryItem(
  history: ArticleHistory[],
  item: Omit<ArticleHistory, 'id' | 'createdAt'>
): ArticleHistory[] {
  const newItem: ArticleHistory = {
    ...item,
    id: `article-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  // 新记录放在最前面，超出数量限制时删除最旧的
  const updated = [newItem, ...history]
  if (updated.length > MAX_HISTORY_COUNT) {
    updated.pop()
  }
  return updated
}

export function removeHistoryItem(history: ArticleHistory[], id: string): ArticleHistory[] {
  return history.filter((h) => h.id !== id)
}

export function clearHistory(): ArticleHistory[] {
  return []
}
