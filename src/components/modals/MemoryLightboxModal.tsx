import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { Memory } from '../../types';
import { 
  X, 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Play, 
  Pause, 
  Send, 
  Mic, 
  Lock, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

export const MemoryLightboxModal: React.FC = () => {
  const { 
    activeLightboxMemory, 
    setActiveLightboxMemory, 
    toggleReaction, 
    addReply, 
    deleteMemory,
    updateMemory,
    currentUser,
    couple,
    chapters
  } = usePairlum();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editChapterId, setEditChapterId] = useState('');

  if (!activeLightboxMemory) return null;

  const mem = activeLightboxMemory;
  const currentPartnerName = currentUser === 'A' ? couple.nameA : couple.nameB;

  const handleStartEdit = () => {
    setEditTitle(mem.title);
    setEditCaption(mem.caption);
    setEditDate(mem.date);
    setEditLocation(mem.location || '');
    setEditChapterId(mem.chapterId || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateMemory(mem.id, {
      title: editTitle,
      caption: editCaption,
      date: editDate,
      location: editLocation,
      chapterId: editChapterId
    });
    setIsEditing(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReply(mem.id, replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110E]/70 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] warm-shadow-lg p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveLightboxMemory(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] hover:bg-[#E7D9C9] flex items-center justify-center text-[#6E5B52] transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* DELETE CONFIRMATION DIALOG (Screenshot 22) */}
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] p-6 text-center warm-shadow-lg animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] mx-auto flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1C110E]">Delete this memory?</h3>
              <p className="text-xs text-[#6E5B52] mt-2 leading-relaxed">
                This action cannot be undone. The memory and all associated reactions and replies will be permanently removed.
              </p>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E7D9C9] text-xs font-medium text-[#6E5B52] hover:text-[#1C110E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsConfirmDeleteOpen(false);
                    deleteMemory(mem.id);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Memory</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MEMORY SCREEN (Screenshot 38) */}
        {isEditing ? (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E7D9C9]">
              <h2 className="font-display text-3xl font-medium text-[#1C110E]">Edit memory</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-[#6E5B52] hover:underline"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                {mem.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E7D9C9] aspect-16/10 bg-[#F7EFE4]">
                    <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                    <button className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-xs font-medium text-[#1C110E] shadow-sm hover:bg-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#8E1B1B]" />
                      <span>Change Photo</span>
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1">Caption / Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-sm text-[#1C110E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1">Note / Caption</label>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-sm text-[#1C110E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1">Date</label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1">Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E]"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-5">
                <h4 className="font-display text-xl text-[#1C110E]">Memory controls</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-[#6E5B52] mb-1">Visibility</label>
                  <p className="text-xs text-[#1C110E] font-medium">Only you and {couple.nameB}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E5B52] mb-1">Move to chapter</label>
                  <select
                    value={editChapterId}
                    onChange={(e) => setEditChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFBF5] border border-[#E7D9C9] text-xs"
                  >
                    <option value="">None (Individual Memory)</option>
                    {chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveEdit}
                  className="w-full py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide cursor-pointer"
                >
                  Save Changes
                </button>

                <div className="pt-4 border-t border-[#E7D9C9]/80">
                  <span className="text-[11px] uppercase font-bold text-[#8E1B1B] tracking-wider block mb-2">Danger zone</span>
                  <button
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="w-full py-2.5 rounded-full bg-[#FFFBF5] border border-[#8E1B1B]/40 text-[#8E1B1B] hover:bg-[#8E1B1B]/10 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Memory</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD LIGHTBOX VIEW (Screenshots 14, 37) */
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Polaroid Media */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-3.5 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow-lg">
                  {mem.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                      <img 
                        src={mem.imageUrl} 
                        alt={mem.title} 
                        className="w-full h-full object-cover"
                      />
                      {mem.kind === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl bg-[#F7EFE4] stationery-lines min-h-48 flex items-center justify-center text-center">
                      <p className="font-script text-2xl text-[#1C110E] leading-relaxed">
                        "{mem.caption}"
                      </p>
                    </div>
                  )}

                  {/* Audio Waveform Player if voice note */}
                  {mem.audioDuration && (
                    <div className="mt-4 p-3 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-9 h-9 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-1 h-6">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            style={{ height: `${Math.abs(Math.sin(i * 0.4)) * 18 + 6}px` }}
                            className={`flex-1 rounded-full ${
                              isPlayingAudio ? 'bg-[#8E1B1B]' : 'bg-[#C63A2E]/60'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#6E5B52] font-mono">{mem.audioDuration}</span>
                    </div>
                  )}

                  {/* Polaroid caption footer */}
                  <div className="pt-3 px-1 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg text-[#1C110E] font-medium">{mem.title}</h3>
                      <p className="text-xs text-[#6E5B52] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#8E1B1B]" />
                        <span>{mem.location || 'Our Safe Place'}</span>
                        <span>•</span>
                        <span>{mem.date}</span>
                      </p>
                    </div>
                    <span className="font-script text-base text-[#8E1B1B]">
                      Added by {mem.authorName} ♡
                    </span>
                  </div>
                </div>

                {/* Heart quote caption */}
                {mem.caption && (
                  <p className="font-script text-xl text-[#1C110E] italic px-2">
                    "{mem.caption}"
                  </p>
                )}
              </div>

              {/* Right Column: Reactions, Replies, and Actions */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E7D9C9]">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#8E1B1B] tracking-wider">Memory details</span>
                    <p className="text-xs text-[#6E5B52] mt-0.5">{mem.time} • Private between you two</p>
                  </div>
                  <button
                    onClick={handleStartEdit}
                    className="p-2 rounded-full bg-[#F7EFE4] hover:bg-[#E7D9C9] text-[#6E5B52] hover:text-[#1C110E] transition-colors cursor-pointer"
                    title="Edit memory"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Reaction Picker (Screenshots 12, 14, 37) */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-2.5">
                    How does this make you feel?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mem.reactions.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => toggleReaction(mem.id, r.id)}
                        className={`
                          px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer
                          ${r.reactedByMe 
                            ? 'bg-[#8E1B1B] text-white shadow-xs' 
                            : 'bg-[#F7EFE4] border border-[#E7D9C9] text-[#1C110E] hover:border-[#8E1B1B]'}
                        `}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                        {r.count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${r.reactedByMe ? 'bg-white/20' : 'bg-[#E7D9C9]'}`}>
                            {r.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Replies Thread */}
                <div className="flex-1 space-y-3">
                  <label className="block text-xs font-semibold text-[#1C110E]">
                    Replies & words ({mem.replies.length})
                  </label>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {mem.replies.length === 0 ? (
                      <p className="text-xs text-[#6E5B52] font-script text-base italic">
                        No replies yet. Leave a sweet whisper below.
                      </p>
                    ) : (
                      mem.replies.map((rep) => (
                        <div key={rep.id} className="p-3 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9]/80 text-xs">
                          <div className="flex items-center justify-between mb-1 text-[11px] text-[#6E5B52]">
                            <span className="font-semibold text-[#8E1B1B]">{rep.authorName}</span>
                            <span>{rep.time}</span>
                          </div>
                          <p className="text-[#1C110E] font-script text-lg leading-snug">{rep.text}</p>
                          {rep.voiceDuration && (
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#8E1B1B]">
                              <Mic className="w-3 h-3" />
                              <span>Voice note ({rep.voiceDuration})</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-[#E7D9C9]">
                  <div className="relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write a reply to ${mem.authorName}...`}
                      className="w-full pl-4 pr-10 py-2.5 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-hidden focus:border-[#8E1B1B]"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6E5B52] text-center font-script text-sm">
                    This will appear in your shared story in {mem.title} ♡
                  </p>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
