'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  RefreshCw,
  Settings,
  PenLine,
  Loader2,
  Cpu,
  AlertCircle,
  ChevronDown,
  Palette,
  Hash,
  History,
} from 'lucide-react'
import { toast } from 'sonner'
import ModelConfigDialog from '@/components/model-config-dialog'
import OutlineCard, { type OutlineData } from '@/components/outline-card'
import ArticleViewer from '@/components/article-viewer'
import HistoryListDialog from '@/components/history-list-dialog'
import {
  type ModelConfig,
  loadModels,
  loadActiveModelId,
  saveActiveModelId,
} from '@/lib/model-store'
import {
  loadHistory,
  saveHistory,
  addHistoryItem,
} from '@/lib/history-store'

// ── 风格选项 ──
const STYLE_OPTIONS = [
  { value: '幽默', emoji: '😂', label: '幽默', desc: '轻松搞笑，段子式表达' },
  { value: '吐槽', emoji: '😤', label: '吐槽', desc: '犀利吐槽，直击痛点' },
  { value: '专业', emoji: '🎓', label: '专业', desc: '严谨专业，数据驱动' },
  { value: '轻松', emoji: '☕', label: '轻松', desc: '娓娓道来，舒适自然' },
  { value: '热情', emoji: '🔥', label: '热情', desc: '激情满满，感染力强' },
  { value: '简洁', emoji: '✂️', label: '简洁', desc: '言简意赅，句句干货' },
  { value: '口语化', emoji: '💬', label: '口语化', desc: '像朋友聊天一样' },
  { value: '文艺', emoji: '🌸', label: '文艺', desc: '优美意境，字字珠玑' },
  { value: '悬疑', emoji: '🔍', label: '悬疑', desc: '制造悬念，层层揭秘' },
  { value: '励志', emoji: '💪', label: '励志', desc: '正能量满满，催人奋进' },
]

// ── 字数选项 ──
const WORD_COUNT_OPTIONS = [
  { value: '500-800', label: '500 ~ 800 字', desc: '适合短文' },
  { value: '800-1200', label: '800 ~ 1200 字', desc: '标准篇幅' },
  { value: '1200-2000', label: '1200 ~ 2000 字', desc: '深度长文' },
  { value: '2000-3000', label: '2000 ~ 3000 字', desc: '超长干货' },
]

type AppStep = 'input' | 'outlines' | 'article'

