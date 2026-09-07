import { useCallback, useRef, useState } from 'react';

// Records microphone audio via MediaRecorder and hands back a File on stop,
// ready to pass straight to uploadToCloudinary. seconds ticks once per
// second while recording so callers can show a live "M:SS" readout.
export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
      recorderRef.current = recorder;

      setSeconds(0);
      setIsRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not access the microphone.');
    }
  }, []);

  // Stops recording and resolves with the recorded audio as a File, or null
  // if nothing was recorded.
  const stop = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        cleanupStream();
        setIsRecording(false);
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        if (blob.size === 0) {
          resolve(null);
          return;
        }
        const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : 'webm';
        resolve(new File([blob], `voice-note.${ext}`, { type: mimeType }));
      };
      recorder.stop();
    });
  }, []);

  // Stops and discards whatever was recorded so far, without resolving a file.
  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.stop();
    }
    cleanupStream();
    chunksRef.current = [];
    setIsRecording(false);
    setSeconds(0);
  }, []);

  return { isRecording, seconds, error, start, stop, cancel };
}
