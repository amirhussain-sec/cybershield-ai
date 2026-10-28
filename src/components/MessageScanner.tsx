import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Cpu,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Send,
  Flag
} from 'lucide-react';
import { MessageAnalysisResult } from '../types';
import { saveActivityLog } from '../utils/cyberSecurity';

export const MessageScanner: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'discord' | 'chat'>('sms');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Student Preset Samples
  const presetSamples = [
    {
      title: 'FAFSA Refund Grant SMS',
      type: 'sms' as const,
      text: 'FAFSA ALERT: You have an unclaimed federal student aid supplemental grant of $1,250.00 pending direct deposit. Complete your identity and banking verification within 12 hours at: https://fafsa-disbursement-funds.xyz/claim to avoid forfeiture.',
    },
    {
      title: 'Canvas Emergency Account Deactivation',
      type: 'email' as const,
      text: 'Action Required: Your institutional Canvas LMS account was flagged for unauthorized access from an unrecognized device. All course submissions and midterm files will be locked in 3 hours. Verify your student credentials immediately at: https://canvas-univ-identity.support/sso',
    },
    {
      title: 'Discord Steam Account Ban Scam',
      type: 'discord' as const,
      text: 'Hey mate, I accidentally reported your Steam account for duplicate purchase fraud! The Valve support admin said your account will be permanently terminated unless you add them on Discord right now to verify you own the inventory!',
    },
    {
      title: 'Work-From-Home Student Assistant Scam',
      type: 'email' as const,
      text: 'University Department Job Offer: Professor Henderson is looking for a remote student research assistant ($450/week). We will mail you an advance cashier check to purchase home office equipment. Reply immediately with your full name, cell number, and home address.',
    },
  ];

  const handleScan = async (textToScan?: string) => {
    const text = textToScan || inputText;
    if (!text || text.trim().length === 0) {
      setErrorMsg('Please enter or paste a suspicious message to scan.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: text,
          messageType,
        }),
      });

      if (!response.ok) {
        throw new Error('Message analysis failed.');
      }

      const data = await response.json();
      const finalResult: MessageAnalysisResult = {
        ...data,
        timestamp: Date.now(),
      };
      setResult(finalResult);

      saveActivityLog({
        type: 'message_scan',
        title: `Message Scan: ${finalResult.threatType}`,
        detail: `Verdict: ${finalResult.verdict} (Risk: ${finalResult.riskScore}/100) · Impersonating: ${finalResult.impersonatedEntity}`,
        status: finalResult.verdict === 'SAFE' ? 'safe' : finalResult.verdict === 'MALICIOUS' ? 'alert' : 'warning',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error scanning message.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summary = `[CyberShield AI Message Threat Audit]
Verdict: ${result.verdict} (Risk Score: ${result.riskScore}/100)
Threat Category: ${result.threatType}
Impersonated Authority: ${result.impersonatedEntity}
Student Action: ${result.recommendedAction}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span>Social Engineering & Smishing Deception Scanner</span>
          <span aria-hidden="true">·</span>
          <span>Red Flag Linguistic Analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Fake Message & Smishing Detector
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Paste suspicious SMS text messages, deceptive school emails, or strange Discord DMs. Uncovers manufactured urgency triggers, fake authority impersonation, and fraudulent payment/credential lures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Message Content to Inspect
              </label>
              {/* Message Type Selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                {(['sms', 'email', 'discord'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMessageType(t)}
                    className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                      messageType === t
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Paste suspicious text message, email body, or DM here..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
            />

            <button
              type="button"
              onClick={() => handleScan()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Message...</span>
                </>
              ) : (
                <>
                  <MessageSquareWarning className="h-4 w-4" />
                  <span>Scan Message for Deception</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 rounded-lg">
                <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Presets */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 block">
                Load common student scam messages:
              </span>
              <div className="space-y-2">
                {presetSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(sample.text);
                      setMessageType(sample.type);
                      handleScan(sample.text);
                    }}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 text-left transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{sample.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{sample.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{sample.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Results */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-6">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    result.verdict === 'SAFE'
                      ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                      : result.verdict === 'MALICIOUS'
                      ? 'border-rose-500/40 bg-rose-950/60 text-rose-400'
                      : 'border-amber-500/40 bg-amber-950/60 text-amber-400'
                  }`}>
                    {result.verdict === 'SAFE' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      result.verdict === 'SAFE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : result.verdict === 'MALICIOUS'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      VERDICT: {result.verdict}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {result.threatType}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Deception Score</span>
                  <span className={`text-2xl font-bold font-mono tabular-nums ${
                    result.riskScore > 60
                      ? 'text-rose-400'
                      : result.riskScore > 25
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {result.riskScore}
                  </span>
                  <span className="text-[10px] text-slate-500">/ 100 risk</span>
                </div>
              </div>

              {/* Provider Engine Tag */}
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Analysis Provider:</span>
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 font-mono">
                  {result.isAiPowered ? <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> : <Cpu className="h-3.5 w-3.5 text-emerald-400" />}
                  {result.provider}
                </span>
              </div>

              {/* Impersonated Authority Callout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Impersonated Entity</span>
                  <div className="text-xs font-bold text-white truncate">
                    {result.impersonatedEntity || 'None / Direct Scammer'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Action Protocol</span>
                  <div className="text-xs font-bold text-emerald-400 truncate">
                    {result.verdict === 'SAFE' ? 'Safe to Read' : 'Do Not Engage'}
                  </div>
                </div>
              </div>

              {/* Psychological Triggers */}
              {result.psychologicalTriggers && result.psychologicalTriggers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Psychological Pressure Tactics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.psychologicalTriggers.map((trig, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded-md font-medium"
                      >
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Linguistic Analysis:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  {result.detailedAnalysis}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/20 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Recommended Student Defense Action:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {result.recommendedAction}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Share Threat Report'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-8 shadow-xl text-center space-y-4 py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                <MessageSquareWarning className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No Message Scanned Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Paste suspicious text or select one of the common student presets on the left to reveal social engineering indicators.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
