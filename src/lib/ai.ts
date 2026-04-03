// src/lib/ai.ts

const CLOUD_FUNCTION_URL = 'https://healthy-app-6gsnm362e5e8530b.ap-shanghai.app.tcloudbasegateway.com/ai-proxy';

interface MealPlan {
  breakfast: MealDetail;
  lunch: MealDetail;
  snack: MealDetail;
  dinner: MealDetail;
}

interface MealDetail {
  time: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface FoodItem {
  name: string;
  icon: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserProfile {
  height: number;
  weight: number;
  age: number;
  targetWeight: number;
}

interface FoodPreferences {
  preferences: string[];
  avoidFoods: string;
  notes: string;
}

export const generateMealPlan = async (
  profile: UserProfile,
  foodPreferences?: FoodPreferences
): Promise<MealPlan> => {
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
  const tdee = calculateTDEE(profile);
  const targetCalories = Math.round(tdee + 500); // 增重:TDEE + 500

  const prompt = `你是一位专业的增重营养师。请根据以下用户信息生成今日完整的增重食谱。

【用户档案】
- 身高: ${profile.height}cm
- 当前体重: ${profile.weight}kg
- 年龄: ${profile.age}岁
- 目标体重: ${profile.targetWeight}kg
- 当前BMI: ${bmi} (偏瘦,需要增重)
- 每日目标热量: ${targetCalories}千卡

${foodPreferences ? `【饮食偏好】
- 饮食特点: ${foodPreferences.preferences.join('、')}
- 避免食物: ${foodPreferences.avoidFoods || '无'}
- 其他备注: ${foodPreferences.notes || '无'}
` : ''}

【增重原则】
1. 高热量:每餐热量充足,全天${targetCalories}千卡
2. 高蛋白:每公斤体重1.5-2g蛋白质,促进肌肉生长
3. 优质碳水:复合碳水为主,提供持续能量
4. 健康脂肪:坚果、牛油果、深海鱼等优质脂肪
5. 少食多餐:4餐(早/午/下午茶/晚),避免一次吃太多
${foodPreferences?.preferences.includes('胃口小') ? '6. 食物松软易消化,份量适中,质量优先' : ''}
${foodPreferences?.preferences.includes('早上没胃口') ? '7. 早餐以流质+易消化食物为主,温和开胃' : ''}

请严格按照以下JSON格式返回,不要有任何额外文字:

{
  "breakfast": {
    "time": "07:30-08:30",
    "foods": [
      {
        "name": "燕麦牛奶粥",
        "icon": "🥣",
        "description": "燕麦50g+全脂牛奶250ml,温热养胃",
        "calories": 280,
        "protein": 12,
        "carbs": 38,
        "fat": 8
      },
      {
        "name": "水煮鸡蛋",
        "icon": "🥚",
        "description": "2个,优质蛋白来源",
        "calories": 140,
        "protein": 12,
        "carbs": 1,
        "fat": 10
      },
      {
        "name": "全麦面包",
        "icon": "🍞",
        "description": "2片,涂花生酱",
        "calories": 200,
        "protein": 8,
        "carbs": 30,
        "fat": 6
      }
    ],
    "totalCalories": 620,
    "totalProtein": 32,
    "totalCarbs": 69,
    "totalFat": 24
  },
  "lunch": {
    "time": "12:00-13:00",
    "foods": [...同样格式,午餐热量650-700千卡],
    "totalCalories": 680,
    "totalProtein": 40,
    "totalCarbs": 75,
    "totalFat": 22
  },
  "snack": {
    "time": "15:30-16:30",
    "foods": [...下午茶,热量300-400千卡],
    "totalCalories": 350,
    "totalProtein": 15,
    "totalCarbs": 40,
    "totalFat": 12
  },
  "dinner": {
    "time": "18:30-19:30",
    "foods": [...晚餐,热量600-650千卡],
    "totalCalories": 650,
    "totalProtein": 45,
    "totalCarbs": 68,
    "totalFat": 20
  }
}

要求:
1. 每餐3-4种食物
2. 食物名称具体(如"清蒸鲈鱼"而非"鱼")
3. icon使用合适的emoji(🍚🍖🥦🥚🍞🥛🥜🥑🍗🥩等)
4. description简短描述做法/重量/营养特点
5. 全天总热量控制在${targetCalories}±100千卡
6. 避免推荐用户不喜欢的食物
7. 考虑用户的饮食特点调整食物质地和份量`;

  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || '';
    
    // 提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI返回格式错误:未找到JSON');
    }

    const mealPlan = JSON.parse(jsonMatch[0]);
    return mealPlan;
  } catch (error) {
    console.error('生成食谱失败:', error);
    // 返回默认食谱
    return getDefaultMealPlan();
  }
};

