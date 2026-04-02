import { useState } from 'react';
import { Card, Button } from '../components/shared';
import { generateMealPlan } from '../lib/ai';
import { getProfile } from '../lib/db';

interface Meal {
  name: string;
  calories: number;
  items: string[];
}

interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export function MealsPage() {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<MealPlan | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');

    try {
      const profile = await getProfile();
      if (!profile) {
        setError('请先在"我的"页面填写个人信息');
        setLoading(false);
        return;
      }

      const result = await generateMealPlan(profile);
      setMeals(result);
    } catch (err) {
      setError('生成失败,请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full bg-[#ededed]">
      <div className="bg-white px-4 py-3 border-b border-[#d9d9d9]">
        <h1 className="text-lg font-medium text-[#191919]">AI 饮食推荐</h1>
      </div>

      <div className="p-3 space-y-3">
        <Button onClick={handleGenerate} loading={loading}>
          {loading ? '正在生成...' : '🎲 AI 生成今日食谱'}
        </Button>

        {error && (
          <div className="bg-[#fa5151] bg-opacity-10 border border-[#fa5151] rounded-lg p-3 text-[#fa5151] text-sm">
            {error}
          </div>
        )}

        {meals && (
          <div className="space-y-3">
            <MealCard meal={meals.breakfast} icon="🌅" title="早餐" />
            <MealCard meal={meals.lunch} icon="☀️" title="午餐" />
            <MealCard meal={meals.dinner} icon="🌙" title="晚餐" />

            <Card className="bg-[#07c160] bg-opacity-5 border border-[#07c160] border-opacity-20">
              <div className="text-center">
                <p className="text-xs text-[#999999] mb-1">今日总热量</p>
                <p className="text-3xl font-bold text-[#07c160]">
                  {meals.breakfast.calories + meals.lunch.calories + meals.dinner.calories}
                </p>
                <p className="text-xs text-[#999999] mt-1">kcal</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function MealCard({ meal, icon, title }: { meal: Meal; icon: string; title: string }) {
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <h3 className="font-medium text-[#191919]">{title}</h3>
              <p className="text-xs text-[#999999]">{meal.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#07c160]">{meal.calories}</p>
            <p className="text-xs text-[#999999]">kcal</p>
          </div>
        </div>
        <div className="space-y-1">
          {meal.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-[#191919]">
              <span className="text-[#07c160]">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
