import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samples';
import { ScanResult, CommunityThreat } from '../types';
import { Ticker } from './Ticker';

interface AnalyzerTabProps {
  onAnalyze: (payload: { text?: string; imageBase64?: string; mimeType?: string }) => Promise<ScanResult | null>;
  onQuarantine: (result: ScanResult) => void;
  onSelectThreat: (threat: CommunityThreat) => void;
  onExploreFeed: () => void;
  threats: CommunityThreat[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AnalyzerTab: React.FC<AnalyzerTabProps> = ({
  onAnalyze,
  onQuarantine,
  onSelectThreat,
  onExploreFeed,
  threats,
  showToast
}) => {
  const [inputText, setInputText] = useState('');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Character and token estimation
  const charCount = inputText.length;
  const tokenCount = Math.ceil(charCount / 4);

  let threatStatus = 'Awaiting payload';
  let threatStatusStyle = 'text-[#75777f]';
  if (charCount > 0 && charCount < 25) {
    threatStatus = 'Buffer warming...';
    threatStatusStyle = 'text-[#006398] font-medium';
  } else if (charCount >= 25) {
    threatStatus = 'Artifact ready for scan';
    threatStatusStyle = 'text-[#00476e] bg-[#e5eeff] px-1.5 py-0.5 rounded-[2px] font-medium';
  }

  const handleSelectPreset = (preset: SamplePreset) => {
    setInputText(preset.text);
    setScreenshotPreview(null);
    const mockRes: ScanResult = {
      id: `sample-${preset.id}-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputSnippet: preset.text.slice(0, 80),
      fullText: preset.text,
      ...preset.result
    };
    setCurrentResult(mockRes);
    setTimeout(() => {
      resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleClear = () => {
    setInputText('');
    setScreenshotPreview(null);
    setCurrentResult(null);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          setInputText(text);
          showToast('Pasted from clipboard', 'info');
          return;
        }
      }
      throw new Error('Fallback clipboard');
    } catch {
      // Fallback sample if browser blocks clipboard access
      const sample = "URGENT: Your Chase card is suspended. Click bit.ly/chase-auth to verify now.";
      setInputText(sample);
      showToast('Loaded demo alert into buffer', 'info');
    }
  };

  const handleUploadScreenshot = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64Data = evt.target?.result as string;
      setScreenshotPreview(base64Data);
      const simulatedOcr = `[OCR Multimodal Extract from ${file.name}]: "ALERT: Unauthorized transfer request on Wells Fargo. Call 1-800-555-0199 or verify: wf-secure-auth.net"`;
      setInputText(simulatedOcr);

      setIsAnalyzing(true);
      showToast('Processing multimodal visual scan...', 'info');

      try {
        const res = await onAnalyze({
          text: simulatedOcr,
          imageBase64: base64Data,
          mimeType: file.type || 'image/png'
        });

        if (res) {
          setCurrentResult({ ...res, screenshotPreview: base64Data });
          setTimeout(() => {
            resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRunAnalysis = async () => {
    if (!inputText.trim() && !screenshotPreview) {
      textareaRef.current?.focus();
      showToast('Please paste a message or upload a screenshot first', 'error');
      return;
    }

    // Check if input matches known presets exactly
    const foundPreset = Object.values(SAMPLE_PRESETS).find(p => p.text === inputText.trim());
    if (foundPreset) {
      handleSelectPreset(foundPreset);
      showToast('Benchmark scan complete', 'success');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze({
        text: inputText,
        imageBase64: screenshotPreview || undefined
      });

      if (res) {
        setCurrentResult(res);
        showToast('Forensic analysis complete', 'success');
        setTimeout(() => {
          resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    } catch {
      showToast('Analysis encountered an issue, check network', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShareReport = () => {
    if (!currentResult) return;
    const reportText = `[ScamShield AI Forensic Report]
Verdict: ${currentResult.verdictLevel} (${currentResult.riskScore}/100)
Classification: ${currentResult.verdictTitle}
Summary: ${currentResult.verdictSummary}
Payload: "${currentResult.inputSnippet}..."
Signals: ${currentResult.signals.map(s => `${s.label}: ${s.value}%`).join(', ')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      showToast('Forensic report copied to clipboard!', 'success');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-6">
      {/* Top Live Intercept Ticker Widget */}
      <Ticker onExploreFeed={onExploreFeed} count={14290} />

      {/* Hero Header Section */}
      <section className="pt-2 pb-4 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-[2px] bg-[#e5eeff] text-[#00476e]">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold">
            FORENSIC ARTIFACT ENGINE
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#000922] tracking-tight leading-tight">
          Understand suspicious messages before you act.
        </h1>
        <p className="font-['Geist'] text-sm sm:text-base text-[#45464e] leading-relaxed">
          Verify suspicious SMS, emails, or chat messages in seconds before tapping links or sending money.
        </p>
      </section>

      {/* Interactive Quick Benchmark Samples */}
      <section className="pb-4">
        <div className="flex items-center justify-between pb-1.5">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464e] uppercase tracking-wider font-medium">
            QUICK BENCHMARK SAMPLES
          </span>
          <button
            onClick={handleClear}
            className="font-['JetBrains_Mono'] text-[11px] text-[#006398] hover:underline cursor-pointer focus:outline-none"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none">
          {Object.values(SAMPLE_PRESETS).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              type="button"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff] hover:bg-[#e5eeff] active:scale-95 transition-all shadow-xs"
            >
              <span className="text-[14px]">{preset.emoji}</span>
              <span className="font-['JetBrains_Mono'] text-xs font-medium whitespace-nowrap">
                {preset.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Ingestion Workspace: Raw Payload Input Card */}
      <section className="pb-5">
        <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl shadow-sm p-4 flex flex-col gap-3 relative">
          {/* Card Sub-header & Channel Badges */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006398]">terminal</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#0b1c30] font-semibold tracking-wider uppercase">
                PAYLOAD INGESTION BUFFER
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#e5eeff] px-2 py-0.5 rounded-[2px]">
              <span className="material-symbols-outlined text-[12px] text-[#00476e]">lock</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#00476e] uppercase tracking-wider font-semibold">
                Zero-Log TLS
              </span>
            </div>
          </div>

          {/* Screenshot Preview thumbnail if attached */}
          {screenshotPreview && (
            <div className="relative rounded-lg overflow-hidden border border-[#dce9ff] bg-[#eff4ff] p-2 flex items-center gap-3">
              <img
                src={screenshotPreview}
                alt="Screenshot upload"
                className="h-16 w-16 object-cover rounded border border-[#c5c6cf]"
              />
              <div className="flex-1 min-w-0">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#006398] font-semibold block">
                  MULTIMODAL ARTIFACT ATTACHED
                </span>
                <span className="text-xs text-[#45464e] truncate block">
                  OCR visual threat analysis activated
                </span>
              </div>
              <button
                onClick={() => setScreenshotPreview(null)}
                className="p-1 rounded hover:bg-[#d3e4fe] text-[#ba1a1a]"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {/* Main Payload Textarea */}
          <div className="relative bg-[#eff4ff] rounded-lg p-2.5 border border-[#dce9ff] focus-within:border-[#006398] focus-within:bg-[#ffffff] transition-all">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-transparent resize-none font-['Geist'] text-sm text-[#0b1c30] placeholder:text-[#75777f] focus:outline-none leading-relaxed min-h-[110px]"
              placeholder="Paste suspicious SMS, WhatsApp message, email body, or payment request here... (e.g., 'URGENT: Your Chase card is suspended. Click bit.ly/chase-auth to verify now.')"
              rows={4}
            />

            {/* Quick Paste Action Inside Focus Area */}
            <button
              onClick={handlePasteClipboard}
              type="button"
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded bg-[#ffffff] border border-[#dce9ff] text-[#000922] shadow-xs hover:bg-[#eff4ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">content_paste</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-medium">Paste Clipboard</span>
            </button>
          </div>

          {/* Input Telemetry Bar */}
          <div className="flex items-center justify-between pt-0.5 px-0.5 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#75777f]">
                {charCount} chars • ~{tokenCount} tokens
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#c5c6cf]">•</span>
              <span className={`font-['JetBrains_Mono'] text-[11px] ${threatStatusStyle}`}>
                {threatStatus}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#45464e] font-['JetBrains_Mono'] text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-[#006398]">bolt</span>
              <span>Fast Heuristics</span>
            </div>
          </div>

          {/* Action Panel Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Primary Trigger Action */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#000922] text-[#ffffff] font-['Space_Grotesk'] text-base font-semibold tracking-tight shadow-md hover:bg-[#0f2042] active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Scanning Heuristic Telemetry...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] text-[#5bb8fe]">radar</span>
                  <span>Analyze Message</span>
                  <span className="material-symbols-outlined text-[16px] opacity-70 ml-auto">arrow_forward</span>
                </>
              )}
            </button>

            {/* Secondary Multimodal Upload */}
            <button
              onClick={handleUploadScreenshot}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-xs sm:text-sm font-medium shadow-xs hover:bg-[#e5eeff] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006398]">add_photo_alternate</span>
              <span>Upload Screenshot</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] ml-1">(iOS &amp; Android)</span>
            </button>
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </section>

      {/* Analysis Interactive Result Pane (Forensic Sandbox) */}
      {currentResult && (
        <section ref={resultCardRef} className="pb-5 transition-all">
          <div className="bg-[#ffffff] border border-[#e5eeff] rounded-xl shadow-lg p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden">
            {/* Risk Category Header Banner */}
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentResult.verdictLevel === 'DANGEROUS'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : currentResult.verdictLevel === 'SUSPICIOUS'
                      ? 'bg-[#ffdcc3] text-[#cf7000]'
                      : 'bg-[#e5eeff] text-[#006398]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {currentResult.verdictLevel === 'DANGEROUS'
                      ? 'gpp_maybe'
                      : currentResult.verdictLevel === 'SUSPICIOUS'
                      ? 'warning'
                      : 'verified_user'}
                  </span>
                </div>
                <div>
                  <span
                    className={`font-['JetBrains_Mono'] text-[11px] uppercase font-bold tracking-wider ${
                      currentResult.verdictLevel === 'DANGEROUS'
                        ? 'text-[#ba1a1a]'
                        : currentResult.verdictLevel === 'SUSPICIOUS'
                        ? 'text-[#cf7000]'
                        : 'text-[#006398]'
                    }`}
                  >
                    {currentResult.verdictLevel === 'DANGEROUS'
                      ? 'HIGH RISK DETECTED'
                      : currentResult.verdictLevel === 'SUSPICIOUS'
                      ? 'SUSPICIOUS PATTERN'
                      : 'VERIFIED LOW RISK'}
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#000922] leading-tight">
                    {currentResult.verdictTitle}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`font-['Space_Grotesk'] text-2xl font-bold ${
                    currentResult.riskScore >= 70
                      ? 'text-[#ba1a1a]'
                      : currentResult.riskScore >= 40
                      ? 'text-[#cf7000]'
                      : 'text-[#006398]'
                  }`}
                >
                  {currentResult.riskScore}
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#75777f]">/100</span>
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#45464e] uppercase font-medium">Risk Index</p>
              </div>
            </div>

            {/* Heuristic Forensic Breakdown Bars */}
            <div className="bg-[#eff4ff] p-3 sm:p-4 rounded-lg flex flex-col gap-2.5 border border-[#dce9ff]">
              <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#45464e]">
                <span className="font-semibold uppercase">FORENSIC TELEMETRY</span>
                <span className="font-semibold text-[#000922]">
                  {currentResult.signals.length} SIGNALS TRIGGERED
                </span>
              </div>

              {currentResult.signals.map((sig, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between font-['JetBrains_Mono'] text-xs">
                    <span className="text-[#0b1c30] font-medium">{sig.label}</span>
                    <span
                      className={`font-semibold ${
                        sig.value >= 75
                          ? 'text-[#ba1a1a]'
                          : sig.value >= 40
                          ? 'text-[#cf7000]'
                          : 'text-[#006398]'
                      }`}
                    >
                      {sig.value}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#dce9ff] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sig.value >= 75
                          ? 'bg-[#ba1a1a]'
                          : sig.value >= 40
                          ? 'bg-[#cf7000]'
                          : 'bg-[#006398]'
                      }`}
                      style={{ width: `${sig.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Forensic Explanation */}
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex flex-col gap-1">
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#006398] font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                AI FORENSIC EXPLANATION
              </span>
              <p className="font-['Geist'] text-xs sm:text-sm text-[#0b1c30] leading-normal">
                {currentResult.verdictSummary}
              </p>
            </div>

            {/* Extracted URLs in Sandboxed Table */}
            {currentResult.extractedUrls && currentResult.extractedUrls.length > 0 && (
              <div className="p-3 rounded-lg bg-[#ffffff] border border-[#dce9ff] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#000922] font-semibold uppercase">
                    ISOLATED URL SANDBOX
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#75777f]">HEADLESS INSPECT</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {currentResult.extractedUrls.map((link, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#eff4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-['JetBrains_Mono'] text-[#ba1a1a] truncate font-medium">
                        {link.url}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-['JetBrains_Mono'] text-[10px] font-bold">
                          {link.verdict}
                        </span>
                        {link.domainAge && (
                          <span className="text-[11px] text-[#75777f] font-['JetBrains_Mono']">
                            {link.domainAge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remediation Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onQuarantine(currentResult)}
                type="button"
                className="py-2.5 px-3 bg-[#ba1a1a] text-[#ffffff] rounded-lg font-['JetBrains_Mono'] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm hover:bg-[#93000a] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">block</span>
                Block &amp; Quarantine
              </button>
              <button
                onClick={handleShareReport}
                type="button"
                className="py-2.5 px-3 bg-[#e5eeff] text-[#00476e] rounded-lg font-['JetBrains_Mono'] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm hover:bg-[#dce9ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Share Report
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Covered Channels & Attack Vectors */}
      <section className="pb-5">
        <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464e] uppercase tracking-wider font-semibold">
              COVERED CHANNELS &amp; ATTACK VECTORS
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#006398]">security</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#ffffff] p-2.5 rounded-lg flex items-center gap-2.5 shadow-xs border border-[#e5eeff]">
              <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#000922] flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">sms</span>
              </div>
              <div className="min-w-0">
                <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#000922] truncate">
                  SMS / Smishing
                </div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] truncate">
                  Delivery &amp; Tolls
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] p-2.5 rounded-lg flex items-center gap-2.5 shadow-xs border border-[#e5eeff]">
              <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#006398] flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </div>
              <div className="min-w-0">
                <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#000922] truncate">
                  WhatsApp / Telegram
                </div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] truncate">
                  Task &amp; Pig Butchering
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] p-2.5 rounded-lg flex items-center gap-2.5 shadow-xs border border-[#e5eeff]">
              <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#000922] flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <div className="min-w-0">
                <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#000922] truncate">
                  Email Spoofing
                </div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] truncate">
                  Fake Invoices &amp; IRS
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] p-2.5 rounded-lg flex items-center gap-2.5 shadow-xs border border-[#e5eeff]">
              <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#006398] flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div className="min-w-0">
                <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#000922] truncate">
                  Zelle &amp; Venmo
                </div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] truncate">
                  Overpayment scams
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Threat Radar */}
      <section className="pb-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464e] uppercase tracking-wider font-semibold">
            COMMUNITY THREAT RADAR
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#006398] font-medium">
            Updated 3m ago
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {threats.slice(0, 3).map((threat) => (
            <div
              key={threat.id}
              onClick={() => onSelectThreat(threat)}
              className="bg-[#ffffff] border border-[#e5eeff] p-3 rounded-lg flex items-center justify-between shadow-xs hover:border-[#006398] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    threat.severity === 'DANGEROUS' ? 'bg-[#ba1a1a]' : 'bg-[#cf7000]'
                  }`}
                />
                <div className="min-w-0">
                  <span className="font-['Geist'] text-xs sm:text-sm font-medium text-[#000922] block truncate">
                    {threat.headline}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#75777f] block truncate">
                    {threat.domain} • {threat.reports.toLocaleString()} reports
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold flex-shrink-0 ${
                  threat.severity === 'DANGEROUS'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#dce9ff] text-[#00476e]'
                }`}
              >
                {threat.severity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Safe Sandbox Isolation Banner */}
      <section className="pb-8">
        <div className="w-full rounded-xl overflow-hidden bg-[#0f2042] text-[#ffffff] p-4 sm:p-5 shadow-md flex items-center gap-4 relative">
          <div className="flex flex-col gap-1 min-w-0 z-10">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#5bb8fe]">
                shield_with_heart
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#5bb8fe] tracking-wider uppercase font-semibold">
                SAFE INTERACTION GUARANTEE
              </span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#ffffff]">
              Safe Sandbox Isolation
            </h4>
            <p className="font-['Geist'] text-xs sm:text-sm text-[#d3e4fe] leading-relaxed">
              Links and scripts inside submitted texts are detached, routed through headless safe-browsing nodes, preventing drive-by infections.
            </p>
          </div>
          <div className="flex-shrink-0 z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#4f5e83]/30 border border-[#5bb8fe]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px] sm:text-[28px] text-[#5bb8fe]">
                fingerprint
              </span>
            </div>
          </div>
          {/* Ambient Glow */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#006398] opacity-25 blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};
