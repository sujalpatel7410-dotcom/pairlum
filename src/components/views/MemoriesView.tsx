import React, { useState, useMemo } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { Memory, MemoryKind } from '../../types';
import {
    Search,
    Heart,
    Plus,
    Camera,
    Video,
    Mic,
    FileText,
    MapPin,
    Grid3X3,
    List,
    X,
    Star,
    Play,
    Image as ImageIcon,
    Calendar,
    SlidersHorizontal,
    ExternalLink
} from 'lucide-react';
import { AudioPlayer } from '../common/AudioPlayer';
import { VideoPlayerModal } from '../modals/VideoPlayerModal';

const KIND_ICONS: Record<MemoryKind, React.FC<{ className?: string }>> = {
    photo: Camera,
    video: Video,
    voice: Mic,
    note: FileText,
    place: MapPin,
    moment: Star
};

const KIND_LABELS: Record<MemoryKind, string> = {
    photo: 'Photo',
    video: 'Video',
    voice: 'Voice Note',
    note: 'Heart Note',
    place: 'Place',
    moment: 'Moment'
};

const KIND_COLOURS: Record<MemoryKind, string> = {
    photo: 'bg-rose-100 text-rose-700',
    video: 'bg-purple-100 text-purple-700',
    voice: 'bg-amber-100 text-amber-700',
    note: 'bg-emerald-100 text-emerald-700',
    place: 'bg-sky-100 text-sky-700',
    moment: 'bg-fuchsia-100 text-fuchsia-700'
};

type SortOption = 'newest' | 'oldest' | 'favorites';
type ViewMode = 'grid' | 'list';

