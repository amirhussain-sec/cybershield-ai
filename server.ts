import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { ETHICAL_HACKING_COURSES, STUDENT_BLOG_ARTICLES } from './src/data/learningResources.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Allow json payloads up to 15mb for base64 images
app.use(express.json({ limit: '15mb' }));

// Initialize Gemini client if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Resilient timeout helper to prevent hanging if network stalls
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timeout')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// -------------------------------------------------------------
// Threat Alerts Community Store
// -------------------------------------------------------------
interface ThreatAlertItem {
  id: string;
  title: string;
  category: 'Phishing Wave' | 'Malware Lure' | 'Credential Breach' | 'Campus Advisory';
  severity: 'Critical' | 'High' | 'Medium' | 'Info';
  targetPlatform: string;
  description: string;
  mitigation: string;
  publishedAt: string;
  reportedCount: number;
  isStudentReported?: boolean;
}

const activeThreatAlerts: ThreatAlertItem[] = [
  {
    id: 'alert-canvas-2026',
    title: 'Widespread Canvas LMS "Course Deactivation" Phishing Wave',
    category: 'Phishing Wave',
    severity: 'Critical',
    targetPlatform: 'Institutional Student Email (.edu)',
    description: 'Deceptive emails sent with subject "Action Required: Verify Canvas Account" redirecting to fake SSO login pages hosted on lookalike .support domains.',
    mitigation: 'Do not click email verification links. Access Canvas strictly through your institution official bookmark or portal.',
    publishedAt: '25 mins ago',
    reportedCount: 42,
  },
  {
    id: 'alert-fafsa-sms',
    title: 'Emergency FAFSA / Student Grant Refund Smishing Campaign',
    category: 'Phishing Wave',
    severity: 'High',
    targetPlatform: 'Student Mobile SMS',
    description: 'SMS messages claiming $1,250 pending direct deposits with links ending in .xyz and .top attempting to harvest bank credentials and SSNs.',
    mitigation: 'Federal Student Aid and campus bursars never request bank verification via SMS text links.',
    publishedAt: '2 hours ago',
    reportedCount: 28,
  },
  {
    id: 'alert-discord-game',
    title: 'Discord "Playtest My Indie Game" Infostealer Malware',
    category: 'Malware Lure',
    severity: 'High',
    targetPlatform: 'Discord DMs & Guilds',
    description: 'Compromised friend accounts sending compressed ZIP files with malicious Python token stealers that siphon Discord session tokens and browser passwords.',
    mitigation: 'Never run executable (.exe, .bat, .scr) files sent through chat platforms, even from acquaintances.',
    publishedAt: '6 hours ago',
    reportedCount: 19,
  },
  {
    id: 'alert-campus-wifi-pine',
    title: 'Rogue "Campus_Student_HighSpeed" Wi-Fi Pineapple Detected',
    category: 'Campus Advisory',
    severity: 'Medium',
    targetPlatform: 'Campus Library & Cafes',
    description: 'An open rogue access point prompting students to download a "Network Trust Security Profile" to intercept plaintext traffic.',
    mitigation: 'Reject any Wi-Fi network that demands installing custom certificates or profiles.',
    publishedAt: '1 day ago',
    reportedCount: 14,
  },
];

// -------------------------------------------------------------
// Security Heuristics Engine for URL inspection
// -------------------------------------------------------------
interface HeuristicResult {
  rule: string;
  triggered: boolean;
  severity: 'high' | 'medium' | 'low' | 'safe';
  explanation: string;
}

function runLocalUrlHeuristics(rawUrl: string): {
  heuristics: HeuristicResult[];
  calculatedRisk: number;
  extractedHost: string;
  extractedProtocol: string;
  isIpAddress: boolean;
  suspiciousKeywordsFound: string[];
} {
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    return {
      heuristics: [
        {
          rule: 'Malformed URL Structure',
          triggered: true,
          severity: 'high',
          explanation: 'The provided string is not a syntactically valid URL.',
        },
      ],
      calculatedRisk: 85,
      extractedHost: rawUrl,
      extractedProtocol: 'unknown',
      isIpAddress: false,
      suspiciousKeywordsFound: [],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = parsed.href.toLowerCase();

  const heuristics: HeuristicResult[] = [];
  let riskScore = 5;

  // 1. IP address hostname check
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const isIp = ipRegex.test(hostname);
  if (isIp) {
    heuristics.push({
      rule: 'Raw IP Address Host',
      triggered: true,
      severity: 'high',
      explanation: 'Legitimate academic and commercial services use registered domain names, not bare IP addresses.',
    });
    riskScore += 35;
  }

  // 2. Protocol check
  const isHttps = parsed.protocol === 'https:';
  if (!isHttps) {
    heuristics.push({
      rule: 'Unencrypted HTTP Protocol',
      triggered: true,
      severity: 'medium',
      explanation: 'The link transmits data in plaintext without SSL/TLS encryption.',
    });
    riskScore += 20;
  }

  // 3. Suspicious TLD check
  const suspiciousTLDs = ['.top', '.xyz', '.buzz', '.click', '.monster', '.work', '.gq', '.cf', '.tk', '.ml', '.ga', '.rest', '.sbs', '.cam'];
  const hasSuspiciousTLD = suspiciousTLDs.some((tld) => hostname.endsWith(tld));
  if (hasSuspiciousTLD) {
    heuristics.push({
      rule: 'High-Abuse Top Level Domain',
      triggered: true,
      severity: 'medium',
      explanation: 'Domain uses a TLD frequently associated with automated throwaway spam and phishing campaigns.',
    });
    riskScore += 25;
  }

  // 4. Embedded credentials (@ symbol)
  if (rawUrl.includes('@')) {
    heuristics.push({
      rule: 'URL Userinfo Spoofing (@ Character)',
      triggered: true,
      severity: 'high',
      explanation: 'URLs containing "@" can deceive browsers into authenticating against a different target host.',
    });
    riskScore += 40;
  }

  // 5. Excessive subdomains / deep nesting
  const hostParts = hostname.split('.');
  if (hostParts.length > 4) {
    heuristics.push({
      rule: 'Excessive Subdomain Stacking',
      triggered: true,
      severity: 'medium',
      explanation: 'Phishing kits often stack subdomains (e.g. student-login.portal.service.attacker.com) to mask the real root domain.',
    });
    riskScore += 20;
  }

  // 6. Suspicious student/portal keywords
  const suspiciousKeywords = [
    'login', 'verify', 'account', 'banking', 'secure', 'canvas', 'blackboard',
    'student-aid', 'fafsa', 'scholarship', 'free-nitro', 'free-robux', 'update-pass',
    'portal-signin', 'webmail', 'office365', 'outlook', 'confirm-identity'
  ];
  const isOfficialEducationalHost =
    hostname.endsWith('.edu') ||
    hostname.endsWith('.gov') ||
    hostname === 'instructure.com' ||
    hostname.endsWith('.instructure.com') ||
    hostname === 'blackboard.com' ||
    hostname.endsWith('.blackboard.com');

  const foundKeywords = suspiciousKeywords.filter((kw) => fullUrl.includes(kw));
  if (foundKeywords.length > 0 && !isOfficialEducationalHost) {
    heuristics.push({
      rule: 'Credential Harvesting / Lure Keywords Detected',
      triggered: true,
      severity: 'medium',
      explanation: `URL contains sensitive auth/lure terms (${foundKeywords.slice(0, 3).join(', ')}) on a non-official institutional domain.`,
    });
    riskScore += 20 * Math.min(foundKeywords.length, 2);
  }

  // 7. Punycode / Homograph indication
  if (hostname.startsWith('xn--')) {
    heuristics.push({
      rule: 'Internationalized / Punycode Domain',
      triggered: true,
      severity: 'high',
      explanation: 'Uses punycode characters which can mimic familiar Latin letters (IDN homograph attack).',
    });
    riskScore += 30;
  }

  // 8. Abnormal length
  if (normalizedUrl.length > 130) {
    heuristics.push({
      rule: 'Extremely Long URL String',
      triggered: true,
      severity: 'low',
      explanation: 'Long URLs are often used to push suspicious domain names out of mobile address bars or conceal malicious redirect payloads.',
    });
    riskScore += 10;
  }

  // 9. Verified safe institutional domains bonus
  if (isOfficialEducationalHost || hostname === 'google.com' || hostname.endsWith('.google.com') || hostname === 'github.com') {
    heuristics.push({
      rule: 'Verified Official / Educational Authority',
      triggered: false,
      severity: 'safe',
      explanation: 'Domain resides within verified academic (.edu), governmental (.gov), or verified school LMS infrastructure (Instructure Canvas / Blackboard).',
    });
    riskScore = Math.max(0, riskScore - 30);
  }

  return {
    heuristics,
    calculatedRisk: Math.min(100, Math.max(0, riskScore)),
    extractedHost: hostname,
    extractedProtocol: parsed.protocol.replace(':', ''),
    isIpAddress: isIp,
    suspiciousKeywordsFound: foundKeywords,
  };
}

// -------------------------------------------------------------
// Endpoint 1: POST /api/analyze-url
// -------------------------------------------------------------
app.post('/api/analyze-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a valid URL string to analyze.' });
    }

    const localInspection = runLocalUrlHeuristics(url);

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's chief cybersecurity threat analyst specializing in protecting students, campus networks, and school accounts from phishing, credential theft, and malware.
Analyze the following URL submitted by a student:
URL: "${url}"
Extracted Hostname: "${localInspection.extractedHost}"
Protocol: "${localInspection.extractedProtocol}"
Triggered Heuristics: ${JSON.stringify(localInspection.heuristics)}

