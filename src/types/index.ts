import { z } from 'zod'

// 押韵词条类型
export const RhythmSchema = z.object({
  id: z.number().optional(),
  word: z.string(),
  rate: z.number(),
  length: z.number(),
  initial: z.string(),
  final_with_tone: z.string(),
  final_without_tone: z.string(),
  type_with_tone: z.string(),
  type_without_tone: z.string(),
})

export type Rhythm = z.infer<typeof RhythmSchema>

// 词语信息类型（用于内部处理）
export interface WordInfo {
  word: string;
  rate: number;
  length: number;
  initial: string;
  final_with_tone: string;
  final_without_tone: string;
  type_with_tone: string;
  type_without_tone: string;
}

// API 响应类型
export const ApiResponseSchema = z.object({
  code: z.number(),
  err_tips: z.string().optional(),
  data: z.array(RhythmSchema).optional(),
})

export type ApiResponse<T = Rhythm[]> = {
  code: number
  err_tips?: string
  data?: T
}

// 搜索参数类型
export const SearchParamsSchema = z.object({
  word: z.string().min(1, '请输入要查询的韵脚'),
  rap_num: z.number().int().min(1).max(4).default(1),
  tone_type: z.number().int().min(0).max(2).default(0),
})

export type SearchParams = z.infer<typeof SearchParamsSchema>

// 常量类型
export interface RadioOption {
  value: number
  label: string
  style?: React.CSSProperties
}

export type RapNumType = 1 | 2 | 3 | 4
export type ToneType = 0 | 1 | 2
export type WordLength = 2 | 3 | 4 | 5
