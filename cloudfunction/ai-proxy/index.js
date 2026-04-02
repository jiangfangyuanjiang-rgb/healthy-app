const cloud = require('@cloudbase/node-sdk');

cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV
});

exports.main = async (event) => {
  const { prompt, type } = event;

  // API Key 在云函数环境变量里,不暴露给前端
  const API_KEY = process.env.ALIYUN_API_KEY;
  const ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: { prompt },
        parameters: {
          result_format: 'message',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.output.text,
    };
  } catch (error) {
    console.error('AI 调用失败:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
