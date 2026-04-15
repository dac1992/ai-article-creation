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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  Trash2,
  Plus,
  Zap,
  Check,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react'
import {
  type ModelConfig,
  loadModels,
  saveModels,
  addOrUpdateModel,
  removeModel,
} from '@/lib/model-store'

interface ModelConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  models: ModelConfig[]
  activeModelId: string
  onSelectModel: (id: string) => void
  onRefresh: () => void
}

const PRESETS = [
  {
    name: 'MiniMax 2.7',
    provider: 'minimax',
    baseUrl: 'https://api.minimax.chat/v1/chat/completions',
    modelId: 'MiniMax-M2.7',
    icon: '🚀',
  },
  {
    name: 'GLM-4.7',
    provider: 'zhipu',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    modelId: 'glm-4.7',
    icon: '🧠',
  },
  {
    name: 'GLM-5',
    provider: 'zhipu',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    modelId: 'glm-5',
    icon: '🔥',
  },
  {
    name: 'qwen3.5-plus',
    provider: 'aliyun',
    baseUrl: 'https://coding.dashscope.aliyuncs.com/v1/chat/completions',
    modelId: 'qwen3.5-plus',
    icon: '🌟',
  },
  {
    name: 'GPT-4o',
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    modelId: 'gpt-4o',
    icon: '🟢',
  },
  {
    name: 'Gemini-2.0-Flash',
    provider: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    modelId: 'gemini-2.0-flash',
    icon: '💫',
  },
]

export default function ModelConfigDialog({
  open,
  onOpenChange,
  models,
  activeModelId,
  onSelectModel,
  onRefresh,
}: ModelConfigDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    provider: 'custom',
    apiKey: '',
    baseUrl: '',
    modelId: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setFormData({ name: '', provider: 'custom', apiKey: '', baseUrl: '', modelId: '' })
      setEditingId(null)
      setShowApiKey(false)
    }
  }, [open])

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setFormData({
      name: preset.name,
      provider: preset.provider,
      apiKey: '',
      baseUrl: preset.baseUrl,
      modelId: preset.modelId,
    })
    setEditingId(null)
  }

  const startEdit = (model: ModelConfig) => {
    setFormData({
      name: model.name,
      provider: model.provider,
      apiKey: model.apiKey,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
    })
    setEditingId(model.id)
  }

  const handleSave = () => {
    if (!formData.name || !formData.apiKey || !formData.baseUrl || !formData.modelId) {
      return
    }
    setSaving(true)
    try {
      const current = loadModels()
      const updated = addOrUpdateModel(current, { ...formData, id: editingId || undefined })
      saveModels(updated)
      setFormData({ name: '', provider: 'custom', apiKey: '', baseUrl: '', modelId: '' })
      setEditingId(null)
      onRefresh()
    } catch (err) {
      console.error('保存失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    try {
      const current = loadModels()
      const updated = removeModel(current, id)
      saveModels(updated)
      onRefresh()
      if (activeModelId === id) {
        onSelectModel('')
      }
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  const handleSetActive = (id: string) => {
    onSelectModel(id)
  }

  const providerColors: Record<string, string> = {
    minimax: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    zhipu: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    aliyun: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    openai: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    gemini: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    custom: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="size-5 text-primary" />
            模型配置
          </DialogTitle>
          <DialogDescription>
            配置 AI 模型的 API 信息，支持通义千问、OpenAI、Gemini、MiniMax、智谱 GLM 等兼容 OpenAI 接口的模型
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 pb-4">
            {/* 预设快捷配置 */}
            <div>
              <p className="text-base font-medium mb-3">快速配置</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-auto py-1.5 px-3"
                    onClick={() => applyPreset(preset)}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* 表单 */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-name">模型名称</Label>
                    <Input
                      id="config-name"
                      placeholder="例如：我的 GLM-4"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="config-provider">供应商</Label>
                    <Select
                      value={formData.provider}
                      onValueChange={(val) => setFormData({ ...formData, provider: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zhipu">智谱 (Zhipu)</SelectItem>
                        <SelectItem value="minimax">MiniMax</SelectItem>
                        <SelectItem value="aliyun">阿里云通义千问</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="custom">自定义</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-apikey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="config-apikey"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="输入你的 API Key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-baseurl">接口地址</Label>
                  <Input
                    id="config-baseurl"
                    placeholder="https://open.bigmodel.cn/api/paas/v4/chat/completions"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    填写完整的 Chat Completions 接口地址
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config-modelid">模型 ID</Label>
                  <Input
                    id="config-modelid"
                    placeholder="例如：glm-4-plus"
                    value={formData.modelId}
                    onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={!formData.name || !formData.apiKey || !formData.baseUrl || !formData.modelId || saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      保存中...
                    </span>
                  ) : editingId ? (
                    '更新配置'
                  ) : (
                    <>
                      <Plus className="size-4" />
                      添加配置
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* 已配置的模型列表 */}
              {models.length > 0 && (
                <div>
                  <p className="text-base font-medium mb-3">
                    已配置的模型
                    <span className="text-muted-foreground font-normal ml-2">
                      (点击卡片选择使用)
                    </span>
                  </p>
                  <ScrollArea className="h-[180px] w-full border rounded-md p-3">
                    <div className="space-y-2 pr-3">
                      {models.map((model) => (
                        <div
                          key={model.id}
                          className={`relative flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            activeModelId === model.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }`}
                          onClick={() => handleSetActive(model.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {activeModelId === model.id && (
                              <Check className="size-4 text-primary shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-base truncate">{model.name}</span>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${providerColors[model.provider] || providerColors.custom}`}
                                >
                                  {model.provider}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {model.modelId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                startEdit(model)
                              }}
                            >
                              <Sparkles className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(model.id)
                              }}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {models.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="text-base">还没有配置任何模型</p>
                  <p className="text-xs mt-1">点击上方的预设按钮快速开始</p>
                </div>
              )}
            </div>
          </div>

        <DialogFooter className="p-4 pt-2 border-t shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
