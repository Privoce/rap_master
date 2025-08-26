import { NextRequest, NextResponse } from 'next/server';
import wordService from '@/lib/services/wordService';
import { connectDatabase, syncDatabase } from '@/lib/database';

// 初始化数据库连接
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    await connectDatabase();
    await syncDatabase();
    dbInitialized = true;
  }
}

/**
 * GET /rap/summary - 兼容老项目的摘要接口
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word') || '';
    const rap_num = searchParams.get('rap_num') || '1';
    const tone_type = searchParams.get('tone_type') || '0';

    const result = await wordService.getSummary({
      word,
      rap_num,
      tone_type,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        code: 500,
        err_tips: '服务器内部错误',
        data: null,
      },
      { status: 500 }
    );
  }
}
