import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AnalyzerTab } from './components/AnalyzerTab';
import { ThreatFeedTab } from './components/ThreatFeedTab';
import { HistoryTab } from './components/HistoryTab';
import { ProtectionTab } from './components/ProtectionTab';
import { AccountModal } from './components/AccountModal';
import { ThreatDetailModal } from './components/ThreatDetailModal';
import { Toast } from './components/Toast';
import { TabType, ScanResult, CommunityThreat } from './types';
import { SAMPLE_PRESETS } from './data/samples';

const INITIAL_THREATS: CommunityThreat[] = [
  {
    id: 'thr-1',
    headline: '"USPS: Package detained due to unpaid $1.49 transit fee"',
    domain: 'smishing-proxy.usps-help.top',
    reports: 1420,
    severity: 'DANGEROUS',
    category: 'Smishing Postal Lure',
    timestamp: '3m ago',
    channel: 'SMS'
  },
  {
    id: 'thr-2',
    headline: '"Hi Mum, I dropped my phone in the sink. Text this new number"',
    domain: 'Family emergency impersonation',
    reports: 849,
    severity: 'SUSPICIOUS',
    category: 'Social Engineering',
    timestamp: '12m ago',
    channel: 'WhatsApp'
  },
  {
    id: 'thr-3',
    headline: '"Geek Squad: Invoice $499.00 auto-renewed. Call 1-888-501-9231 to cancel"',
    domain: 'billing-geeksquad-refund.net',
    reports: 2150,
    severity: 'DANGEROUS',
    category: 'Refund / Tech Support Scam',
    timestamp: '25m ago',
    channel: 'Email'
  },
  {
    id: 'thr-4',
    headline: '"Zelle Alert: $650 sent to Michael K. Reply NO to decline"',
    domain: 'zelle-fraud-cancel-sms.com',
    reports: 975,
    severity: 'DANGEROUS',
    category: 'Financial Impersonation',
    timestamp: '1h ago',
    channel: 'SMS'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('analyzer');
  const [threats, setThreats] = useState<CommunityThreat[]>(INITIAL_THREATS);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('scamshield_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed with initial benchmark history
    return [
      {
        id: 'hist-seed-1',
        timestamp: '10:14 AM',
        inputSnippet: 'URGENT from CHASE SECURITY: A withdrawal of $1,850.00 is pending...',
        fullText: SAMPLE_PRESETS.bank.text,
        ...SAMPLE_PRESETS.bank.result
      }
    ];
  });

  const [quarantinedList, setQuarantinedList] = useState<ScanResult[]>(() => {
    try {
      const saved = localStorage.getItem('scamshield_quarantine');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedThreatModal, setSelectedThreatModal] = useState<CommunityThreat | null>(null);
  const [toast, setToast] = useState<{ message: string | null; type?: 'success' | 'info' | 'error' }>({
    message: null
  });

  // Save history and quarantine to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scamshield_history', JSON.stringify(scanHistory));
    } catch {}
  }, [scanHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('scamshield_quarantine', JSON.stringify(quarantinedList));
    } catch {}
  }, [quarantinedList]);

  // Load live threats from backend if available
  useEffect(() => {
    fetch('/api/threats')
      .then((res) => res.json())
      .then((data) => {
        if (data?.threats?.length) {
          setThreats(data.threats);
        }
      })
      .catch(() => {
        // Use client INITIAL_THREATS on standalone dev or static fallback
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  const handleAnalyze = async (payload: {
    text?: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<ScanResult | null> => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setScanHistory((prev) => [data.result, ...prev.filter((i) => i.id !== data.result.id)]);
          return data.result;
        }
      }
    } catch (err) {
      console.warn('API analyze request failed, using client heuristic fallback', err);
    }

    // Client-side Heuristic Fallback
    const input = payload.text || 'Screenshot artifact scan';
    const lower = input.toLowerCase();

    const hasBank = /(chase|wells|bank of america|zelle|venmo|wire|transfer|security|unauthorized)/i.test(lower);
    const hasDelivery = /(usps|fedex|ups|package|detained|redelivery|parcel)/i.test(lower);
    const hasJob = /(kelly|recruitment|work from home|\$200|\$400|daily payout|task)/i.test(lower);
    const hasCrypto = /(sol|crypto|binance|alpha|trading|\+450%|return)/i.test(lower);

    let preset = SAMPLE_PRESETS.bank;
    if (hasDelivery) preset = SAMPLE_PRESETS.package;
    else if (hasJob) preset = SAMPLE_PRESETS.job;
    else if (hasCrypto) preset = SAMPLE_PRESETS.crypto;
    else if (hasBank) preset = SAMPLE_PRESETS.bank;

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputSnippet: input.slice(0, 80),
      fullText: input,
      ...preset.result
    };

    setScanHistory((prev) => [result, ...prev]);
    return result;
  };

  const handleQuarantine = (result: ScanResult) => {
    if (quarantinedList.some((q) => q.id === result.id)) {
      showToast('Artifact is already quarantined in vault', 'info');
      return;
    }
    setQuarantinedList((prev) => [result, ...prev]);
    showToast('Sender blocked & added to Quarantine Vault', 'success');
  };

  const handleReportThreat = async (newThreatData: {
    headline: string;
    domain: string;
    channel: any;
  }) => {
    const created: CommunityThreat = {
      id: `thr-${Date.now()}`,
      headline: newThreatData.headline,
      domain: newThreatData.domain,
      reports: 1,
      severity: 'DANGEROUS',
      category: 'Community User Intercept',
      timestamp: 'Just now',
      channel: newThreatData.channel
    };

    setThreats((prev) => [created, ...prev]);

    try {
      await fetch('/api/report-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newThreatData)
      });
    } catch {}
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    setQuarantinedList([]);
    localStorage.removeItem('scamshield_history');
    localStorage.removeItem('scamshield_quarantine');
    showToast('Scan history and quarantine vault cleared', 'info');
  };

  const handleTestThreatInAnalyzer = (headline: string) => {
    setActiveTab('analyzer');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Analyzing threat: "${headline.slice(0, 30)}..."`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Geist'] selection:bg-[#cce5ff]">
      {/* Fixed Header */}
      <Header
        onOpenSettings={() => setAccountModalOpen(true)}
        threatCount={threats.length}
      />

      {/* Main Tab Views */}
      <main className="flex-1 w-full pt-16 pb-20">
        {activeTab === 'analyzer' && (
          <AnalyzerTab
            onAnalyze={handleAnalyze}
            onQuarantine={handleQuarantine}
            onSelectThreat={(t) => setSelectedThreatModal(t)}
            onExploreFeed={() => setActiveTab('threat-feed')}
            threats={threats}
            showToast={showToast}
          />
        )}

        {activeTab === 'threat-feed' && (
          <ThreatFeedTab
            threats={threats}
            onReportThreat={handleReportThreat}
            onScanThisThreat={handleTestThreatInAnalyzer}
            showToast={showToast}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            history={scanHistory}
            quarantinedList={quarantinedList}
            onSelectScan={(item) => {
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={handleClearHistory}
            showToast={showToast}
          />
        )}

        {activeTab === 'protection' && <ProtectionTab />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        quarantineBadgeCount={quarantinedList.length}
      />

      {/* Account / Engine Settings Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onClearAll={handleClearHistory}
      />

      {/* Community Threat Detail Modal */}
      <ThreatDetailModal
        threat={selectedThreatModal}
        onClose={() => setSelectedThreatModal(null)}
        onTestInAnalyzer={handleTestThreatInAnalyzer}
      />

      {/* Floating Feedback Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null })}
      />
    </div>
  );
}