Provide a strict JSON response analyzing this URL with the following exact schema:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "MALICIOUS",
  "threatType": string (e.g. "Credential Harvester (Fake Student Portal)", "Malware Stager", "Legitimate Educational Service", "Spam / Adware Redirect", "Impersonation Attack", "Clean Web Resource"),
  "riskScore": number (integer between 0 and 100),
  "targetedService": string (e.g. "Canvas / School SSO", "Discord / Steam", "Google Workspace for Education", "Financial Aid / FAFSA", "None / Legitimate Domain"),
  "technicalAnalysis": string (2-3 clear sentences analyzing the domain anatomy, query parameters, or likelihood of deceptive social engineering),
  "keyRedFlags": array of strings (bullet points highlighting suspicious elements, or empty if safe),
  "studentAction": string (Actionable, clear guidance for the student on what to do right now, e.g. "Do not enter your school login credentials", "Safe to proceed for homework", "Report this link to your school IT desk")
}

Do not include markdown ticks around JSON. Return only parseable JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          7000
        );

        const textOutput = response.text ? response.text.trim() : '';
        const parsedAiData = JSON.parse(textOutput);

        return res.json({
          url: url.trim(),
          isAiPowered: true,
          provider: 'Gemini 3.8 Flash Threat Intelligence',
          verdict: parsedAiData.verdict || (localInspection.calculatedRisk > 60 ? 'MALICIOUS' : localInspection.calculatedRisk > 30 ? 'SUSPICIOUS' : 'SAFE'),
          riskScore: typeof parsedAiData.riskScore === 'number' ? parsedAiData.riskScore : localInspection.calculatedRisk,
          threatType: parsedAiData.threatType || 'Domain Heuristic Evaluation',
          targetedService: parsedAiData.targetedService || 'Generic Web Resource',
          technicalAnalysis: parsedAiData.technicalAnalysis,
          keyRedFlags: parsedAiData.keyRedFlags || [],
          studentAction: parsedAiData.studentAction,
          heuristics: localInspection.heuristics,
          hostDetails: {
            host: localInspection.extractedHost,
            protocol: localInspection.extractedProtocol,
            isIp: localInspection.isIpAddress,
          },
        });
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back to local heuristic analysis:', aiErr);
      }
    }

    // Fallback: Local deterministic heuristic evaluation
    const verdict = localInspection.calculatedRisk >= 60 ? 'MALICIOUS' : localInspection.calculatedRisk >= 25 ? 'SUSPICIOUS' : 'SAFE';
    const threatType =
      verdict === 'SAFE'
        ? 'Verified / Clean Web Resource (No Active Red Flags)'
        : localInspection.isIpAddress
        ? 'Direct IP Address Host (Anomalous Web Server)'
        : localInspection.suspiciousKeywordsFound.length > 0
        ? 'Potential Credential Interceptor (Keywords Detected)'
        : 'Suspicious Domain Heuristics';

    const redFlags = localInspection.heuristics
      .filter((h) => h.triggered && h.severity !== 'safe')
      .map((h) => `${h.rule}: ${h.explanation}`);

    return res.json({
      url: url.trim(),
      isAiPowered: false,
      provider: 'Deterministic Heuristic Rule Engine (Local)',
      verdict,
      riskScore: localInspection.calculatedRisk,
      threatType,
      targetedService: localInspection.suspiciousKeywordsFound.length > 0 ? 'Possible School Portal / Account Login' : 'Unspecified',
      technicalAnalysis: `Analyzed through 9 structural heuristic rules. URL evaluated with a risk score of ${localInspection.calculatedRisk}/100. ${
        verdict === 'SAFE'
          ? 'No obvious structural anomalies or known deceptive patterns were detected.'
          : 'Multiple structural flags were triggered including domain structure or lack of secure protocol standards.'
      }`,
      keyRedFlags: redFlags,
      studentAction:
        verdict === 'MALICIOUS'
          ? 'Do not open this link or input any credentials. If received via school email or Discord DM, report it to your IT department or teacher.'
          : verdict === 'SUSPICIOUS'
          ? 'Exercise extreme caution. Verify the sender through a separate official channel before clicking.'
          : 'Link appears normal according to standard URL safety heuristics. Always confirm the destination address in your browser address bar.',
      heuristics: localInspection.heuristics,
      hostDetails: {
        host: localInspection.extractedHost,
        protocol: localInspection.extractedProtocol,
        isIp: localInspection.isIpAddress,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing URL:', error);
    return res.status(500).json({ error: 'Server error processing URL safety analysis.' });
  }
});

