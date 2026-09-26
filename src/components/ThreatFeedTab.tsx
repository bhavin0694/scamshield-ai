import React, { useState } from 'react';
import { CommunityThreat } from '../types';

interface ThreatFeedTabProps {
  threats: CommunityThreat[];
  onReportThreat: (threat: { headline: string; domain: string; channel: any }) => void;
  onScanThisThreat: (text: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ThreatFeedTab: React.FC<ThreatFeedTabProps> = ({
  threats,
  onReportThreat,
  onScanThisThreat,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportHeadline, setReportHeadline] = useState('');
  const [reportDomain, setReportDomain] = useState('');
  const [reportChannel, setReportChannel] = useState<'SMS' | 'WhatsApp' | 'Email' | 'Payment App'>('SMS');

  const filteredThreats = threats.filter((t) => {
    const matchesSearch =
      t.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === 'All' || t.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportHeadline.trim()) {
      showToast('Please enter the message or headline', 'error');
      return;
    }
    onReportThreat({
      headline: reportHeadline,
      domain: reportDomain || 'Unverified sender',
      channel: reportChannel
    });
    setReportHeadline('');
    setReportDomain('');
    setShowReportModal(false);
    showToast('Threat reported to Community Radar', 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#e5eeff] text-[#00476e] mb-1">
            <span className="material-symbols-outlined text-[14px]">radar</span>
            <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold">
              GLOBAL INTELLIGENCE
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#000922]">
            Community Threat Radar
          </h2>
          <p className="font-['Geist'] text-xs sm:text-sm text-[#45464e]">
            Real-time smishing and phishing campaigns intercepted across mobile carriers.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          type="button"
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#000922] text-white font-['JetBrains_Mono'] text-xs font-semibold hover:bg-[#0f2042] active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          Report New Threat
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-3 sm:p-4 shadow-xs mb-4 flex flex-col gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#75777f] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keywords, sender, domain (e.g. USPS, Chase, refund)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#75777f] focus:outline-none focus:border-[#006398]"
          />
        </div>

        {/* Channel Filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {['All', 'SMS', 'WhatsApp', 'Email', 'Payment App'].map((chan) => (
            <button
              key={chan}
              onClick={() => setSelectedChannel(chan)}
              type="button"
              className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-xs whitespace-nowrap transition-all ${
                selectedChannel === chan
                  ? 'bg-[#000922] text-white font-semibold'
                  : 'bg-[#eff4ff] text-[#45464e] hover:bg-[#e5eeff]'
              }`}
            >
              {chan}
            </button>
          ))}
        </div>
      </div>

      {/* Threat Cards List */}
      <div className="flex flex-col gap-2.5">
        {filteredThreats.length === 0 ? (
          <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-8 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#75777f]">shield_search</span>
            <p className="font-['Space_Grotesk'] font-medium text-[#000922]">No matching threat intercepts</p>
            <p className="text-xs text-[#45464e]">Try clearing search filters or report a new payload.</p>
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-4 shadow-xs hover:border-[#006398] transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      threat.severity === 'DANGEROUS' ? 'bg-[#ba1a1a]' : 'bg-[#cf7000]'
                    }`}
                  />
                  <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#006398] uppercase">
                    {threat.channel} • {threat.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#75777f]">
                    {threat.timestamp}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold ${
                      threat.severity === 'DANGEROUS'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#ffdcc3] text-[#cf7000]'
                    }`}
                  >
                    {threat.severity}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-['Geist'] text-sm sm:text-base font-semibold text-[#000922] leading-snug">
                  {threat.headline}
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-[#75777f]">link</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ba1a1a] truncate">
                    {threat.domain}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#eff4ff] pt-2 mt-1">
                <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[11px] text-[#45464e]">
                  <span className="material-symbols-outlined text-[14px] text-[#006398]">people</span>
                  <span>{threat.reports.toLocaleString()} community confirmations</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${threat.headline} - Link: ${threat.domain}`);
                        showToast('Threat info copied', 'info');
                      }
                    }}
                    className="p-1 rounded text-[#75777f] hover:text-[#000922] hover:bg-[#eff4ff]"
                    title="Copy details"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                  <button
                    onClick={() => onScanThisThreat(threat.headline)}
                    className="px-2.5 py-1 rounded bg-[#eff4ff] border border-[#dce9ff] text-[#00476e] font-['JetBrains_Mono'] text-xs font-semibold hover:bg-[#dce9ff] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">troubleshoot</span>
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Threat Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-[#e5eeff] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006398]">add_alert</span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#000922]">
                  Report Community Threat
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#75777f] hover:text-black p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="flex flex-col gap-3 pt-3">
              <div>
                <label className="font-['JetBrains_Mono'] text-xs font-medium text-[#000922] block mb-1">
                  Suspicious Message / Hook *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportHeadline}
                  onChange={(e) => setReportHeadline(e.target.value)}
                  placeholder="e.g. 'Your USPS delivery is suspended. Pay $2.10 fee to confirm'"
                  className="w-full p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs font-['Geist'] focus:outline-none focus:border-[#006398]"
                />
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-xs font-medium text-[#000922] block mb-1">
                  Sender Number or Domain
                </label>
                <input
                  type="text"
                  value={reportDomain}
                  onChange={(e) => setReportDomain(e.target.value)}
                  placeholder="e.g. +1 (833) 441-0921 or usps-redelivery.net"
                  className="w-full p-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-[#006398]"
                />
              </div>

              <div>
                <label className="font-['JetBrains_Mono'] text-xs font-medium text-[#000922] block mb-1">
                  Channel
                </label>
                <select
                  value={reportChannel}
                  onChange={(e) => setReportChannel(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-[#006398]"
                >
                  <option value="SMS">SMS / Smishing</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email Spoofing</option>
                  <option value="Payment App">Payment App (Zelle/Venmo)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-['JetBrains_Mono'] text-[#75777f] hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#ba1a1a] text-white text-xs font-['JetBrains_Mono'] font-bold hover:bg-[#93000a] transition-all"
                >
                  Publish Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
