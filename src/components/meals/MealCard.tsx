// src/components/meals/MealCard.tsx
import React from 'react';
import type { MealDetail } from '../../lib/ai';

interface MealCardProps {
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  meal: MealDetail;
  onRefresh?: () => void;
}

const mealTypeConfig = {
  breakfast: { title: '早餐', icon: '🌅', gradient: 'from-orange-400 to-pink-400' },
  lunch: { title: '午餐', icon: '☀️', gradient: 'from-yellow-400 to-orange-400' },
  snack: { title: '下午茶', icon: '🍰', gradient: 'from-purple-400 to-pink-400' },
  dinner: { title: '晚餐', icon: '🌙', gradient: 'from-blue-400 to-indigo-400' },
};

export const MealCard: React.FC<MealCardProps> = ({ mealType, meal, onRefresh }) => {
  const config = mealTypeConfig[mealType];

  return (
    <div className="flex-shrink-0 w-[340px] bg-white rounded-3xl shadow-soft overflow-hidden">
      {/* 顶部渐变条 */}
      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
      
      {/* 标题区 */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
              <p className="text-xs text-gray-500">{meal.time}</p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="刷新食谱"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>

        {/* 食物列表 */}
        <div className="space-y-3 mb-4">
          {meal.foods.map((food, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{food.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-medium text-gray-900 text-sm">{food.name}</h4>
                  <span className="text-sm font-semibold text-primary-600 whitespace-nowrap">
                    {food.calories}千卡
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{food.description}</p>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-gray-400">蛋白 {food.protein}g</span>
                  <span className="text-xs text-gray-400">碳水 {food.carbs}g</span>
                  <span className="text-xs text-gray-400">脂肪 {food.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 总计卡片 */}
        <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">本餐总计</span>
            <span className="text-2xl font-bold text-primary-600">{meal.totalCalories}</span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{meal.totalProtein}g</div>
              <div className="text-gray-500">蛋白质</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{meal.totalCarbs}g</div>
              <div className="text-gray-500">碳水</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{meal.totalFat}g</div>
              <div className="text-gray-500">脂肪</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};