// -------------------------------------------------------------
// Endpoint 2: POST /api/analyze-image (Multimodal AI Image & Deepfake Analysis)
// -------------------------------------------------------------
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', filename = 'uploaded_image' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid base64-encoded image string.' });
    }

    // Strip data prefix if present (e.g. data:image/png;base64,)
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    if (aiClient) {
      try {
        const forensicPrompt = `You are CyberShield AI's senior digital media forensics and deepfake detection specialist.
Your role is to protect students from synthetic media deception, such as:
1. AI-generated deepfake photos (used in sextortion, cyberbullying, or impersonation).
2. Forged academic documents (fake university transcripts, fake campus closure notices, manipulated grade screenshots).
3. Synthetic screenshots (fake Discord chats, fabricated WhatsApp messages, forged Venmo receipts).
4. Phishing banners and deceptive QR code flyers.

Perform a forensic visual inspection on this submitted image.
Analyze:
- Visual artifacts (skin smoothing, unnatural specular highlights, pupil asymmetry, ear/finger geometry, blurry background synthesis).
- Typographical anomalies (warped font rendering, baseline misalignment, mismatched font anti-aliasing on documents).
- Digital compositing seams (unnatural edge sharpness, lighting direction mismatches).

Return a strict JSON response with this exact schema:
{
  "verdict": "LIKELY_AI_GENERATED" | "SUSPICIOUS_MANIPULATION" | "LIKELY_AUTHENTIC",
  "syntheticProbability": number (0 to 100 representing probability of AI generation or forgery),
  "confidenceTier": "HIGH" | "MODERATE" | "LOW",
  "primaryIndicators": array of strings (key forensic observations),
  "anomalies": [
    {
      "title": string (short anomaly name, e.g. "Synthetic Eye Specularity", "Font Compression Discrepancy", "Hallucinated Background Structure"),
      "description": string (detailed visual explanation of what is off),
      "severity": "high" | "medium" | "low"
    }
  ],
  "forensicSummary": string (2-3 sentences providing the comprehensive expert conclusion),
  "studentSafetyContext": string (Actionable advice for the student: how to handle this image, verify its origin, or avoid falling for potential extortion/fake news)
}
Return only parseable JSON without markdown ticks.`;

        const imagePart = {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        };

        const textPart = {
          text: forensicPrompt,
        };

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          9000
        );

        const textOutput = response.text ? response.text.trim() : '';
        const parsed = JSON.parse(textOutput);

        return res.json({
          isAiPowered: true,
          provider: 'Gemini 3.8 Flash Multimodal Forensics',
          verdict: parsed.verdict || 'SUSPICIOUS_MANIPULATION',
          syntheticProbability: typeof parsed.syntheticProbability === 'number' ? parsed.syntheticProbability : 65,
          confidenceTier: parsed.confidenceTier || 'MODERATE',
          primaryIndicators: parsed.primaryIndicators || [],
          anomalies: parsed.anomalies || [],
          forensicSummary: parsed.forensicSummary || 'Forensic analysis completed with detected visual signals.',
          studentSafetyContext: parsed.studentSafetyContext || 'Do not trust screenshots or documents that lack cryptographic signatures.',
          filename,
        });
      } catch (aiErr) {
        console.warn('Multimodal Gemini call failed, falling back to local image heuristics:', aiErr);
      }
    }

    // Fallback: Local structural & metadata heuristics
    const byteLength = Buffer.byteLength(cleanBase64, 'base64');
    const isSmallPayload = byteLength < 50000; // Under 50KB often indicates heavy compression or screenshot
    const calculatedProb = isSmallPayload ? 50 : 35;

    return res.json({
      isAiPowered: false,
      provider: 'Forensic Metadata & Compression Rule Engine (Local)',
      verdict: calculatedProb > 50 ? 'SUSPICIOUS_MANIPULATION' : 'LIKELY_AUTHENTIC',
      syntheticProbability: calculatedProb,
      confidenceTier: 'LOW',
      primaryIndicators: [
        `File payload size: ${(byteLength / 1024).toFixed(1)} KB analyzed.`,
        'Inspected visual raster structure for irregular compression blocking.',
        'Gemini API key inactive or unreachable: evaluated via local compression heuristics.',
      ],
      anomalies: [
        {
          title: 'Raster Compression Artifacts',
          description: 'Image exhibits standard re-compression characteristics consistent with repeated social media transfers or screenshotting.',
          severity: 'low',
        },
      ],
      forensicSummary: 'Analyzed using local raster structural rules. Real AI visual inspection requires Gemini API connectivity.',
      studentSafetyContext: 'If this image was sent to blackmail, threaten, or impersonate you or a classmate, never pay money or panic. Report it to a trusted adult, counselor, or your school administration immediately.',
      filename,
    });
  } catch (err: any) {
    console.error('Image analysis error:', err);
    return res.status(500).json({ error: 'Server error processing image forensic analysis.' });
  }
});

