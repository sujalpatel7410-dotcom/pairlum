import { useCallback, useRef } from 'react';
import type React from 'react';

interface UseLongPressOptions {
  /** Milliseconds the pointer must stay down before it counts as a long press. */
  delay?: number;
  /** Pixels of movement that cancels a pending long press (treated as a scroll/drag). */
  moveThreshold?: number;
}

/**
 * Adds a touch-only long-press gesture to an element without disturbing its
 * existing click handling. Desktop mouse input is intentionally left alone —
 * Pairlum's Timeline exposes the same actions there via a visible "•••" button
 * instead, per the interaction spec.
 *
 * Usage: spread the returned handlers onto the element, and guard its existing
 * onClick with `if (consumeLongPress()) return;` so the tap that follows a
 * long press doesn't also open the memory.
 */
export function useLongPress(onLongPress: () => void, options: UseLongPressOptions = {}) {
  const { delay = 550, moveThreshold = 10 } = options;

  const timerRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only touch/pen triggers long-press; mouse users get the "•••" button instead.
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;

    // Don't start a long-press if the finger landed on a nested interactive
    // control (Listen, Watch, reaction buttons, etc.) — let those work as normal.
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, [data-no-long-press]')) return;

    startRef.current = { x: e.clientX, y: e.clientY };
    firedRef.current = false;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      firedRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(15); } catch { /* haptics unsupported — ignore */ }
      }
      onLongPress();
    }, delay);
  }, [clearTimer, delay, onLongPress]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!startRef.current || timerRef.current === null) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    // Any real movement means the user is scrolling, not holding — cancel cleanly.
    if (Math.hypot(dx, dy) > moveThreshold) {
      clearTimer();
      startRef.current = null;
    }
  }, [clearTimer, moveThreshold]);

  const onPointerUp = useCallback(() => {
    clearTimer();
    startRef.current = null;
  }, [clearTimer]);

  const onPointerCancel = useCallback(() => {
    clearTimer();
    startRef.current = null;
    firedRef.current = false;
  }, [clearTimer]);

  // Android/Chrome show a native context menu / text-selection UI on long-press;
  // suppress it once our own action sheet has taken over the gesture.
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    if (firedRef.current) e.preventDefault();
  }, []);

  /** Call from the element's onClick: returns true (and swallows the tap) if it followed a long press. */
  const consumeLongPress = useCallback(() => {
    if (firedRef.current) {
      firedRef.current = false;
      return true;
    }
    return false;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onContextMenu, consumeLongPress };
}
