---
Task ID: 1
Agent: Super Z (Main)
Task: 构建公众号文章创作助手应用

Work Log:
- 分析用户需求：选题输入 → 3种风格大纲生成 → 文章内容生成 → 一键复制Markdown
- 初始化 Next.js 16 项目环境（已有 fullstack 脚本）
- 更新 Prisma Schema，新增 ModelConfig 模型存储模型配置
- 创建 AI 客户端工具 (src/lib/ai-client.ts)，支持 OpenAI 兼容 API
- 创建 3 个 API 路由：
  - /api/models (GET/POST/DELETE) - 模型配置 CRUD
  - /api/generate-outlines (POST) - 生成3种风格大纲
  - /api/generate-article (POST) - 根据大纲生成完整文章
- 推送数据库 Schema 并生成 Prisma Client
- 创建前端组件：
  - ModelConfigDialog - 模型配置管理对话框（预设 MiniMax/GLM 系列）
  - OutlineCard - 大纲卡片（3种风格不同配色）
  - ArticleViewer - 文章查看器（Markdown 预览/源码切换、一键复制）
- 创建主页面 (src/app/page.tsx) - 完整的三步工作流
- 更新全局样式 (globals.css) - 暖色调主题、Markdown 渲染样式、自定义滚动条
- 更新 layout.tsx - 中文语言、Sonner 通知
- ESLint 检查通过，编译成功无错误

Stage Summary:
- 完整的公众号文章创作工具已构建完成
- 支持 MiniMax、智谱 GLM 等多种 OpenAI 兼容 API
- AI 提示词已内置写作要求（禁用词检查、代词使用、热情文风等）
- 三步工作流：选题 → 大纲选择 → 文章生成
- 文章支持 Markdown 预览和源码查看，一键复制
