import React from 'react';
import { CommunityThreat } from '../types';

interface ThreatDetailModalProps {
  threat: CommunityThreat | null;
  onClose: () => void;
  onTestInAnalyzer: (headline: string) => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  threat,
  onClose,
  onTestInAnalyzer
}) => {
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-[#e5eeff] animate-in fade-in zoom-in-95 flex flex-col gap-3">
        <div className="flex items-start justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                threat.severity === 'DANGEROUS' ? 'bg-[#ba1a1a]' : 'bg-[#cf7000]'
              }`}
            />
            <div>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#006398] uppercase font-bold">
                {threat.channel} • {threat.category}
              </span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#000922]">
                Threat Radar Telemetry
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#75777f] hover:text-black">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff] flex flex-col gap-1">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#75777f]">
            INTERCEPTED TEXT SAMPLE
          </span>
          <p className="font-['Geist'] text-sm text-[#000922] font-medium leading-relaxed">
            {threat.headline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-['JetBrains_Mono']">
          <div className="p-2.5 rounded bg-[#ffffff] border border-[#e5eeff]">
            <span className="text-[#75777f] block text-[10px]">ASSOCIATED DOMAIN</span>
            <span className="font-bold text-[#ba1a1a] truncate block mt-0.5">
              {threat.domain}
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#ffffff] border border-[#e5eeff]">
            <span className="text-[#75777f] block text-[10px]">REPORTS & CONFIRMATIONS</span>
            <span className="font-bold text-[#000922] block mt-0.5">
              {threat.reports.toLocaleString()} victims reported
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#fffbe8] border border-[#fcd34d] text-xs font-['Geist'] text-[#92400e]">
          <strong>Forensic Notice:</strong> This campaign uses high-frequency SMS gateway rotations to bypass cellular spam filters. Never click the link or reply STOP (replying STOP confirms your line is active to attackers).
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-2 rounded-lg text-xs font-['JetBrains_Mono'] text-[#75777f] hover:bg-[#eff4ff]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onTestInAnalyzer(threat.headline);
              onClose();
            }}
            type="button"
            className="px-4 py-2 rounded-lg bg-[#000922] text-white text-xs font-['JetBrains_Mono'] font-bold hover:bg-[#0f2042] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-[#5bb8fe]">troubleshoot</span>
            Analyze In Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
