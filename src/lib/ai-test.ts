import { requestAILocal, getLocalModels } from '@/lib/ai';

/**
 * 测试 AI API 客户端
 * 运行此文件来验证本地 Ollama 连接是否正常
 */

export async function testAIConnection() {
  console.log('🔍 开始测试 AI API 连接...\n');

  try {
    // 测试 1: 获取本地模型列表
    console.log('📋 测试 1: 获取本地模型列表');
    const modelsResponse = await getLocalModels();

    if (modelsResponse.success) {
      console.log('✅ 本地模型列表获取成功:');
      console.log(JSON.stringify(modelsResponse.data, null, 2));
    } else {
      console.log('❌ 本地模型列表获取失败:', modelsResponse.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试 2: 简单文本生成（如果有可用模型）
    if (modelsResponse.success && modelsResponse.data?.models?.length > 0) {
      const availableModel = modelsResponse.data.models[0].name;
      console.log(`📝 测试 2: 使用模型 "${availableModel}" 生成文本`);

      const generateResponse = await requestAILocal({
        model: availableModel,
        prompt: '请用一句话介绍你自己',
        options: {
          temperature: 0.7,
          num_predict: 50, // 限制输出长度
        },
      });

      if (generateResponse.success) {
        console.log('✅ 文本生成成功:');
        console.log(generateResponse.data.response || generateResponse.data);
      } else {
        console.log('❌ 文本生成失败:', generateResponse.error);
      }
    } else {
      console.log('⚠️  跳过文本生成测试（无可用本地模型）');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试 3: 对话模式（如果支持）
    if (modelsResponse.success && modelsResponse.data?.models?.length > 0) {
      const availableModel = modelsResponse.data.models[0].name;
      console.log(`💬 测试 3: 使用模型 "${availableModel}" 进行对话`);

      const chatResponse = await requestAILocal({
        model: availableModel,
        messages: [
          { role: 'user', content: '你好，请简单介绍一下你自己' },
        ],
        options: {
          temperature: 0.7,
          num_predict: 100,
        },
      });

      if (chatResponse.success) {
        console.log('✅ 对话测试成功:');
        console.log(chatResponse.data.response || chatResponse.data.message?.content || chatResponse.data);
      } else {
        console.log('❌ 对话测试失败:', chatResponse.error);
      }
    }

  } catch (error) {
    console.error('🔥 测试过程中发生错误:', error);
  }

  console.log('\n🏁 AI API 连接测试完成');
}

/**
 * 快速测试函数（仅检查连接）
 */
export async function quickTest() {
  try {
    const response = await getLocalModels();
    if (response.success) {
      console.log('✅ Ollama 连接正常');
      return true;
    } else {
      console.log('❌ Ollama 连接失败:', response.error);
      return false;
    }
  } catch (error) {
    console.log('❌ 连接测试出错:', error);
    return false;
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  testAIConnection().catch(console.error);
}

export default {
  testAIConnection,
  quickTest,
};
