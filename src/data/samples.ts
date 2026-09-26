import { ScanResult } from '../types';

export interface SamplePreset {
  id: string;
  emoji: string;
  title: string;
  text: string;
  result: Omit<ScanResult, 'id' | 'timestamp' | 'inputSnippet' | 'fullText'>;
}

export const SAMPLE_PRESETS: Record<string, SamplePreset> = {
  bank: {
    id: 'bank',
    emoji: '🚨',
    title: 'Bank Urgent Alert',
    text: "URGENT from CHASE SECURITY: A withdrawal of $1,850.00 is pending. If this was NOT you, immediately review and stop this transaction: https://chase-security-resolver.cc/auth?ref=9401",
    result: {
      riskScore: 96,
      verdictLevel: 'DANGEROUS',
      verdictTitle: 'Credential Phishing smish',
      verdictSummary: 'High-confidence bank phishing attempt. The link points to a rogue domain (chase-security-resolver.cc) registered 48 hours ago in Eastern Europe, configured to siphon two-factor OTP tokens.',
      signals: [
        { label: 'Domain Spoofing / Lookalike URL', value: 99, severity: 'danger' },
        { label: 'Artificial Urgency / Threat Tactics', value: 94, severity: 'warning' },
        { label: 'Brand Impersonation (Financial Institution)', value: 98, severity: 'danger' },
        { label: 'Financial Routing / Transfer Lure', value: 91, severity: 'danger' }
      ],
      extractedUrls: [
        {
          url: 'https://chase-security-resolver.cc/auth?ref=9401',
          verdict: 'MALICIOUS',
          domainAge: '48h (Rogue Proxy)',
          sandboxStatus: 'Detached in isolated sandbox'
        }
      ],
      recommendedActions: [
        'Do not tap or click the link under any circumstances.',
        'Never enter bank passwords or SMS one-time codes on third-party links.',
        'Call Chase directly at the official number printed on the back of your card.'
      ]
    }
  },
  package: {
    id: 'package',
    emoji: '📦',
    title: 'Fake Package Redelivery',
    text: "USPS Notice: Your shipment USPS-921448 could not be delivered on 03/24 due to incomplete street address details. Update your shipping info within 12h: https://redelivery-postoffice.xyz/form",
    result: {
      riskScore: 91,
      verdictLevel: 'DANGEROUS',
      verdictTitle: 'Smishing Address Harvesting',
      verdictSummary: 'Phishing lure targeting postal tracking numbers. The domain is flagged on multiple threat telemetry blacklists. It prompts for a $0.35 redelivery credit card hold to steal card credentials.',
      signals: [
        { label: 'Domain Spoofing / Lookalike URL', value: 95, severity: 'danger' },
        { label: 'Artificial Urgency / Threat Tactics', value: 89, severity: 'warning' },
        { label: 'Brand Impersonation (USPS / Postal)', value: 92, severity: 'danger' },
        { label: 'Credit Card Skimmer Vector', value: 88, severity: 'danger' }
      ],
      extractedUrls: [
        {
          url: 'https://redelivery-postoffice.xyz/form',
          verdict: 'MALICIOUS',
          domainAge: '3 days (Dynamic DNS)',
          sandboxStatus: 'Isolated & Blocked'
        }
      ],
      recommendedActions: [
        'USPS never sends SMS requiring payment for address corrections.',
        'Track parcels directly on official usps.com using your original tracking code.',
        'Block sender and forward the text to 7726 (SPAM).'
      ]
    }
  },
  job: {
    id: 'job',
    emoji: '💼',
    title: 'WhatsApp Job Offer',
    text: "Hello! I am Emily from Kelly Recruitment. We have flexible online work-from-home tasks paying $200-$400 daily. Only 1-2 hours per day on mobile. Reply 'YES' or click to chat with our supervisor on WhatsApp: wa.me/qr/91992482",
    result: {
      riskScore: 88,
      verdictLevel: 'DANGEROUS',
      verdictTitle: 'Task Scams & Advance-Fee Fraud',
      verdictSummary: 'Classic task-based recruitment scam designed to lure victims into fake crypto hotel-review or app-optimization tasks, later demanding deposit fees to unlock fake earned balances.',
      signals: [
        { label: 'Unsolicited Cold Recruitment', value: 94, severity: 'danger' },
        { label: 'Unrealistic Compensation Promise', value: 96, severity: 'danger' },
        { label: 'Channel Redirection (WhatsApp/Telegram)', value: 87, severity: 'warning' },
        { label: 'Advance-Fee / Pig Butchering Pattern', value: 91, severity: 'danger' }
      ],
      extractedUrls: [
        {
          url: 'https://wa.me/qr/91992482',
          verdict: 'SUSPICIOUS RECRUITMENT',
          domainAge: 'Encrypted Chat Entrypoint',
          sandboxStatus: 'Detached'
        }
      ],
      recommendedActions: [
        'Never pay money or buy crypto to unlock a remote job or commission payout.',
        'Legitimate recruiters reach out via LinkedIn or official business email, not cold WhatsApp texts.',
        'Report and block the WhatsApp sender immediately.'
      ]
    }
  },
  crypto: {
    id: 'crypto',
    emoji: '💰',
    title: 'Crypto Investment DM',
    text: "Private VIP signal notification: Our trading algorithm scored +450% on SOL today. Join the private alpha channel before 100 spots fill up: https://t.me/BinanceOfficialAlphaGuaranteedReturn",
    result: {
      riskScore: 93,
      verdictLevel: 'DANGEROUS',
      verdictTitle: 'High-Yield Crypto Investment Scam',
      verdictSummary: 'Impersonates official Binance affiliate channels. Features guaranteed rate-of-return assertions, a definitive indicator of Ponzi-style rug pull contracts and drainer wallets.',
      signals: [
        { label: 'Guaranteed Yield Assertion (Fraud Marker)', value: 99, severity: 'danger' },
        { label: 'Artificial Scarcity / FOMO Tactics', value: 92, severity: 'warning' },
        { label: 'Brand Impersonation (Binance)', value: 95, severity: 'danger' },
        { label: 'Web3 Wallet Drainer Risk', value: 96, severity: 'danger' }
      ],
      extractedUrls: [
        {
          url: 'https://t.me/BinanceOfficialAlphaGuaranteedReturn',
          verdict: 'MALICIOUS CHANNEL',
          domainAge: 'Impersonation Channel',
          sandboxStatus: 'Detached'
        }
      ],
      recommendedActions: [
        'Never connect your Web3 wallet (MetaMask, Phantom) to unverified Telegram bot links.',
        'Any offer promising guaranteed double-digit daily crypto returns is 100% fraudulent.',
        'Report channel for fraud to Telegram abuse team.'
      ]
    }
  },
  tax: {
    id: 'tax',
    emoji: '🏛️',
    title: 'IRS Tax Refund',
    text: "IRS Alert: You have an outstanding tax refund of $482.10 pending validation. Review your direct deposit details within 24h: https://irs-treasury-claim.org/verify",
    result: {
      riskScore: 97,
      verdictLevel: 'DANGEROUS',
      verdictTitle: 'Federal Agency Impersonation',
      verdictSummary: 'Direct impersonation of the Internal Revenue Service. The IRS never initiates contact with taxpayers by email, text messages, or social media channels to request personal or financial information.',
      signals: [
        { label: 'Government Agency Spoofing', value: 99, severity: 'danger' },
        { label: 'Urgency / Impending Forfeiture', value: 92, severity: 'warning' },
        { label: 'SSN / Financial PII Harvest', value: 98, severity: 'danger' },
        { label: 'Rogue Top-Level Domain', value: 95, severity: 'danger' }
      ],
      extractedUrls: [
        {
          url: 'https://irs-treasury-claim.org/verify',
          verdict: 'CRITICAL PHISH',
          domainAge: '1 day old',
          sandboxStatus: 'Blacklisted & Isolated'
        }
      ],
      recommendedActions: [
        'The IRS communicates strictly via postal mail, never SMS.',
        'Forward phishing emails claiming to be from the IRS to phishing@irs.gov.',
        'Do not submit Social Security numbers or banking details.'
      ]
    }
  }
};
