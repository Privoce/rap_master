import { requestAILocal, requestAIAPI, requestOpenAI, requestClaude, getLocalModels } from '@/lib/ai';

// 使用示例

/**
 * 示例 1: 使用本地 Ollama API
 */
export async function exampleLocalOllama() {
  try {
    const response = await requestAILocal({
      model: 'llama2', // 或其他本地模型名称
      prompt: '请写一首关于编程的短诗',
      options: {
        temperature: 0.7,
        top_p: 0.9,
      },
    });

    if (response.success) {
      console.log('本地模型响应:', response.data);
      return response.data;
    } else {
      console.error('本地模型错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 2: 使用本地 Ollama API（对话模式）
 */
export async function exampleLocalOllamaChat() {
  try {
    const response = await requestAILocal({
      model: 'llama2',
      messages: [
        { role: 'system', content: '你是一个编程助手' },
        { role: 'user', content: '解释什么是 TypeScript' },
      ],
      options: {
        temperature: 0.7,
      },
    });

    if (response.success) {
      console.log('本地对话响应:', response.data);
      return response.data;
    } else {
      console.error('本地对话错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 3: 使用 OpenAI API
 */
export async function exampleOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key';

  try {
    const response = await requestOpenAI({
      messages: [
        { role: 'user', content: '请解释什么是机器学习' },
      ],
      options: {
        temperature: 0.7,
        max_tokens: 500,
      },
    }, apiKey);

    if (response.success) {
      console.log('OpenAI 响应:', response.data);
      return response.data;
    } else {
      console.error('OpenAI 错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 4: 使用 Claude API
 */
export async function exampleClaude() {
  const apiKey = process.env.CLAUDE_API_KEY || 'your-claude-api-key';

  try {
    const response = await requestClaude({
      messages: [
        { role: 'user', content: '请写一个关于人工智能的短故事' },
      ],
      options: {
        temperature: 0.8,
        max_tokens: 1000,
      },
    }, apiKey);

    if (response.success) {
      console.log('Claude 响应:', response.data);
      return response.data;
    } else {
      console.error('Claude 错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 5: 使用自定义远程 API
 */
export async function exampleCustomAPI() {
  const apiKey = 'your-custom-api-key';
  const baseURL = 'https://your-custom-api.com/v1';

  try {
    const response = await requestAIAPI({
      model: 'your-model-name',
      messages: [
        { role: 'user', content: '你好，请介绍一下你自己' },
      ],
      options: {
        temperature: 0.7,
      },
    }, {
      apiKey,
      baseURL,
      model: 'your-default-model',
    });

    if (response.success) {
      console.log('自定义 API 响应:', response.data);
      return response.data;
    } else {
      console.error('自定义 API 错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 6: 获取本地模型列表
 */
export async function exampleGetLocalModels() {
  try {
    const response = await getLocalModels();

    if (response.success) {
      console.log('本地模型列表:', response.data);
      return response.data;
    } else {
      console.error('获取模型列表错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

/**
 * 示例 7: 流式响应处理
 */
export async function exampleStreaming() {
  try {
    const response = await requestAILocal({
      model: 'llama2',
      prompt: '请写一篇关于未来的文章',
      stream: true, // 启用流式响应
      options: {
        temperature: 0.8,
      },
    });

    if (response.success) {
      // 处理流式响应
      console.log('流式响应开始:', response.data);
      return response.data;
    } else {
      console.error('流式响应错误:', response.error);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
}

export default {
  exampleLocalOllama,
  exampleLocalOllamaChat,
  exampleOpenAI,
  exampleClaude,
  exampleCustomAPI,
  exampleGetLocalModels,
  exampleStreaming,
};
