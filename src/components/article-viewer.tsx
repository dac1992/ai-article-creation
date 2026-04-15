'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Copy,
  Check,
  FileText,
  Code,
  Eye,
  Type,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ArticleViewerProps {
  article: string
  title: string
  style: string
  wordCount: number
  loading: boolean
  onBack: () => void
}

export default function ArticleViewer({
  article,
  title,
  style,
  wordCount,
  loading,
  onBack,
}: ArticleViewerProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const textArea = document.createElement('textarea')
      textArea.value = article
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (loading) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">正在创作中...</p>
              <p className="text-base text-muted-foreground mt-1">
                AI 正在根据大纲撰写完整文章，请稍候
              </p>
            </div>
            <div className="w-full max-w-md space-y-3 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-muted animate-shimmer"
                  style={{ width: `${Math.random() * 30 + 70}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0">
              <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{style}</Badge>
                <span className="text-base text-muted-foreground">
                  {wordCount} 字
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* 视图切换 */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-r-none gap-1.5"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="size-3.5" />
                <span className="hidden sm:inline">预览</span>
              </Button>
              <Button
                variant={viewMode === 'markdown' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-l-none gap-1.5"
                onClick={() => setViewMode('markdown')}
              >
                <Code className="size-3.5" />
                <span className="hidden sm:inline">MD</span>
              </Button>
            </div>

            {/* 复制按钮 */}
            <Button
              variant={copied ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5 min-w-[100px]"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  复制 Markdown
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] custom-scrollbar">
          <div className="p-6 max-w-none">
            {viewMode === 'preview' ? (
              <div className="markdown-body">{article && <ReactMarkdown>{article}</ReactMarkdown>}</div>
            ) : (
              <pre className="bg-muted/50 rounded-lg p-4 text-base leading-relaxed whitespace-pre-wrap font-mono break-all custom-scrollbar max-h-[560px] overflow-auto">
                {article}
              </pre>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
