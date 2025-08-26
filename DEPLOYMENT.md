# 部署指南

## 修复跨域问题的说明

### 问题原因
跨域问题通常出现在以下情况：
1. 前端代码中硬编码了 `localhost:3000` 地址
2. 服务器部署后，客户端尝试从不同的域名访问本地地址

### 已实施的解决方案

#### 1. API 客户端配置修复
- 修改 `src/lib/api.ts` 使用相对路径 `/api` 而不是绝对路径
- 这样确保 API 请求始终指向当前域名

#### 2. 添加 CORS 中间件
- 创建 `src/middleware.ts` 处理跨域请求
- 为所有 API 路由添加必要的 CORS 头部

#### 3. Next.js 配置
- 在 `next.config.ts` 中添加 CORS 头部配置
- 配置 webpack 外部依赖以支持 Sequelize

#### 4. 环境配置清理
- 移除硬编码的 localhost 地址
- 使用相对路径确保在任何域名下都能正常工作

### 部署检查清单

#### 部署前：
1. ✅ 确保 `.env` 文件包含正确的数据库配置
2. ✅ 检查没有硬编码的 localhost 地址
3. ✅ 验证 API 路由使用相对路径

#### 部署后：
1. 检查 API 端点是否可访问：`https://yourdomain.com/api/words`
2. 在浏览器开发者工具中检查网络请求
3. 确认没有 CORS 错误

### 环境变量配置

创建 `.env` 文件：
```bash
# 数据库配置
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=rap_db
DB_HOST=your_db_host
DB_PORT=3306

# 应用配置
NODE_ENV=production
PORT=3000
```

### 常见问题排查

#### 1. 仍然出现 CORS 错误
- 检查服务器是否正确启动
- 验证 API 路由是否可以直接访问
- 检查浏览器控制台的网络请求 URL

#### 2. API 请求失败
- 确认数据库连接配置正确
- 检查服务器日志中的错误信息
- 验证数据库表是否存在

#### 3. 静态文件问题
- 确保 Next.js 正确构建：`npm run build`
- 检查生产环境启动：`npm start`

### 验证部署成功

1. 打开应用首页
2. 输入一个词语进行搜索
3. 检查是否返回押韵结果
4. 在开发者工具中确认 API 请求成功
