import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard, HandNote } from '../common/PaperCard';
import { Memory, MemoryKind } from '../../types';
import { 
  Heart, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  FileText, 
  MapPin, 
  Plus, 
  Play, 
  Calendar,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const OurWallView: React.FC = () => {
  const { 
    memories, 
    openAddMemoryModal, 
    setActiveLightboxMemory,
    currentUser,
    couple
  } = usePairlum();

  const [selectedFilter, setSelectedFilter] = useState<'all' | MemoryKind | 'places'>('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'places') return !!m.location;
    return m.kind === selectedFilter;
  });

  const filterCounts = {
    all: memories.length,
    photo: memories.filter(m => m.kind === 'photo').length,
    video: memories.filter(m => m.kind === 'video').length,
    voice: memories.filter(m => m.kind === 'voice').length,
    note: memories.filter(m => m.kind === 'note').length,
    places: memories.filter(m => !!m.location).length
  };

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left PageRail (Design System Signature) */}
      <PageRail
        step="01 / 06"
        categoryLabel="MEMORIES BOARD"
        title="Our Wall"
        subtitle="A pinboard of little polaroid moments, tickets, and love notes collected over time."
        quote="Every memory with you feels like a warm candle in a cold room."
        quoteAuthor={currentUser === 'A' ? couple.nameB : couple.nameA}
        illustrationSrc="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Pinned with love on Our Wall ♡"
      >
        {/* Type Filters */}
        <div className="space-y-1 pt-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'all' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Moments</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'all' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.all}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('photo')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'photo' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'photo' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.photo}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('voice')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'voice' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Notes</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'voice' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.voice}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('video')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'video' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'video' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.video}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('note')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'note' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Love Notes</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'note' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.note}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('places')}
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
              selectedFilter === 'places' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Places</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === 'places' ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
              {filterCounts.places}
            </span>
          </button>
        </div>

        {/* Pin New Memory CTA */}
        <div className="pt-3">
          <button
            onClick={() => openAddMemoryModal('photo')}
            className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin a New Memory</span>
          </button>
        </div>
      </PageRail>

      {/* Right Pinboard Area */}
      <main className="flex-1 space-y-6">
        
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#1C110E]">Showing:</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#E7D9C9] text-[#8E1B1B] font-medium capitalize">
              {selectedFilter === 'all' ? 'All Types' : selectedFilter}
            </span>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6E5B52]">Year:</span>
            {['2024', '2025', '2026'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedYear === yr ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* MASONRY PINBOARD (Polaroids with subtle rotation) */}
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
          {filteredMemories.map((mem) => {
            const rot = mem.rotationDeg || (mem.id.charCodeAt(mem.id.length - 1) % 4) - 2;

            if (mem.kind === 'note') {
              return (
                <div key={mem.id} className="break-inside-avoid">
                  <HandNote
                    text={mem.caption}
                    author={mem.authorName}
                    date={mem.date}
                    hasWaxSeal
                    rotation={rot}
                    onClick={() => setActiveLightboxMemory(mem)}
                  />
                </div>
              );
            }

            return (
              <div 
                key={mem.id} 
                className="break-inside-avoid transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                style={{ transform: `rotate(${rot}deg)` }}
                onClick={() => setActiveLightboxMemory(mem)}
              >
                <div className="relative p-3.5 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow group">
                  
                  {/* Pushpin at top center */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#8E1B1B] to-[#C63A2E] shadow-sm flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  </div>

                  {/* Media container */}
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                    <img 
                      src={mem.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'} 
                      alt={mem.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {mem.kind === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-10 h-10 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center shadow-md">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {mem.kind === 'voice' && (
                      <div className="absolute bottom-2 left-2 bg-[#8E1B1B] text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                        <Mic className="w-3 h-3" />
                        <span>{mem.audioDuration}</span>
                      </div>
                    )}
                  </div>

                  {/* Polaroid caption area */}
                  <div className="pt-3 px-1">
                    <h4 className="font-display text-sm font-semibold text-[#1C110E] truncate">
                      {mem.title}
                    </h4>
                    <p className="font-script text-base text-[#6E5B52] line-clamp-2 mt-0.5 leading-snug">
                      "{mem.caption}"
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#E7D9C9]/50 flex items-center justify-between text-[11px] text-[#6E5B52]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8E1B1B]" />
                        <span className="truncate max-w-[100px]">{mem.location || 'Home'}</span>
                      </span>

                      {/* Reactions count */}
                      <div className="flex items-center gap-1">
                        {mem.reactions.some(r => r.count > 0) && (
                          <span className="text-[#8E1B1B] font-medium flex items-center gap-0.5">
                            ❤️ {mem.reactions.reduce((acc, r) => acc + r.count, 0)}
                          </span>
                        )}
                        <span className="text-[10px] font-script text-xs text-[#8E1B1B]">
                          — {mem.authorName}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Month Scrubber (Prompt 3) */}
        <div className="mt-10 p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9]">
          <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-2 text-center">
            Scrub Timeline ({selectedYear})
          </div>
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex-shrink-0 ${
                  selectedMonth === m 
                    ? 'bg-[#8E1B1B] text-white shadow-xs' 
                    : 'text-[#6E5B52] hover:bg-[#FFFBF5]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
};