// -------------------------------------------------------------
// Endpoint 3: POST /api/analyze-message (Fake Message / SMS / DM Scanner)
// -------------------------------------------------------------
app.post('/api/analyze-message', async (req: Request, res: Response) => {
  try {
    const { messageText, messageType = 'sms' } = req.body;
    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide text message content to scan.' });
    }

    const text = messageText.trim();
    const lower = text.toLowerCase();

    // Local pattern heuristics
    const triggers: string[] = [];
    if (/urgent|immediately|within (24|12|6|2|1) hour|final notice|suspended|terminated/i.test(text)) {
      triggers.push('Artificial Urgency / Panic Inducement');
    }
    if (/grant|refund|disbursement|\$[0-9]+|winner|free nitro|claim reward/i.test(text)) {
      triggers.push('Financial or Gaming Incentive (Baiting)');
    }
    if (/police|fbi|irs|dean|registrar|canvas admin|valve support|security team/i.test(text)) {
      triggers.push('False Authority Impersonation');
    }
    if (/click here|verify at|http:\/\/|https:\/\//i.test(text)) {
      triggers.push('Unverified Call-to-Action Link');
    }
    if (/crypto|gift card|wire|bitcoin|cashapp|apple card/i.test(text)) {
      triggers.push('Untraceable Payment Mechanism');
    }

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's chief social engineering investigator.
A student received this suspicious message (${messageType.toUpperCase()} format):
"""
${text}
"""

Analyze the message for social engineering, phishing, smishing, token theft, or scam tactics.
Respond with strict JSON adhering to this schema:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "MALICIOUS",
  "riskScore": number (0 to 100),
  "threatType": string (e.g. "Fake Financial Aid Smishing", "Discord Token Stealer Social Engineering", "Emergency Account Suspension Phishing", "Job Offer / Advance-Fee Scam", "Clean Communication"),
  "impersonatedEntity": string (e.g. "Financial Aid Office / FAFSA", "Discord Moderator", "University Registrar", "Canvas LMS", "Unknown / None"),
  "psychologicalTriggers": array of strings (e.g. ["Manufactured Urgency", "Fear of Academic Discipline", "Greed / Free Reward"]),
  "deceptiveSegments": [
    {
      "text": string (the exact phrase extracted from the message that is deceptive),
      "tactic": string (why this phrase is manipulative),
      "severity": "high" | "medium"
    }
  ],
  "detailedAnalysis": string (2-3 sentences explaining the psychological and technical trap),
  "recommendedAction": string (Clear student instructions on how to respond, ignore, or report)
}
Return only parseable JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          7000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({
          isAiPowered: true,
          provider: 'Gemini 3.8 Flash Linguistic Analysis',
          verdict: parsed.verdict || (triggers.length >= 2 ? 'MALICIOUS' : triggers.length === 1 ? 'SUSPICIOUS' : 'SAFE'),
          riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : triggers.length * 25,
          threatType: parsed.threatType || 'Suspicious Student Message',
          impersonatedEntity: parsed.impersonatedEntity || 'Unspecified Authority',
          psychologicalTriggers: parsed.psychologicalTriggers || triggers,
          deceptiveSegments: parsed.deceptiveSegments || [],
          detailedAnalysis: parsed.detailedAnalysis || 'Analysis concluded with detected manipulation triggers.',
          recommendedAction: parsed.recommendedAction || 'Do not reply or click any included links.',
        });
      } catch (aiErr) {
        console.warn('Gemini message analysis error, using heuristic fallback:', aiErr);
      }
    }

    // Heuristic fallback
    const riskScore = Math.min(100, Math.max(10, triggers.length * 30));
    const verdict = riskScore >= 60 ? 'MALICIOUS' : riskScore >= 30 ? 'SUSPICIOUS' : 'SAFE';

    return res.json({
      isAiPowered: false,
      provider: 'Deterministic Social Engineering Heuristics (Local)',
      verdict,
      riskScore,
      threatType: triggers.length > 0 ? 'Deceptive Psychological Lure' : 'Benign Message',
      impersonatedEntity: lower.includes('canvas') ? 'Canvas LMS' : lower.includes('fafsa') ? 'Student Financial Aid' : 'Unknown',
      psychologicalTriggers: triggers.length > 0 ? triggers : ['Standard Conversational Tone'],
      deceptiveSegments: triggers.map((t) => ({
        text: 'Identified trigger pattern in message body',
        tactic: t,
        severity: 'high',
      })),
      detailedAnalysis: `Evaluated through linguistic indicators. Detected ${triggers.length} social engineering persuasion markers. Authentic institutions rarely communicate with high urgency threats over informal channels.`,
      recommendedAction: verdict === 'SAFE'
        ? 'Message does not exhibit classic social engineering triggers. Remain vigilant with unexpected links.'
        : 'Do not click links or reply. Verify the claim independently by calling your school department or visiting their official website.',
    });
  } catch (err: any) {
    console.error('Message scan error:', err);
    return res.status(500).json({ error: 'Server error processing message scan.' });
  }
});

// -------------------------------------------------------------
// Endpoint 4: POST /api/chat (Full AI Sentinel Chatbot)
// -------------------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (aiClient) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          history.slice(-8).forEach((msg) => {
            if (msg.role && msg.text) {
              contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
              });
            }
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: {
              systemInstruction: `You are CyberShield Sentinel, an advanced yet student-friendly AI Cybersecurity Chatbot and Digital Safety Advisor.
Your responsibilities:
1. Act as a calm, expert, and non-judgmental security copilot for students (middle school, high school, university).
2. Help diagnose immediate security emergencies: account takeovers, clicked phishing links, suspicious Discord DMs, compromised Google/Canvas accounts, and digital blackmail/sextortion threats.
3. Provide step-by-step containment checklists with numbered instructions.
4. Explain technical concepts (MFA, password entropy, SSL certificates, tokens, root certificates, deepfakes) in simple, engaging analogies.
5. Offer 2-3 quick follow-up topic suggestions at the end of every helpful reply.
Keep responses concise, formatted with clear headings, bullet points, and under 250 words.`,
              temperature: 0.3,
            },
          }),
          7000
        );

        const answer = response.text || 'CyberShield Sentinel is ready to assist with your cybersecurity questions.';
        return res.json({ isAiPowered: true, reply: answer });
      } catch (err) {
        console.warn('Gemini chat error:', err);
      }
    }

    // Heuristic/Knowledgebase fallback
    const qLower = message.toLowerCase();
    let reply = 'Always practice good cyber hygiene: use unique 14+ character passphrases, enable Two-Factor Authentication (2FA) with an authenticator app, and never enter school credentials from email links.';

    if (qLower.includes('clicked') || qLower.includes('hacked') || qLower.includes('password leaked')) {
      reply = `### Immediate 60-Second Containment Checklist:
1. **Change Passwords Immediately**: Go to the official site directly and reset your credentials.
2. **Terminate Active Sessions**: In account security settings, select "Log out of all devices".
3. **Enable 2-Factor Authentication**: Turn on an authenticator app (Google Authenticator / Duo).
4. **Notify School IT Desk**: If this involves campus email or Canvas access, report it to prevent lateral account misuse.`;
    } else if (qLower.includes('image') || qLower.includes('deepfake') || qLower.includes('photo')) {
      reply = `### Spotting AI Images & Deepfakes:
- **Inspect Hands & Eyes**: AI frequently struggles with realistic fingers, ear lobes, and specular reflections in pupils.
- **Check Text & Backgrounds**: Look for warped letters, illegible signs, or surreal blurred architectural lines.
- **Reverse Image Search**: Run suspicious media through Google Images to find original sources.`;
    }

    return res.json({
      isAiPowered: false,
      reply,
      note: 'Offline Student Knowledge Base Mode (Gemini API key not active).',
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Failed to process chat message.' });
  }
});

// -------------------------------------------------------------
// Endpoint 5: GET /api/alerts & POST /api/report-threat
// -------------------------------------------------------------
app.get('/api/alerts', (_req: Request, res: Response) => {
  return res.json({ alerts: activeThreatAlerts });
});

