'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, FileText, Loader2 } from 'lucide-react'

export interface OutlineData {
  id: string
  style: string
  title: string
  summary: string
  sections: { heading: string; description: string }[]
}

interface OutlineCardProps {
  outline: OutlineData
  index: number
  isSelected: boolean
  isGenerating: boolean
  onSelect: (outline: OutlineData) => void
}

const STYLE_CONFIGS = [
  {
    icon: '🌟',
    gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    selectBorder: 'border-orange-400 dark:border-orange-600',
    dotColor: 'bg-orange-400',
  },
  {
    icon: '📊',
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    border: 'border-teal-200 dark:border-teal-800',
    badgeBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    selectBorder: 'border-teal-400 dark:border-teal-600',
    dotColor: 'bg-teal-400',
  },
  {
    icon: '📖',
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
    selectBorder: 'border-rose-400 dark:border-rose-600',
    dotColor: 'bg-rose-400',
  },
]

export default function OutlineCard({
  outline,
  index,
  isSelected,
  isGenerating,
  onSelect,
}: OutlineCardProps) {
  const config = STYLE_CONFIGS[index % STYLE_CONFIGS.length]

  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-md cursor-pointer bg-gradient-to-br ${config.gradient} ${
        isSelected ? `${config.selectBorder} border-2 shadow-lg` : `${config.border} border`
      }`}
      onClick={() => !isGenerating && onSelect(outline)}
    >
      <CardContent className="p-5">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <Badge variant="secondary" className={config.badgeBg}>
              {outline.style}
            </Badge>
          </div>
          {isSelected && (
            <div className={`size-3 rounded-full ${config.dotColor} animate-pulse`} />
          )}
        </div>

        {/* 标题 */}
        <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug">
          {outline.title}
        </h3>

        {/* 摘要 */}
        <p className="text-base text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {outline.summary}
        </p>

        <Separator className="my-3" />

        {/* 章节列表 */}
        <div className="space-y-1.5 mb-4">
          {outline.sections.map((section, i) => (
            <div key={i} className="flex items-start gap-2 text-base">
              <span
                className={`shrink-0 size-5 rounded-full ${config.dotColor}/20 flex items-center justify-center text-xs font-bold mt-0.5`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className="font-medium text-sm">{section.heading}</span>
                <span className="text-sm text-muted-foreground ml-1.5">
                  {section.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 生成按钮 */}
        <Button
          className={`w-full gap-2 ${
            isSelected
              ? 'bg-foreground text-background hover:bg-foreground/90'
              : ''
          }`}
          variant={isSelected ? 'default' : 'outline'}
          size="sm"
          disabled={isGenerating}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(outline)
          }}
        >
          {isGenerating && isSelected ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              正在生成文章...
            </>
          ) : (
            <>
              <FileText className="size-4" />
              生成文章
              <ChevronRight className="size-3.5 ml-auto" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