// 计算基础代谢率 (TDEE)
function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor 公式 (男性)
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  // 活动系数 1.375 (轻度活动)
  return Math.round(bmr * 1.375);
}

// 默认食谱 (AI调用失败时使用)
function getDefaultMealPlan(): MealPlan {
  return {
    breakfast: {
      time: '07:30-08:30',
      foods: [
        { name: '燕麦牛奶粥', icon: '🥣', description: '燕麦50g+全脂牛奶250ml', calories: 280, protein: 12, carbs: 38, fat: 8 },
        { name: '水煮鸡蛋', icon: '🥚', description: '2个', calories: 140, protein: 12, carbs: 1, fat: 10 },
        { name: '全麦面包', icon: '🍞', description: '2片+花生酱', calories: 200, protein: 8, carbs: 30, fat: 6 },
      ],
      totalCalories: 620,
      totalProtein: 32,
      totalCarbs: 69,
      totalFat: 24,
    },
    lunch: {
      time: '12:00-13:00',
      foods: [
        { name: '米饭', icon: '🍚', description: '200g', calories: 260, protein: 5, carbs: 58, fat: 1 },
        { name: '清蒸鲈鱼', icon: '🐟', description: '150g', calories: 180, protein: 30, carbs: 0, fat: 6 },
        { name: '蒜蓉西兰花', icon: '🥦', description: '150g', calories: 50, protein: 4, carbs: 8, fat: 1 },
        { name: '番茄炒蛋', icon: '🍅', description: '1份', calories: 190, protein: 10, carbs: 8, fat: 14 },
      ],
      totalCalories: 680,
      totalProtein: 49,
      totalCarbs: 74,
      totalFat: 22,
    },
    snack: {
      time: '15:30-16:30',
      foods: [
        { name: '香蕉', icon: '🍌', description: '1根', calories: 90, protein: 1, carbs: 23, fat: 0 },
        { name: '混合坚果', icon: '🥜', description: '30g', calories: 180, protein: 6, carbs: 6, fat: 16 },
        { name: '酸奶', icon: '🥛', description: '200ml全脂', calories: 120, protein: 8, carbs: 12, fat: 6 },
      ],
      totalCalories: 390,
      totalProtein: 15,
      totalCarbs: 41,
      totalFat: 22,
    },
    dinner: {
      time: '18:30-19:30',
      foods: [
        { name: '杂粮饭', icon: '🍚', description: '180g', calories: 240, protein: 6, carbs: 50, fat: 2 },
        { name: '香煎鸡胸肉', icon: '🍗', description: '150g', calories: 250, protein: 45, carbs: 0, fat: 8 },
        { name: '清炒芦笋', icon: '🥬', description: '100g', calories: 40, protein: 3, carbs: 5, fat: 1 },
        { name: '紫菜蛋花汤', icon: '🍜', description: '1碗', calories: 80, protein: 6, carbs: 4, fat: 5 },
      ],
      totalCalories: 610,
      totalProtein: 60,
      totalCarbs: 59,
      totalFat: 16,
    },
  };
}

export type { MealPlan, MealDetail, FoodItem, UserProfile, FoodPreferences };