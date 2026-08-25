import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import {
  Heart,
  Lock,
  Calendar,
  MapPin,
  Download,
  ShieldCheck,
  Flame,
  Music,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Palette,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { useCloudinaryUpload } from '../../lib/useCloudinaryUpload';

export const SettingsView: React.FC = () => {
  const { 
    couple, 
    updateCoupleProfile, 
    showToast, 
    isCandlelit, 
    toggleCandlelight,
    themeMode,
    setThemeMode,
    isDarkMode,
    toggleDarkMode
  } = usePairlum();

  const [nameA, setNameA] = useState(couple.nameA);
  const [nameB, setNameB] = useState(couple.nameB);
  const [cityA, setCityA] = useState(couple.cityA || 'Mumbai, India');
  const [cityB, setCityB] = useState(couple.cityB || 'London, UK');
  const [distance, setDistance] = useState(couple.distance || '7,192 km (4,469 mi)');
  const [flightDuration, setFlightDuration] = useState(couple.flightDuration || '9 hrs 15 min flight');
  const [timezoneDiff, setTimezoneDiff] = useState(couple.timezoneDiff || '4.5 hrs time difference');
  const [reunionLocation, setReunionLocation] = useState(couple.reunionLocation || 'Ahmedabad, India');
  const [reunionTitle, setReunionTitle] = useState(couple.reunionTitle || 'Home is wherever we\'re together');
  const [startDate, setStartDate] = useState(couple.startDate || '2024-05-16');
  const [reunionDate, setReunionDate] = useState(couple.reunionDate || '2026-12-25T20:00:00');
  const [drawerPin, setDrawerPin] = useState(couple.drawerPin || '140224');

  const { upload: uploadAvatarA, isUploading: isUploadingAvatarA, progress: progressAvatarA } = useCloudinaryUpload();
  const { upload: uploadAvatarB, isUploading: isUploadingAvatarB, progress: progressAvatarB } = useCloudinaryUpload();
  const { upload: uploadCover, isUploading: isUploadingCover, progress: progressCover } = useCloudinaryUpload();

  const handleAvatarSelected = async (file: File | undefined, role: 'A' | 'B') => {
    if (!file) return;
    const result = role === 'A' ? await uploadAvatarA(file) : await uploadAvatarB(file);
    if (!result) return;
    updateCoupleProfile(role === 'A' ? { avatarA: result.secureUrl } : { avatarB: result.secureUrl });
  };

  const handleCoverSelected = async (file: File | undefined) => {
    if (!file) return;
    const result = await uploadCover(file);
    if (!result) return;
    updateCoupleProfile({ coverPhoto: result.secureUrl });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCoupleProfile({
      nameA,
      nameB,
      cityA,
      cityB,
      distance,
      flightDuration,
      timezoneDiff,
      reunionLocation,
      reunionTitle,
      startDate,
      reunionDate,
      drawerPin,
      initials: `${nameA.charAt(0)} & ${nameB.charAt(0)}`
    });
    showToast('Sanctuary settings updated ♡');
  };

  const handleExportArchive = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(couple, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Pairlum_Our_Story_${couple.initials.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported memory archive');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left PageRail */}
      <PageRail
        step="07 / 07"
        categoryLabel="CONFIGURATION"
        title="Sanctuary Settings"
        subtitle="Manage couple identities, privacy passcode, anniversary dates, and export your private book."
        quote="Protected in our little corner of the world."
        quoteAuthor="Pairlum"
      >
        <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-3 text-xs">
          <span className="font-bold text-[#8E1B1B] uppercase tracking-wider block">Privacy Guarantee</span>
          <p className="text-[#6E5B52]">
            Pairlum is an end-to-end private sanctuary. No social feeds, no public profiles, no ads. Just you two.
          </p>
        </div>

        <div className="pt-3">
          <button
            onClick={handleExportArchive}
            className="w-full py-2.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-semibold text-[#1C110E] hover:border-[#8E1B1B] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8E1B1B]" />
            <span>Export Memory Archive</span>
          </button>
        </div>
      </PageRail>

      {/* Main Settings Form */}
      <main className="flex-1 space-y-8">
        
        <div>
          <h2 className="font-display text-4xl text-[#1C110E] font-medium">Sanctuary Settings</h2>
          <p className="text-xs text-[#6E5B52] mt-1">Keep your profile and shared milestones up to date.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Couple Profiles */}
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
            <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8E1B1B]" />
              <span>Partners & Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Partner A (Name)</label>
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Partner A (City)</label>
                <input
                  type="text"
                  value={cityA}
                  onChange={(e) => setCityA(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Partner B (Name)</label>
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Partner B (City)</label>
                <input
                  type="text"
                  value={cityB}
                  onChange={(e) => setCityB(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Distance Apart</label>
                <input
                  type="text"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 7,192 km (4,469 mi)"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Flight Duration & Timezone</label>
                <input
                  type="text"
                  value={flightDuration}
                  onChange={(e) => setFlightDuration(e.target.value)}
                  placeholder="e.g. 9 hrs 15 min flight"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Photos: Avatars & Cover */}
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
            <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8E1B1B]" />
              <span>Photos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <img src={couple.avatarA} alt={couple.nameA} className="w-20 h-20 rounded-full object-cover mx-auto border border-[#E7D9C9]" />
                <label className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#8E1B1B] cursor-pointer hover:underline">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploadingAvatarA ? `Uploading... ${progressAvatarA}%` : `${couple.nameA}'s photo`}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatarA}
                    onChange={(e) => handleAvatarSelected(e.target.files?.[0], 'A')}
                  />
                </label>
              </div>

              <div className="text-center">
                <img src={couple.avatarB} alt={couple.nameB} className="w-20 h-20 rounded-full object-cover mx-auto border border-[#E7D9C9]" />
                <label className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#8E1B1B] cursor-pointer hover:underline">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploadingAvatarB ? `Uploading... ${progressAvatarB}%` : `${couple.nameB}'s photo`}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatarB}
                    onChange={(e) => handleAvatarSelected(e.target.files?.[0], 'B')}
                  />
                </label>
              </div>

              <div className="text-center">
                <img src={couple.coverPhoto} alt="Cover" className="w-full h-20 rounded-xl object-cover mx-auto border border-[#E7D9C9]" />
                <label className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#8E1B1B] cursor-pointer hover:underline">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploadingCover ? `Uploading... ${progressCover}%` : 'Cover photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingCover}
                    onChange={(e) => handleCoverSelected(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Dates & Milestones */}
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
            <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8E1B1B]" />
              <span>Milestones & Reunion</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Anniversary / Since Date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Next Reunion Target Date</label>
                <input
                  type="text"
                  value={reunionDate}
                  onChange={(e) => setReunionDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Reunion Destination City</label>
                <input
                  type="text"
                  value={reunionLocation}
                  onChange={(e) => setReunionLocation(e.target.value)}
                  placeholder="e.g. Ahmedabad, India"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1">Reunion Door Title</label>
                <input
                  type="text"
                  value={reunionTitle}
                  onChange={(e) => setReunionTitle(e.target.value)}
                  placeholder="e.g. Home is wherever we're together"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Theme & Sanctuary Ambiance */}
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#8E1B1B]" />
                <span>Sanctuary Ambiance & Dark Mode</span>
              </h3>
              <span className="text-[11px] font-medium text-[#6E5B52] bg-[#FFFBF5] px-2.5 py-1 rounded-full border border-[#E7D9C9]">
                Active: <strong className="text-[#8E1B1B] capitalize">{themeMode}</strong>
              </span>
            </div>
            
            <p className="text-xs text-[#6E5B52]">
              Choose the atmosphere for your shared sanctuary. Midnight mode offers an eye-safe, deep candlelight backdrop ideal for late-night moments together.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Parchment Light */}
              <button
                type="button"
                onClick={() => {
                  setThemeMode('light');
                  showToast('☀️ Parchment light mode activated');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  themeMode === 'light'
                    ? 'border-[#8E1B1B] bg-white ring-2 ring-[#8E1B1B]/20 shadow-md'
                    : 'border-[#E7D9C9] bg-[#FFFBF5] hover:border-[#8E1B1B]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sun className="w-4 h-4" />
                  </div>
                  {themeMode === 'light' && (
                    <span className="text-[10px] uppercase font-bold text-white bg-[#8E1B1B] px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="font-display text-sm font-semibold text-[#1C110E]">Daylight Parchment</p>
                <p className="text-[11px] text-[#6E5B52] mt-0.5">Warm cream paper, crisp crimson ink & sunny nostalgia</p>
              </button>

              {/* Midnight Sanctuary Dark Mode */}
              <button
                type="button"
                onClick={() => {
                  setThemeMode('dark');
                  showToast('🌙 Midnight sanctuary dark mode activated');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  themeMode === 'dark'
                    ? 'border-[#C63A2E] bg-[#1C1310] ring-2 ring-[#C63A2E]/30 shadow-md'
                    : 'border-[#E7D9C9] bg-[#241A17] hover:border-[#C63A2E]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  {themeMode === 'dark' && (
                    <span className="text-[10px] uppercase font-bold text-white bg-[#C63A2E] px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="font-display text-sm font-semibold text-[#FAF3EC]">Midnight Sanctuary</p>
                <p className="text-[11px] text-[#B8A699] mt-0.5">Deep charcoal velvet, amber glow & eye-safe night intimacy</p>
              </button>

              {/* Candlelight Glow */}
              <button
                type="button"
                onClick={() => {
                  setThemeMode('candlelight');
                  showToast('🕯️ Candlelight ambiance activated');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  themeMode === 'candlelight'
                    ? 'border-[#E8A33D] bg-amber-50/50 ring-2 ring-[#E8A33D]/30 shadow-md'
                    : 'border-[#E7D9C9] bg-[#FFFBF5] hover:border-[#E8A33D]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-[#E8A33D]">
                    <Flame className="w-4 h-4" />
                  </div>
                  {themeMode === 'candlelight' && (
                    <span className="text-[10px] uppercase font-bold text-white bg-[#E8A33D] px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="font-display text-sm font-semibold text-[#1C110E]">Candlelight Glow</p>
                <p className="text-[11px] text-[#6E5B52] mt-0.5">Soft pulsing ambient vignette with warm fireplace warmth</p>
              </button>
            </div>
          </div>

          {/* Security PIN */}
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
            <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8E1B1B]" />
              <span>The Drawer Passcode</span>
            </h3>

            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-[#1C110E] mb-1">6-Digit Secret PIN</label>
              <input
                type="password"
                maxLength={6}
                value={drawerPin}
                onChange={(e) => setDrawerPin(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs font-mono text-center tracking-widest text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Sanctuary Settings</span>
          </button>

        </form>

      </main>

    </div>
  );
};
