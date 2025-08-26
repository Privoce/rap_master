import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 在构建时完全忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时完全忽略 TypeScript 类型检查错误
    ignoreBuildErrors: true,
  },
  // 实验性功能：禁用严格模式
  experimental: {
    forceSwcTransforms: true,
  },
  async headers() {
    return [
      {
        // 为所有 API 路由添加 CORS 头部
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // 如果需要支持 webpack 的外部依赖
  webpack: (config, { isServer }) => {
    // 处理 Sequelize 在服务端的兼容性问题
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'mysql2': 'commonjs mysql2',
      });
    }
    
    // 忽略 Sequelize 的警告
    config.ignoreWarnings = [
      { module: /node_modules\/sequelize/ },
      { file: /node_modules\/sequelize/ },
    ];
    
    return config;
  },
};

export default nextConfig;
