import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, SearchParams, Rhythm } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api' 
        : '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log('API Response:', response.status, response.data)
        return response
      },
      (error) => {
        console.error('API Response Error:', error)
        
        if (error.response?.status === 404) {
          throw new Error('API 接口不存在')
        }
        if (error.response?.status >= 500) {
          throw new Error('服务器内部错误')
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('请求超时，请稍后重试')
        }
        
        throw new Error(error.message || '网络请求失败')
      }
    )
  }

  /**
   * 获取押韵词汇
   */
  async getRhymes(params: SearchParams): Promise<Rhythm[]> {
    try {
      const response = await this.client.get<ApiResponse<Rhythm[]>>('/words', {
        params,
      })
      
      if (response.data.code === 0) {
        return response.data.data || []
      } else {
        throw new Error(response.data.err_tips || '获取数据失败')
      }
    } catch (error) {
      console.error('获取押韵数据失败:', error)
      throw error
    }
  }

  /**
   * 通用 GET 请求
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  /**
   * 通用 POST 请求
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
export default apiClient
