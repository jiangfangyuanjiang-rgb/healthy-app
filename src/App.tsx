// src/App.tsx
import React, { useState } from 'react';
import { MealsPage } from './pages/MealsPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { StatsPage } from './pages/StatsPage';
import { ProfilePage } from './pages/ProfilePage';

type Page = 'meals' | 'workout' | 'stats' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('meals');

  const renderPage = () => {
    switch (currentPage) {
      case 'meals':
        return <MealsPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'stats':
        return <StatsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <MealsPage />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 页面内容 */}
      <main className="pb-20">{renderPage()}</main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 safe-bottom z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <NavButton
            icon="🍽️"
            label="饮食"
            active={currentPage === 'meals'}
            onClick={() => setCurrentPage('meals')}
          />
          <NavButton
            icon="💪"
            label="训练"
            active={currentPage === 'workout'}
            onClick={() => setCurrentPage('workout')}
          />
          <NavButton
            icon="📊"
            label="数据"
            active={currentPage === 'stats'}
            onClick={() => setCurrentPage('stats')}
          />
          <NavButton
            icon="👤"
            label="我的"
            active={currentPage === 'profile'}
            onClick={() => setCurrentPage('profile')}
          />
        </div>
      </nav>

      {/* 全局样式 */}
      <style>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}

interface NavButtonProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
        active ? 'text-primary-600' : 'text-gray-500'
      }`}
    >
      <span className={`text-2xl transition-transform ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </span>
      <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
      {active && (
        <div className="w-1 h-1 bg-primary-500 rounded-full mt-0.5" />
      )}
    </button>
  );
};

export default App;