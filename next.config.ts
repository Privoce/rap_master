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
    serverComponentsExternalPackages: ['nodejieba'], // 添加对 nodejieba 的支持
  },
  // 添加 webpack 外部化配置
  externals: {
    'nodejieba': 'commonjs nodejieba',
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
    // 处理 Sequelize 和 nodejieba 在服务端的兼容性问题
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'mysql2': 'commonjs mysql2',
        'nodejieba': 'commonjs nodejieba', // 添加 nodejieba 外部化
      });
    }
    
    // 忽略各种原生模块的警告
    config.ignoreWarnings = [
      { module: /node_modules\/sequelize/ },
      { file: /node_modules\/sequelize/ },
      { module: /node_modules\/nodejieba/ },
      { file: /node_modules\/nodejieba/ },
      { module: /node_modules\/@mapbox/ },
      { file: /node_modules\/@mapbox/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    
    // 添加对 .html 文件的处理（忽略）
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/resource',
      generator: {
        emit: false,
      },
    });
    
    // 忽略 node-pre-gyp 的一些问题文件
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mapbox/node-pre-gyp/lib/util/nw-pre-gyp': false,
      '@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html': false,
    };
    
    // 完全忽略这些有问题的文件
    config.plugins.push({
      apply: (compiler: any) => {
        compiler.hooks.normalModuleFactory.tap('IgnorePlugin', (factory: any) => {
          factory.hooks.beforeResolve.tap('IgnorePlugin', (data: any) => {
            if (data.request && data.request.includes('nw-pre-gyp/index.html')) {
              return false;
            }
            return data;
          });
        });
      },
    });
    
    return config;
  },
};

export default nextConfig;
