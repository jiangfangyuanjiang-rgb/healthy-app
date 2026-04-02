export type TabType = 'meals' | 'workout' | 'stats' | 'profile';

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 py-2 px-3 transition-all flex-1"
    >
      <span className={`text-xl transition-all ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </span>
      <span
        className={`text-xs transition-all ${
          active ? 'text-green-600 font-semibold' : 'text-gray-500 font-normal'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'meals' as TabType, icon: '🍽️', label: '饮食' },
    { id: 'workout' as TabType, icon: '💪', label: '训练' },
    { id: 'stats' as TabType, icon: '📊', label: '数据' },
    { id: 'profile' as TabType, icon: '👤', label: '我的' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg
                 border-t border-gray-100 z-50 shadow-lg"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around max-w-screen-sm mx-auto">
        {tabs.map((tab) => (
          <NavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}

