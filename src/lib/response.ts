import type { ApiResponse } from '@/types';

/**
 * 成功响应
 * @param data 返回的数据
 * @returns 标准化的成功响应
 */
export function success<T = any>(data: T): ApiResponse<T> {
  return {
    code: 0,
    err_tips: 'success',
    data,
  };
}

/**
 * 参数错误响应
 * @returns 标准化的参数错误响应
 */
export function paramErr<T = any>(): ApiResponse<T> {
  return {
    code: 400,
    err_tips: '参数错误',
  } as ApiResponse<T>;
}

/**
 * 系统错误响应
 * @param err 错误信息
 * @returns 标准化的系统错误响应
 */
export function systemErr<T = any>(err: any): ApiResponse<T> {
  const errorMessage = err instanceof Error ? err.message : String(err);
  return {
    code: 500,
    err_tips: errorMessage,
  } as ApiResponse<T>;
}