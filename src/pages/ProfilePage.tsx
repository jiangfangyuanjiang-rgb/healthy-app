// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { saveProfile, getProfile } from '../lib/db';
import { FoodPreferences } from '../components/profile/FoodPreferences';

type ActiveTab = 'basic' | 'preferences';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('basic');
  const [height, setHeight] = useState('173');
  const [weight, setWeight] = useState('50');
  const [age, setAge] = useState('25');
  const [targetWeight, setTargetWeight] = useState('65');
  const [bmi, setBmi] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  }, [height, weight]);

  const loadProfile = async () => {
    const profile = await getProfile();
    if (profile) {
      setHeight(profile.height.toString());
      setWeight(profile.weight.toString());
      setAge(profile.age.toString());
      setTargetWeight(profile.targetWeight.toString());
    }
  };

  const handleSave = async () => {
    try {
      await saveProfile({
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        targetWeight: parseFloat(targetWeight),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败,请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24">
      {/* 顶部标题 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">我的</h1>
          <p className="text-sm text-gray-600 mt-1">个人信息与偏好设置</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Tab 切换 */}
        <div className="bg-white rounded-2xl p-2 shadow-soft mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'basic'
                ? 'bg-gradient-to-r from-primary-500 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            👤 个人档案
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'preferences'
                ? 'bg-gradient-to-r from-primary-500 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🍽️ 饮食偏好
          </button>
        </div>

        {/* 个人档案 Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-3xl p-6 shadow-soft space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">个人档案</h2>
              <p className="text-sm text-gray-600">填写准确信息,帮助AI生成更科学的食谱</p>
            </div>

            {/* 身高 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身高</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all"
                  placeholder="173"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
              </div>
            </div>

            {/* 体重 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">当前体重</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all"
                  placeholder="50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
              </div>
            </div>

            {/* 年龄 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all"
                  placeholder="25"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">岁</span>
              </div>
            </div>

            {/* 目标体重 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标体重</label>
              <div className="relative">
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all"
                  placeholder="65"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
              </div>
            </div>

            {/* 身体指标卡片 */}
            <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">身体指标</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{bmi}</div>
                  <div className="text-xs text-gray-600 mt-1">BMI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{height}</div>
                  <div className="text-xs text-gray-600 mt-1">身高(cm)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{weight}</div>
                  <div className="text-xs text-gray-600 mt-1">体重(kg)</div>
                </div>
              </div>

              {/* 健康提示 */}
              {bmi > 0 && bmi < 18.5 && (
                <div className="bg-orange-100 border border-orange-200 rounded-xl p-4">
                  <div className="flex gap-2">
                    <span className="text-xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 text-sm mb-1">健康提示</h4>
                      <p className="text-xs text-orange-800 leading-relaxed">
                        你的 BMI 偏低({bmi}),建议:
                      </p>
                      <ul className="text-xs text-orange-800 mt-2 space-y-1 pl-4">
                        <li>• 增加蛋白质摄入(鸡蛋、牛奶、肉类)</li>
                        <li>• 规律进行无氧训练</li>
                        <li>• 保证充足睡眠(8小时+)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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
                '保存个人信息'
              )}
            </button>
          </div>
        )}

        {/* 饮食偏好 Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <FoodPreferences />
          </div>
        )}
      </div>
    </div>
  );
};