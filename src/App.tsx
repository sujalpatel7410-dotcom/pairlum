import React from 'react';
import { PairlumProvider, usePairlum } from './context/PairlumContext';
import { TopNav } from './components/navigation/TopNav';
import { BottomTabs } from './components/navigation/BottomTabs';
import { HomeView } from './components/views/HomeView';
import { OurShelfView } from './components/views/OurShelfView';
import { OurPlacesView } from './components/views/OurPlacesView';
import { TheDrawerView } from './components/views/TheDrawerView';
import { TheDoorView } from './components/views/TheDoorView';
import { DoorOpenedView } from './components/views/DoorOpenedView';
import { DoorReactionView } from './components/views/DoorReactionView';
import { TogetherView } from './components/views/TogetherView';
import { SettingsView } from './components/views/SettingsView';
import { AddMemoryModal } from './components/modals/AddMemoryModal';
import { MemoryLightboxModal } from './components/modals/MemoryLightboxModal';
import { SplashCursor } from './components/common/SplashCursor';
import { Heart, Sparkles, Flame } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, isCandlelit, isDarkMode } = usePairlum();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;

      case 'shelf':
        return <OurShelfView />;
      case 'places':
        return <OurPlacesView />;
      case 'drawer':
        return <TheDrawerView />;
      case 'door':
      case 'reunion':
      case 'prepare_door':
        return <TheDoorView />;
      case 'door_opened':
        return <DoorOpenedView />;
      case 'door_reaction':
        return <DoorReactionView />;
      case 'together':
      case 'invite':
        return <TogetherView />;
      case 'settings':
      case 'pricing':
      case 'legal':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#120C0A] text-[#FAF3EC]' : 'bg-[#FFFBF5] text-[#1C110E]'} flex flex-col font-sans transition-colors duration-500 ${isCandlelit ? 'candle-glow' : ''}`}>

      {/* Interactive Fluid Splash Cursor */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={3.0}
        VELOCITY_DISSIPATION={2.0}
        PRESSURE={0.15}
        CURL={4}
        SPLAT_RADIUS={0.22}
        SPLAT_FORCE={5500}
        COLOR={isDarkMode ? '#E8A33D' : '#8E1B1B'}
        RAINBOW_MODE={false}
      />

      {/* Top Header Navigation */}
      <TopNav />

      {/* Main Sanctuary Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentView()}
      </div>

      {/* Mobile Floating Bottom Bar */}
      <BottomTabs />

      {/* Global Modals */}
      <AddMemoryModal />
      <MemoryLightboxModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#1C110E] text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient footer candle watermark */}
      <footer className="py-6 border-t border-[#E7D9C9]/50 text-center text-xs text-[#6E5B52] space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#8E1B1B]" />
          <span className="font-display font-medium text-[#1C110E]">Pairlum</span>
          <span>•</span>
          <span className="font-script text-base text-[#8E1B1B]">a private candlelight sanctuary for two</span>
        </div>
        <p className="text-[11px] text-[#6E5B52]/70 font-mono">
          Encrypted & private to your coordinates
        </p>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <PairlumProvider>
      <AppContent />
    </PairlumProvider>
  );
}

export default App;
