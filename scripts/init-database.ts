import { connectDatabase, syncDatabase } from '@/lib/database';

/**
 * 数据库初始化脚本
 */
async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 连接数据库
    const connected = await connectDatabase();
    if (!connected) {
      console.error('数据库连接失败');
      process.exit(1);
    }
    
    // 同步数据库模型
    const synced = await syncDatabase();
    if (!synced) {
      console.error('数据库模型同步失败');
      process.exit(1);
    }
    
    console.log('数据库初始化完成');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
if (require.main === module) {
  initDatabase();
}

export { initDatabase };