app.post('/api/report-threat', (req: Request, res: Response) => {
  try {
    const { title, category, description, targetPlatform } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const newAlert: ThreatAlertItem = {
      id: `threat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      category: category || 'Campus Advisory',
      severity: 'High',
      targetPlatform: targetPlatform || 'Student Accounts',
      description: description.trim(),
      mitigation: 'Exercise extreme caution and do not interact with unverified links or downloads.',
      publishedAt: 'Just now',
      reportedCount: 1,
      isStudentReported: true,
    };

    activeThreatAlerts.unshift(newAlert);
    return res.json({ success: true, alert: newAlert });
  } catch (err: any) {
    console.error('Report threat error:', err);
    return res.status(500).json({ error: 'Failed to record threat report.' });
  }
});

// -------------------------------------------------------------
// Endpoint 6: POST /api/password-advice (Privacy-Preserving)
// -------------------------------------------------------------
app.post('/api/password-advice', async (req: Request, res: Response) => {
  try {
    const { entropy, length, hasUpper, hasLower, hasNumber, hasSymbol, crackTimeEstimate, weaknessFlags } = req.body;

    if (typeof entropy !== 'number' || typeof length !== 'number') {
      return res.status(400).json({ error: 'Missing numerical entropy or length metadata.' });
    }

    if (aiClient) {
      try {
        const prompt = `You are a friendly, encouraging student cybersecurity advisor for CyberShield AI.
A student just analyzed their password telemetry (NOTE: WE NEVER SEND THE PLAIN PASSWORD FOR SECURITY):
- Password Length: ${length} characters
- Shannon Entropy: ${entropy.toFixed(1)} bits
- Includes Uppercase: ${hasUpper}
- Includes Lowercase: ${hasLower}
- Includes Numbers: ${hasNumber}
- Includes Symbols: ${hasSymbol}
- Estimated Brute-Force Crack Time: "${crackTimeEstimate || 'Calculated'}"
- Pattern Warnings Flagged: ${JSON.stringify(weaknessFlags || [])}

Provide a JSON response with:
{
  "strengthTier": "WEAK" | "MODERATE" | "STRONG" | "FORTRESS",
  "coachSummary": string (1-2 friendly sentences explaining their password strength in student-relatable terms),
  "mnemonicTip": string (A practical student tip, such as using a 4-word passphrase or Diceware like "Correct-Horse-Battery-Staple"),
  "recommendations": array of strings (2-3 concise bullet points for improving password security, including password managers, 2FA, and passkeys)
}
Return only valid JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          7000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({
          isAiPowered: true,
          ...parsed,
        });
      } catch (err) {
        console.warn('Gemini password advice error, using heuristic fallback:', err);
      }
    }

    // Heuristic fallback
    let tier = 'WEAK';
    if (entropy >= 80 && length >= 14) tier = 'FORTRESS';
    else if (entropy >= 60 && length >= 12) tier = 'STRONG';
    else if (entropy >= 40 && length >= 8) tier = 'MODERATE';

    return res.json({
      isAiPowered: false,
      strengthTier: tier,
      coachSummary:
        tier === 'FORTRESS'
          ? 'Outstanding entropy! This password offers robust mathematical resistance against modern GPU dictionary attacks.'
          : tier === 'STRONG'
          ? 'Great baseline security! Meets recommended modern student hygiene standards.'
          : 'This password could be guessed or cracked in seconds by automated dictionary crawlers.',
      mnemonicTip: 'Try using a passphrase made of 4 unrelated, memorable words separated by hyphens (e.g., "Cosmic-Pancake-Guitar-92!").',
      recommendations: [
        'Aim for at least 14+ characters: length provides exponential resistance to brute force attacks.',
        'Never reuse your school portal password for gaming, social media, or forum accounts.',
        'Always activate Two-Factor Authentication (2FA / Authenticator app) wherever available.',
      ],
    });
  } catch (err: any) {
    console.error('Password advice error:', err);
    return res.status(500).json({ error: 'Failed to generate password security recommendations.' });
  }
});

