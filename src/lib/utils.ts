import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 获取热度等级
 */
export function getHotLevel(length: number, rate: number): string {
  const HOT_MAP = ['rate-hot', 'rate-popular', 'rate-common', 'rate-rare']
  
  const HOT_LEVEL: Record<number, number[]> = {
    2: [5000, 500, 30],
    3: [1500, 300, 30],
    4: [5000, 500, 10],
    5: [300, 50, 5],
  }

  const thresholds = HOT_LEVEL[length > 5 ? 5 : length]
  
  for (let i = 0; i < thresholds.length; i++) {
    if (rate > thresholds[i]) {
      return HOT_MAP[i]
    }
  }
  
  return HOT_MAP[HOT_MAP.length - 1]
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 格式化错误信息
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return '发生了未知错误'
}
