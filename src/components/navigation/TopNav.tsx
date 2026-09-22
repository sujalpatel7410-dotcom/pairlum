import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { useAuth } from '../../context/AuthContext';
import { AppView } from '../../types';
import { formatMonthYear } from '../../lib/format';
import {
  Heart,
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
  { id: 'memories', label: 'Memories' },
  { id: 'wall', label: 'Our Wall' },
  { id: 'shelf', label: 'Our Shelf' },
  { id: 'places', label: 'Our Places' },
  { id: 'drawer', label: 'The Drawer' },
  { id: 'door', label: 'The Door' },
  { id: 'together', label: 'Together' },
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
    setThemeMode,
    activityFeed
  } = usePairlum();
  const { signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isActivityMenuOpen, setIsActivityMenuOpen] = useState(false);

  const currentPartnerName = currentUser === 'A' ? couple.nameA : couple.nameB;
  const otherPartnerName = currentUser === 'A' ? couple.nameB : couple.nameA;
  const currentAvatar = currentUser === 'A' ? couple.avatarA : couple.avatarB;
  const togetherSinceLabel = formatMonthYear(couple.startDate) || couple.togetherSince || null;

  return (
    <header className="sticky top-0 z-40 bg-[#FFD3DE]/90 backdrop-blur-md border-b border-[#F4A9BF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-6">
          <button
            id="pairlum-logo-button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#E11D48]/10 flex items-center justify-center group-hover:bg-[#E11D48]/20 transition-colors">
              <Heart className="w-4 h-4 text-[#E11D48] fill-[#E11D48]/30 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-[#4A0420]">
              Pairlum
            </span>
          </button>

          {/* Signed-in-as badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB8CB] border border-[#F4A9BF] text-xs text-[#8A4058]">
            <span className="w-2 h-2 rounded-full bg-[#FFC145] animate-pulse" />
            <span>Signed in as <strong className="text-[#E11D48]">{currentPartnerName}</strong></span>
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
                    ? 'text-[#E11D48] font-semibold'
                    : 'text-[#8A4058] hover:text-[#4A0420]'}
                `}
              >
                {item.label}
                {isActive && (
                  <div className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[#E11D48] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] -mt-[1px]" />
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
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>

          {/* Dark / Light Mode Sanctuary Toggle Button */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full bg-[#FFB8CB] border border-[#F4A9BF] flex items-center justify-center text-[#8A4058] hover:text-[#FFC145] transition-colors relative cursor-pointer group"
            title={isDarkMode ? 'Switch to Parchment (Light Mode)' : 'Switch to Midnight Sanctuary (Dark Mode)'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#FFC145] group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#E11D48] group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Activity / Notification button */}
          <div className="relative">
            <button
              id="nav-activity-btn"
              onClick={() => setIsActivityMenuOpen(!isActivityMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#FFB8CB] border border-[#F4A9BF] flex items-center justify-center text-[#8A4058] hover:text-[#E11D48] transition-colors relative cursor-pointer"
              title="Activity Feed"
            >
              <Bell className="w-4 h-4" />
              {activityFeed.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
              )}
            </button>

            {isActivityMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-[#FFD3DE] border border-[#F4A9BF] warm-shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-4 py-2 border-b border-[#F4A9BF]/60">
                  <p className="text-xs font-semibold text-[#4A0420]">Activity</p>
                </div>
                {activityFeed.length === 0 ? (
                  <p className="px-4 py-6 text-xs text-[#8A4058] text-center">Nothing yet — activity from you two will show up here.</p>
                ) : (
                  <div className="py-1">
                    {activityFeed.slice(0, 12).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => {
                          if (event.actionTarget) setCurrentView(event.actionTarget);
                          setIsActivityMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#FFB8CB] flex items-start gap-2.5 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mt-1.5 flex-shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-[#4A0420] truncate">{event.title}</span>
                          {event.subtitle && (
                            <span className="block text-[11px] text-[#8A4058] truncate">{event.subtitle}</span>
                          )}
                          <span className="block text-[10px] text-[#8A4058]/70 mt-0.5">{event.timeAgo}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Simulator toggle button */}
          {onToggleMobileSim && (
            <button
              onClick={onToggleMobileSim}
              className={`p-2 rounded-full border text-xs transition-colors hidden md:flex items-center gap-1 cursor-pointer ${isMobileSim ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-[#FFB8CB] text-[#8A4058] border-[#F4A9BF]'
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
              className="flex items-center gap-2 p-1 pl-2 rounded-full bg-[#FFB8CB] border border-[#F4A9BF] hover:border-[#E11D48]/40 transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold text-[#4A0420] tracking-tight">
                {currentUser}
              </span>
              <span className="text-[11px] text-[#8A4058] hidden sm:inline font-medium">
                {couple.initials}
              </span>
              <img
                src={currentAvatar || (currentUser === 'A' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80')}
                alt={currentPartnerName}
                className="w-7 h-7 rounded-full object-cover border border-[#F4A9BF]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#8A4058] mr-1" />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFD3DE] border border-[#F4A9BF] warm-shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-[#F4A9BF]/60">
                  <p className="text-xs text-[#8A4058]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#4A0420]">{currentPartnerName} ({currentUser})</p>
                  <p className="text-[11px] text-[#E11D48] font-script text-base mt-0.5">
                    Together with {otherPartnerName}{togetherSinceLabel ? ` since ${togetherSinceLabel}` : ''}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setCurrentView('settings')}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A0420] hover:bg-[#FFB8CB] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SettingsIcon className="w-3.5 h-3.5 text-[#8A4058]" />
                      <span>Sanctuary Settings</span>
                    </span>
                    <span className="text-[10px] text-[#E11D48] bg-[#E11D48]/10 px-1.5 py-0.5 rounded capitalize font-medium">
                      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                    </span>
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A0420] hover:bg-[#FFB8CB] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#FFC145]" /> : <Moon className="w-3.5 h-3.5 text-[#E11D48]" />}
                      <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                    </span>
                    <span className="text-[10px] text-[#8A4058] bg-[#FFB8CB] px-1.5 py-0.5 rounded border border-[#F4A9BF]">
                      Toggle
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentView('pricing')}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A0420] hover:bg-[#FFB8CB] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#FFC145]" />
                      <span>Membership & Storage</span>
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-semibold uppercase">
                      {couple.plan}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentView('invite')}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A0420] hover:bg-[#FFB8CB] flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Partner Invite Link</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('legal')}
                    className="w-full px-4 py-2 text-left text-xs text-[#4A0420] hover:bg-[#FFB8CB] flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8A4058]" />
                    <span>Privacy & Trust</span>
                  </button>
                </div>

                <div className="border-t border-[#F4A9BF]/60 pt-1 mt-1">
                  <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-2 text-left text-xs text-[#E11D48] hover:bg-[#E11D48]/5 flex items-center gap-2 cursor-pointer"
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