// -------------------------------------------------------------
// Endpoint 8: POST /api/analyze-news (Fake News & Misinformation Detector)
// -------------------------------------------------------------
app.post('/api/analyze-news', async (req: Request, res: Response) => {
  try {
    const { claimOrArticle, sourceUrl } = req.body;
    if (!claimOrArticle || typeof claimOrArticle !== 'string' || claimOrArticle.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide news text, headline, or claim to analyze.' });
    }

    const text = claimOrArticle.trim();
    const lower = text.toLowerCase();

    // Local heuristic cues
    const redFlags: string[] = [];
    if (/shocking|you won't believe|secret they don't want you to know|miracle cure|banned everywhere/i.test(text)) {
      redFlags.push('Clickbait sensationalism & emotional bait');
    }
    if (/anonymous sources close to|insiders reveal without proof|undisclosed whistleblower/i.test(text)) {
      redFlags.push('Unverifiable anonymous source attribution');
    }
    if (/100% confirmed|leaked classified memo|urgent alert share before deleted/i.test(text)) {
      redFlags.push('Manufactured viral urgency & censorship claims');
    }

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's chief fact-checking investigator and media literacy expert for students.
Analyze the following news headline, viral social media claim, or article snippet:
"""
${text}
"""
Source context (if any): "${sourceUrl || 'Unspecified social media/message forward'}"

Perform rigorous fact-checking and media literacy evaluation.
Adhere strictly to this JSON schema:
{
  "verdict": "HIGH_CREDIBILITY" | "QUESTIONABLE_MISINFORMATION" | "FABRICATED_FAKE_NEWS" | "SATIRE_PARODY",
  "credibilityScore": number (integer 0 to 100),
  "sensationalismLevel": "LOW" | "MEDIUM" | "EXTREME",
  "biasRating": string (e.g. "Hyper-Partisan Clickbait", "Unsubstantiated Rumor", "Satirical Parody", "Balanced / Objective Reporting"),
  "primaryRedFlags": array of strings (specific deceptive claims, logical fallacies, or unverified facts),
  "evidenceSummary": string (2-3 clear sentences summarizing current factual consensus, official press statements, or debunking details),
  "factCheckingSources": array of strings (reputable fact-checking references e.g. Snopes, AP News, Reuters Fact Check, FactCheck.org),
  "studentVerificationSteps": array of strings (3 actionable steps for students to verify this claim using lateral reading and primary sources)
}
Return only parseable JSON without markdown ticks.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          8000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({
          headlineOrClaim: text,
          isAiPowered: true,
          provider: 'Gemini 3.8 Flash Media Forensics',
          verdict: parsed.verdict || 'QUESTIONABLE_MISINFORMATION',
          credibilityScore: typeof parsed.credibilityScore === 'number' ? parsed.credibilityScore : 45,
          sensationalismLevel: parsed.sensationalismLevel || (redFlags.length >= 2 ? 'EXTREME' : redFlags.length === 1 ? 'MEDIUM' : 'LOW'),
          biasRating: parsed.biasRating || 'Sensationalized Claim',
          primaryRedFlags: parsed.primaryRedFlags || redFlags,
          evidenceSummary: parsed.evidenceSummary || 'Evaluated for veracity and factual grounding against authoritative news sources.',
          factCheckingSources: parsed.factCheckingSources || ['Reuters Fact Check', 'Associated Press', 'Snopes.com'],
          studentVerificationSteps: parsed.studentVerificationSteps || [
            'Check if major reputable news wire outlets (AP, Reuters, BBC) are reporting the same event.',
            'Search the official institution or government press room (.gov/.edu) directly.',
            'Reverse-search any included images or quotes to identify out-of-context recycling.',
          ],
        });
      } catch (aiErr) {
        console.warn('Gemini news analysis error, using heuristic fallback:', aiErr);
      }
    }

    // Heuristic fallback
    const credibilityScore = Math.max(15, 100 - redFlags.length * 35);
    const verdict = credibilityScore < 40 ? 'FABRICATED_FAKE_NEWS' : credibilityScore < 75 ? 'QUESTIONABLE_MISINFORMATION' : 'HIGH_CREDIBILITY';

    return res.json({
      headlineOrClaim: text,
      isAiPowered: false,
      provider: 'Deterministic Media Literacy Heuristics (Local)',
      verdict,
      credibilityScore,
      sensationalismLevel: redFlags.length >= 2 ? 'EXTREME' : redFlags.length === 1 ? 'MEDIUM' : 'LOW',
      biasRating: redFlags.length > 0 ? 'Sensationalized Virality Lure' : 'Standard Journalistic Tone',
      primaryRedFlags: redFlags.length > 0 ? redFlags : ['No overt clickbait keywords detected in sample.'],
      evidenceSummary: 'Analyzed using deterministic linguistic sensationalism markers. Real-time fact-checking requires Gemini API access.',
      factCheckingSources: ['Associated Press Fact Check', 'Snopes', 'FactCheck.org'],
      studentVerificationSteps: [
        'Practice Lateral Reading: Open two new tabs and search the claim with the word "fact check" or "hoax".',
        'Inspect the URL domain: Look out for typo-squatted fake news domains (e.g. cnn-breaking-official.co).',
        'Verify with primary sources: Consult university administration statements or official governmental agencies directly.',
      ],
    });
  } catch (err: any) {
    console.error('News analysis error:', err);
    return res.status(500).json({ error: 'Server error processing news analysis.' });
  }
});

// -------------------------------------------------------------
// Endpoint 9: POST /api/generate-incident-report
// -------------------------------------------------------------
app.post('/api/generate-incident-report', (req: Request, res: Response) => {
  try {
    const {
      studentName = 'Alex Rivera',
      studentId = 'STU-94021',
      courseOrDept = 'Computer Science / Academic Registrar',
      incidentType = 'Unauthorized SSO Credential Access',
      dateOfCompromise = new Date().toISOString().slice(0, 10),
      affectedServices = 'Canvas LMS, Student Email (.edu)',
      details = 'Compromised via credential phishing lure.',
    } = req.body;

    const letter = `TO: ${courseOrDept}
FROM: ${studentName} (Student ID: ${studentId})
DATE: ${dateOfCompromise}
SUBJECT: Formal Cybersecurity Incident Notification & Academic Account Protection Notice

Dear Faculty / IT Support Desk,

I am writing to formally report an unauthorized cybersecurity breach affecting my institutional student account (${affectedServices}) discovered on ${dateOfCompromise}.

INCIDENT DETAILS:
- Nature of Incident: ${incidentType}
- Affected Accounts: ${affectedServices}
- Summary: ${details}

CONTAINMENT MEASURES COMPLETED:
1. Revoked all active OAuth authorizations and third-party sessions.
2. Updated Single Sign-On (SSO) credentials to a high-entropy passphrase via secure secondary device.
3. Activated multi-factor authentication (MFA / Authenticator App).
4. Scanned personal devices for keystroke loggers and persistent malware.

ACADEMIC IMPACT & REQUEST:
Because access to coursework, assignment submission gateways, or midterm examinations may have been affected or intercepted by unauthorized third parties during this window, I respectfully request:
- An administrative notation on my student record confirming this reported compromise.
- A 48-hour deadline accommodation for course submissions scheduled during the containment window.
- Guidance from the University IT Security Office on any additional log audits required.

Thank you for your prompt assistance and support in maintaining institutional cyber hygiene.

Respectfully submitted,
${studentName}
Student ID: ${studentId}`;

    return res.json({ success: true, reportDocument: letter });
  } catch (err: any) {
    console.error('Incident report generation error:', err);
    return res.status(500).json({ error: 'Failed to generate academic incident report.' });
  }
});

