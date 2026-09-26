import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  quarantineBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  quarantineBadgeCount = 0
}) => {
  const tabs: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'analyzer', label: 'Analyzer', icon: 'shield' },
    { id: 'threat-feed', label: 'Threat Feed', icon: 'radar' },
    { id: 'history', label: 'History', icon: 'history', badge: quarantineBadgeCount },
    { id: 'protection', label: 'Protection', icon: 'verified_user' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto h-16 px-1 grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`flex flex-col items-center justify-center min-h-[44px] h-full transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-[#000922] font-semibold'
                  : 'text-[#45464e] hover:text-[#000922]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">
                  {tab.icon}
                </span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-[#ba1a1a] text-white font-['JetBrains_Mono'] text-[9px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="font-['JetBrains_Mono'] text-[11px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-[#000922] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
