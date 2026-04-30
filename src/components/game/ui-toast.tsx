'use client';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function GameToast({ message, type }: ToastProps) {
  const style = type === 'success'
    ? 'bg-emerald-600'
    : type === 'error'
      ? 'bg-rose-600'
      : 'bg-slate-700';

  return (
    <div className={`fixed bottom-6 right-6 z-50 text-white px-4 py-3 rounded-xl shadow-lg ${style} animate-[fadeIn_.2s_ease-out]`}>
      {message}
    </div>
  );
}
