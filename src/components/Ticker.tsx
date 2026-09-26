import React from 'react';

interface TickerProps {
  onExploreFeed?: () => void;
  count?: number;
}

export const Ticker: React.FC<TickerProps> = ({ onExploreFeed, count = 14290 }) => {
  return (
    <div className="pt-2 pb-2">
      <div 
        onClick={onExploreFeed}
        className="w-full bg-[#eff4ff] border border-[#dce9ff] px-3 sm:px-4 py-2 rounded-xl flex items-center justify-between shadow-xs cursor-pointer hover:bg-[#e5eeff] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5bb8fe] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006398]"></span>
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464e] uppercase tracking-wider truncate">
              LIVE HEURISTIC FEED
            </span>
            <span className="text-[#c5c6cf] font-['JetBrains_Mono'] text-[11px]">•</span>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#000922] truncate">
              {count.toLocaleString()}+ flagged this week
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#006398] font-medium">
            99.8% precision
          </span>
        </div>
      </div>
    </div>
  );
};