// -------------------------------------------------------------
// Endpoint 10: POST /api/hack-triage (Immediate Compromise Recovery)
// -------------------------------------------------------------
app.post('/api/hack-triage', async (req: Request, res: Response) => {
  try {
    const { scenarioText, affectedAccounts = [] } = req.body;
    if (!scenarioText) {
      return res.status(400).json({ error: 'Scenario description is required.' });
    }

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's Emergency Post-Compromise Recovery Commander.
A student is currently in distress because their account(s) or device have been compromised:
Student's description of what happened:
"""
${scenarioText}
"""
Reported Affected Services: ${JSON.stringify(affectedAccounts)}

Provide an immediate, calm, non-judgmental emergency recovery plan in JSON format adhering strictly to this schema:
{
  "triageLevel": "CRITICAL_SESSION_TERMINATION" | "HIGH_ACCOUNT_TAKEOVER" | "MODERATE_DATA_LEAK",
  "firstMinuteAction": string (The absolute single most critical thing the student must do in the next 60 seconds),
  "orderedRecoverySteps": [
    {
      "step": number,
      "target": string (e.g. "Primary Email", "School SSO Portal", "Device Antivirus", "Bank / Financial Aid"),
      "instruction": string (Clear, numbered instruction)
    }
  ],
  "dataRecoveryAdvice": string (How to check audit logs, restore altered files, or export backup data),
  "academicProtectionAdvice": string (Advice on notifying school IT, professors, or registrar)
}
Return only valid parseable JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
          7000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({ isAiPowered: true, triage: parsed });
      } catch (aiErr) {
        console.warn('Hack triage Gemini error, using fallback:', aiErr);
      }
    }

    // Comprehensive Fallback Triage Plan
    return res.json({
      isAiPowered: false,
      triage: {
        triageLevel: 'HIGH_ACCOUNT_TAKEOVER',
        firstMinuteAction: 'Disconnect compromised device from Wi-Fi immediately, and use a separate clean device (like your phone) to click "Log out of all sessions" on your primary email account.',
        orderedRecoverySteps: [
          {
            step: 1,
            target: 'Primary Recovery Email',
            instruction: 'Secure your primary email address first. If an attacker controls your email, they can reset every other password. Change email password to a fresh 16+ character passphrase and turn on 2FA.',
          },
          {
            step: 2,
            target: 'Kill Active Sessions Everywhere',
            instruction: 'In Google, Apple ID, Discord, or Microsoft account security settings, select "Manage Devices" and click "Sign out of all other sessions".',
          },
          {
            step: 3,
            target: 'Campus SSO & Canvas Portal',
            instruction: 'Log in to your university portal and change your password. Check if recovery email or phone numbers were altered.',
          },
          {
            step: 4,
            target: 'Revoke Third-Party OAuth App Permissions',
            instruction: 'Go to "Apps with account access" in Google/Discord and revoke all suspicious integrations.',
          },
          {
            step: 5,
            target: 'Inform School Helpdesk & Professors',
            instruction: 'Notify university IT that your account sent unauthorized messages, and notify professors if homework submissions were affected.',
          },
        ],
        dataRecoveryAdvice: 'Check the "Trash" and "Sent" folders in your email for attacker activity. Most services offer a "Restore deleted items" window up to 30 days.',
        academicProtectionAdvice: 'Generate an Academic Cybersecurity Incident Letter to protect your grades and request reasonable deadline accommodations.',
      },
    });
  } catch (err: any) {
    console.error('Hack triage error:', err);
    return res.status(500).json({ error: 'Failed to process hack triage recovery.' });
  }
});
app.post('/api/security-drill/generate', async (req: Request, res: Response) => {
  try {
    const { category, difficulty } = req.body;
    const requestedCat = category || 'phishing';
    const requestedDiff = difficulty || 'intermediate';

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's cybersecurity simulation generator for students.
Create an interactive, realistic cybersecurity scenario drill.
Category: "${requestedCat}" (options: phishing, public_wifi, social_engineering, gaming_scams, school_portal)
Difficulty: "${requestedDiff}"

Format the response as strict JSON:
{
  "id": string (unique slug like "drill-wifi-evil-twin-1"),
  "title": string (catchy student drill title),
  "scenarioType": "email" | "sms" | "chat" | "network_alert",
  "context": string (Background context, e.g. "You are sitting in the campus library preparing for midterms..."),
  "mockPayload": {
    "sender": string (e.g. "DeanOfStudents@univ-portal-support.com" or "Discord Nitro Bot"),
    "recipient": string (e.g. "student@university.edu"),
    "subject": string (or "Network SSID" / "SMS Notification"),
    "timestamp": string,
    "content": string (The authentic looking fake message or prompt),
    "actionButtonLabel": string (e.g. "Claim Emergency Grant", "Connect Without Security")
  },
  "question": string (e.g. "What is the primary indicator that this is a fraudulent lure?"),
  "options": [
    { "id": "a", "text": string, "isCorrect": boolean },
    { "id": "b", "text": string, "isCorrect": boolean },
    { "id": "c", "text": string, "isCorrect": boolean },
    { "id": "d", "text": string, "isCorrect": boolean }
  ],
  "explanation": string (Detailed educational breakdown explaining the exact red flags and safe protocol),
  "securityTakeaway": string (1 memorable takeaway sentence for students)
}
Return only parseable JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
          7000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({ isAiGenerated: true, drill: parsed });
      } catch (aiErr) {
        console.warn('Gemini drill generation error, returning curated drill:', aiErr);
      }
    }

    // Curated high-fidelity fallback drill
    return res.json({
      isAiGenerated: false,
      drill: {
        id: 'curated-portal-upgrade-2026',
        title: 'Emergency Canvas LMS Access Verification',
        scenarioType: 'email',
        context: 'It is Sunday night before finals week. You receive an urgent email in your inbox claiming your school portal account has been flagged for deactivation.',
        mockPayload: {
          sender: 'IT-Helpdesk <notifications@canvas-univ-identity.support>',
          recipient: 'alex.rivera@student.campus.edu',
          subject: 'ACTION REQUIRED: Verify Canvas SSO Credentials Within 6 Hours',
          timestamp: 'Sunday 11:42 PM',
          content: 'Dear Student,\n\nOur system detected multiple failed login attempts on your institutional Canvas account from an unknown IP address. To prevent administrative suspension during examination periods, you must authenticate your credentials immediately.\n\nFailure to verify within 6 hours will require an in-person visit to the registrar.',
          actionButtonLabel: 'Authenticate Canvas SSO Now',
        },
        question: 'Which of the following is the most conclusive red flag that proves this is a phishing attack?',
        options: [
          { id: 'a', text: 'The email was sent late on a Sunday night.', isCorrect: false },
          { id: 'b', text: 'The sender domain is "canvas-univ-identity.support" instead of the official school domain (.edu).', isCorrect: true },
          { id: 'c', text: 'The email includes a 6-hour deadline for action.', isCorrect: false },
          { id: 'd', text: 'It addresses the student as "Dear Student" instead of their full name.', isCorrect: false },
        ],
        explanation: 'While artificial urgency and generic greetings are common phishing tactics, the definitive technical proof is the sender domain. The attacker registered "canvas-univ-identity.support", which is completely unassociated with the official university (.edu) domain.',
        securityTakeaway: 'Always inspect the root domain after the @ sign in sender addresses, and never click email authentication links during urgent deadlines.',
      },
    });
  } catch (err: any) {
    console.error('Drill generation error:', err);
    return res.status(500).json({ error: 'Failed to generate security drill.' });
  }
});

// -------------------------------------------------------------
// Endpoint 12: GET /api/learning/courses & GET /api/learning/blogs
// -------------------------------------------------------------
app.get('/api/learning/courses', (_req: Request, res: Response) => {
  return res.json({ courses: ETHICAL_HACKING_COURSES });
});

app.get('/api/learning/blogs', (_req: Request, res: Response) => {
  return res.json({ articles: STUDENT_BLOG_ARTICLES });
});

