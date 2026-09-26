import React, { useState } from 'react';
import { ScanResult } from '../types';

interface HistoryTabProps {
  history: ScanResult[];
  quarantinedList: ScanResult[];
  onSelectScan: (item: ScanResult) => void;
  onClearHistory: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  quarantinedList,
  onSelectScan,
  onClearHistory,
  showToast
}) => {
  const [filter, setFilter] = useState<'all' | 'quarantine' | 'dangerous'>('all');

  const allItems = [...quarantinedList, ...history.filter(h => !quarantinedList.some(q => q.id === h.id))];

  const filteredItems = allItems.filter((item) => {
    if (filter === 'quarantine') return quarantinedList.some(q => q.id === item.id);
    if (filter === 'dangerous') return item.verdictLevel === 'DANGEROUS';
    return true;
  });

  const totalDangerous = allItems.filter(i => i.verdictLevel === 'DANGEROUS').length;
  const totalQuarantined = quarantinedList.length;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scamshield-forensic-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Forensic records exported', 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#e5eeff] text-[#00476e] mb-1">
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold">
              FORENSIC AUDIT TRAIL
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#000922]">
            Scan &amp; Quarantine Vault
          </h2>
          <p className="font-['Geist'] text-xs sm:text-sm text-[#45464e]">
            Review intercepted phishing artifacts, blocked senders, and historical risk telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allItems.length > 0 && (
            <>
              <button
                onClick={handleExportJSON}
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#00476e] font-['JetBrains_Mono'] text-xs font-semibold hover:bg-[#dce9ff] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export
              </button>
              <button
                onClick={onClearHistory}
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] text-xs font-semibold hover:bg-[#ffdad6]/80 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-[#ffffff] border border-[#e5eeff] p-3 rounded-xl shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#75777f]">TOTAL SCANNED</span>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#000922] mt-0.5">
            {allItems.length}
          </div>
        </div>
        <div className="bg-[#ffffff] border border-[#e5eeff] p-3 rounded-xl shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#ba1a1a]">THREATS DETECTED</span>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#ba1a1a] mt-0.5">
            {totalDangerous}
          </div>
        </div>
        <div className="bg-[#ffffff] border border-[#e5eeff] p-3 rounded-xl shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#006398]">QUARANTINED</span>
          <div className="font-['Space_Grotesk'] text-xl font-bold text-[#006398] mt-0.5">
            {totalQuarantined}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-xs ${
            filter === 'all'
              ? 'bg-[#000922] text-white font-semibold'
              : 'bg-[#eff4ff] text-[#45464e] hover:bg-[#e5eeff]'
          }`}
        >
          All Activity ({allItems.length})
        </button>
        <button
          onClick={() => setFilter('quarantine')}
          className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-xs ${
            filter === 'quarantine'
              ? 'bg-[#ba1a1a] text-white font-semibold'
              : 'bg-[#eff4ff] text-[#45464e] hover:bg-[#e5eeff]'
          }`}
        >
          Quarantined Vault ({totalQuarantined})
        </button>
        <button
          onClick={() => setFilter('dangerous')}
          className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-xs ${
            filter === 'dangerous'
              ? 'bg-[#cf7000] text-white font-semibold'
              : 'bg-[#eff4ff] text-[#45464e] hover:bg-[#e5eeff]'
          }`}
        >
          High Risk ({totalDangerous})
        </button>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-8 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#75777f]">folder_open</span>
            <p className="font-['Space_Grotesk'] font-medium text-[#000922]">No vault records found</p>
            <p className="text-xs text-[#45464e]">
              Analyze messages in the Analyzer tab to build your forensic audit history.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isQuarantined = quarantinedList.some(q => q.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectScan(item)}
                className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-3.5 shadow-xs hover:border-[#006398] transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        item.verdictLevel === 'DANGEROUS'
                          ? 'bg-[#ba1a1a]'
                          : item.verdictLevel === 'SUSPICIOUS'
                          ? 'bg-[#cf7000]'
                          : 'bg-[#006398]'
                      }`}
                    />
                    <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#000922] truncate">
                      {item.verdictTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isQuarantined && (
                      <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] text-[10px] font-bold">
                        QUARANTINED
                      </span>
                    )}
                    <span
                      className={`font-['JetBrains_Mono'] text-xs font-bold ${
                        item.riskScore >= 70
                          ? 'text-[#ba1a1a]'
                          : item.riskScore >= 40
                          ? 'text-[#cf7000]'
                          : 'text-[#006398]'
                      }`}
                    >
                      {item.riskScore}/100
                    </span>
                  </div>
                </div>

                <p className="font-['Geist'] text-xs text-[#45464e] line-clamp-2 bg-[#eff4ff] p-2 rounded border border-[#dce9ff]">
                  "{item.inputSnippet}"
                </p>

                <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#75777f] pt-1">
                  <span>Logged at {item.timestamp}</span>
                  <span className="text-[#006398] hover:underline flex items-center gap-0.5">
                    View forensic report
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
