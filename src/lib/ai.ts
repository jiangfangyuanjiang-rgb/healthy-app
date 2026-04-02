const API_KEY = 'sk-df3229ace90f4ade9bcfb0bc3f73404e';
const ENDPOINT = '/api/aliyun';

export async function callAliyunAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: {
          prompt: prompt,
        },
        parameters: {
          result_format: 'message',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 响应错误:', errorText);
      throw new Error(`API 错误: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI 返回数据:', data);

    // 检查返回数据结构
    if (data.output && data.output.text) {
      return data.output.text;
    } else if (data.output && data.output.choices && data.output.choices[0]) {
      return data.output.choices[0].message.content;
    } else {
      console.error('未知的返回格式:', data);
      throw new Error('AI 返回格式错误');
    }
  } catch (error: any) {
    console.error('AI 调用失败:', error);
    throw new Error(error.message || 'AI 调用失败');
  }
}

export async function generateMealPlan(profile: {
  height: number;
  weight: number;
  goal: string;
}): Promise<any> {
  const prompt = `
你是专业的营养师。用户信息:
- 身高: ${profile.height}cm
- 体重: ${profile.weight}kg
- 目标: ${profile.goal}

请生成今日三餐食谱,要求:
1. 每餐标注热量(kcal)
2. 包含开胃的流食类食物
3. 适合增重增肌
4. 严格返回 JSON 格式,不要任何其他文字:
{
  "breakfast": {"name": "营养早餐", "calories": 500, "items": ["燕麦粥", "水煮蛋", "牛奶"]},
  "lunch": {"name": "午餐", "calories": 800, "items": ["鸡胸肉", "糙米饭", "西兰花"]},
  "dinner": {"name": "晚餐", "calories": 700, "items": ["三文鱼", "红薯", "蔬菜沙拉"]}
}
`;

  try {
    const result = await callAliyunAI(prompt);
    console.log('AI 原始返回:', result);

    if (!result) {
      throw new Error('AI 返回为空');
    }

    // 提取 JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('AI 返回格式错误');
  } catch (error: any) {
    console.error('生成食谱失败:', error);
    throw error;
  }
}

export async function generateWorkoutPlan(profile: {
  height: number;
  weight: number;
  goal: string;
}): Promise<any> {
  const prompt = `
你是专业健身教练。用户信息:
- 身高: ${profile.height}cm
- 体重: ${profile.weight}kg (偏瘦)
- 目标: 无氧增肌

请生成本周训练计划,严格返回 JSON:
{
  "plan": [
    {
      "day": "周一",
      "focus": "胸+三头",
      "exercises": [
        {"name": "杠铃卧推", "sets": 4, "reps": "8-12", "weight": "自重", "rest": "90秒"}
      ]
    }
  ]
}
`;

  const result = await callAliyunAI(prompt);
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('AI 返回格式错误');
}

