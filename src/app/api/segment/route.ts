import { NextRequest, NextResponse } from 'next/server';

// // 动态导入 nodejieba（避免 SSR 问题）
// let jieba: any = null;

// async function getJieba() {
//   if (!jieba) {
//     try {
//       // 使用动态导入而不是 require
//       jieba = await import('nodejieba');
//     } catch (error) {
//       console.error('Failed to load nodejieba:', error);
//       throw new Error('分词服务不可用');
//     }
//   }
//   return jieba;
// }
/**
 * POST /api/segment - 文本分词接口
 */
export async function POST(request: NextRequest) {
  // try {
  //   const { text, minLength = 2, maxLength = 4 } = await request.json();

  //   if (!text || typeof text !== 'string') {
  //     return NextResponse.json(
  //       {
  //         code: 400,
  //         message: '请提供有效的文本内容',
  //         words: [],
  //       },
  //       { status: 400 }
  //     );
  //   }

  //   // 获取jieba实例
  //   const jieba = await getJieba();
    
  //   // 使用jieba进行分词
  //   const words = jieba.cut(text);

  //   // 过滤结果：只保留指定长度的中文词汇
  //   const filteredWords = words.filter((word: string) => {
  //     const trimmedWord = word.trim();
  //     return (
  //       trimmedWord.length >= minLength &&
  //       trimmedWord.length <= maxLength &&
  //       /^[\u4e00-\u9fa5]+$/.test(trimmedWord) // 只保留纯中文
  //     );
  //   });

  //   // 去重
  //   const uniqueWords = [...new Set(filteredWords)];

  //   return NextResponse.json({
  //     code: 0,
  //     message: 'success',
  //     text,
  //     words: uniqueWords,
  //     total: uniqueWords.length,
  //   });

  // } catch (error) {
  //   console.error('分词API错误:', error);
  //   return NextResponse.json(
  //     {
  //       code: 500,
  //       message: error instanceof Error ? error.message : '分词服务内部错误',
  //       words: [],
  //     },
  //     { status: 500 }
  //   );
  // }
}