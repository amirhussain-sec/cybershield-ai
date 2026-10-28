import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Cpu,
  Globe,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { UrlAnalysisResult } from '../types';
import { saveActivityLog, unlockBadge, loadBadges } from '../utils/cyberSecurity';

export const UrlChecker: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sample student links to quickly test
  const sampleUrls = [
    {
      label: 'Legitimate Canvas SSO',
      url: 'https://canvas.instructure.com/login/canvas',
      type: 'Safe',
    },
    {
      label: 'Fake Student Aid Grant Scam',
      url: 'http://fafsa-disbursement-funds.xyz/claim-grant?user=student',
      type: 'Malicious',
    },
    {
      label: 'Discord Free Nitro Token Trap',
      url: 'http://192.168.1.105/free-nitro@discord-nitro-gift.work/login',
      type: 'Malicious',
    },
    {
      label: 'Suspicious Subdomain Stacking',
      url: 'https://student-portal.auth.verification.service.account-update.buzz/login',
      type: 'Suspicious',
    },
  ];

  const handleScan = async (urlToScan?: string) => {
    const targetUrl = urlToScan || inputUrl;
    if (!targetUrl || targetUrl.trim().length === 0) {
      setErrorMsg('Please enter a website link or URL to analyze.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to inspect link.');
      }

      const data = await response.json();
      const finalResult: UrlAnalysisResult = {
        ...data,
        timestamp: Date.now(),
      };
      setResult(finalResult);

      // Save to local activity log
      saveActivityLog({
        type: 'url_check',
        title: `URL Inspection: ${finalResult.hostDetails.host}`,
        detail: `Verdict: ${finalResult.verdict} (Risk: ${finalResult.riskScore}/100) · ${finalResult.threatType}`,
        status: finalResult.verdict === 'SAFE' ? 'safe' : finalResult.verdict === 'MALICIOUS' ? 'alert' : 'warning',
      });

      // Track URL scans count to unlock Phishing Detective badge
      const currentLog = JSON.parse(localStorage.getItem('cybershield_activity_log') || '[]');
      const urlChecksCount = currentLog.filter((item: any) => item.type === 'url_check').length;
      if (urlChecksCount >= 3) {
        unlockBadge('phish_hunter');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error scanning link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const summary = `[CyberShield AI Link Inspection]
URL: ${result.url}
Verdict: ${result.verdict} (Risk Score: ${result.riskScore}/100)
Threat Category: ${result.threatType}
Provider: ${result.provider}
Student Action: ${result.studentAction}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span>Phishing & Deceptive Link Inspection</span>
          <span aria-hidden="true">·</span>
          <span>Zero Fake Threat Claims</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Phishing URL Inspector
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Verify suspect links from student emails, SMS messages, Canvas notifications, or Discord DMs. Every analysis transparently details whether it was evaluated using the <strong>Gemini 3.8 Flash AI Model</strong> or <strong>Local Deterministic Heuristic Engine</strong>.
        </p>
      </div>

      {/* URL Input Box */}
      <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="space-y-4"
        >
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Paste Suspect URL or Domain
          </label>
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Globe className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. https://student-aid-verification.xyz/login or paste email link"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-colors shadow-sm disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Inspecting Link...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Inspect with CyberShield AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 rounded-lg">
            <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Sample Links */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
            <span>Try sample student scenarios:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputUrl(sample.url);
                  handleScan(sample.url);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>{sample.label}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
                  sample.type === 'Safe'
                    ? 'text-emerald-400 bg-emerald-950'
                    : sample.type === 'Malicious'
                    ? 'text-rose-400 bg-rose-950'
                    : 'text-amber-400 bg-amber-950'
                }`}>
                  {sample.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="rounded-xl border border-slate-800 bg-[#0c121e] overflow-hidden shadow-2xl space-y-6 p-6">
          {/* Header Status Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                result.verdict === 'SAFE'
                  ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                  : result.verdict === 'MALICIOUS'
                  ? 'border-rose-500/40 bg-rose-950/60 text-rose-400'
                  : 'border-amber-500/40 bg-amber-950/60 text-amber-400'
              }`}>
                {result.verdict === 'SAFE' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : result.verdict === 'MALICIOUS' ? (
                  <XCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded tracking-wide font-mono ${
                    result.verdict === 'SAFE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : result.verdict === 'MALICIOUS'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    VERDICT: {result.verdict}
                  </span>
                  <span className="text-xs text-slate-400 font-mono truncate max-w-xs">
                    {result.hostDetails.host}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {result.threatType}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Provider Engine Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300">
                {result.isAiPowered ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Gemini 3.8 Flash AI</span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Local Heuristic Engine</span>
                  </>
                )}
              </div>

              {/* Copy Report Button */}
              <button
                onClick={handleCopyAnalysis}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Share Report'}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-1">
              <span className="text-xs text-slate-400">Risk Severity Score</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-mono tabular-nums ${
                  result.riskScore > 60
                    ? 'text-rose-400'
                    : result.riskScore > 25
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {result.riskScore}
                </span>
                <span className="text-xs text-slate-500">/ 100 max risk</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-1">
              <span className="text-xs text-slate-400">Targeted Student Service</span>
              <div className="text-sm font-semibold text-white truncate">
                {result.targetedService || 'Generic Web Asset'}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-1">
              <span className="text-xs text-slate-400">Protocol & Encryption</span>
              <div className="text-sm font-mono text-slate-300 flex items-center gap-1.5">
                {result.hostDetails.protocol === 'https' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> HTTPS (TLS Encrypted)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> HTTP (Plaintext Insecure)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Analysis & Guidance Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Analysis Description */}
            <div className="p-5 rounded-lg border border-slate-800/80 bg-slate-900/50 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Threat Intelligence Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.technicalAnalysis}
              </p>

              {result.keyRedFlags && result.keyRedFlags.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-rose-400">Identified Indicators:</span>
                  <ul className="space-y-1.5">
                    {result.keyRedFlags.map((flag, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommended Student Action */}
            <div className="p-5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Student Safety Protocol</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {result.studentAction}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-500/20 text-[11px] text-slate-400">
                Reminder: University IT desks will never ask for your password via email, SMS, or Discord DM.
              </div>
            </div>
          </div>

          {/* 9-Point Heuristic Rule Matrix */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Heuristic Inspection Audit (9 Structural Rules)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.heuristics.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    h.triggered && h.severity !== 'safe'
                      ? 'border-rose-500/30 bg-rose-950/20 text-slate-300'
                      : 'border-slate-800/80 bg-slate-900/30 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {h.triggered && h.severity !== 'safe' ? (
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">{h.rule}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{h.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
