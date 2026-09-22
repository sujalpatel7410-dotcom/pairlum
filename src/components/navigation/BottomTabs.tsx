import React from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { AppView } from '../../types';
import { Home, Plus, BookOpen, Users, Sparkles, Image as ImageIcon } from 'lucide-react';

export const BottomTabs: React.FC = () => {
  const { currentView, setCurrentView, openAddMemoryModal } = usePairlum();

  const tabs: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'memories', label: 'Memories', icon: ImageIcon },
    { id: 'shelf', label: 'Shelf', icon: BookOpen },
    { id: 'together', label: 'Together', icon: Users }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFD3DE]/95 backdrop-blur-md border-t border-[#F4A9BF] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around relative max-w-md mx-auto">

        {/* First 2 tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${isActive ? 'text-[#E11D48] font-semibold' : 'text-[#8A4058] hover:text-[#4A0420]'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />}
            </button>
          );
        })}

        {/* Center Raised FAB: Add Memory */}
        <div className="relative -top-5 flex justify-center">
          <button
            id="mobile-add-fab"
            onClick={() => openAddMemoryModal('photo')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F59E0B] text-white flex items-center justify-center shadow-lg shadow-[#E11D48]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-[#FFD3DE]"
            title="Add Memory"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Last 2 tabs */}
        {tabs.slice(2, 4).map((tab) => {
          const isActive = currentView === tab.id ||
            (tab.id === 'together' && currentView === 'places');
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${isActive ? 'text-[#E11D48] font-semibold' : 'text-[#8A4058] hover:text-[#4A0420]'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />}
            </button>
          );
        })}

      </div>
    </nav>
  );
};
