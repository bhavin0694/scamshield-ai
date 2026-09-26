export interface ForensicSignal {
  label: string;
  value: number;
  severity: 'danger' | 'warning' | 'safe';
}

export interface ExtractedUrl {
  url: string;
  verdict: string;
  domainAge?: string;
  sandboxStatus?: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  inputSnippet: string;
  fullText: string;
  riskScore: number;
  verdictLevel: 'DANGEROUS' | 'SUSPICIOUS' | 'SAFE';
  verdictTitle: string;
  verdictSummary: string;
  signals: ForensicSignal[];
  extractedUrls?: ExtractedUrl[];
  recommendedActions?: string[];
  screenshotPreview?: string;
}

export interface CommunityThreat {
  id: string;
  headline: string;
  domain: string;
  reports: number;
  severity: 'DANGEROUS' | 'SUSPICIOUS' | 'SAFE';
  category: string;
  timestamp: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Payment App' | 'Telegram';
}

export type TabType = 'analyzer' | 'threat-feed' | 'history' | 'protection';
