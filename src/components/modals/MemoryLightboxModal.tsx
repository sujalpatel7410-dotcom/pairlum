import React, { useState, useEffect } from 'react';
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
import { useCloudinaryUpload } from '../../lib/useCloudinaryUpload';
import { useAudioRecorder } from '../../lib/useAudioRecorder';
import { formatDuration } from '../../lib/format';
import { AudioPlayer } from '../common/AudioPlayer';

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
    chapters,
    pendingEditMemoryId,
    clearPendingEditMemory
  } = usePairlum();

  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editChapterId, setEditChapterId] = useState('');
  const { upload: uploadPhoto, isUploading: isUploadingPhoto, progress: photoProgress, error: photoError } = useCloudinaryUpload();
  const { upload: uploadVoiceReply, isUploading: isUploadingVoiceReply, error: voiceReplyUploadError } = useCloudinaryUpload();
  const voiceReplyRecorder = useAudioRecorder();
  const [replyVoiceUrl, setReplyVoiceUrl] = useState<string | undefined>(undefined);
  const [replyVoiceDuration, setReplyVoiceDuration] = useState<string | undefined>(undefined);

  // Reset transient view/edit state whenever a different memory is opened (or
  // the lightbox is closed) so a stale edit/delete/audio state from the
  // previous memory can't bleed into the next one. If this memory was opened
  // via the Timeline's "Edit" action, jump straight into edit mode.
  useEffect(() => {
    if (activeLightboxMemory && pendingEditMemoryId === activeLightboxMemory.id && activeLightboxMemory.author === currentUser) {
      setEditTitle(activeLightboxMemory.title);
      setEditCaption(activeLightboxMemory.caption);
      setEditDate(activeLightboxMemory.date);
      setEditLocation(activeLightboxMemory.location || '');
      setEditChapterId(activeLightboxMemory.chapterId || '');
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    if (pendingEditMemoryId) clearPendingEditMemory();
    setIsConfirmDeleteOpen(false);
    setReplyText('');
    setReplyVoiceUrl(undefined);
    setReplyVoiceDuration(undefined);
    voiceReplyRecorder.cancel();
  }, [activeLightboxMemory?.id]);

  if (!activeLightboxMemory) return null;

  const mem = activeLightboxMemory;
  const isOwner = mem.author === currentUser;
  const currentPartnerName = currentUser === 'A' ? couple.nameB : couple.nameA;

  const handleStartEdit = () => {
    if (!isOwner) return;
    setEditTitle(mem.title);
    setEditCaption(mem.caption);
    setEditDate(mem.date);
    setEditLocation(mem.location || '');
    setEditChapterId(mem.chapterId || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!isOwner) return;
    updateMemory(mem.id, {
      title: editTitle,
      caption: editCaption,
      date: editDate,
      location: editLocation,
      chapterId: editChapterId
    });
    setIsEditing(false);
    // Close back to the Timeline (rather than the standard viewer) so the
    // save lands the user back at roughly the same Timeline position.
    setActiveLightboxMemory(null);
  };

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
    const result = await uploadPhoto(file);
    if (result) updateMemory(mem.id, { imageUrl: result.secureUrl });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !replyVoiceUrl) return;
    addReply(mem.id, replyText, replyVoiceDuration, replyVoiceUrl);
    setReplyText('');
    setReplyVoiceUrl(undefined);
    setReplyVoiceDuration(undefined);
  };

  const handleToggleReplyVoice = async () => {
    if (voiceReplyRecorder.isRecording) {
      const file = await voiceReplyRecorder.stop();
      if (file) {
        setReplyVoiceDuration(formatDuration(voiceReplyRecorder.seconds));
        const result = await uploadVoiceReply(file);
        if (result) setReplyVoiceUrl(result.secureUrl);
      }
    } else {
      setReplyVoiceUrl(undefined);
      setReplyVoiceDuration(undefined);
      voiceReplyRecorder.start();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A0420]/70 backdrop-blur-xs animate-in fade-in duration-200">

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FFD3DE] border border-[#F4A9BF] warm-shadow-lg p-6 sm:p-8">

        {/* Close Button */}
        <button
          onClick={() => setActiveLightboxMemory(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFB8CB] hover:bg-[#F4A9BF] flex items-center justify-center text-[#8A4058] transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* DELETE CONFIRMATION DIALOG (Screenshot 22) */}
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-[#FFD3DE] border border-[#F4A9BF] p-6 text-center warm-shadow-lg animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-[#E11D48]/10 text-[#E11D48] mx-auto flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#4A0420]">Delete this memory?</h3>
              <p className="text-xs text-[#8A4058] mt-2 leading-relaxed">
                This action cannot be undone. The memory and all associated reactions and replies will be permanently removed.
              </p>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#F4A9BF] text-xs font-medium text-[#8A4058] hover:text-[#4A0420] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsConfirmDeleteOpen(false);
                    deleteMemory(mem.id);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-semibold tracking-wide cursor-pointer flex items-center gap-1.5"
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
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F4A9BF]">
              <h2 className="font-display text-3xl font-medium text-[#4A0420]">Edit memory</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-[#8A4058] hover:underline"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                {mem.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#F4A9BF] aspect-16/10 bg-[#FFB8CB]">
                    <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                    <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-xs font-medium text-[#4A0420] shadow-sm hover:bg-white flex items-center gap-1.5 cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5 text-[#E11D48]" />
                      <span>{isUploadingPhoto ? `Uploading... ${photoProgress}%` : 'Change Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingPhoto}
                        onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                      />
                    </label>
                    {photoError && (
                      <p className="absolute bottom-3 left-3 right-32 px-2 py-1 rounded-lg bg-white/90 text-[10px] text-[#E11D48]">
                        {photoError}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#4A0420] mb-1">Caption / Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] text-sm text-[#4A0420]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A0420] mb-1">Note / Caption</label>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] text-sm text-[#4A0420]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A0420] mb-1">Date</label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] text-xs text-[#4A0420]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A0420] mb-1">Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] text-xs text-[#4A0420]"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFB8CB] border border-[#F4A9BF] space-y-5">
                <h4 className="font-display text-xl text-[#4A0420]">Memory controls</h4>

                <div>
                  <label className="block text-xs font-semibold text-[#8A4058] mb-1">Visibility</label>
                  <p className="text-xs text-[#4A0420] font-medium">Only you and {currentPartnerName}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A4058] mb-1">Move to chapter</label>
                  <select
                    value={editChapterId}
                    onChange={(e) => setEditChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFD3DE] border border-[#F4A9BF] text-xs"
                  >
                    <option value="">None (Individual Memory)</option>
                    {chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveEdit}
                  className="w-full py-3 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-semibold tracking-wide cursor-pointer"
                >
                  Save Changes
                </button>

                {isOwner && (
                  <div className="pt-4 border-t border-[#F4A9BF]/80">
                    <span className="text-[11px] uppercase font-bold text-[#E11D48] tracking-wider block mb-2">Danger zone</span>
                    <button
                      onClick={() => setIsConfirmDeleteOpen(true)}
                      className="w-full py-2.5 rounded-full bg-[#FFD3DE] border border-[#E11D48]/40 text-[#E11D48] hover:bg-[#E11D48]/10 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Memory</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD LIGHTBOX VIEW (Screenshots 14, 37) */
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left Column: Polaroid Media */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-3.5 bg-white rounded-2xl border border-[#F4A9BF] warm-shadow-lg">
                  {mem.kind === 'video' && mem.videoUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-black">
                      <video
                        src={mem.videoUrl}
                        poster={mem.imageUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : mem.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#FFB8CB]">
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover"
                      />
                      {mem.kind === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl bg-[#FFB8CB] stationery-lines min-h-48 flex items-center justify-center text-center">
                      <p className="font-script text-2xl text-[#4A0420] leading-relaxed">
                        "{mem.caption}"
                      </p>
                    </div>
                  )}

                  {/* Audio Player if voice note */}
                  {mem.audioUrl ? (
                    <div className="mt-4">
                      <AudioPlayer src={mem.audioUrl} durationLabel={mem.audioDuration} />
                    </div>
                  ) : mem.audioDuration ? (
                    <div className="mt-4 p-3 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] flex items-center gap-3 text-xs text-[#8A4058]">
                      <Mic className="w-4 h-4 flex-shrink-0" />
                      <span>Voice note ({mem.audioDuration}) — recorded before playback support was added.</span>
                    </div>
                  ) : null}

                  {/* Polaroid caption footer */}
                  <div className="pt-3 px-1 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg text-[#4A0420] font-medium">{mem.title}</h3>
                      <p className="text-xs text-[#8A4058] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#E11D48]" />
                        <span>{mem.location || 'Our Safe Place'}</span>
                        <span>•</span>
                        <span>{mem.date}</span>
                      </p>
                    </div>
                    <span className="font-script text-base text-[#E11D48]">
                      Added by {mem.authorName} ♡
                    </span>
                  </div>
                </div>

                {/* Heart quote caption */}
                {mem.caption && (
                  <p className="font-script text-xl text-[#4A0420] italic px-2">
                    "{mem.caption}"
                  </p>
                )}
              </div>

              {/* Right Column: Reactions, Replies, and Actions */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F4A9BF]">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#E11D48] tracking-wider">Memory details</span>
                    <p className="text-xs text-[#8A4058] mt-0.5">{mem.time} • Private between you two</p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={handleStartEdit}
                      className="p-2 rounded-full bg-[#FFB8CB] hover:bg-[#F4A9BF] text-[#8A4058] hover:text-[#4A0420] transition-colors cursor-pointer"
                      title="Edit memory"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Reaction Picker (Screenshots 12, 14, 37) */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A0420] mb-2.5">
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
                            ? 'bg-[#E11D48] text-white shadow-xs'
                            : 'bg-[#FFB8CB] border border-[#F4A9BF] text-[#4A0420] hover:border-[#E11D48]'}
                        `}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                        {r.count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${r.reactedByMe ? 'bg-white/20' : 'bg-[#F4A9BF]'}`}>
                            {r.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Replies Thread */}
                <div className="flex-1 space-y-3">
                  <label className="block text-xs font-semibold text-[#4A0420]">
                    Replies & words ({mem.replies.length})
                  </label>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {mem.replies.length === 0 ? (
                      <p className="text-xs text-[#8A4058] font-script text-base italic">
                        No replies yet. Leave a sweet whisper below.
                      </p>
                    ) : (
                      mem.replies.map((rep) => (
                        <div key={rep.id} className="p-3 rounded-2xl bg-[#FFB8CB] border border-[#F4A9BF]/80 text-xs">
                          <div className="flex items-center justify-between mb-1 text-[11px] text-[#8A4058]">
                            <span className="font-semibold text-[#E11D48]">{rep.authorName}</span>
                            <span>{rep.time}</span>
                          </div>
                          <p className="text-[#4A0420] font-script text-lg leading-snug">{rep.text}</p>
                          {rep.voiceUrl ? (
                            <div className="mt-2">
                              <AudioPlayer src={rep.voiceUrl} durationLabel={rep.voiceDuration} />
                            </div>
                          ) : rep.voiceDuration ? (
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#E11D48]">
                              <Mic className="w-3 h-3" />
                              <span>Voice note ({rep.voiceDuration})</span>
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-[#F4A9BF]">
                  {/* Voice reply recording indicator */}
                  {(voiceReplyRecorder.isRecording || replyVoiceUrl) && (
                    <div className="p-2.5 rounded-xl bg-[#FFB8CB] border border-[#F4A9BF] flex items-center gap-2 text-xs">
                      <Mic className={`w-3.5 h-3.5 ${voiceReplyRecorder.isRecording ? 'text-[#E11D48] animate-pulse' : 'text-[#8A4058]'}`} />
                      <span className="text-[#4A0420] font-mono">
                        {voiceReplyRecorder.isRecording
                          ? formatDuration(voiceReplyRecorder.seconds)
                          : isUploadingVoiceReply
                            ? 'Uploading...'
                            : `Recorded (${replyVoiceDuration})`}
                      </span>
                      {replyVoiceUrl && (
                        <button
                          type="button"
                          onClick={() => { setReplyVoiceUrl(undefined); setReplyVoiceDuration(undefined); }}
                          className="ml-auto text-[10px] text-[#E11D48] hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                  {voiceReplyRecorder.error && <p className="text-xs text-[#E11D48]">{voiceReplyRecorder.error}</p>}
                  {voiceReplyUploadError && <p className="text-xs text-[#E11D48]">{voiceReplyUploadError}</p>}
                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleReplyVoice}
                      disabled={isUploadingVoiceReply}
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${voiceReplyRecorder.isRecording
                          ? 'bg-[#E11D48] text-white animate-pulse'
                          : 'bg-[#FFB8CB] border border-[#F4A9BF] text-[#8A4058] hover:text-[#E11D48]'
                        }`}
                      title={voiceReplyRecorder.isRecording ? 'Stop recording' : 'Record voice reply'}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write a reply to ${mem.authorName}...`}
                      className="flex-1 pl-4 pr-10 py-2.5 rounded-full bg-[#FFB8CB] border border-[#F4A9BF] text-xs text-[#4A0420] focus:outline-hidden focus:border-[#E11D48]"
                    />
                    <button
                      type="submit"
                      disabled={(!replyText.trim() && !replyVoiceUrl) || isUploadingVoiceReply}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#E11D48] text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8A4058] text-center font-script text-sm">
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
