import { RadioOption } from "@/types";

/**
 * 押韵数量选项
 */
export const RAP_NUM_OPTIONS: RadioOption[] = [
  { value: 1, label: "单押" },
  { value: 2, label: "双押" },
  { value: 3, label: "三押" },
  { value: 4, label: "四押及以上" },
];

/**
 * 音调类型选项
 */
export const TONE_TYPE_OPTIONS: RadioOption[] = [
  { value: 0, label: "音调不限" },
  { value: 1, label: "尾调一致" },
  { value: 2, label: "完全一致" },
];

/**
 * 词长选项
 */
export const WORD_LENGTH_OPTIONS: RadioOption[] = [
  { value: 2, label: "双字" },
  { value: 3, label: "三字" },
  { value: 4, label: "四字" },
  { value: 5, label: "五字及以上" },
];

/**
 * 应用配置
 */
export const APP_CONFIG = {
  name: "押韵大师",
  description: "在线押韵,数十万的韵脚在线查询,是一款说唱freestyle的神器",
  keywords: "押韵,在线押韵,韵脚查询,freestyle,说唱",
  author: "周立翔",
} as const;

/**
 * API 配置
 */
export const API_CONFIG = {
  timeout: 10000,
  retryTimes: 3,
  retryDelay: 1000,
} as const;

export const STANDARD_WORDS = [
  {
    id: 1,
    word: "差",
    rate: 5,
    length: 2,
  },
  {
    id: 2,
    word: "你",
    rate: 4,
    length: 2,
  },
  {
    id: 3,
    word: "不",
    rate: 3,
    length: 2,
  },
  {
    id: 4,
    word: "快",
    rate: 2,
    length: 2,
  },
  {
    id: 5,
    word: "谁",
    rate: 1,
    length: 2,
  },
  {
    id: 6,
    word: "错",
    rate: 4,
    length: 2,
  },
  {
    id: 7,
    word: "闹",
    rate: 3,
    length: 2,
  },
  {
    id: 8,
    word: "乱",
    rate: 2,
    length: 2,
  },
  {
    id: 9,
    word: "句",
    rate: 1,
    length: 2,
  },
  {
    id: 10,
    word: "认",
    rate: 4,
    length: 2,
  },
  {
    id: 11,
    word: "控",
    rate: 2,
    length: 2,
  },
  {
    id: 12,
    word: "信",
    rate: 1,
    length: 2,
  },
  {
    id: 13,
    word: "家",
    rate: 4,
    length: 2,
  },
  {
    id: 14,
    word: "夜",
    rate: 3,
    length: 2,
  },
  {
    id: 15,
    word: "话",
    rate: 2,
    length: 2,
  },
  {
    id: 16,
    word: "血",
    rate: 1,
    length: 2,
  },
  {
    id: 17,
    word: "天",
    rate: 4,
    length: 2,
  },
  {
    id: 18,
    word: "强",
    rate: 3,
    length: 2,
  },
];
