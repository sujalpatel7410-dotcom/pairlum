import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { Chapter } from '../../types';
import {
  BookOpen,
  Plus,
  Sparkles,
  Check,
  Bookmark,
  UploadCloud,
  Library,
} from 'lucide-react';
import { useCloudinaryUpload } from '../../lib/useCloudinaryUpload';

export const OurShelfView: React.FC = () => {
  const {
    chapters,
    addChapter,
    memories,
    setActiveLightboxMemory,
    currentUser,
    couple,
  } = usePairlum();

  const safeChapters = chapters || [];
  const safeMemories = memories || [];

  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  // New Chapter Wizard State
  const [newTitle, setNewTitle] = useState('The Window');
  const [newSubtitle, setNewSubtitle] = useState('The little moments that felt like home. The talks, the sunsets, the quiet.');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80');
  const [newStartDate, setNewStartDate] = useState('May 2024');
  const [newEndDate, setNewEndDate] = useState('Aug 2026');
  const [newTheme, setNewTheme] = useState('Home & Everyday');
  const [newSpineColor, setNewSpineColor] = useState('#8E1B1B');
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);

  const { upload: uploadCover, isUploading: isUploadingCover, progress: coverProgress } = useCloudinaryUpload();

  const handleCoverSelected = async (file: File | undefined) => {
    if (!file) return;
    const result = await uploadCover(file);
    if (result) setNewCover(result.secureUrl);
  };

  // Resolve active chapter — fall back to first available or undefined
  const activeChapter: Chapter | undefined =
    safeChapters.find((c) => c.id === activeChapterId) ?? safeChapters[0];

  const chapterMemories = activeChapter
    ? safeMemories.filter(
      (m) =>
        activeChapter.memoryIds?.includes(m.id) ||
        m.chapterId === activeChapter.id
    )
    : [];

  const handleToggleMemorySelect = (id: string) => {
    setSelectedMemoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveChapter = () => {
    addChapter({
      title: newTitle || 'Untitled Chapter',
      subtitle: newSubtitle,
      coverImage: newCover,
      startDate: newStartDate,
      endDate: newEndDate,
      theme: newTheme,
      spineColor: newSpineColor,
      memoryIds: selectedMemoryIds,
    });
    setIsCreatingChapter(false);
    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setSelectedMemoryIds([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">

      {/* Left PageRail */}
      <PageRail
        step="02 / 06"
        categoryLabel="OUR STORY ARCHIVE"
        title="Our Shelf"
        subtitle="Chapters of your love story bound as books. Read through the pages of each season together."
        quote="Every chapter with you is my favorite one so far."
        quoteAuthor={currentUser === 'A' ? couple.nameB : couple.nameA}
        illustrationSrc="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Reading the chapters of us ♡"
      >
        {/* Chapters list */}
        <div className="space-y-1.5 pt-2">
          {safeChapters.length === 0 ? (
            <p className="text-xs text-[#6E5B52] italic px-1 py-2">
              No chapters yet. Create your first one →
            </p>
          ) : (
            safeChapters.map((ch, idx) => {
              const isSelected = ch.id === (activeChapter?.id ?? '');
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterId(ch.id);
                    setIsCreatingChapter(false);
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer ${isSelected && !isCreatingChapter
                      ? 'bg-[#8E1B1B] text-white border-[#8E1B1B] shadow-sm'
                      : 'bg-[#F7EFE4] text-[#1C110E] border-[#E7D9C9] hover:bg-[#EFE4D6]'
                    }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[10px] opacity-80">Book 0{idx + 1}</span>
                    <span className="text-[10px] opacity-75">
                      {ch.startDate} – {ch.endDate}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-medium truncate">{ch.title}</h4>
                  <p className={`text-[11px] truncate mt-0.5 ${isSelected && !isCreatingChapter ? 'text-white/80' : 'text-[#6E5B52]'}`}>
                    {ch.memoryIds.length} memories
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Create Chapter button */}
        <div className="pt-3">
          <button
            onClick={() => setIsCreatingChapter(true)}
            className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border transition-all cursor-pointer ${isCreatingChapter
                ? 'bg-[#1C110E] text-white border-[#1C110E]'
                : 'bg-[#FFFBF5] border-[#8E1B1B] text-[#8E1B1B] hover:bg-[#8E1B1B]/10'
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Turn Memories into a Chapter</span>
          </button>
        </div>
      </PageRail>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">

        {/* CREATE CHAPTER WIZARD */}
        {isCreatingChapter ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Chapter</span>
              </span>
              <h2 className="font-display text-4xl text-[#1C110E] font-medium mt-1">
                Turn your memories into a chapter.
              </h2>
              <p className="text-sm text-[#6E5B52] mt-1">
                A chapter is a collection of moments that tell part of your story.
              </p>
            </div>

            {/* Top Preview */}
            <div className="p-6 rounded-3xl bg-[#1C110E] text-white warm-shadow-lg relative overflow-hidden">
              <span className="text-[11px] text-white/60 uppercase font-mono tracking-widest block mb-4">
                Preview on Our Shelf
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-48 h-64 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl relative flex-shrink-0 bg-[#8E1B1B]">
                  <img src={newCover} alt="Cover" className="w-full h-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Volume</span>
                    <div className="text-center">
                      <h4 className="font-display text-xl font-bold text-white">{newTitle}</h4>
                      <p className="text-[10px] text-white/80 font-script text-sm mt-1">{newSubtitle}</p>
                      <p className="text-[9px] text-white/60 mt-2">{newStartDate} – {newEndDate}</p>
                      <span className="text-xs text-amber-400">♡</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-semibold text-white">{newTitle}</h3>
                  <p className="text-sm text-white/80 font-script text-lg leading-snug">{newSubtitle}</p>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>{newStartDate} – {newEndDate}</span>
                    <span>•</span>
                    <span>{selectedMemoryIds.length} memories selected</span>
                  </div>
                  <p className="text-xs text-amber-300 font-mono">It will live on Our Shelf in your couple chapter collection.</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Chapter Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="The Window"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E7D9C9] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Cover Photo</label>
                  <label className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 hover:border-[#8E1B1B]">
                    <UploadCloud className="w-3.5 h-3.5 text-[#8E1B1B]" />
                    <span>{isUploadingCover ? `Uploading... ${coverProgress}%` : 'Upload cover photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingCover}
                      onChange={(e) => handleCoverSelected(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Chapter Theme</label>
                  <select
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs font-medium"
                  >
                    <option value="Home & Everyday">Home &amp; Everyday</option>
                    <option value="Travel & Trips">Travel &amp; Trips</option>
                    <option value="Beginnings">Beginnings</option>
                    <option value="Milestones">Milestones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Short Description</label>
                <textarea
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white border border-[#E7D9C9] text-xs font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Time Period (From – To)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                      placeholder="May 2024"
                    />
                    <input
                      type="text"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E7D9C9] text-xs"
                      placeholder="Aug 2026"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Spine Color</label>
                  <div className="flex items-center gap-2 pt-1">
                    {['#8E1B1B', '#C63A2E', '#6E5B52', '#2A4365', '#285E61'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewSpineColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${newSpineColor === c ? 'ring-2 ring-[#8E1B1B] scale-110' : 'opacity-80'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Memory Multi-Select */}
              {safeMemories.length > 0 ? (
                <div className="pt-4 border-t border-[#E7D9C9]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-[#1C110E]">Select Memories for this Chapter</label>
                    <span className="text-xs text-[#8E1B1B] font-medium">{selectedMemoryIds.length} selected</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {safeMemories.map((m) => {
                      const isSel = selectedMemoryIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMemorySelect(m.id)}
                          className={`relative p-2 rounded-2xl bg-white border transition-all cursor-pointer ${isSel ? 'border-[#8E1B1B] ring-2 ring-[#8E1B1B]/30' : 'border-[#E7D9C9] opacity-70'
                            }`}
                        >
                          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F7EFE4] mb-1.5">
                            <img
                              src={m.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80'}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-display text-xs font-semibold text-[#1C110E] truncate">{m.title}</p>
                          <p className="text-[10px] text-[#6E5B52]">{m.date}</p>
                          <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-xs ${isSel ? 'bg-[#8E1B1B] text-white' : 'bg-black/30 text-white'}`}>
                            {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-[#E7D9C9] text-xs text-[#6E5B52] italic">
                  No memories yet — you can add them to this chapter from Our Wall later.
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleSaveChapter}
                  className="flex-1 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-md cursor-pointer"
                >
                  Create Chapter (It will appear on Our Shelf)
                </button>
                <button
                  onClick={() => setIsCreatingChapter(false)}
                  className="px-6 py-3 rounded-full bg-white border border-[#E7D9C9] text-xs font-medium text-[#6E5B52] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

        ) : safeChapters.length === 0 ? (

          /* ── Empty shelf state ── */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            {/* Decorative empty shelf */}
            <div className="relative w-72 mb-10">
              {/* Shelf plank */}
              <div className="h-5 bg-gradient-to-r from-[#2B1B17] via-[#3D261E] to-[#2B1B17] rounded-md shadow-lg" />
              {/* Shelf wall above */}
              <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-b from-[#F7EFE4] to-[#EFE4D6] rounded-t-3xl border-b-0 flex items-center justify-center gap-3 px-4">
                {/* Ghost book spines */}
                {['#C8B8AF', '#D4C4BB', '#BFAEA5'].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-t-lg opacity-25 flex-shrink-0"
                    style={{ width: 32, height: 56, backgroundColor: c }}
                  />
                ))}
                <div className="w-8 h-14 rounded-t-lg border-2 border-dashed border-[#8E1B1B]/30 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#8E1B1B]/40" />
                </div>
              </div>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] flex items-center justify-center mb-4">
              <Library className="w-7 h-7 text-[#8E1B1B]" />
            </div>

            <h3 className="font-display text-3xl text-[#1C110E] font-medium">
              Your shelf is empty
            </h3>
            <p className="mt-2 max-w-xs text-[#6E5B52] font-script text-lg leading-relaxed">
              Create your first chapter — a curated collection of memories that tells a part of your story.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCreatingChapter(true)}
                className="px-6 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Create First Chapter</span>
              </button>
            </div>

            <p className="mt-6 text-xs text-[#6E5B52]/60 font-mono">
              🕯️ Chapters are private to your couple space
            </p>
          </div>

        ) : (

          /* ── Active chapter view ── */
          <div className="space-y-8">

            {/* Wooden Shelf Header */}
            <div className="p-6 rounded-3xl bg-[#2B1B17] text-[#FFFBF5] shadow-xl relative">
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-mono block mb-4">
                The Wooden Bookshelf
              </span>

              <div className="flex items-end gap-5 overflow-x-auto pb-4 pt-2">
                {safeChapters.map((ch) => {
                  const isCur = ch.id === activeChapter?.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapterId(ch.id)}
                      style={{ backgroundColor: ch.spineColor }}
                      className={`relative w-28 sm:w-32 h-44 rounded-t-xl p-3 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer flex-shrink-0 ${isCur ? 'scale-105 shadow-2xl ring-2 ring-amber-300 -translate-y-2' : 'opacity-80 hover:opacity-100'
                        }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider text-white/70 font-mono">
                        {ch.theme}
                      </div>
                      <div className="my-auto">
                        <h4 className="font-display text-base font-bold text-white leading-tight">{ch.title}</h4>
                        <span className="text-xs text-amber-300">♡</span>
                      </div>
                      <div className="absolute -bottom-2 right-4 w-4 h-6 bg-amber-400 rounded-b-xs shadow-xs" />
                      <div className="text-[9px] text-white/70">{ch.startDate}</div>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsCreatingChapter(true)}
                  className="w-28 sm:w-32 h-44 rounded-t-xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-center p-3 text-white/60 hover:text-white hover:border-white transition-colors cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">New Chapter</span>
                </button>
              </div>

              <div className="h-4 bg-gradient-to-r from-[#1C110E] via-[#3D261E] to-[#1C110E] rounded-md shadow-inner border-t border-amber-900/40 -mx-2" />
            </div>

            {/* Active Chapter Hero Banner */}
            {activeChapter && (
              <>
                <div className="relative rounded-3xl overflow-hidden border border-[#E7D9C9] warm-shadow-lg min-h-64 bg-[#1C110E] text-white p-6 sm:p-8 flex flex-col justify-between">
                  <img
                    src={activeChapter.coverImage || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80'}
                    alt={activeChapter.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                  <div className="relative z-10 max-w-lg space-y-2">
                    <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Our Shelf • {activeChapter.theme}</span>
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl font-medium text-white">
                      {activeChapter.title}
                    </h2>
                    <p className="font-script text-2xl text-white/90 leading-snug">
                      "{activeChapter.subtitle}"
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/70 pt-2">
                      <span>📅 {activeChapter.startDate} – {activeChapter.endDate}</span>
                      <span>•</span>
                      <span>🔒 Private to us</span>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsCreatingChapter(true)}
                      className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-xs font-medium text-white cursor-pointer"
                    >
                      Edit Chapter ✎
                    </button>
                  </div>
                </div>

                {/* Chapter Memories Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl text-[#1C110E] flex items-center gap-2">
                      <span>Memories in this chapter</span>
                      <span className="text-xs text-[#8E1B1B] font-sans font-semibold bg-[#8E1B1B]/10 px-2 py-0.5 rounded-full">
                        {chapterMemories.length}
                      </span>
                    </h3>
                  </div>

                  {chapterMemories.length === 0 ? (
                    <div className="py-12 text-center rounded-2xl border border-dashed border-[#E7D9C9] bg-[#F7EFE4]/50">
                      <BookOpen className="w-10 h-10 text-[#8E1B1B]/30 mx-auto mb-3" />
                      <p className="text-sm text-[#6E5B52] font-script text-base">
                        No memories in this chapter yet.
                      </p>
                      <p className="text-xs text-[#6E5B52]/70 mt-1">
                        Pin memories on Our Wall and assign them to this chapter.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {chapterMemories.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setActiveLightboxMemory(m)}
                          className="p-3 rounded-2xl bg-white border border-[#E7D9C9] warm-shadow transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F7EFE4] mb-2">
                            <img
                              src={m.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80'}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-display text-sm font-semibold text-[#1C110E] truncate">{m.title}</h4>
                          <p className="font-script text-sm text-[#6E5B52] truncate">"{m.caption}"</p>
                          <p className="text-[10px] text-[#8E1B1B] mt-1 font-medium">{m.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
