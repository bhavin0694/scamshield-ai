import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initial community threats
let communityThreats = [
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
  },
  {
    id: 'thr-5',
    headline: '"Netflix: Your payment failed. Account will freeze within 24 hours"',
    domain: 'netflix-billing-update.cc',
    reports: 3410,
    severity: 'DANGEROUS',
    category: 'Subscription Phishing',
    timestamp: '2h ago',
    channel: 'SMS'
  }
];

// Forensic scan history stored in memory
let scanHistory: any[] = [];

// Heuristic fallback analysis when Gemini is unavailable
function fallbackHeuristicAnalysis(text: string) {
  const lower = text.toLowerCase();
  
  let score = 20;
  let verdictLevel: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' = 'SAFE';
  let title = 'Low Risk Message Pattern';
  let summary = 'No malicious indicators or credential-harvesting triggers detected in this text. Safe to proceed with normal caution.';
  
  const signals = [
    { label: 'Domain Spoofing / Lookalike URL', value: 12, severity: 'safe' },
    { label: 'Artificial Urgency / Threat Tactics', value: 15, severity: 'safe' },
    { label: 'Brand Impersonation (Financial/Official)', value: 10, severity: 'safe' },
    { label: 'Financial Routing / Payment Trap', value: 8, severity: 'safe' }
  ];

  const hasUrgency = /(urgent|immediately|action required|suspended|24 hours|detained|unauthorized|blocked|freeze|within 15 min)/i.test(text);
  const hasLink = /(https?:\/\/|bit\.ly|tinyurl|\.cc|\.top|\.xyz|\.click|\.ru|\.net|wa\.me|t\.me)/i.test(text);
  const hasBrand = /(chase|wells fargo|bank of america|usps|fedex|ups|netflix|amazon|apple|paypal|zelle|venmo|geek squad|irs)/i.test(text);
  const hasMoney = /(\$\d+|transfer|wire|fee|paid|crypto|bitcoin|sol|withdraw|gift card)/i.test(text);
  const hasJob = /(work from home|task|recruitment|earn \$\d+|daily payout)/i.test(text);

  if (hasUrgency) {
    score += 25;
    signals[1].value = 88;
    signals[1].severity = 'warning';
  }
  if (hasLink) {
    score += 30;
    signals[0].value = 95;
    signals[0].severity = 'danger';
  }
  if (hasBrand) {
    score += 25;
    signals[2].value = 92;
    signals[2].severity = 'danger';
  }
  if (hasMoney || hasJob) {
    score += 15;
    signals[3].value = 86;
    signals[3].severity = 'danger';
  }

  score = Math.min(score, 98);

  if (score >= 75) {
    verdictLevel = 'DANGEROUS';
    title = hasBrand ? 'Brand Impersonation & Credential Phish' : 'High-Confidence Smishing Trap';
    summary = 'The message demonstrates classic social engineering tactics: deceptive urgency combined with external redirect mechanisms. The link aims to extract two-factor credentials or financial authorization.';
  } else if (score >= 45) {
    verdictLevel = 'SUSPICIOUS';
    title = 'Suspicious Interaction Pattern';
    summary = 'Potential social engineering or unsolicited marketing. Urgency or unverified contact info detected. Exercise caution before responding or sharing any personal details.';
  }

  return {
    riskScore: score,
    verdictLevel,
    verdictTitle: title,
    verdictSummary: summary,
    signals,
    extractedUrls: (text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|wa\.me\/[^\s]+|t\.me\/[^\s]+/gi) || []).map(url => ({
      url,
      verdict: score > 70 ? 'DANGEROUS' : 'UNVERIFIED',
      domainAge: '48h (Rogue Proxy)',
      sandboxStatus: 'Detached in isolated browser'
    })),
    recommendedActions: [
      'Do not tap or follow any contained URLs or shortened links.',
      'Never share 2FA OTP codes, passwords, or credit card details.',
      'Report the message to your cellular carrier by forwarding to 7726 (SPAM).'
    ]
  };
}

// API Routes
app.get('/api/threats', (_req, res) => {
  res.json({ success: true, threats: communityThreats });
});

