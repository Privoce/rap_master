import { NextRequest, NextResponse } from 'next/server';
import { getWordModel, connectDatabase } from '@/lib/database';
import { Op } from 'sequelize';

/**
 * POST /api/word-rates - 批量查询词语评分
 */
export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        {
          code: 400,
          message: '请提供有效的词语数组',
          wordRates: [],
        },
        { status: 400 }
      );
    }

    // 确保数据库连接
    await connectDatabase();
    const WordModel = getWordModel();

    // 批量查询词语
    const results = await WordModel.findAll({
      where: {
        word: {
          [Op.in]: words,
        },
      },
      attributes: ['word', 'rate', 'final_without_tone', 'final_with_tone', 'initial'],
    });

    // 创建查询结果映射
    const resultMap = new Map();
    results.forEach(result => {
      const data = result.toJSON();
      resultMap.set(data.word, {
        rate: data.rate,
        final_with_tone: data.final_with_tone,
        final_without_tone: data.final_without_tone,
        initial: data.initial,
      });
    });

    // 构建返回结果，包含未找到的词语
    const wordRates = words.map(word => ({
      word,
      rate: resultMap.get(word) || 0,
      found: resultMap.has(word),
    }));

    return NextResponse.json({
      code: 0,
      message: 'success',
      wordRates,
      total: wordRates.length,
      found: wordRates.filter(wr => wr.found).length,
      notFound: wordRates.filter(wr => !wr.found).length,
    });

  } catch (error) {
    console.error('词语评分查询API错误:', error);
    return NextResponse.json(
      {
        code: 500,
        message: '词语评分查询服务内部错误',
        wordRates: [],
      },
      { status: 500 }
    );
  }
}
