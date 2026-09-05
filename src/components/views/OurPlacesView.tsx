import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard } from '../common/PaperCard';
import { 
  MapPin, 
  Sparkles, 
  Plus, 
  Play, 
  Pause, 
  Compass, 
  Heart, 
  Clock, 
  Lock, 
  Camera, 
  Mic,
  Navigation
} from 'lucide-react';

export const OurPlacesView: React.FC = () => {
  const { 
    parallelMoments, 
    addParallelMoment, 
    currentUser, 
    couple,
    showToast 
  } = usePairlum();

  const [activeTab, setActiveTab] = useState<'parallel' | 'map'>('parallel');
  const [isPlayingAudioA, setIsPlayingAudioA] = useState(false);
  const [isPlayingAudioB, setIsPlayingAudioB] = useState(false);
  const [isCreatingParallel, setIsCreatingParallel] = useState(false);

  // New parallel moment fields
  const [newTitleA, setNewTitleA] = useState('My sunset corner');
  const [newDescA, setNewDescA] = useState('Thinking of you while the lights turn on.');
  const [newLocA, setNewLocA] = useState('Bandra, Mumbai');
  const [newTitleB, setNewTitleB] = useState('Midnight Walk');
  const [newDescB, setNewDescB] = useState('Looking at the same stars from across the sea.');
  const [newLocB, setNewLocB] = useState('London, UK');

  const places = [
    { name: 'Sunset Beach Point', city: 'Goa, India', category: 'date', date: 'Aug 2026', photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80', note: 'Our favorite evening ever.' },
    { name: 'Marine Drive Promenade', city: 'Mumbai, India', category: 'trip', date: 'Jul 2026', photo: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80', note: 'Holding hands in the rain.' },
    { name: 'Old Town Café', city: 'Ahmedabad, India', category: 'date', date: 'May 2026', photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80', note: 'Where we talked for 4 hours non-stop.' },
    { name: 'Eiffel Tower at Twilight', city: 'Paris, France', category: 'dream', date: 'Future Dream', photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', note: 'One day we will stand here together.' }
  ];

  const handleSaveParallel = () => {
    addParallelMoment(
      {
        location: newLocA,
        title: newTitleA,
        description: newDescA,
        photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        audioDuration: '0:22',
        timeAgo: 'Just now'
      },
      {
        location: newLocB,
        title: newTitleB,
        description: newDescB,
        photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        audioDuration: '0:30',
        timeAgo: 'Just now'
      }
    );
    setIsCreatingParallel(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left PageRail */}
      <PageRail
        step="03 / 06"
        categoryLabel="PLACES & COORDINATES"
        title="Our Places"
        subtitle="Coordinates of our memories and synchronized parallel moments from across the distance."
        quote="Distance means so little when someone means so much."
        quoteAuthor={currentUser === 'A' ? couple.nameB : couple.nameA}
        illustrationSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Connected under the same sky ♡"
      >
        <div className="space-y-1 pt-2">
          <button
            onClick={() => setActiveTab('parallel')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'parallel' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Parallel Moments</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{parallelMoments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'map' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Paper Map & Trips</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">4 spots</span>
          </button>
        </div>

        <div className="pt-3">
          <button
            onClick={() => setIsCreatingParallel(true)}
            className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Parallel Moment</span>
          </button>
        </div>
      </PageRail>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        
        {/* PARALLEL MOMENTS VIEW (Screenshot 11) */}
        {activeTab === 'parallel' && (
          <div className="space-y-8">
            
            {/* Header Description */}
            <div>
              <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#8E1B1B]" />
                <span>Parallel Moments</span>
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1C110E] font-medium mt-1 leading-tight">
                Same time, <br />
                <span className="text-[#8E1B1B] italic">different places,</span> still together.
              </h2>
              <p className="text-sm text-[#6E5B52] mt-2 max-w-lg">
                Two moments, side by side. Because distance changes nothing when hearts stay close.
              </p>
            </div>

            {/* Create Parallel Moment Form Modal / Collapse */}
            {isCreatingParallel && (
              <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-4 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E7D9C9]">
                  <h3 className="font-display text-2xl text-[#1C110E]">Capture Parallel Moment</h3>
                  <button onClick={() => setIsCreatingParallel(false)} className="text-xs text-[#6E5B52] hover:underline">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#E7D9C9] space-y-3">
                    <span className="text-xs font-bold text-[#8E1B1B] uppercase">Emma's Side</span>
                    <input
                      type="text"
                      value={newTitleA}
                      onChange={(e) => setNewTitleA(e.target.value)}
                      placeholder="Title"
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg"
                    />
                    <input
                      type="text"
                      value={newLocA}
                      onChange={(e) => setNewLocA(e.target.value)}
                      placeholder="Location"
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg"
                    />
                    <textarea
                      value={newDescA}
                      onChange={(e) => setNewDescA(e.target.value)}
                      placeholder="What are you doing / feeling?"
                      rows={2}
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E7D9C9] space-y-3">
                    <span className="text-xs font-bold text-[#8E1B1B] uppercase">Liam's Side</span>
                    <input
                      type="text"
                      value={newTitleB}
                      onChange={(e) => setNewTitleB(e.target.value)}
                      placeholder="Title"
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg"
                    />
                    <input
                      type="text"
                      value={newLocB}
                      onChange={(e) => setNewLocB(e.target.value)}
                      placeholder="Location"
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg"
                    />
                    <textarea
                      value={newDescB}
                      onChange={(e) => setNewDescB(e.target.value)}
                      placeholder="What are you doing / feeling?"
                      rows={2}
                      className="w-full p-2 text-xs bg-[#F7EFE4] rounded-lg resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveParallel}
                  className="w-full py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide cursor-pointer"
                >
                  Save Synchronized Parallel Moment ♡
                </button>
              </div>
            )}

            {/* Render Parallel Moments list (Screenshot 11) */}
            {parallelMoments.map((pm) => (
              <div key={pm.id} className="p-6 sm:p-8 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow-lg space-y-6">
                
                {/* Top synchronization pill */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E7D9C9]">
                  <div className="flex items-center gap-2 text-xs text-[#6E5B52]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8E1B1B] animate-pulse" />
                    <span>Connected at the same time: <strong className="text-[#1C110E]">{pm.date}, {pm.time}</strong></span>
                  </div>

                  <span className="text-xs text-[#8E1B1B] font-script text-base">
                    captured at the same time ♡
                  </span>
                </div>

                {/* Side-by-Side Dual Polaroid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  
                  {/* Center Heart Bridge */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#8E1B1B] text-white items-center justify-center shadow-lg border-2 border-white">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>

                  {/* Left Side: Partner A */}
                  <div className="p-4 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] font-semibold">
                        Emma was here
                      </span>
                      <span className="text-[#6E5B52]">{pm.momentA.timeAgo}</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                      <img src={pm.momentA.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'} alt={pm.momentA.title} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#8E1B1B] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{pm.momentA.location}</span>
                      </span>
                      <h4 className="font-display text-base font-semibold text-[#1C110E] mt-0.5">
                        {pm.momentA.title}
                      </h4>
                      <p className="font-script text-base text-[#6E5B52] mt-0.5 leading-snug">
                        "{pm.momentA.description}"
                      </p>
                    </div>

                    {/* Audio wave note */}
                    {pm.momentA.audioDuration && (
                      <div className="p-2 rounded-xl bg-[#F7EFE4] flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setIsPlayingAudioA(!isPlayingAudioA)}
                          className="w-7 h-7 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center cursor-pointer"
                        >
                          {isPlayingAudioA ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                        </button>
                        <div className="flex-1 h-2 bg-[#E7D9C9] rounded-full overflow-hidden">
                          <div className={`h-full bg-[#8E1B1B] ${isPlayingAudioA ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
                        </div>
                        <span className="text-[10px] text-[#6E5B52] font-mono">{pm.momentA.audioDuration}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Partner B */}
                  <div className="p-4 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] font-semibold">
                        Liam was here
                      </span>
                      <span className="text-[#6E5B52]">{pm.momentB.timeAgo}</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                      <img src={pm.momentB.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'} alt={pm.momentB.title} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#8E1B1B] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{pm.momentB.location}</span>
                      </span>
                      <h4 className="font-display text-base font-semibold text-[#1C110E] mt-0.5">
                        {pm.momentB.title}
                      </h4>
                      <p className="font-script text-base text-[#6E5B52] mt-0.5 leading-snug">
                        "{pm.momentB.description}"
                      </p>
                    </div>

                    {/* Audio wave note */}
                    {pm.momentB.audioDuration && (
                      <div className="p-2 rounded-xl bg-[#F7EFE4] flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setIsPlayingAudioB(!isPlayingAudioB)}
                          className="w-7 h-7 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center cursor-pointer"
                        >
                          {isPlayingAudioB ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                        </button>
                        <div className="flex-1 h-2 bg-[#E7D9C9] rounded-full overflow-hidden">
                          <div className={`h-full bg-[#8E1B1B] ${isPlayingAudioB ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
                        </div>
                        <span className="text-[10px] text-[#6E5B52] font-mono">{pm.momentB.audioDuration}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Explanatory Strip (Screenshot 11) */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#E7D9C9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E5B52]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#8E1B1B]" />
                    <span>Only you two can see what you share. Ordinary moments become something more, together.</span>
                  </div>
                  <button
                    onClick={() => setIsCreatingParallel(true)}
                    className="px-4 py-2 rounded-full bg-[#8E1B1B] text-white text-xs font-medium cursor-pointer"
                  >
                    + Add your side
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* PAPER MAP & TRIPS VIEW */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-4xl text-[#1C110E] font-medium">Our Paper Map</h2>
              <p className="text-sm text-[#6E5B52] mt-1">
                Every pin is a place where we held hands, made promises, or dreamed of tomorrow.
              </p>
            </div>

            {/* Illustrated Parchment Map Area */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E7D9C9] p-8 paper-texture warm-shadow-lg min-h-80 bg-[#F7EFE4] flex flex-col justify-between">
              
              {/* Compass rose decoration */}
              <div className="absolute top-6 right-6 text-[#8E1B1B]/20 flex flex-col items-center">
                <Compass className="w-16 h-16 stroke-[1.2]" />
                <span className="font-display text-xs text-[#8E1B1B]/40 font-bold mt-1">N</span>
              </div>

              <div className="relative z-10 max-w-sm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8E1B1B]">
                  Parchment Canvas
                </span>
                <h3 className="font-display text-2xl text-[#1C110E]">Our Journey Coordinates</h3>
                <p className="text-xs text-[#6E5B52]">3 Cities visited • 1 Dream destination charted</p>
              </div>

              {/* Pinned Places Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
                {places.map((place, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow relative group">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8E1B1B] shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F7EFE4] mb-2 mt-1">
                      <img src={place.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>

                    <span className="text-[10px] uppercase font-bold text-[#8E1B1B] tracking-wider block">
                      {place.category} • {place.date}
                    </span>
                    <h4 className="font-display text-sm font-semibold text-[#1C110E] truncate">{place.name}</h4>
                    <p className="text-[11px] text-[#6E5B52]">{place.city}</p>
                    <p className="font-script text-sm text-[#8E1B1B] mt-1 italic truncate">"{place.note}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
