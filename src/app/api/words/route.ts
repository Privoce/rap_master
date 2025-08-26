import { NextRequest, NextResponse } from 'next/server'
import { SearchParamsSchema, ApiResponse, Rhythm } from '@/types'
import { formatError } from '@/lib/utils'

// 模拟数据库查询（实际项目中应该连接真实数据库）
const mockDatabase: Rhythm[] = [
  {
    id: 1,
    word: "演唱",
    rate: 8500,
    length: 2,
    initial: "y-ch",
    final_with_tone: "an3-ang4",
    final_without_tone: "an-ang",
    type_with_tone: "an3-ang4",
    type_without_tone: "an-ang"
  },
  {
    id: 2,
    word: "传唱",
    rate: 7200,
    length: 2,
    initial: "ch-ch",
    final_with_tone: "uan2-ang4",
    final_without_tone: "uan-ang",
    type_with_tone: "uan2-ang4",
    type_without_tone: "uan-ang"
  },
  {
    id: 3,
    word: "歌唱",
    rate: 9100,
    length: 2,
    initial: "g-ch",
    final_with_tone: "e1-ang4",
    final_without_tone: "e-ang",
    type_with_tone: "e1-ang4",
    type_without_tone: "e-ang"
  },
  {
    id: 4,
    word: "高唱",
    rate: 6800,
    length: 2,
    initial: "g-ch",
    final_with_tone: "ao1-ang4",
    final_without_tone: "ao-ang",
    type_with_tone: "ao1-ang4",
    type_without_tone: "ao-ang"
  },
  {
    id: 5,
    word: "独唱",
    rate: 5400,
    length: 2,
    initial: "d-ch",
    final_with_tone: "u2-ang4",
    final_without_tone: "u-ang",
    type_with_tone: "u2-ang4",
    type_without_tone: "u-ang"
  }
]

/**
 * 获取词汇的拼音信息（简化版本）
 */
function getWordInfo(word: string) {
  // 这里应该调用真实的拼音解析库
  // 简化处理，返回模拟数据
  return {
    type_with_tone: "ang4",
    type_without_tone: "ang"
  }
}

/**
 * 从模拟数据库查询押韵词汇
 */
function queryRhymes(params: {
  word: string
  type_with_tone: string
  type_without_tone: string
  length: number
  rap_num: number
  tone_type: number
}): Rhythm[] {
  const { word, type_without_tone, length } = params
  
  return mockDatabase.filter(item => {
    // 排除查询词本身
    if (item.word === word) return false
    
    // 长度匹配
    if (length <= 5 && item.length !== length) return false
    if (length > 5 && item.length < length) return false
    
    // 韵母匹配（简化版本）
    return item.type_without_tone.includes(type_without_tone)
  }).sort((a, b) => b.rate - a.rate)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 解析查询参数
    const rawParams = {
      word: searchParams.get('word') || '',
      rap_num: parseInt(searchParams.get('rap_num') || '1'),
      tone_type: parseInt(searchParams.get('tone_type') || '0'),
      length: parseInt(searchParams.get('length') || '2'),
    }

    // 参数验证
    const validationResult = SearchParamsSchema.safeParse(rawParams)
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        code: 400,
        message: '参数无效: ' + validationResult.error.errors.map(e => e.message).join(', ')
      }, { status: 400 })
    }

    const params = validationResult.data

    // 如果搜索词为空，返回空结果
    if (!params.word.trim()) {
      return NextResponse.json<ApiResponse>({
        code: 0,
        message: '查询成功',
        data: []
      })
    }

    // 获取词汇拼音信息
    const wordInfo = getWordInfo(params.word)
    
    // 生成查询条件
    const type_without_tone = wordInfo.type_without_tone
      .split('-')
      .slice(-params.rap_num)
      .join('-')
    
    const type_with_tone_arr = wordInfo.type_with_tone.split('-')
    const num = params.tone_type > 1 ? params.rap_num : params.tone_type
    const type_with_tone = num === 0 ? '' : type_with_tone_arr.slice(-num).join('-')

    // 查询押韵词汇
    const results = queryRhymes({
      word: params.word,
      type_with_tone,
      type_without_tone,
      length: params.length,
      rap_num: params.rap_num,
      tone_type: params.tone_type
    })

    return NextResponse.json<ApiResponse>({
      code: 0,
      message: '查询成功',
      data: results
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json<ApiResponse>({
      code: 500,
      message: formatError(error)
    }, { status: 500 })
  }
}
