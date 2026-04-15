# 公众号文章创作助手 🚀

一个基于 AI 的公众号文章自动创作工具，支持多种大语言模型，一键生成高质量文章。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## ✨ 功能特性

### 📝 文章创作
- **智能大纲生成**：输入选题后自动生成 3 个不同角度的文章大纲
- **多种写作风格**：幽默、吐槽、专业、轻松、热情、简洁、口语化、文艺、悬疑、励志
- **字数控制**：支持 500~3000 字任意范围
- **一键生成**：选择大纲后自动生成完整文章

### 📝 界面展示

<table>
  <tr>
    <td><img src="image/image-01.png" alt="界面截图 1" width="100%"></td>
    <td><img src="image/image-02.png" alt="界面截图 2" width="100%"></td>
  </tr>
  <tr>
    <td><img src="image/image-03.png" alt="界面截图 3" width="100%"></td>
    <td><img src="image/image-04.png" alt="界面截图 4" width="100%"></td>
  </tr>
  <tr>
    <td><img src="image/image-05.png" alt="界面截图 5" width="100%"></td>
    <td><img src="image/image-06.png" alt="界面截图 6" width="100%"></td>
  </tr>
</table>

### 🤖 多模型支持
支持市面上主流的大语言模型，所有模型均通过 OpenAI 兼容接口调用：

| 供应商 | 支持模型 |
|--------|----------|
| **智谱 AI** | GLM-4.7、GLM-5 |
| **阿里云** | 通义千问 (Qwen) 系列 |
| **MiniMax** | MiniMax-Text-01、MiniMax-M2.7 |

### 📜 历史记录
- 所有生成的文章自动保存到浏览器本地
- 随时查看和管理历史创作记录
- 支持单篇删除和批量清空

### 🔒 隐私安全
- 所有 API Key 存储在浏览器本地 (localStorage)
- 不上传任何敏感信息到第三方服务器
- 历史记录仅保存在你的浏览器中

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- Bun (推荐) 或 npm/pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/ai-article-creation.git
cd ai-article-creation

# 安装依赖 (推荐使用 Bun)
bun install

# 或者使用 npm
npm install
```

### 开发

```bash
# 启动开发服务器
bun dev

# 访问 http://localhost:3000
```

### 生产部署

```bash
# 构建
bun build

# 启动服务
bun start
```

### Docker 部署

```bash
# 构建镜像
docker build -t ai-article-creation .

# 运行容器
docker run -d -p 3000:3000 ai-article-creation
```

## 📖 使用说明

### 1. 配置 AI 模型

1. 点击右上角 **设置** 按钮
2. 选择预设模型或自定义配置
3. 输入对应平台的 API Key
4. 点击「添加配置」保存

### 2. 创作文章

1. **输入选题**：在选题框输入你的文章主题
2. **选择风格**：选择你想要的写作风格
3. **生成大纲**：点击「生成大纲」按钮
4. **选择大纲**：从 3 个大纲中选择一个最喜欢的
5. **选择字数**：设定目标字数范围
6. **生成文章**：点击大纲卡片上的「生成文章」按钮

### 3. 查看历史记录

1. 点击右上角 **时钟图标** 按钮
2. 浏览历史生成的文章
3. 可点击查看全文或删除不需要的记录

## ⚙️ API Key 获取指南

### 智谱 AI (GLM)
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入「个人中心」→「API Key 管理」
4. 创建新的 API Key

### 阿里云通义千问
1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 进入「API-KEY 管理」
4. 创建新的 API Key

### MiniMax
1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)
2. 注册/登录账号
3. 进入「用户中心」→「API Key 管理」
4. 获取 API Key

### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 进入「API Keys」页面
4. 创建新的 API Key

### Google Gemini
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 点击「Get API Key」
4. 创建新的 API Key

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI 库**: [React 19](https://react.dev/)
- **语言**: [TypeScript 5](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **组件**: [shadcn/ui](https://ui.shadcn.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **表单**: [React Hook Form](https://react-hook-form.com/)
- **验证**: [Zod](https://zod.dev/)

## 📁 项目结构

```
ai-article-creation/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/                # API 路由
│   │   │   ├── generate-article/    # 文章生成接口
│   │   │   └── generate-outlines/   # 大纲生成接口
│   │   └── page.tsx          # 主页面
│   ├── components/            # React 组件
│   │   ├── ui/               # shadcn UI 基础组件
│   │   ├── article-viewer.tsx     # 文章展示组件
│   │   ├── history-list-dialog.tsx # 历史记录弹窗
│   │   ├── model-config-dialog.tsx # 模型配置弹窗
│   │   └── outline-card.tsx       # 大纲卡片组件
│   └── lib/                  # 工具函数和类型定义
│       ├── ai-client.ts      # AI API 客户端
│       ├── history-store.ts  # 历史记录存储
│       └── model-store.ts    # 模型配置存储
├── public/                   # 静态资源
├── package.json
└── README.md
```

## 🔐 安全说明

- 所有 API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
- 历史记录同样存储在本地，清除浏览器数据会删除所有记录
- 建议在私人设备上使用，避免在公共电脑上保存 API Key

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 [MIT 协议](LICENSE) 开源

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- 感谢所有 AI 模型提供商的 API 支持

## 📬 联系方式

- 作者：[1344160559@qq.com](mailto:1344160559@qq.com)
- 项目地址：[GitHub](https://github.com/YOUR_USERNAME/ai-article-creation)

---

<p align="center">如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！</p>
