# 押韵大师 (Rap Master)

一个现代化的在线押韵查询工具，使用 Next.js 15 + Ant Design 5 构建。

## 🚀 功能特性

- **智能押韵查询**：支持单押、双押、三押和四押及以上
- **灵活音调控制**：音调不限、尾调一致、完全一致
- **词长筛选**：支持2-5字及以上的词语查询
- **现代化界面**：基于 Ant Design 5 和 TailwindCSS 的响应式设计
- **实时搜索**：防抖搜索，提升用户体验
- **热度标识**：按词频热度显示不同颜色标签

## 🛠️ 技术栈

- **前端框架**：Next.js 15 (App Router)
- **UI 库**：Ant Design 5
- **样式方案**：TailwindCSS + CSS Modules
- **类型安全**：TypeScript 5.7
- **数据验证**：Zod
- **开发工具**：ESLint, PostCSS

## 📦 安装与运行

### 环境要求

- Node.js 18.17 或更高版本
- pnpm 包管理器

### 安装依赖

```bash
cd rap_master
pnpm install
```

### 开发模式

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
pnpm build
pnpm start
```

## 🏗️ 项目结构

```
src/
├── app/                    # App Router 页面
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── Empty.tsx          # 空状态组件
│   ├── Loading.tsx        # 加载组件
│   ├── RadioGroup.tsx     # 单选组组件
│   └── RhymeTag.tsx       # 押韵标签组件
├── lib/                   # 工具库
│   ├── api.ts             # API 客户端
│   ├── constants.ts       # 常量定义
│   └── utils.ts           # 工具函数
└── types/                 # TypeScript 类型定义
    └── index.ts
```

## 🔧 配置说明

### Ant Design 主题配置

在 `src/app/layout.tsx` 中可以自定义 Ant Design 主题：

```tsx
const antdTheme = {
  token: {
    colorPrimary: '#0ea5e9',
    borderRadius: 8,
  },
}
```

### TailwindCSS 配置

在 `tailwind.config.ts` 中可以扩展样式：

```ts
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',
      }
    }
  }
}
```

## 📱 API 文档

### 获取押韵词汇

```
GET /api/words?word=唱&rap_num=1&tone_type=0&length=2
```

**参数说明：**

- `word`: 要查询的韵脚（必需）
- `rap_num`: 押韵数量 (1-4)
- `tone_type`: 音调类型 (0=不限, 1=尾调一致, 2=完全一致)
- `length`: 词语长度 (2-5)

**响应格式：**

```json
{
  "code": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "word": "演唱",
      "rate": 8500,
      "length": 2,
      "initial": "y-ch",
      "final_with_tone": "an3-ang4",
      "final_without_tone": "an-ang",
      "type_with_tone": "an3-ang4",
      "type_without_tone": "an-ang"
    }
  ]
}
```

## 🎨 设计系统

### 颜色方案

- **主色调**：蓝色系 (#0ea5e9)
- **辅助色**：紫色系 (#8b5cf6)
- **中性色**：灰色系

### 热度标识

- 🔥 **热门词汇**：红色标签，使用频率极高
- 🌟 **流行词汇**：橙色标签，使用频率较高
- 👍 **常用词汇**：蓝色标签，使用频率中等
- 💎 **冷门词汇**：灰色标签，使用频率较低

## 🚦 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 使用 `clsx` 和 `tailwind-merge` 处理动态样式

### 性能优化

- 使用防抖搜索减少 API 请求
- 组件懒加载
- 图片优化（Next.js Image 组件）
- CSS 树摇和代码分割

## 📄 许可证

本项目采用 MIT 许可证。

## 👨‍💻 作者

周立翔

---

**押韵大师** - 让说唱创作更简单 🎤
