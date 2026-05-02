'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDone?: () => void;
  durationMs?: number;
}

export function GameToast({ message, type, onDone, durationMs = 2600 }: ToastProps) {
  useEffect(() => {
    if (!onDone) return;
    const id = window.setTimeout(onDone, durationMs);
    return () => window.clearTimeout(id);
  }, [onDone, durationMs, message]);

  const style = type === 'success'
    ? 'bg-emerald-600'
    : type === 'error'
      ? 'bg-rose-600'
      : 'bg-slate-700';

  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-50 text-white px-4 py-3 rounded-xl shadow-lg ${style} animate-[fadeInToast_.2s_ease-out,fadeOutToast_.25s_ease-in_2.3s_forwards]`}>
      {message}
    </div>
  );
}
