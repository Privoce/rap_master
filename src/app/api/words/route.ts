import { NextRequest, NextResponse } from 'next/server';
import wordService from '@/lib/services/wordService';
import { syncDatabase } from '@/lib/database';

// 初始化数据库连接
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await syncDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
}

/**
 * GET /api/words - 获取押韵词汇摘要（总是返回所有长度的词汇）
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word') || '';
    const rap_num = searchParams.get('rap_num') || '1';
    const tone_type = searchParams.get('tone_type') || '0';

    // 总是返回摘要（所有长度的词汇）
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
        err_tips: error instanceof Error ? error.message : '服务器内部错误',
        data: null,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/words - 批量添加词汇
 */
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { words } = body;

    if (!Array.isArray(words)) {
      return NextResponse.json(
        {
          code: 400,
          err_tips: '参数错误：words必须是数组',
          data: null,
        },
        { status: 400 }
      );
    }

    const result = await wordService.addWords(words);
    
    return NextResponse.json({
      code: 0,
      err_tips: 'success',
      data: result,
    });
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