export const MemoriesView: React.FC = () => {
    const { memories, setActiveLightboxMemory, openAddMemoryModal, chapters, couple } = usePairlum();

    const [search, setSearch] = useState('');
    const [selectedKind, setSelectedKind] = useState<MemoryKind | 'all'>('all');
    const [selectedChapter, setSelectedChapter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Inline expanded audio — stores the memory id whose player is open in the grid
    const [expandedAudioId, setExpandedAudioId] = useState<string | null>(null);
    // Video modal
    const [videoMemory, setVideoMemory] = useState<Memory | null>(null);

    const safeMemories: Memory[] = memories || [];

    const filtered = useMemo(() => {
        let list = [...safeMemories];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(m =>
                m.title.toLowerCase().includes(q) ||
                m.caption.toLowerCase().includes(q) ||
                (m.location || '').toLowerCase().includes(q) ||
                m.authorName.toLowerCase().includes(q)
            );
        }
        if (selectedKind !== 'all') list = list.filter(m => m.kind === selectedKind);
        if (selectedChapter !== 'all') list = list.filter(m => m.chapterId === selectedChapter);
        if (favoritesOnly) list = list.filter(m => m.isFavorite);
        if (sortBy === 'oldest') list = list.reverse();
        if (sortBy === 'favorites') list = list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        return list;
    }, [safeMemories, search, selectedKind, selectedChapter, sortBy, favoritesOnly]);

    const kindCounts = useMemo(() => {
        const counts: Record<string, number> = { all: safeMemories.length };
        safeMemories.forEach(m => { counts[m.kind] = (counts[m.kind] || 0) + 1; });
        return counts;
    }, [safeMemories]);

    const activeFiltersCount = [
        selectedKind !== 'all',
        selectedChapter !== 'all',
        favoritesOnly,
        sortBy !== 'newest'
    ].filter(Boolean).length;

    /* ── helper: handle card click based on kind ── */
    const handleCardClick = (mem: Memory, e: React.MouseEvent) => {
        // Voice: always expand inline player (even if no audioUrl yet)
        if (mem.kind === 'voice') {
            e.stopPropagation();
            setExpandedAudioId(prev => (prev === mem.id ? null : mem.id));
            return;
        }
        if (mem.kind === 'video' && mem.videoUrl) {
            e.stopPropagation();
            setVideoMemory(mem);
            return;
        }
        setActiveLightboxMemory(mem);
    };

    /* ── dedicated listen button click (always stops propagation) ── */
    const handleListenClick = (mem: Memory, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedAudioId(prev => (prev === mem.id ? null : mem.id));
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-24">

            {/* ── VIDEO MODAL ── */}
            {videoMemory && (
                <VideoPlayerModal memory={videoMemory} onClose={() => setVideoMemory(null)} />
            )}

            {/* ── PAGE HEADER ── */}
            <section className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] text-xs font-semibold mb-3">
                            <Heart className="w-3 h-3 fill-[#8E1B1B]" />
                            <span>Your shared story</span>
                        </div>
                        <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#1C110E] leading-tight tracking-tight">
                            All Memories<span className="text-[#8E1B1B] italic"> ♡</span>
                        </h1>
                        <p className="text-sm text-[#6E5B52] mt-1.5">
                            {safeMemories.length} moment{safeMemories.length !== 1 ? 's' : ''} saved between {couple.nameA} &amp; {couple.nameB}
                        </p>
                    </div>
                    <button
                        id="memories-add-btn"
                        onClick={() => openAddMemoryModal('photo')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer self-start sm:self-auto flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Memory</span>
                    </button>
                </div>
            </section>

            {/* ── SEARCH + TOOLBAR ── */}
            <section className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5B52] pointer-events-none" />
                        <input
                            id="memories-search"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search memories, places, captions…"
                            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] text-sm text-[#1C110E] placeholder:text-[#6E5B52]/60 focus:outline-none focus:border-[#8E1B1B] transition-colors"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E5B52] hover:text-[#1C110E] cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <button
                        id="memories-filter-btn"
                        onClick={() => setShowFilters(f => !f)}
                        className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-medium cursor-pointer transition-all ${showFilters || activeFiltersCount > 0
                            ? 'bg-[#8E1B1B] text-white border-[#8E1B1B]'
                            : 'bg-[#F7EFE4] border-[#E7D9C9] text-[#6E5B52] hover:border-[#8E1B1B]'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-white text-[#8E1B1B] text-[10px] font-bold flex items-center justify-center">{activeFiltersCount}</span>
                        )}
                    </button>

                    <div className="flex rounded-full border border-[#E7D9C9] overflow-hidden bg-[#F7EFE4]">
                        <button onClick={() => setViewMode('grid')} title="Grid view" className={`px-3 py-2.5 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:text-[#1C110E]'}`}>
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} title="List view" className={`px-3 py-2.5 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:text-[#1C110E]'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter panel */}
                {showFilters && (
                    <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-[#6E5B52] uppercase tracking-wider mb-1.5">Type</label>
                                <select value={selectedKind} onChange={e => setSelectedKind(e.target.value as MemoryKind | 'all')} className="w-full px-3 py-2 rounded-xl bg-[#FFFBF5] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-none focus:border-[#8E1B1B] cursor-pointer">
                                    <option value="all">All types ({kindCounts.all})</option>
                                    {(Object.keys(KIND_LABELS) as MemoryKind[]).map(k => kindCounts[k] ? <option key={k} value={k}>{KIND_LABELS[k]} ({kindCounts[k] || 0})</option> : null)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6E5B52] uppercase tracking-wider mb-1.5">Chapter</label>
                                <select value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#FFFBF5] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-none focus:border-[#8E1B1B] cursor-pointer">
                                    <option value="all">All chapters</option>
                                    {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6E5B52] uppercase tracking-wider mb-1.5">Sort by</label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="w-full px-3 py-2 rounded-xl bg-[#FFFBF5] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-none focus:border-[#8E1B1B] cursor-pointer">
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                    <option value="favorites">Favorites first</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={() => setFavoritesOnly(f => !f)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all ${favoritesOnly ? 'bg-[#8E1B1B] text-white border-[#8E1B1B]' : 'bg-[#FFFBF5] border-[#E7D9C9] text-[#6E5B52] hover:border-[#8E1B1B]'}`}>
                                <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} />
                                <span>Favorites only</span>
                            </button>
                            {activeFiltersCount > 0 && (
                                <button onClick={() => { setSelectedKind('all'); setSelectedChapter('all'); setSortBy('newest'); setFavoritesOnly(false); }} className="text-xs text-[#8E1B1B] hover:underline font-medium cursor-pointer">
                                    Reset filters
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Kind pills */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button onClick={() => setSelectedKind('all')} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${selectedKind === 'all' ? 'bg-[#1C110E] text-white border-[#1C110E]' : 'bg-[#F7EFE4] border-[#E7D9C9] text-[#6E5B52] hover:border-[#1C110E]'}`}>
                        All ({safeMemories.length})
                    </button>
                    {(Object.keys(KIND_LABELS) as MemoryKind[]).filter(k => kindCounts[k]).map(k => {
                        const Icon = KIND_ICONS[k];
                        const active = selectedKind === k;
                        return (
                            <button key={k} onClick={() => setSelectedKind(active ? 'all' : k)} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${active ? 'bg-[#8E1B1B] text-white border-[#8E1B1B]' : 'bg-[#F7EFE4] border-[#E7D9C9] text-[#6E5B52] hover:border-[#8E1B1B]'}`}>
                                <Icon className="w-3 h-3" />
                                <span>{KIND_LABELS[k]}</span>
                                <span className={`text-[10px] px-1 rounded-full ${active ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>{kindCounts[k]}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {(search || activeFiltersCount > 0) && (
                <p className="text-xs text-[#6E5B52]">Showing <strong className="text-[#1C110E]">{filtered.length}</strong> of {safeMemories.length} memories</p>
            )}

            {/* ── LEGEND ── */}
            <div className="flex flex-wrap gap-3 text-[11px] text-[#6E5B52] bg-[#F7EFE4]/60 border border-[#E7D9C9] rounded-2xl px-4 py-2.5">
                <span className="flex items-center gap-1.5"><Mic className="w-3 h-3 text-amber-600" /> Click voice cards to <strong className="text-[#1C110E]">play inline</strong></span>
                <span className="text-[#E7D9C9]">·</span>
                <span className="flex items-center gap-1.5"><Video className="w-3 h-3 text-purple-600" /> Click video cards to <strong className="text-[#1C110E]">open player</strong></span>
                <span className="text-[#E7D9C9]">·</span>
                <span className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-[#8E1B1B]" /> Click others to <strong className="text-[#1C110E]">view details</strong></span>
            </div>

            {/* ── EMPTY STATES ── */}
            {safeMemories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1C110E]">No memories yet</h3>
                    <p className="text-sm text-[#6E5B52] max-w-xs leading-relaxed">Start capturing your moments together.</p>
                    <button onClick={() => openAddMemoryModal('photo')} className="mt-2 px-6 py-3 rounded-full bg-[#8E1B1B] text-white text-sm font-semibold hover:bg-[#751515] transition-colors cursor-pointer">
                        Add your first memory
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <Search className="w-10 h-10 text-[#E7D9C9]" />
                    <p className="text-sm text-[#6E5B52]">No memories match your filters.</p>
                    <button onClick={() => { setSearch(''); setSelectedKind('all'); setSelectedChapter('all'); setFavoritesOnly(false); }} className="text-xs text-[#8E1B1B] hover:underline font-medium cursor-pointer">Clear all filters</button>
                </div>
            ) : viewMode === 'grid' ? (

                /* ══════════════════════════════
                     GRID VIEW
                   ══════════════════════════════ */
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map(mem => {
                        const KindIcon = KIND_ICONS[mem.kind];
                        const isVoice = mem.kind === 'voice';
                        const isVideo = mem.kind === 'video' && !!mem.videoUrl;
                        const audioExpanded = expandedAudioId === mem.id;

                        return (
                            <div
                                key={mem.id}
                                id={`memory-card-${mem.id}`}
                                className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${audioExpanded
                                    ? 'border-amber-300 shadow-lg col-span-2'
                                    : 'border-[#E7D9C9] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                                    }`}
                                style={!audioExpanded ? { transform: `rotate(${mem.rotationDeg ?? 0}deg)` } : {}}
                                onClick={e => handleCardClick(mem, e)}
                            >
                                {/* ── Thumbnail area ── */}
                                <div className={`bg-[#F7EFE4] overflow-hidden relative ${audioExpanded ? 'hidden' : 'aspect-square'}`}>
                                    {mem.imageUrl && !isVoice ? (
                                        <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                            <KindIcon className="w-8 h-8 text-[#8E1B1B]/40 mb-2" />
                                            {mem.caption && <p className="font-script text-sm text-[#6E5B52] leading-snug line-clamp-3">"{mem.caption}"</p>}
                                        </div>
                                    )}

                                    {/* Type badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${KIND_COLOURS[mem.kind]}`}>{KIND_LABELS[mem.kind]}</span>
                                    </div>

                                    {mem.isFavorite && (
                                        <div className="absolute top-2 right-2">
                                            <Heart className="w-4 h-4 text-[#8E1B1B] fill-[#8E1B1B] drop-shadow-sm" />
                                        </div>
                                    )}

                                    {/* Video play badge */}
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Voice: big Listen button overlay */}
                                    {isVoice && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100">
                                            <div className="flex flex-col items-center gap-3">
                                                {/* Animated waveform decoration */}
                                                <div className="flex items-end gap-[3px] h-10">
                                                    {[6, 10, 14, 18, 14, 20, 12, 8, 16, 14, 10, 18, 14, 8, 12].map((h, i) => (
                                                        <div key={i} style={{ height: `${h}px` }} className="w-1 rounded-full bg-amber-400/60" />
                                                    ))}
                                                </div>
                                                {/* The actual listen button */}
                                                <button
                                                    id={`listen-btn-${mem.id}`}
                                                    onClick={e => handleListenClick(mem, e)}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-amber-300"
                                                >
                                                    <Mic className="w-4 h-4" />
                                                    <span>Listen</span>
                                                </button>
                                                {mem.audioDuration && (
                                                    <span className="text-amber-700 text-[11px] font-mono bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{mem.audioDuration}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover overlay for non-media */}
                                    {!isVideo && !isVoice && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                                            <p className="text-white text-xs font-medium truncate">{mem.title}</p>
                                        </div>
                                    )}
                                </div>

                                {/* ── Inline Audio Player (expanded) ── */}
                                {audioExpanded && (
                                    <div className="p-4 space-y-3 bg-gradient-to-br from-amber-50 to-[#FFFBF5]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                                                    <Mic className="w-3.5 h-3.5" />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#1C110E]">{mem.title}</p>
                                                    <p className="text-[10px] text-[#6E5B52]">by {mem.authorName}{mem.location ? ` • ${mem.location}` : ''}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={e => { e.stopPropagation(); setExpandedAudioId(null); }}
                                                className="w-6 h-6 rounded-full bg-[#E7D9C9] text-[#6E5B52] hover:text-[#1C110E] flex items-center justify-center cursor-pointer"
                                                title="Collapse"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Audio player or no-audio notice */}
                                        {mem.audioUrl ? (
                                            <AudioPlayer src={mem.audioUrl} durationLabel={mem.audioDuration} />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-100 border border-amber-200">
                                                <Mic className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-amber-800">Audio not available</p>
                                                    <p className="text-[11px] text-amber-700 mt-0.5">This voice note was saved before audio storage was enabled.</p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={e => { e.stopPropagation(); setActiveLightboxMemory(mem); }}
                                            className="text-[11px] text-[#8E1B1B] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            View full memory details
                                        </button>
                                    </div>
                                )}

                                {/* ── Card footer ── */}
                                {!audioExpanded && (
                                    <div className="p-3 space-y-1">
                                        <p className="text-[#1C110E] text-xs font-semibold truncate">{mem.title}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-[#6E5B52]">
                                            {mem.location ? (
                                                <><MapPin className="w-2.5 h-2.5 text-[#8E1B1B]" /><span className="truncate">{mem.location}</span></>
                                            ) : (
                                                <><Calendar className="w-2.5 h-2.5" /><span>{mem.date}</span></>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

            ) : (

                /* ══════════════════════════════
                     LIST VIEW
                   ══════════════════════════════ */
                <section className="space-y-3">
                    {filtered.map(mem => {
                        const KindIcon = KIND_ICONS[mem.kind];
                        const chapterName = chapters.find(c => c.id === mem.chapterId)?.title;
                        const isVoice = mem.kind === 'voice';
                        const isVideo = mem.kind === 'video' && !!mem.videoUrl;
                        const audioExpanded = expandedAudioId === mem.id;

                        return (
                            <div key={mem.id} id={`memory-list-${mem.id}`} className={`bg-white rounded-2xl border transition-all ${audioExpanded ? 'border-amber-300 shadow-md' : 'border-[#E7D9C9] hover:border-[#8E1B1B]/40 hover:shadow-md cursor-pointer'}`}>

                                {/* Main row */}
                                <div
                                    id={`memory-list-${mem.id}`}
                                    className="flex items-center gap-4 p-4 group cursor-pointer"
                                    onClick={e => handleCardClick(mem, e)}
                                >
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F7EFE4] flex-shrink-0 relative cursor-pointer">
                                        {mem.imageUrl ? (
                                            <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <KindIcon className="w-6 h-6 text-[#8E1B1B]/40" />
                                            </div>
                                        )}
                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                            </div>
                                        )}
                                        {isVoice && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-amber-600/30">
                                                <Mic className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-[#1C110E] truncate">{mem.title}</p>
                                            {mem.isFavorite && <Heart className="w-3.5 h-3.5 text-[#8E1B1B] fill-[#8E1B1B] flex-shrink-0" />}
                                        </div>
                                        {mem.caption && <p className="text-xs text-[#6E5B52] truncate font-script text-base leading-snug">"{mem.caption}"</p>}
                                        <div className="flex items-center gap-3 text-[10px] text-[#6E5B52]">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold ${KIND_COLOURS[mem.kind]}`}>{KIND_LABELS[mem.kind]}</span>
                                            {mem.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-[#8E1B1B]" />{mem.location}</span>}
                                            <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{mem.date}</span>
                                            {chapterName && <span className="hidden sm:inline text-[#8E1B1B] font-medium truncate">📖 {chapterName}</span>}
                                        </div>
                                    </div>

                                    {/* Right: action hint + reactions */}
                                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                        {isVoice && (
                                            <button
                                                id={`list-listen-btn-${mem.id}`}
                                                onClick={e => handleListenClick(mem, e)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer transition-all ${audioExpanded
                                                    ? 'bg-amber-600 text-white border-amber-600'
                                                    : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                                    }`}
                                            >
                                                <Mic className="w-3 h-3" />
                                                {audioExpanded ? 'Close' : 'Listen'}
                                            </button>
                                        )}
                                        {isVideo && (
                                            <button
                                                id={`list-watch-btn-${mem.id}`}
                                                onClick={e => { e.stopPropagation(); setVideoMemory(mem); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-300 hover:bg-purple-100 cursor-pointer transition-all"
                                            >
                                                <Play className="w-3 h-3 fill-purple-700" />Watch
                                            </button>
                                        )}
                                        <span className="text-[10px] text-[#8E1B1B] font-script text-sm">{mem.authorName}</span>
                                        {mem.reactions.some(r => r.count > 0) && (
                                            <div className="flex gap-0.5">
                                                {mem.reactions.filter(r => r.count > 0).slice(0, 3).map(r => (
                                                    <span key={r.id} className="text-sm" title={`${r.label} ×${r.count}`}>{r.emoji}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Inline audio player (list view) */}
                                {audioExpanded && (
                                    <div className="px-4 pb-4 space-y-2">
                                        {mem.audioUrl ? (
                                            <AudioPlayer src={mem.audioUrl} durationLabel={mem.audioDuration} />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                                <Mic className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-amber-800">Audio not available</p>
                                                    <p className="text-[11px] text-amber-700 mt-0.5">This voice note was saved before audio storage was enabled.</p>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={e => { e.stopPropagation(); setActiveLightboxMemory(mem); }}
                                            className="text-[11px] text-[#8E1B1B] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            View full memory details
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            )}
        </div>
    );
};
