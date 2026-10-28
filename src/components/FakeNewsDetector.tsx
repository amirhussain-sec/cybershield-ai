import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Cpu,
  BookOpen,
  ExternalLink,
  ShieldAlert,
  Compass,
  Copy,
  Check
} from 'lucide-react';
import { NewsAnalysisResult } from '../types';
import { saveActivityLog } from '../utils/cyberSecurity';

export const FakeNewsDetector: React.FC = () => {
  const [claimText, setClaimText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Common student viral rumors and misinformation samples
  const viralPresets = [
    {
      title: 'AI Replacing All College Degrees by Fall 2026',
      claim: 'Leaked Department of Education memo claims universities will eliminate standard bachelor degrees by Fall 2026 in favor of 3-month AI certification bootcamps.',
      category: 'Academic Rumor',
    },
    {
      title: 'Campus Wi-Fi Reading Private Encrypted WhatsApp Chats',
      claim: 'Campus IT administrator reveals that university networks are secretly intercepting and decrypting all private end-to-end encrypted WhatsApp and iMessage communications of students.',
      category: 'Technical Misconception',
    },
    {
      title: 'Overnight Total Student Loan Erasure Executive Decree',
      claim: 'Urgent emergency executive decree erases 100% of all federal and private student loans with zero application required, click here before the server crashes.',
      category: 'Financial Phishing Hook',
    },
  ];

  const handleScanNews = async (textToScan?: string) => {
    const text = textToScan || claimText;
    if (!text || text.trim().length === 0) {
      setErrorMsg('Please enter a headline, article text, or viral claim to analyze.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimOrArticle: text.trim(),
          sourceUrl: sourceUrl.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('News analysis request failed.');
      }

      const data = await response.json();
      const finalResult: NewsAnalysisResult = {
        ...data,
        timestamp: Date.now(),
      };
      setResult(finalResult);

      saveActivityLog({
        type: 'news_check',
        title: `Fact-Check: "${text.slice(0, 35)}..."`,
        detail: `Verdict: ${finalResult.verdict.replace(/_/g, ' ')} (Credibility: ${finalResult.credibilityScore}/100) · Bias: ${finalResult.biasRating}`,
        status: finalResult.credibilityScore >= 75 ? 'safe' : finalResult.credibilityScore <= 35 ? 'alert' : 'warning',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing news analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `[CyberShield AI Fact-Check & Media Audit]
Claim: "${result.headlineOrClaim}"
Verdict: ${result.verdict.replace(/_/g, ' ')} (Credibility: ${result.credibilityScore}/100)
Sensationalism: ${result.sensationalismLevel} | Bias: ${result.biasRating}
Factual Consensus: ${result.evidenceSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span>AI Media Literacy & Viral Disinformation Scanner</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
          Fake News & Misinformation Detector
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Verify viral social headlines, alarming TikTok claims, unverified academic rumors, and fabricated screenshots. Detects sensationalism, anonymous attribution fallacies, and guides you in practicing lateral reading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 shadow-xl space-y-5 transition-colors">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Headline, Social Post, or Viral Claim
              </label>
              <textarea
                rows={5}
                value={claimText}
                onChange={(e) => {
                  setClaimText(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Paste news headline, tweet, TikTok claim, or forwarded rumor..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Source URL or Platform (Optional)
              </label>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="e.g. twitter.com/post/123 or tiktok link"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              type="button"
              onClick={() => handleScanNews()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Fact-Checking Claim...</span>
                </>
              ) : (
                <>
                  <Compass className="h-4 w-4" />
                  <span>Analyze Claim Credibility</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/30 rounded-lg">
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Presets */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Test common student viral claims:
              </span>
              <div className="space-y-2">
                {viralPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setClaimText(preset.claim);
                      handleScanNews(preset.claim);
                    }}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {preset.claim}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fact-Check Results */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 shadow-xl space-y-6 transition-colors">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    result.verdict === 'HIGH_CREDIBILITY'
                      ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : result.verdict === 'FABRICATED_FAKE_NEWS'
                      ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      : 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}>
                    {result.verdict === 'HIGH_CREDIBILITY' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : result.verdict === 'FABRICATED_FAKE_NEWS' ? (
                      <XCircle className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      result.verdict === 'HIGH_CREDIBILITY'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                        : result.verdict === 'FABRICATED_FAKE_NEWS'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                    }`}>
                      {result.verdict.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      Fact-Check Verdict
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Credibility Score</span>
                  <span className={`text-2xl font-bold font-mono tabular-nums ${
                    result.credibilityScore > 70
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : result.credibilityScore > 40
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {result.credibilityScore}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 100</span>
                </div>
              </div>

              {/* Provider Tag */}
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Fact-Check Engine:</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-300 flex items-center gap-1.5 font-mono">
                  {result.isAiPowered ? <Sparkles className="h-3.5 w-3.5 text-cyan-500" /> : <Cpu className="h-3.5 w-3.5 text-emerald-500" />}
                  {result.provider}
                </span>
              </div>

              {/* Sensationalism & Bias Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-0.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Sensationalism Level</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {result.sensationalismLevel}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-0.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Bias & Tone</span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    {result.biasRating}
                  </div>
                </div>
              </div>

              {/* Factual Consensus Summary */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Factual Consensus & Evidence:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {result.evidenceSummary}
                </p>
              </div>

              {/* Primary Red Flags */}
              {result.primaryRedFlags && result.primaryRedFlags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Spotted Misinformation Red Flags:
                  </span>
                  <div className="space-y-1.5">
                    {result.primaryRedFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-lg flex items-start gap-2"
                      >
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Lateral Reading Steps */}
              {result.studentVerificationSteps && result.studentVerificationSteps.length > 0 && (
                <div className="p-4 rounded-lg border border-emerald-300 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 space-y-2 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Lateral Reading & Student Verification Protocol:
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {result.studentVerificationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Share Fact-Check Report'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-8 shadow-xl text-center space-y-4 py-16 transition-colors">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
                <Newspaper className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Claim Analyzed Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Paste a news headline, social post, or select a student rumor on the left to evaluate its credibility.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
