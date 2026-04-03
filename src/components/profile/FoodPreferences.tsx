// src/components/profile/FoodPreferences.tsx
import React, { useState, useEffect } from 'react';
import { saveFoodPreferences, getFoodPreferences } from '../../lib/db';

const PREFERENCE_OPTIONS = [
  { value: '不爱油腻', icon: '🚫', label: '不爱油腻' },
  { value: '早上没胃口', icon: '🌅', label: '早上没胃口' },
  { value: '胃口小', icon: '🍽️', label: '胃口小' },
  { value: '吃几口就饱', icon: '😌', label: '吃几口就饱' },
  { value: '不爱辣', icon: '🌶️', label: '不爱辣' },
  { value: '素食主义', icon: '🥬', label: '素食主义' },
];

export const FoodPreferences: React.FC = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [avoidFoods, setAvoidFoods] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await getFoodPreferences();
    if (prefs) {
      setSelectedPreferences(prefs.preferences || []);
      setAvoidFoods(prefs.avoidFoods || '');
      setNotes(prefs.notes || '');
    }
  };

  const togglePreference = (value: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleSave = async () => {
    try {
      await saveFoodPreferences({
        preferences: selectedPreferences,
        avoidFoods,
        notes,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败,请重试');
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">饮食偏好</h2>
        <p className="text-sm text-gray-600">帮助AI生成更符合你口味的食谱</p>
      </div>

      {/* 偏好选项 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">我的饮食特点</label>
        <div className="grid grid-cols-2 gap-3">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => togglePreference(option.value)}
              className={`flex items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selectedPreferences.includes(option.value)
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <span className={`text-sm font-medium ${
                selectedPreferences.includes(option.value) ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 避免食物 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          避免推荐的食物
          <span className="text-xs text-gray-500 ml-2">(用逗号分隔,如:芹菜,香菜,苦瓜)</span>
        </label>
        <input
          type="text"
          value={avoidFoods}
          onChange={(e) => setAvoidFoods(e.target.value)}
          placeholder="例如: 芹菜, 香菜, 苦瓜"
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all"
        />
      </div>

      {/* 其他备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          其他饮食偏好
          <span className="text-xs text-gray-500 ml-2">(可选)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="例如: 不吃内脏、喜欢清淡口味、对海鲜过敏等..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all resize-none"
        />
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-semibold transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-primary-500 to-emerald-600 text-white hover:shadow-lg'
        }`}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            已保存
          </span>
        ) : (
          '保存偏好设置'
        )}
      </button>

      {/* 提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 text-sm mb-1">温馨提示</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              设置饮食偏好后,AI会根据你的口味和习惯生成更适合的增重食谱。每次生成食谱时都会参考这些偏好。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};