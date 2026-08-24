import React from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { AppView } from '../../types';
import { Home, Image as ImageIcon, Plus, BookOpen, Users, Lock, Sparkles } from 'lucide-react';

export const BottomTabs: React.FC = () => {
  const { currentView, setCurrentView, openAddMemoryModal } = usePairlum();

  const tabs: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wall', label: 'Our Wall', icon: ImageIcon },
    { id: 'reunion', label: 'Reunion', icon: Sparkles },
    { id: 'together', label: 'Together', icon: Users }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-md border-t border-[#E7D9C9] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        
        {/* First 2 tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = currentView === tab.id || (tab.id === 'wall' && currentView === 'memories');
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#8E1B1B] font-semibold' : 'text-[#6E5B52] hover:text-[#1C110E]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#8E1B1B] mt-0.5" />}
            </button>
          );
        })}

        {/* Center Raised FAB: Add Memory */}
        <div className="relative -top-5 flex justify-center">
          <button
            id="mobile-add-fab"
            onClick={() => openAddMemoryModal('photo')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8E1B1B] to-[#C63A2E] text-white flex items-center justify-center shadow-lg shadow-[#8E1B1B]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-[#FFFBF5]"
            title="Add Memory"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Last 2 tabs */}
        {tabs.slice(2, 4).map((tab) => {
          const isActive = currentView === tab.id || 
            (tab.id === 'reunion' && (currentView === 'door' || currentView === 'door_opened' || currentView === 'door_reaction' || currentView === 'prepare_door')) ||
            (tab.id === 'together' && currentView === 'places');
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#8E1B1B] font-semibold' : 'text-[#6E5B52] hover:text-[#1C110E]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#8E1B1B] mt-0.5" />}
            </button>
          );
        })}

      </div>
    </nav>
  );
};
