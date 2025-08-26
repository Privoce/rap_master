export const apiPath =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://rap.zlxiang.com';

/**
 * 环境配置
 */
export const config = {
  // 服务器端口
  PORT: process.env.PORT || 3000,
  
  // 数据库配置
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_DATABASE: process.env.DB_DATABASE || 'rap_db',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  
  // 环境模式
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API 配置
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
};

export default config;
