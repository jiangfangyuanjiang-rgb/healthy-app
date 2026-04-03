// src/pages/MealsPage.tsx
import React, { useState, useEffect } from 'react';
import { MealCard } from '../components/meals/MealCard';
import { WeeklySummary } from '../components/meals/WeeklySummary';
import { DatePicker } from '../components/meals/DatePicker';
import { generateMealPlan, type MealPlan } from '../lib/ai';
import { getProfile, getFoodPreferences, getMealsByDateRange } from '../lib/db';

type ViewMode = 'day' | 'week' | 'month' | 'year';

export const MealsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState({
    totalCalories: 0,
    avgCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    daysLogged: 0,
  });

  // 生成AI食谱
  const generateMeals = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      const preferences = await getFoodPreferences();

      if (!profile) {
        alert('请先完善个人信息');
        return;
      }

      const plan = await generateMealPlan(profile, preferences || undefined);
      setMealPlan(plan);
    } catch (error) {
      console.error('生成食谱失败:', error);
      alert('生成食谱失败,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 计算周统计
  const calculateWeeklySummary = async () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    const meals = await getMealsByDateRange(startDate, endDate);

    const uniqueDays = new Set(meals.map(m => m.date)).size;
    const totalCals = meals.reduce((sum, m) => sum + m.totalCalories, 0);
    const totalProt = meals.reduce((sum, m) => sum + m.totalProtein, 0);
    const totalCarb = meals.reduce((sum, m) => sum + m.totalCarbs, 0);
    const totalFats = meals.reduce((sum, m) => sum + m.totalFat, 0);

    setWeeklySummary({
      totalCalories: totalCals,
      avgCalories: uniqueDays > 0 ? Math.round(totalCals / uniqueDays) : 0,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFats,
      daysLogged: uniqueDays,
    });
  };

  useEffect(() => {
    generateMeals();
    calculateWeeklySummary();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24">
      {/* 顶部标题 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI 饮食推荐</h1>
          <p className="text-sm text-gray-600 mt-1">科学增重,健康饮食</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 日期选择器 */}
        <DatePicker
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />

        {/* 周统计卡片 */}
        {viewMode === 'week' && weeklySummary.daysLogged > 0 && (
          <WeeklySummary {...weeklySummary} />
        )}

        {/* AI生成按钮 */}
        {viewMode === 'day' && (
          <button
            onClick={generateMeals}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-emerald-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>AI 生成中...</span>
              </>
            ) : (
              <>
                <span className="text-xl">🤖</span>
                <span>生成今日食谱</span>
              </>
            )}
          </button>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-bounce text-6xl mb-4">🍽️</div>
            <p className="text-gray-600">AI 正在为你定制专属食谱...</p>
          </div>
        )}

        {/* 今日食谱 - 横向滚动 */}
        {!loading && mealPlan && viewMode === 'day' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">今日推荐</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <MealCard mealType="breakfast" meal={mealPlan.breakfast} onRefresh={generateMeals} />
              <MealCard mealType="lunch" meal={mealPlan.lunch} onRefresh={generateMeals} />
              <MealCard mealType="snack" meal={mealPlan.snack} onRefresh={generateMeals} />
              <MealCard mealType="dinner" meal={mealPlan.dinner} onRefresh={generateMeals} />
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !mealPlan && viewMode === 'day' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-600 mb-4">还没有生成食谱</p>
            <p className="text-sm text-gray-500">点击上方按钮生成专属增重食谱</p>
          </div>
        )}
      </div>

      {/* 隐藏滚动条样式 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};