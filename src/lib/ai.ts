import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// AI API 请求的接口定义
export interface AIRequest {
  model?: string; // 改为可选，因为便捷方法会自动设置默认模型
  prompt?: string;
  messages?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    [key: string]: any;
  };
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

// Ollama 本地 API 配置
interface OllamaConfig {
  baseURL: string;
  timeout?: number;
}

// 远程 AI API 配置
interface RemoteAIConfig {
  apiKey: string;
  baseURL: string;
  model?: string;
  timeout?: number;
}

// Ollama 本地请求类
class OllamaClient {
  private config: OllamaConfig;
  private client: any;

  constructor(config: OllamaConfig) {
    this.config = {
      baseURL: config.baseURL || 'http://localhost:11434',
      timeout: config.timeout || 30000,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    try {
      const payload = {
        model: request.model,
        prompt: request.prompt,
        stream: request.stream || false,
        options: request.options || {},
      };

      const response: AxiosResponse = await this.client.post('/api/generate', payload);

      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
      };
    } catch (error: any) {
      console.error('Ollama API Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Unknown error',
      };
    }
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    try {
      const payload = {
        model: request.model,
        messages: request.messages,
        stream: request.stream || false,
        options: request.options || {},
      };

      const response: AxiosResponse = await this.client.post('/api/chat', payload);

      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
      };
    } catch (error: any) {
      console.error('Ollama Chat API Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Unknown error',
      };
    }
  }

  async listModels(): Promise<AIResponse> {
    try {
      const response: AxiosResponse = await this.client.get('/api/tags');

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Ollama List Models Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Unknown error',
      };
    }
  }
}

// 远程 AI API 客户端
class RemoteAIClient {
  private config: RemoteAIConfig;
  private client: any;

  constructor(config: RemoteAIConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      model: config.model,
      timeout: config.timeout || 30000,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    try {
      const payload = {
        model: request.model || this.config.model,
        messages: request.messages || [
          { role: 'user', content: request.prompt || '' }
        ],
        temperature: request.options?.temperature || 0.7,
        max_tokens: request.options?.max_tokens || 1000,
        top_p: request.options?.top_p || 1,
        stream: request.stream || false,
      };

      const response: AxiosResponse = await this.client.post('/chat/completions', payload);

      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
      };
    } catch (error: any) {
      console.error('Remote AI API Error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Unknown error',
      };
    }
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    return this.generate(request);
  }
}

// 全局配置
let ollamaClient: OllamaClient | null = null;
let remoteAIClient: RemoteAIClient | null = null;

/**
 * 请求本地 Ollama API
 * @param request AI 请求参数
 * @param config Ollama 配置（可选）
 * @returns AI 响应
 */
export async function requestAILocal(
  request: AIRequest,
  config?: OllamaConfig
): Promise<AIResponse> {
  try {
    // 如果没有客户端或配置不同，创建新的客户端
    if (!ollamaClient || config) {
      const clientConfig = config || {
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        timeout: 30000,
      };
      ollamaClient = new OllamaClient(clientConfig);
    }

    // 根据是否有 messages 字段选择使用 chat 还是 generate
    if (request.messages && request.messages.length > 0) {
      return await ollamaClient.chat(request);
    } else {
      return await ollamaClient.generate(request);
    }
  } catch (error: any) {
    console.error('Local AI Request Error:', error);
    return {
      success: false,
      error: error.message || 'Local AI request failed',
    };
  }
}

/**
 * 请求远程 AI API（通过 API Key）
 * @param request AI 请求参数
 * @param config 远程 AI 配置
 * @returns AI 响应
 */
export async function requestAIAPI(
  request: AIRequest,
  config: RemoteAIConfig
): Promise<AIResponse> {
  try {
    // 如果没有客户端或配置不同，创建新的客户端
    if (!remoteAIClient ||
        remoteAIClient['config'].apiKey !== config.apiKey ||
        remoteAIClient['config'].baseURL !== config.baseURL) {
      remoteAIClient = new RemoteAIClient(config);
    }

    return await remoteAIClient.generate(request);
  } catch (error: any) {
    console.error('Remote AI API Request Error:', error);
    return {
      success: false,
      error: error.message || 'Remote AI API request failed',
    };
  }
}

/**
 * 获取本地模型列表
 * @param config Ollama 配置（可选）
 * @returns 模型列表
 */
export async function getLocalModels(config?: OllamaConfig): Promise<AIResponse> {
  try {
    if (!ollamaClient || config) {
      const clientConfig = config || {
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        timeout: 30000,
      };
      ollamaClient = new OllamaClient(clientConfig);
    }

    return await ollamaClient.listModels();
  } catch (error: any) {
    console.error('Get Local Models Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get local models',
    };
  }
}

/**
 * 便捷方法：使用 OpenAI API
 * @param request AI 请求参数
 * @param apiKey OpenAI API Key
 * @returns AI 响应
 */
export async function requestOpenAI(
  request: AIRequest,
  apiKey: string
): Promise<AIResponse> {
  return requestAIAPI(request, {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo',
  });
}

/**
 * 便捷方法：使用 Claude API
 * @param request AI 请求参数
 * @param apiKey Claude API Key
 * @returns AI 响应
 */
export async function requestClaude(
  request: AIRequest,
  apiKey: string
): Promise<AIResponse> {
  return requestAIAPI(request, {
    apiKey,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
  });
}

export default {
  requestAILocal,
  requestAIAPI,
  getLocalModels,
  requestOpenAI,
  requestClaude,
};
