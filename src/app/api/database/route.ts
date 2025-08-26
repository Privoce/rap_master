import { NextResponse } from 'next/server';
import { connectDatabase, syncDatabase } from '@/lib/database';

/**
 * GET /api/database - 测试数据库连接
 */
export async function GET() {
  try {
    const connected = await connectDatabase();
    
    if (connected) {
      await syncDatabase();
      return NextResponse.json({
        code: 0,
        err_tips: 'success',
        data: {
          status: 'connected',
          message: '数据库连接成功'
        },
      });
    } else {
      return NextResponse.json({
        code: 500,
        err_tips: '数据库连接失败',
        data: null,
      });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        code: 500,
        err_tips: '数据库连接错误',
        data: null,
      },
      { status: 500 }
    );
  }
}