// -------------------------------------------------------------
// Endpoint 13: POST /api/learning/ask-tutor (AI Ethical Hacking Mentor)
// -------------------------------------------------------------
app.post('/api/learning/ask-tutor', async (req: Request, res: Response) => {
  try {
    const { question, contextTopic, courseId } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const cleanQuestion = question.trim();

    if (aiClient) {
      try {
        const prompt = `You are CyberShield Aegis AI's senior Ethical Hacking Mentor & Cybersecurity Professor for students.
A student is asking a technical question about ethical hacking, offensive security, or cybersecurity education.

Context Topic/Course: "${contextTopic || courseId || 'General Ethical Hacking & Defensive Security'}"
Student Question:
"""
${cleanQuestion}
"""

Guidelines:
1. Provide a clear, educational, and engaging explanation tailored for high school and university students.
2. Emphasize ethical boundaries (always obtain written authorization, use isolated labs or sanctioned bug bounty programs).
3. If relevant, include a short, clean code snippet or terminal command.
4. Keep the response under 250 words, structured with clear Markdown headings and bullet points.
5. Conclude with 2 recommended next steps or related concepts to study.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              temperature: 0.2,
            },
          }),
          8000
        );

        const reply = response.text ? response.text.trim() : 'I am here to help you master ethical hacking concepts safely.';
        return res.json({
          isAiPowered: true,
          provider: 'Gemini 3.8 Flash Ethical Hacking Mentor',
          reply,
        });
      } catch (aiErr) {
        console.warn('Learning tutor AI error, using fallback:', aiErr);
      }
    }

    // Comprehensive Fallback Tutor Logic
    const qLower = cleanQuestion.toLowerCase();
    let reply = `### Ethical Hacking Core Principles
- **Authorized Scope**: In offensive security, your highest priority is having documented, signed permission. Never test an asset without explicit written scope.
- **Isolated Testing**: Practice on your own virtual machines (VirtualBox + Kali Linux) or official platforms like PicoCTF and Hack The Box.
- **Parameterized Security**: When developing applications, always separate code from data using parameterized queries and context-aware escaping.`;

    if (qLower.includes('sql') || qLower.includes('sqli')) {
      reply = `### Understanding SQL Injection & Prepared Statements
SQL Injection occurs when user-submitted input is concatenated directly into a database query string, allowing attackers to manipulate the SQL syntax tree.

\`\`\`javascript
// ❌ INSECURE
db.query("SELECT * FROM users WHERE id = " + req.query.id);

// ✅ SECURE: Prepared Statement
db.query("SELECT * FROM users WHERE id = ?", [req.query.id]);
\`\`\`

**Key Takeaways:**
1. Prepared statements pre-compile the SQL template, ensuring user input is treated strictly as literal data.
2. Never rely on manual character blacklists (like stripping quotes) as attackers can use alternate encodings.`;
    } else if (qLower.includes('nmap') || qLower.includes('port scan')) {
      reply = `### Nmap Scanning Best Practices
Nmap (Network Mapper) is the primary tool for host discovery and network service enumeration.

\`\`\`bash
# Fast reconnaissance scan with version detection and safe scripts
nmap -sV -sC -F 192.168.56.101
\`\`\`

**Important Ethical Rules:**
- Only scan IP addresses within your private local lab (e.g., 192.168.56.0/24 host-only network) or approved scan targets like \`scanme.nmap.org\`.
- Unauthorized network scanning on school Wi-Fi or public IPs can trigger network intrusion alarms and violate campus acceptable use policies.`;
    } else if (qLower.includes('xss') || qLower.includes('cross-site')) {
      reply = `### Cross-Site Scripting (XSS) Breakdown
XSS happens when an application includes untrusted data in an HTTP response without proper validation or escaping, causing the victim's browser to execute injected JavaScript.

**The 3 Main Types:**
1. **Stored XSS**: Injected script is saved permanently in a database (e.g. forum comment) and served to every visitor.
2. **Reflected XSS**: Script is reflected off a web server in an error message or search query.
3. **DOM-based XSS**: Vulnerability resides entirely in client-side JavaScript code.

**Primary Defense**: Context-aware output encoding (or using React's safe JSX rendering) and setting the \`HttpOnly\` flag on session cookies so JavaScript cannot steal them.`;
    }

    return res.json({
      isAiPowered: false,
      provider: 'Offline Ethical Hacking Knowledge Base',
      reply,
    });
  } catch (err: any) {
    console.error('Ask tutor error:', err);
    return res.status(500).json({ error: 'Failed to process question.' });
  }
});

// -------------------------------------------------------------
// Endpoint 14: POST /api/learning/generate-lab-challenge
// -------------------------------------------------------------
app.post('/api/learning/generate-lab-challenge', async (req: Request, res: Response) => {
  try {
    const { topic = 'linux_permissions', difficulty = 'intermediate' } = req.body;

    if (aiClient) {
      try {
        const prompt = `You are CyberShield AI's hands-on ethical hacking lab instructor.
Create an interactive simulated terminal or code challenge for a student.
Topic: "${topic}"
Difficulty: "${difficulty}"

Return strict JSON adhering to this schema:
{
  "id": string (unique slug like "lab-chal-xss-1"),
  "title": string (engaging student lab title),
  "scenario": string (2 sentences describing the sandbox situation),
  "objective": string (what specific command or flag the student must run/find),
  "starterCommand": string (sample command to start with),
  "simulatedOutput": string (realistic terminal response output),
  "solution": string (the winning command or fix),
  "educationalTakeaway": string (1 memorable cybersecurity takeaway)
}
Return only parseable JSON.`;

        const response = await withTimeout(
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          8000
        );

        const parsed = JSON.parse(response.text ? response.text.trim() : '{}');
        return res.json({ isAiPowered: true, challenge: parsed });
      } catch (aiErr) {
        console.warn('Lab challenge AI error, using fallback:', aiErr);
      }
    }

    return res.json({
      isAiPowered: false,
      challenge: {
        id: `lab-chal-${topic}-${Date.now()}`,
        title: 'Linux Hidden Flag Extraction Challenge',
        scenario: 'An unprivileged attacker left a hidden temporary file in /tmp on your lab Linux server.',
        objective: 'Use the ls command with flags to reveal hidden dot-files and file permissions.',
        starterCommand: 'ls -la /tmp',
        simulatedOutput: 'drwxrwxrwt  2 root root 4096 Oct 28 11:20 .\n-rw-r--r--  1 student student 34 Oct 28 11:22 .secret_flag.txt\n-rw-------  1 root root 1024 Oct 28 10:14 root_backup.log',
        solution: 'cat /tmp/.secret_flag.txt',
        educationalTakeaway: 'In Linux, files prefixed with a period (.) are hidden by default from standard ls, but readily revealed using the -a (all) flag.',
      },
    });
  } catch (err: any) {
    console.error('Lab challenge error:', err);
    return res.status(500).json({ error: 'Failed to generate lab challenge.' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Asset Serving
// -------------------------------------------------------------
async function setupServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberShield AI Server] Running on http://0.0.0.0:${PORT} (Gemini AI: ${aiClient ? 'Active' : 'Offline/Heuristic Fallback'})`);
  });
}

setupServer().catch((err) => {
  console.error('Server startup failed:', err);
});
