// src/components/meals/WeeklySummary.tsx
import React from 'react';

interface WeeklySummaryProps {
  totalCalories: number;
  avgCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  daysLogged: number;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  totalCalories,
  avgCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  daysLogged,
}) => {
  return (
    <div className="bg-gradient-to-br from-primary-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">本周摄入统计</h3>
          <p className="text-sm text-primary-100">已记录 {daysLogged} 天</p>
        </div>
        <div className="text-5xl">📊</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 总热量 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-xs text-primary-100 mb-1">总热量</div>
          <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
          <div className="text-xs text-primary-100 mt-1">千卡</div>
        </div>

        {/* 日均热量 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-xs text-primary-100 mb-1">日均热量</div>
          <div className="text-2xl font-bold">{avgCalories.toLocaleString()}</div>
          <div className="text-xs text-primary-100 mt-1">千卡/天</div>
        </div>

        {/* 蛋白质 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-xs text-primary-100 mb-1">总蛋白质</div>
          <div className="text-xl font-bold">{totalProtein}g</div>
        </div>

        {/* 碳水 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-xs text-primary-100 mb-1">总碳水</div>
          <div className="text-xl font-bold">{totalCarbs}g</div>
        </div>
      </div>

      {/* 营养占比 */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-xs text-primary-100 mb-2">营养素占比</div>
        <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-white/20">
          <div 
            className="bg-orange-400" 
            style={{ width: `${(totalProtein * 4 / totalCalories * 100).toFixed(0)}%` }}
            title={`蛋白质 ${(totalProtein * 4 / totalCalories * 100).toFixed(0)}%`}
          />
          <div 
            className="bg-yellow-400" 
            style={{ width: `${(totalCarbs * 4 / totalCalories * 100).toFixed(0)}%` }}
            title={`碳水 ${(totalCarbs * 4 / totalCalories * 100).toFixed(0)}%`}
          />
          <div 
            className="bg-purple-400" 
            style={{ width: `${(totalFat * 9 / totalCalories * 100).toFixed(0)}%` }}
            title={`脂肪 ${(totalFat * 9 / totalCalories * 100).toFixed(0)}%`}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span>🟠 蛋白</span>
          <span>🟡 碳水</span>
          <span>🟣 脂肪</span>
        </div>
      </div>
    </div>
  );
};