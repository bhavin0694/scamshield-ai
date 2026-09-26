import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgStyles =
    type === 'error'
      ? 'bg-[#ba1a1a] text-white'
      : type === 'success'
      ? 'bg-[#000922] text-white border border-[#5bb8fe]/40'
      : 'bg-[#0f2042] text-white';

  const iconName =
    type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none transition-all duration-300">
      <div
        className={`${bgStyles} px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-['Geist'] pointer-events-auto border border-white/10`}
      >
        <span className="material-symbols-outlined text-[18px] text-[#5bb8fe]">
          {iconName}
        </span>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-0.5"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
