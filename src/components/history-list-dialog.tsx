'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  History,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Hash,
  Palette,
  X,
} from 'lucide-react'
import {
  type ArticleHistory,
  loadHistory,
  saveHistory,
  removeHistoryItem,
  clearHistory,
} from '@/lib/history-store'
import ArticleViewer from '@/components/article-viewer'

interface HistoryListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HistoryListDialog({ open, onOpenChange }: HistoryListDialogProps) {
  const [history, setHistory] = useState<ArticleHistory[]>(() => loadHistory())
  const [viewingArticle, setViewingArticle] = useState<ArticleHistory | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // 每次打开弹窗时重新加载历史数据
  useEffect(() => {
    if (open) {
      setHistory(loadHistory())
    }
  }, [open])

  const refreshHistory = () => {
    setHistory(loadHistory())
  }

  const handleView = (item: ArticleHistory) => {
    setViewingArticle(item)
  }

  const handleDelete = (id: string) => {
    const updated = removeHistoryItem(history, id)
    saveHistory(updated)
    setHistory(updated)
    setShowDeleteConfirm(null)
  }

  const handleClearAll = () => {
    saveHistory([])
    setHistory([])
    setShowClearConfirm(false)
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes}分钟前`
      }
      return `${hours}小时前`
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <History className="size-5 text-primary" />
              历史记录
            </DialogTitle>
            <DialogDescription>
              查看和管理之前生成的文章，所有数据存储在浏览器本地
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="size-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">暂无历史记录</p>
                <p className="text-sm mt-1">生成的文章会自动保存到这里</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">共 {history.length} 篇</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-8"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    <Trash2 className="size-3.5 mr-1" />
                    清空全部
                  </Button>
                </div>

                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="size-4 text-primary shrink-0" />
                          <h3 className="font-medium text-base truncate">{item.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.outline.summary}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs gap-1">
                            <Palette className="size-3" />
                            {item.style}
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Hash className="size-3" />
                            {item.wordCount}字
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Calendar className="size-3" />
                            {formatDate(item.createdAt)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleView(item)}
                        >
                          <Eye className="size-3.5" />
                          查看
                        </Button>
                        {showDeleteConfirm === item.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8"
                              onClick={() => handleDelete(item.id)}
                            >
                              确认
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => setShowDeleteConfirm(item.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="p-4 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 查看文章详情弹窗 */}
      {viewingArticle && (
        <Dialog open={!!viewingArticle} onOpenChange={() => setViewingArticle(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 pb-2 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg">{viewingArticle.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {viewingArticle.style}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {viewingArticle.wordCount}字
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(viewingArticle.createdAt)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewingArticle(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </DialogHeader>
            <ScrollArea className="flex-1 p-4">
              <ArticleViewer
                article={viewingArticle.content}
                title={viewingArticle.title}
                style={viewingArticle.style}
                wordCount={viewingArticle.wordCount}
                loading={false}
                onBack={() => {}}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* 清空历史确认框 */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空历史记录？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销，所有历史记录都将被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>确认清空</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