export default function Home() {
  // 模型配置（浏览器本地存储）
  const [models, setModels] = useState<ModelConfig[]>([])
  const [activeModelId, setActiveModelId] = useState<string>('')
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  // 历史记录
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyTopic, setHistoryTopic] = useState<string>('')

  // 应用状态
  const [topic, setTopic] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string>('幽默')
  const [selectedWordCount, setSelectedWordCount] = useState<string>('800-1200')
  const [step, setStep] = useState<AppStep>('input')
  const [outlines, setOutlines] = useState<OutlineData[]>([])
  const [selectedOutline, setSelectedOutline] = useState<OutlineData | null>(null)
  const [articleContent, setArticleContent] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [articleStyle, setArticleStyle] = useState('')
  const [articleWordCount, setArticleWordCount] = useState(0)

  // 加载状态
  const [loadingOutlines, setLoadingOutlines] = useState(false)
  const [loadingArticle, setLoadingArticle] = useState(false)

  // 从 localStorage 加载模型配置
  const fetchModels = useCallback(() => {
    const stored = loadModels()
    setModels(stored)
    const savedActiveId = loadActiveModelId()
    if (savedActiveId && stored.find((m) => m.id === savedActiveId)) {
      setActiveModelId(savedActiveId)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  // 切换激活模型时同步到 localStorage
  const handleSelectModel = useCallback((id: string) => {
    setActiveModelId(id)
    saveActiveModelId(id)
  }, [])

  // 获取当前激活的完整模型配置
  const getActiveModelConfig = useCallback((): ModelConfig | undefined => {
    return models.find((m) => m.id === activeModelId)
  }, [models, activeModelId])

  // 生成大纲
  const handleGenerateOutlines = async () => {
    if (!topic.trim()) {
      toast.error('请输入文章选题')
      return
    }
    const modelConfig = getActiveModelConfig()
    if (!modelConfig) {
      toast.error('请先配置并选择一个 AI 模型')
      setConfigDialogOpen(true)
      return
    }

    setLoadingOutlines(true)
    setSelectedOutline(null)
    setArticleContent('')
    setStep('outlines')

    try {
      const res = await fetch('/api/generate-outlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          style: selectedStyle,
          modelConfig: {
            apiKey: modelConfig.apiKey,
            baseUrl: modelConfig.baseUrl,
            modelId: modelConfig.modelId,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '生成大纲失败')
      }

      setOutlines(data.outlines)
      toast.success('大纲生成完成，选择一个来生成文章')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '生成大纲失败'
      toast.error(message)
      setStep('input')
    } finally {
      setLoadingOutlines(false)
    }
  }

  // 生成文章
  const handleGenerateArticle = async (outline: OutlineData) => {
    const modelConfig = getActiveModelConfig()
    if (!modelConfig) {
      toast.error('请先选择 AI 模型')
      return
    }

    setSelectedOutline(outline)
    setLoadingArticle(true)
    setStep('article')

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline,
          wordCountRange: selectedWordCount,
          modelConfig: {
            apiKey: modelConfig.apiKey,
            baseUrl: modelConfig.baseUrl,
            modelId: modelConfig.modelId,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '生成文章失败')
      }

      setArticleContent(data.article)
      setArticleTitle(data.title)
      setArticleStyle(data.style)
      setArticleWordCount(data.wordCount)
      toast.success(`文章生成完成，共 ${data.wordCount} 字`)

      // 保存到历史记录
      const currentHistory = loadHistory()
      const updatedHistory = addHistoryItem(currentHistory, {
        title: data.title,
        content: data.article,
        style: data.style,
        wordCount: data.wordCount,
        topic: topic.trim(),
        outline: {
          style: outline.style,
          title: outline.title,
          summary: outline.summary,
          sections: outline.sections,
        },
      })
      saveHistory(updatedHistory)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '生成文章失败'
      toast.error(message)
      setStep('outlines')
      setSelectedOutline(null)
    } finally {
      setLoadingArticle(false)
    }
  }

  // 返回大纲
  const handleBackToOutlines = () => {
    setStep('outlines')
    setArticleContent('')
    setSelectedOutline(null)
  }

  // 重新开始
  const handleReset = () => {
    setStep('input')
    setOutlines([])
    setSelectedOutline(null)
    setArticleContent('')
  }

  const activeModel = models.find((m) => m.id === activeModelId)
  const currentStyleOption = STYLE_OPTIONS.find((s) => s.value === selectedStyle)

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <PenLine className="size-4 text-primary" />
            </div>
            <div>
              <h1 className="font-bold leading-none">公众号文章创作助手</h1>
              <p className="text-sm text-muted-foreground mt-0.5">AI 驱动的一站式创作工具</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 模型选择器 */}
            <Select value={activeModelId} onValueChange={handleSelectModel}>
              <SelectTrigger className="w-[160px] sm:w-[200px] h-8 text-sm">
                <SelectValue placeholder="选择模型">
                  {activeModel ? (
                    <span className="flex items-center gap-2 truncate">
                      <Cpu className="size-3 shrink-0" />
                      <span className="truncate">{activeModel.name}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertCircle className="size-3 text-destructive" />
                      <span>未配置模型</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <span className="flex items-center gap-2">
                      <Cpu className="size-3" />
                      {model.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setHistoryOpen(true)}
              title="历史记录"
            >
              <History className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setConfigDialogOpen(true)}
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* 步骤指示器 */}
        <div className="flex items-center gap-2 mb-6">
          {['选题输入', '大纲选择', '文章生成'].map((label, i) => {
            const steps: AppStep[] = ['input', 'outlines', 'article']
            const isActive = steps[i] === step
            const isDone =
              (i === 0 && step !== 'input') ||
              (i === 1 && step === 'article')

            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? (
                    <span className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      ✓
                    </span>
                  ) : (
                    <span
                      className={`size-4 rounded-full flex items-center justify-center text-xs ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                  {label}
                </div>
                {i < 2 && (
                  <ChevronDown className="size-3.5 text-muted-foreground rotate-[-90deg]" />
                )}
              </div>
            )
          })}
        </div>

        {/* 步骤 1: 选题 + 风格选择 */}
        {(step === 'input' || step === 'outlines') && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                {/* 选题输入 */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    文章选题
                  </label>
                  <Textarea
                    placeholder="输入你的文章选题，例如：2025年普通人最值得学习的3个AI工具"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-[80px] resize-none text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleGenerateOutlines()
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground mt-1.5">
                    提示：选题越具体，生成的大纲质量越高 · 按 Ctrl+Enter 快速生成
                  </p>
                </div>

                {/* 风格选择 */}
                <div>
                  <label className="text-sm font-medium mb-2.5 block flex items-center gap-2">
                    <Palette className="size-4 text-primary" />
                    写作风格
                    {currentStyleOption && (
                      <Badge variant="secondary" className="text-xs gap-1 ml-1">
                        {currentStyleOption.emoji} {currentStyleOption.label}
                      </Badge>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedStyle(opt.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selectedStyle === opt.value
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border hover:border-primary/40 hover:bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentStyleOption
                      ? `当前风格：${currentStyleOption.desc}，AI 将围绕「${currentStyleOption.label}」基调生成大纲`
                      : '选择一种写作风格，AI 将围绕该基调生成大纲'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    className="gap-2"
                    onClick={handleGenerateOutlines}
                    disabled={loadingOutlines || !topic.trim()}
                  >
                    {loadingOutlines ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        正在生成大纲...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        生成大纲
                      </>
                    )}
                  </Button>
                  {step === 'outlines' && outlines.length > 0 && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleGenerateOutlines}
                      disabled={loadingOutlines}
                    >
                      <RefreshCw className={`size-4 ${loadingOutlines ? 'animate-spin' : ''}`} />
                      重新生成
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 加载大纲骨架 */}
        {loadingOutlines && step === 'outlines' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-dashed">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1.5" />
                  <Skeleton className="h-4 w-full mb-1.5" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 步骤 2: 大纲卡片 */}
        {step === 'outlines' && !loadingOutlines && outlines.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                选择你喜欢的角度
                <Badge variant="secondary" className="text-sm">
                  {outlines.length} 个方案
                </Badge>
              </h2>
              {/* 字数选择 */}
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">目标字数：</span>
                <Select value={selectedWordCount} onValueChange={setSelectedWordCount}>
                  <SelectTrigger className="w-[140px] h-7 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORD_COUNT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-1.5">
                          <span>{opt.label}</span>
                          <span className="text-muted-foreground">({opt.desc})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {outlines.map((outline, index) => (
                <OutlineCard
                  key={outline.id}
                  outline={outline}
                  index={index}
                  isSelected={selectedOutline?.id === outline.id}
                  isGenerating={loadingArticle}
                  onSelect={handleGenerateArticle}
                />
              ))}
            </div>
          </div>
        )}

        {/* 步骤 3: 文章生成 */}
        {(step === 'article' || (step === 'outlines' && loadingArticle)) && (
          <div className="mb-6">
            <ArticleViewer
              article={articleContent}
              title={articleTitle}
              style={articleStyle}
              wordCount={articleWordCount}
              loading={loadingArticle}
              onBack={handleBackToOutlines}
            />
            {!loadingArticle && articleContent && (
              <div className="flex justify-center gap-3 mt-4">
                <Button variant="outline" className="gap-2" onClick={handleBackToOutlines}>
                  <RefreshCw className="size-4" />
                  换个大纲重新生成
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleGenerateOutlines}>
                  <Sparkles className="size-4" />
                  换个选题
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 空状态 */}
        {step === 'input' && !loadingOutlines && (
          <div className="mt-8 text-center">
            <div className="size-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <PenLine className="size-10 text-primary/30" />
            </div>
            <h2 className="text-lg font-semibold mb-2">开始创作你的文章</h2>
            <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              选择一种写作风格，输入选题，AI 将为你生成3个不同角度的大纲，然后选择字数即可一键生成完整文章
            </p>

            <Separator className="my-8 max-w-xs mx-auto" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto text-left">
              {STYLE_OPTIONS.slice(0, 5).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStyle(opt.value)}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    selectedStyle === opt.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="text-lg mb-1">{opt.emoji}</div>
                  <h3 className="font-medium text-sm">{opt.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="border-t py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            公众号文章创作助手 · AI 驱动
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {activeModel && (
              <Badge variant="outline" className="text-xs gap-1">
                <Cpu className="size-3" />
                {activeModel.name}
              </Badge>
            )}
            {selectedStyle && (
              <Badge variant="outline" className="text-xs gap-1">
                <Palette className="size-3" />
                {STYLE_OPTIONS.find((s) => s.value === selectedStyle)?.label}
              </Badge>
            )}
          </div>
        </div>
      </footer>

      {/* 模型配置弹窗 */}
      <ModelConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        models={models}
        activeModelId={activeModelId}
        onSelectModel={handleSelectModel}
        onRefresh={fetchModels}
      />

      {/* 历史记录弹窗 */}
      <HistoryListDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  )
}
