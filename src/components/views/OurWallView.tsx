import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { HandNote } from '../common/PaperCard';
import { MemoryKind } from '../../types';
import {
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  MapPin,
  Plus,
  Play,
  Sparkles,
  Filter,
  Camera,
} from 'lucide-react';

export const OurWallView: React.FC = () => {
  const {
    memories,
    openAddMemoryModal,
    setActiveLightboxMemory,
    currentUser,
    couple,
  } = usePairlum();

  const [selectedFilter, setSelectedFilter] = useState<'all' | MemoryKind | 'places'>('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const filteredMemories = memories.filter((m) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'places') return !!m.location;
    return m.kind === selectedFilter;
  });

  const filterCounts = {
    all: memories.length,
    photo: memories.filter((m) => m.kind === 'photo').length,
    video: memories.filter((m) => m.kind === 'video').length,
    voice: memories.filter((m) => m.kind === 'voice').length,
    note: memories.filter((m) => m.kind === 'note').length,
    places: memories.filter((m) => !!m.location).length,
  };

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filterBtn = (
    value: 'all' | MemoryKind | 'places',
    label: string,
    Icon: React.ElementType,
    count: number
  ) => (
    <button
      key={value}
      onClick={() => setSelectedFilter(value)}
      className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${selectedFilter === value ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
        }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </span>
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedFilter === value ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">

      {/* Left PageRail */}
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
          {filterBtn('all', 'All Moments', Sparkles, filterCounts.all)}
          {filterBtn('photo', 'Photos', ImageIcon, filterCounts.photo)}
          {filterBtn('voice', 'Voice Notes', Mic, filterCounts.voice)}
          {filterBtn('video', 'Videos', Video, filterCounts.video)}
          {filterBtn('note', 'Love Notes', FileText, filterCounts.note)}
          {filterBtn('places', 'Places', MapPin, filterCounts.places)}
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6E5B52]">Year:</span>
            {['2024', '2025', '2026'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedYear === yr ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-white'
                  }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content area: empty / filter-empty / pinboard ── */}
        {memories.length === 0 ? (

          /* Full empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="relative w-40 h-52 mb-10">
              {/* ghost polaroids behind */}
              <div
                className="absolute inset-0 bg-white border border-[#E7D9C9] rounded-xl shadow-md opacity-30"
                style={{ transform: 'rotate(-8deg) translate(-24px, 8px)' }}
              />
              <div
                className="absolute inset-0 bg-white border border-[#E7D9C9] rounded-xl shadow-md opacity-30"
                style={{ transform: 'rotate(6deg) translate(24px, 12px)' }}
              />
              {/* center polaroid */}
              <div className="relative z-10 w-full h-full bg-white border border-[#E7D9C9] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-[#8E1B1B] to-[#C63A2E] shadow flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                </div>
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#F7EFE4] to-[#EFE4D6] flex items-center justify-center">
                  <Camera className="w-10 h-10 text-[#8E1B1B]/50" />
                </div>
                <span className="font-script text-sm text-[#6E5B52]">your first memory</span>
              </div>
            </div>

            <h3 className="font-display text-3xl text-[#1C110E] font-medium">
              Your wall is empty
            </h3>
            <p className="mt-2 max-w-xs text-[#6E5B52] font-script text-lg leading-relaxed">
              Pin your first polaroid — a photo, a love note, or a voice memo — and start filling this wall with your story.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openAddMemoryModal('photo')}
                className="px-6 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Pin a Photo</span>
              </button>
              <button
                onClick={() => openAddMemoryModal('note')}
                className="px-6 py-3 rounded-full border border-[#8E1B1B] text-[#8E1B1B] hover:bg-[#8E1B1B]/5 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Write a Love Note</span>
              </button>
            </div>

            <p className="mt-6 text-xs text-[#6E5B52]/60 font-mono">
              🕯️ Everything stays private between just the two of you
            </p>
          </div>

        ) : filteredMemories.length === 0 ? (

          /* Filter empty state */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F7EFE4] flex items-center justify-center mb-4">
              <Filter className="w-7 h-7 text-[#8E1B1B]" />
            </div>
            <h4 className="font-display text-xl text-[#1C110E] font-medium capitalize">
              No {selectedFilter} memories yet
            </h4>
            <p className="mt-1 text-[#6E5B52] font-script text-base">
              Try a different filter or pin a new one.
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-4 px-5 py-2 rounded-full border border-[#8E1B1B] text-[#8E1B1B] text-xs font-semibold cursor-pointer hover:bg-[#8E1B1B]/5"
            >
              Show all memories
            </button>
          </div>

        ) : (

          /* Masonry pinboard */
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
            {filteredMemories.map((mem) => {
              const rot = mem.rotationDeg ?? ((mem.id.charCodeAt(mem.id.length - 1) % 4) - 2);

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

                    {/* Pushpin */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#8E1B1B] to-[#C63A2E] shadow-sm flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    </div>

                    {/* Media */}
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

                    {/* Caption */}
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
                        <div className="flex items-center gap-1">
                          {mem.reactions.some((r) => r.count > 0) && (
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
        )}

        {/* Bottom Month Scrubber (only show when there are memories) */}
        {memories.length > 0 && (
          <div className="mt-10 p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9]">
            <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-2 text-center">
              Scrub Timeline ({selectedYear})
            </div>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex-shrink-0 ${selectedMonth === m
                      ? 'bg-[#8E1B1B] text-white shadow-xs'
                      : 'text-[#6E5B52] hover:bg-[#FFFBF5]'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
