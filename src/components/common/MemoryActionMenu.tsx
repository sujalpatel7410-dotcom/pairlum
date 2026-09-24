import React, { useEffect, useRef, useState } from 'react';
import { Memory, Chapter } from '../../types';
import {
  Edit3,
  BookOpen,
  Heart,
  EyeOff,
  Trash2,
  X,
  ChevronLeft,
  Check
} from 'lucide-react';

interface MemoryActionMenuProps {
  memory: Memory;
  isOwner: boolean;
  chapters: Chapter[];
  triggerEl: HTMLElement | null;
  onClose: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onSetChapter: (chapterId: string) => void;
  onHide: () => void;
  onDelete: () => void;
}

type Step = 'menu' | 'chapter' | 'delete';

/**
 * The Timeline memory action sheet. Opened either by a mobile long-press or by
 * the desktop "•••" button — same component, same actions, so behaviour never
 * drifts between the two entry points.
 */
export const MemoryActionMenu: React.FC<MemoryActionMenuProps> = ({
  memory,
  isOwner,
  chapters,
  triggerEl,
  onClose,
  onEdit,
  onToggleFavorite,
  onSetChapter,
  onHide,
  onDelete
}) => {
  const [step, setStep] = useState<Step>('menu');
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Focus the sheet on open; restore focus to whatever triggered it on close.
  useEffect(() => {
    const firstFocusable = sheetRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]');
    (firstFocusable ?? sheetRef.current)?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      triggerEl?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape to close, and a basic focus trap so Tab never escapes the sheet.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  const sheetAnim = reduceMotion ? '' : 'animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200';
  const backdropAnim = reduceMotion ? '' : 'animate-in fade-in duration-150';

  const ActionRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    tone?: 'default' | 'danger';
  }> = ({ icon, label, onClick, tone = 'default' }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium cursor-pointer transition-colors text-left ${
        tone === 'danger'
          ? 'text-[#E11D48] hover:bg-[#E11D48]/10'
          : 'text-[#4A0420] hover:bg-[#FFB8CB]'
      }`}
    >
      <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tone === 'danger' ? 'bg-[#E11D48]/10' : 'bg-[#FFB8CB]'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 z-70 flex items-end sm:items-center justify-center bg-[#4A0420]/50 backdrop-blur-xs p-0 sm:p-4 ${backdropAnim}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={step === 'menu' ? `Actions for ${memory.title}` : step === 'chapter' ? 'Add to chapter' : 'Delete this memory'}
        tabIndex={-1}
        className={`w-full sm:max-w-sm bg-[#FFD3DE] border border-[#F4A9BF] rounded-t-3xl sm:rounded-3xl warm-shadow-lg pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-2 outline-none ${sheetAnim}`}
      >
        {/* Grab handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-[#F4A9BF]" />
        </div>

        {step === 'menu' && (
          <div className="p-3">
            <div className="flex items-center justify-between px-2 pt-1 pb-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#8A4058] truncate">{memory.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close actions"
                className="w-8 h-8 rounded-full bg-[#FFB8CB] hover:bg-[#F4A9BF] flex items-center justify-center text-[#8A4058] cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {isOwner && (
                <ActionRow icon={<Edit3 className="w-4 h-4 text-[#E11D48]" />} label="Edit" onClick={onEdit} />
              )}
              <ActionRow
                icon={<BookOpen className="w-4 h-4 text-[#E11D48]" />}
                label="Add to chapter"
                onClick={() => setStep('chapter')}
              />
              <ActionRow
                icon={<Heart className={`w-4 h-4 text-[#E11D48] ${memory.isFavorite ? 'fill-[#E11D48]' : ''}`} />}
                label={memory.isFavorite ? 'Remove favorite' : 'Favorite'}
                onClick={onToggleFavorite}
              />
              <ActionRow icon={<EyeOff className="w-4 h-4 text-[#E11D48]" />} label="Hide" onClick={onHide} />
              {isOwner && (
                <ActionRow
                  icon={<Trash2 className="w-4 h-4 text-[#E11D48]" />}
                  label="Delete"
                  tone="danger"
                  onClick={() => setStep('delete')}
                />
              )}
            </div>

            {!isOwner && (
              <p className="px-5 pt-2 pb-1 text-[11px] text-[#8A4058] leading-relaxed">
                This memory was added by {memory.authorName}. You can organize it, but only they can edit or delete its original content.
              </p>
            )}
          </div>
        )}

        {step === 'chapter' && (
          <div className="p-3">
            <div className="flex items-center gap-2 px-2 pt-1 pb-3">
              <button
                type="button"
                onClick={() => setStep('menu')}
                aria-label="Back to actions"
                className="w-8 h-8 rounded-full bg-[#FFB8CB] hover:bg-[#F4A9BF] flex items-center justify-center text-[#8A4058] cursor-pointer flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display text-lg text-[#4A0420]">Add to chapter</h3>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => onSetChapter('')}
                className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl text-sm font-medium text-[#4A0420] hover:bg-[#FFB8CB] cursor-pointer text-left"
              >
                <span>None (individual memory)</span>
                {!memory.chapterId && <Check className="w-4 h-4 text-[#E11D48]" />}
              </button>
              {chapters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSetChapter(c.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl text-sm font-medium text-[#4A0420] hover:bg-[#FFB8CB] cursor-pointer text-left"
                >
                  <span className="truncate">{c.title}</span>
                  {memory.chapterId === c.id && <Check className="w-4 h-4 text-[#E11D48] flex-shrink-0" />}
                </button>
              ))}
              {chapters.length === 0 && (
                <p className="px-5 py-3 text-xs text-[#8A4058]">No chapters yet — create one from Our Shelf first.</p>
              )}
            </div>
          </div>
        )}

        {step === 'delete' && (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E11D48]/10 text-[#E11D48] mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-[#4A0420]">Delete this memory?</h3>
            <p className="text-xs text-[#8A4058] mt-2 leading-relaxed">
              This action cannot be undone. The memory and all associated reactions and replies will be permanently removed.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setStep('menu')}
                className="px-5 py-2.5 rounded-full border border-[#F4A9BF] text-xs font-medium text-[#8A4058] hover:text-[#4A0420] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-5 py-2.5 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-semibold tracking-wide cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Memory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
