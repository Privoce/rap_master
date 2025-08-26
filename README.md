# 押韵大师 (Rap Master)

一个现代化的在线押韵查询工具，使用 Next.js 15 + TypeScript + MySQL 构建。

## 🚀 功能特性

- **智能押韵查询**：支持单押、双押、三押和四押及以上
- **灵活音调控制**：音调不限、尾调一致、完全一致
- **词长筛选**：支持2-5字及以上的词语查询
- **现代化界面**：基于 Ant Design 5 和 TailwindCSS 的响应式设计
- **全栈应用**：内置API后端，无需单独部署后端服务
- **数据库支持**：使用 MySQL + Sequelize ORM 进行数据管理
- **热度标识**：按词频热度显示不同颜色标签

## 🛠️ 技术栈

### 前端
- **框架**：Next.js 15 (App Router)
- **UI 库**：Ant Design 5
- **样式**：TailwindCSS + CSS Modules
- **状态管理**：React Hooks
- **类型安全**：TypeScript 5.7

### 后端
- **运行时**：Next.js API Routes
- **数据库**：MySQL 8.0+
- **ORM**：Sequelize 6
- **数据验证**：Zod
- **拼音处理**：pinyin-pro

## 📦 安装与配置

### 环境要求

- Node.js 18.17 或更高版本
- MySQL 8.0 或更高版本
- pnpm 包管理器

### 1. 克隆项目

```bash
git clone <repository-url>
cd rap_master
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
# 数据库配置
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=rap_db
DB_HOST=localhost
DB_PORT=3306

# 开发环境配置
NODE_ENV=development
PORT=3000

# API 配置
NEXT_PUBLIC_API_BASE_URL=/api
```

### 4. 初始化数据库

```bash
# 初始化数据库结构
pnpm db:init

# 导入词汇数据（可选）
pnpm db:import
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 项目结构

```
src/
├── app/                    # App Router 页面和API
│   ├── api/               # API 路由
│   │   ├── words/         # 词汇相关API
│   │   └── database/      # 数据库相关API
│   ├── rap/               # 兼容老项目的API路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── Empty.tsx          # 空状态组件
│   ├── Loading.tsx        # 加载组件
│   ├── RadioGroup.tsx     # 单选组组件
│   └── RhymeTag.tsx       # 押韵标签组件
├── lib/                   # 核心库
│   ├── api.ts             # API 客户端
│   ├── database.ts        # 数据库连接和模型
│   ├── pinyin.ts          # 拼音处理工具
│   ├── response.ts        # API响应工具
│   └── services/          # 业务逻辑服务
│       └── wordService.ts # 词汇服务
├── config/                # 配置文件
│   └── env.ts            # 环境配置
├── types/                 # TypeScript 类型定义
│   └── index.ts
└── utils/                 # 工具函数
    └── common.ts
scripts/                   # 脚本文件
├── init-database.ts       # 数据库初始化脚本
└── import-words.ts        # 词汇数据导入脚本
old_project/               # 原项目代码（参考）
```

## � API 文档

### 获取押韵词汇摘要

```
GET /api/words?word=唱&rap_num=1&tone_type=0
```

### 获取指定长度的押韵词汇

```
GET /api/words?word=唱&rap_num=1&tone_type=0&length=2
```

### 兼容老项目的接口

```
GET /rap/summary?word=唱&rap_num=1&tone_type=0
GET /rap/summary/get_words?word=唱&rap_num=1&tone_type=0&length=2
```

**参数说明：**

- `word`: 要查询的韵脚（必需）
- `rap_num`: 押韵数量 (1-4)
- `tone_type`: 音调类型 (0=不限, 1=尾调一致, 2=完全一致)
- `length`: 词语长度 (2-5，可选)

**响应格式：**

```json
{
  "code": 0,
  "err_tips": "success",
  "data": [
    {
      "id": 1,
      "word": "演唱",
      "rate": 8500,
      "length": 2,
      "initial": "y-ch",
      "final_with_tone": "an3-ang4",
      "final_without_tone": "an-ang",
      "type_with_tone": "13.3-16.4",
      "type_without_tone": "13-16"
    }
  ]
}
```

## 🗄️ 数据库结构

### word 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| word | VARCHAR(255) | 词语 |
| rate | INTEGER | 使用频率 |
| initial | VARCHAR(255) | 声母 |
| final_with_tone | VARCHAR(255) | 带音调韵母 |
| final_without_tone | VARCHAR(255) | 不带音调韵母 |
| type_with_tone | VARCHAR(255) | 带音调韵母类型 |
| type_without_tone | VARCHAR(255) | 不带音调韵母类型 |
| length | INTEGER | 词语长度 |

## � 部署指南

### 生产构建

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

### Docker 部署（推荐）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 从老项目迁移

本项目完全重构了原有的 Express.js 后端，现在是一个完整的 Next.js 全栈应用：

### 主要变化

1. **架构变化**：从 Express.js + React 分离架构 → Next.js 全栈架构
2. **语言升级**：JavaScript → TypeScript
3. **API 路由**：Express 路由 → Next.js API Routes
4. **数据库**：保持 MySQL + Sequelize，但升级到 v6
5. **兼容性**：保留原有 API 接口路径以确保兼容性

### 迁移步骤

1. 配置新的数据库连接
2. 运行数据库初始化脚本
3. 导入原有词汇数据
4. 更新前端API调用地址（如果需要）

## 📄 许可证

本项目采用 MIT 许可证。

---

**押韵大师** - 让说唱创作更简单 🎤
