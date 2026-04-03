// src/pages/StatsPage.tsx
import React from 'react';

export const StatsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24">
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-sm text-gray-600 mt-1">即将上线</p>
        </div>
      </div>

      <div className="px-4 py-12 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">数据模块开发中</h3>
        <p className="text-gray-600 text-sm">等饮食模块完善后上线</p>
      </div>
    </div>
  );
};