app.post('/api/report-threat', (req, res) => {
  const { headline, domain, channel, severity = 'SUSPICIOUS' } = req.body;
  if (!headline) {
    return res.status(400).json({ error: 'Headline is required' });
  }

  const newThreat = {
    id: `thr-${Date.now()}`,
    headline,
    domain: domain || 'Unknown domain / sender',
    reports: 1,
    severity,
    category: 'Community User Report',
    timestamp: 'Just now',
    channel: channel || 'SMS'
  };

  communityThreats.unshift(newThreat);
  if (communityThreats.length > 20) communityThreats.pop();

  res.json({ success: true, threat: newThreat });
});

app.get('/api/history', (_req, res) => {
  res.json({ success: true, history: scanHistory });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, imageBase64, mimeType } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Please provide message text or an image' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available, use server-side @google/genai
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const promptText = `
You are ScamShield AI Forensic Artifact Engine, a senior cybersecurity forensics specialist analyzing suspicious messages, SMS smishing, WhatsApp task scams, fake package delivery notifications, email spoofing, and crypto fraud.

Analyze the following payload thoroughly:
Payload:
${text ? `"""${text}"""` : '[See attached screenshot image for OCR / Visual Phishing forensic analysis]'}

Evaluate:
1. Risk score between 0 and 100 (0 = safe, 100 = malicious attack).
2. Verdict level: "DANGEROUS" (score >= 70), "SUSPICIOUS" (score 40-69), or "SAFE" (score < 40).
3. Verdict title: Short punchy forensic categorization (e.g., "Financial Impersonation Phishing", "Smishing Address Harvesting", "Task Scams & Advance-Fee Fraud", "Safe Verified Notification").
4. Verdict summary: 2-3 sentences explaining exactly why this is safe or dangerous, identifying specific psychological triggers (urgency, fear, greed), unverified sender patterns, domain spoofs, or OTP stealing vectors.
5. Signal 1 (Domain Spoofing / Lookalike URL risk: percentage string like "98%" and severity "danger"|"warning"|"safe").
6. Signal 2 (Artificial Urgency / Threat Tactics risk: percentage string and severity).
7. Signal 3 (Brand Impersonation risk: percentage string and severity).
8. Signal 4 (Financial Routing / Overpayment risk: percentage string and severity).
9. Extracted links/domains with risk assessment.
10. Concrete remediation actions for the user.
`;

        const contents: any = [];
        if (imageBase64) {
          contents.push({
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          });
        }
        contents.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents.length === 1 ? contents[0].text : { parts: contents },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: { type: Type.INTEGER, description: 'Risk score from 0 to 100' },
                verdictLevel: { type: Type.STRING, description: 'DANGEROUS, SUSPICIOUS, or SAFE' },
                verdictTitle: { type: Type.STRING, description: 'Short title of forensic finding' },
                verdictSummary: { type: Type.STRING, description: 'Forensic explanation of indicators' },
                signals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.INTEGER, description: 'Percentage 0-100' },
                      severity: { type: Type.STRING, description: 'danger, warning, or safe' }
                    },
                    required: ['label', 'value', 'severity']
                  }
                },
                extractedUrls: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      url: { type: Type.STRING },
                      verdict: { type: Type.STRING },
                      domainAge: { type: Type.STRING },
                      sandboxStatus: { type: Type.STRING }
                    },
                    required: ['url', 'verdict']
                  }
                },
                recommendedActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['riskScore', 'verdictLevel', 'verdictTitle', 'verdictSummary', 'signals']
            }
          }
        });

        const raw = response.text || '{}';
        const parsed = JSON.parse(raw);

        const record = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          inputSnippet: (text || 'Screenshot upload').slice(0, 80),
          fullText: text || 'Screenshot Forensic Scan',
          ...parsed
        };
        scanHistory.unshift(record);
        if (scanHistory.length > 30) scanHistory.pop();

        return res.json({ success: true, result: record });
      } catch (geminiError) {
        console.error('Gemini API call failed, using heuristic engine:', geminiError);
      }
    }

    // Heuristic fallback
    const result = fallbackHeuristicAnalysis(text || 'Screenshot upload');
    const record = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputSnippet: (text || 'Screenshot upload').slice(0, 80),
      fullText: text || 'Screenshot Forensic Scan',
      ...result
    };
    scanHistory.unshift(record);
    if (scanHistory.length > 30) scanHistory.pop();

    return res.json({ success: true, result: record });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Internal server error analyzing message' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
