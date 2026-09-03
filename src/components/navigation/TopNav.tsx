import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { useAuth } from '../../context/AuthContext';
import { AppView } from '../../types';
import { 
  Heart,
  Sparkles,
  Settings as SettingsIcon,
  Lock, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown, 
  Plus, 
  LogOut,
  Bell,
  Smartphone,
  Eye,
  Moon,
  Sun,
  Flame
} from 'lucide-react';

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'wall', label: 'Our Wall' },
  { id: 'shelf', label: 'Our Shelf' },
  { id: 'places', label: 'Our Places' },
  { id: 'drawer', label: 'The Drawer' },
  { id: 'door', label: 'The Door' },
  { id: 'together', label: 'Together' },
  { id: 'memories', label: 'Memories' },
  { id: 'reunion', label: 'Reunion' }
];

export const TopNav: React.FC<{ onToggleMobileSim?: () => void; isMobileSim?: boolean }> = ({
  onToggleMobileSim,
  isMobileSim = false
}) => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    couple,
    openAddMemoryModal,
    isDarkMode,
    toggleDarkMode,
    themeMode,
    setThemeMode
  } = usePairlum();
  const { signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const currentPartnerName = currentUser === 'A' ? couple.nameA : couple.nameB;
  const otherPartnerName = currentUser === 'A' ? couple.nameB : couple.nameA;
  const currentAvatar = currentUser === 'A' ? couple.avatarA : couple.avatarB;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-[#E7D9C9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-6">
          <button 
            id="pairlum-logo-button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center group-hover:bg-[#8E1B1B]/20 transition-colors">
              <Heart className="w-4 h-4 text-[#8E1B1B] fill-[#8E1B1B]/30 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-[#1C110E]">
              Pairlum
            </span>
          </button>

          {/* Signed-in-as badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#6E5B52]">
            <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-pulse" />
            <span>Signed in as <strong className="text-[#8E1B1B]">{currentPartnerName}</strong></span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                className={`
                  relative px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer
                  ${isActive 
                    ? 'text-[#8E1B1B] font-semibold' 
                    : 'text-[#6E5B52] hover:text-[#1C110E]'}
                `}
              >
                {item.label}
                {isActive && (
                  <div className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[#8E1B1B] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E1B1B] -mt-[1px]" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Add FAB, Notifications, & Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Add Button */}
          <button
            id="nav-quick-add"
            onClick={() => openAddMemoryModal('photo')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>

          {/* Dark / Light Mode Sanctuary Toggle Button */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] flex items-center justify-center text-[#6E5B52] hover:text-[#E8A33D] transition-colors relative cursor-pointer group"
            title={isDarkMode ? 'Switch to Parchment (Light Mode)' : 'Switch to Midnight Sanctuary (Dark Mode)'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#E8A33D] group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#8E1B1B] group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Activity / Notification button */}
          <button
            id="nav-activity-btn"
            onClick={() => setCurrentView('activity')}
            className="w-9 h-9 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] flex items-center justify-center text-[#6E5B52] hover:text-[#8E1B1B] transition-colors relative cursor-pointer"
            title="Activity Feed"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C63A2E]" />
          </button>

          {/* Simulator toggle button */}
          {onToggleMobileSim && (
            <button
              onClick={onToggleMobileSim}
              className={`p-2 rounded-full border text-xs transition-colors hidden md:flex items-center gap-1 cursor-pointer ${
                isMobileSim ? 'bg-[#8E1B1B] text-white border-[#8E1B1B]' : 'bg-[#F7EFE4] text-[#6E5B52] border-[#E7D9C9]'
              }`}
              title="Toggle Mobile View Preview"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[11px] font-medium">{isMobileSim ? 'Desktop' : 'Mobile View'}</span>
            </button>
          )}

          {/* User / Couple Avatar Dropdown */}
          <div className="relative">
            <button
              id="user-profile-menu-button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] hover:border-[#8E1B1B]/40 transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold text-[#1C110E] tracking-tight">
                {currentUser}
              </span>
              <span className="text-[11px] text-[#6E5B52] hidden sm:inline font-medium">
                {couple.initials}
              </span>
              <img 
                src={currentAvatar} 
                alt={currentPartnerName} 
                className="w-7 h-7 rounded-full object-cover border border-[#E7D9C9]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#6E5B52] mr-1" />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFBF5] border border-[#E7D9C9] warm-shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-[#E7D9C9]/60">
                  <p className="text-xs text-[#6E5B52]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#1C110E]">{currentPartnerName} ({currentUser})</p>
                  <p className="text-[11px] text-[#8E1B1B] font-script text-base mt-0.5">Together with {otherPartnerName} since May 2024</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setCurrentView('settings')}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SettingsIcon className="w-3.5 h-3.5 text-[#6E5B52]" />
                      <span>Sanctuary Settings</span>
                    </span>
                    <span className="text-[10px] text-[#8E1B1B] bg-[#8E1B1B]/10 px-1.5 py-0.5 rounded capitalize font-medium">
                      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                    </span>
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#E8A33D]" /> : <Moon className="w-3.5 h-3.5 text-[#8E1B1B]" />}
                      <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                    </span>
                    <span className="text-[10px] text-[#6E5B52] bg-[#F7EFE4] px-1.5 py-0.5 rounded border border-[#E7D9C9]">
                      Toggle
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentView('pricing')}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#E8A33D]" />
                      <span>Membership & Storage</span>
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-semibold uppercase">
                      {couple.plan}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentView('invite')}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C63A2E]" />
                    <span>Partner Invite Link</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('onboarding')}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8E1B1B]" />
                    <span>Experience Onboarding Flow</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('legal')}
                    className="w-full px-4 py-2 text-left text-xs text-[#1C110E] hover:bg-[#F7EFE4] flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6E5B52]" />
                    <span>Privacy & Trust</span>
                  </button>
                </div>

                <div className="border-t border-[#E7D9C9]/60 pt-1 mt-1">
                  <button
                    onClick={signOut}
                    className="w-full px-4 py-2 text-left text-xs text-[#8E1B1B] hover:bg-[#8E1B1B]/5 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
