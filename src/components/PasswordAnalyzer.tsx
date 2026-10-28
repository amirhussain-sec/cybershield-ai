import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Cpu,
  ArrowRight,
  Info,
  HelpCircle,
  Hash,
  Sliders,
  Smartphone,
  Shield,
  Wifi
} from 'lucide-react';
import {
  analyzePasswordSecurity,
  generatePassphrase,
  generateComplexPassword,
  saveActivityLog,
  unlockBadge,
} from '../utils/cyberSecurity';
import { PasswordAnalysis, PasswordAdvice } from '../types';

export const PasswordAnalyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(analyzePasswordSecurity(''));
  const [advice, setAdvice] = useState<PasswordAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  // Generator State
  const [genPreset, setGenPreset] = useState<'mobile' | 'fortress' | 'complex' | 'wifi'>('fortress');
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Re-run analysis when input password changes
  useEffect(() => {
    const res = analyzePasswordSecurity(password);
    setAnalysis(res);
    setAdvice(null);

    if (res.entropy >= 75 && res.length >= 14) {
      unlockBadge('entropy_master');
    }
  }, [password]);

  // Initial generated password
  useEffect(() => {
    handleRegenerate();
  }, [genPreset]);

  const handleRegenerate = () => {
    if (genPreset === 'mobile') {
      // 3 words, easy to type on phone
      setGeneratedResult(generatePassphrase(3, '-', false));
    } else if (genPreset === 'fortress') {
      // 5 words, high entropy
      setGeneratedResult(generatePassphrase(5, '-', true));
    } else if (genPreset === 'wifi') {
      // No confusing characters (O, 0, I, l)
      const cleanChars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%*';
      let res = '';
      for (let i = 0; i < 18; i++) {
        res += cleanChars[Math.floor(Math.random() * cleanChars.length)];
      }
      setGeneratedResult(res);
    } else {
      // 20-character complex token
      setGeneratedResult(generateComplexPassword(20, true));
    }
    setCopied(false);
  };

  const handleCopyGenerated = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseGenerated = () => {
    setPassword(generatedResult);
    setShowPassword(true);
  };

  const handleFetchAiAdvice = async () => {
    if (!password || password.trim().length === 0) return;
    setLoadingAdvice(true);
    setAdviceError(null);

    try {
      const payload = {
        entropy: analysis.entropy,
        length: analysis.length,
        hasUpper: analysis.hasUpper,
        hasLower: analysis.hasLower,
        hasNumber: analysis.hasNumber,
        hasSymbol: analysis.hasSymbol,
        crackTimeEstimate: analysis.crackTimeEstimate,
        weaknessFlags: analysis.weaknessFlags,
      };

      const response = await fetch('/api/password-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve advice from security advisor.');
      }

      const data = await response.json();
      setAdvice(data);

      saveActivityLog({
        type: 'password_audit',
        title: `Password Security Audit (${analysis.length} chars)`,
        detail: `Entropy: ${analysis.entropy} bits · Tier: ${analysis.tier} · GPU resistance: ${analysis.crackTimeEstimate}`,
        status: analysis.score >= 70 ? 'safe' : analysis.score >= 40 ? 'warning' : 'alert',
      });
    } catch (err: any) {
      setAdviceError(err.message || 'Unable to load advice.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500';
    if (score >= 60) return 'text-cyan-400 bg-cyan-500';
    if (score >= 40) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span>Mathematical Shannon Entropy & GPU Resistance</span>
          <span aria-hidden="true">·</span>
          <span>Zero Plaintext Transmission</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Password Strength & Passphrase Studio
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Analyze password strength using Shannon entropy calculations ($E = L \times \log_2(R)$) and simulate brute-force cracking speeds against modern GPU clusters. Plain passwords are never stored or transmitted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Password Input & Analysis */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Enter Password or Passphrase to Test
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type a password or generate one below..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono tracking-wider pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Score Progress Bar & Tier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Security Score</span>
                <span className={`font-bold font-mono tracking-wide ${getScoreColor(analysis.score).split(' ')[0]}`}>
                  {analysis.tier} ({analysis.score}/100)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${getScoreColor(analysis.score).split(' ')[1]}`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* Character Composition Pills */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2 rounded-lg border ${
                analysis.hasLower
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500'
              }`}>
                a-z Lower
              </div>
              <div className={`p-2 rounded-lg border ${
                analysis.hasUpper
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500'
              }`}>
                A-Z Upper
              </div>
              <div className={`p-2 rounded-lg border ${
                analysis.hasNumber
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500'
              }`}>
                0-9 Numbers
              </div>
              <div className={`p-2 rounded-lg border ${
                analysis.hasSymbol
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500'
              }`}>
                !@# Symbols
              </div>
            </div>

            {/* Entropy & Crack Speeds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/50 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Shannon Entropy</span>
                  <Hash className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  {analysis.entropy} <span className="text-xs text-slate-400 font-normal">bits</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {analysis.entropy >= 75 ? 'Fortress grade (> 75 bits)' : 'Target >= 60 bits'}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/50 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Offline GPU Cluster Crack Time</span>
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums truncate">
                  {analysis.crackTimeEstimate}
                </div>
                <div className="text-[11px] text-slate-400">
                  Based on RTX 4090 cluster hashcat speeds
                </div>
              </div>
            </div>

            {/* Pattern Flags & Weaknesses */}
            {analysis.weaknessFlags.length > 0 && (
              <div className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-950/20 space-y-2">
                <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  Vulnerability Flags Detected:
                </span>
                <ul className="space-y-1">
                  {analysis.weaknessFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Security Coach Advice Trigger */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Receive personalized passphrase tips and threat prevention advice:
              </span>
              <button
                type="button"
                onClick={handleFetchAiAdvice}
                disabled={loadingAdvice || !password}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {loadingAdvice ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Get AI Advice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Advice Card */}
          {advice && (
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-[#0a1424] to-[#070d18] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">AI Cyber Coach Assessment</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  Tier: {advice.strengthTier}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {advice.coachSummary}
              </p>

              {advice.mnemonicTip && (
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/70 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-emerald-400">Student Memory Technique:</span>
                  <p>{advice.mnemonicTip}</p>
                </div>
              )}

              {advice.recommendations && advice.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-300">Key Recommendations:</span>
                  <ul className="space-y-1">
                    {advice.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {adviceError && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg">
              {adviceError}
            </div>
          )}
        </div>

        {/* Right Column: Student Password Studio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Student Password Studio</h2>
                <p className="text-xs text-slate-400 mt-0.5">Custom security presets for campus devices</p>
              </div>
              <KeyRound className="h-5 w-5 text-emerald-400" />
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGenPreset('fortress')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer space-y-1 ${
                  genPreset === 'fortress'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Fortress Diceware</span>
                </div>
                <p className="text-[10px] text-slate-400">5 Words · 85+ Bits Entropy</p>
              </button>

              <button
                type="button"
                onClick={() => setGenPreset('mobile')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer space-y-1 ${
                  genPreset === 'mobile'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Easy on Mobile</span>
                </div>
                <p className="text-[10px] text-slate-400">3 Words · Fast Touchscreen Typing</p>
              </button>

              <button
                type="button"
                onClick={() => setGenPreset('complex')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer space-y-1 ${
                  genPreset === 'complex'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Cpu className="h-3.5 w-3.5 text-teal-400" />
                  <span>20-Char Complex</span>
                </div>
                <p className="text-[10px] text-slate-400">Alphanumeric + Symbols</p>
              </button>

              <button
                type="button"
                onClick={() => setGenPreset('wifi')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer space-y-1 ${
                  genPreset === 'wifi'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Wifi className="h-3.5 w-3.5 text-amber-400" />
                  <span>Wi-Fi / Hotspot Safe</span>
                </div>
                <p className="text-[10px] text-slate-400">No ambiguous characters</p>
              </button>
            </div>

            {/* Generated Display Box */}
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/90 space-y-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Generated Safe Secret
              </span>
              <div className="font-mono text-sm font-bold text-emerald-300 break-all select-all tracking-wide py-1">
                {generatedResult}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCopyGenerated}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Generate another"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleUseGenerated}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Test Strength</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Practical Advice */}
            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/40 text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold text-slate-300 block">Student Password Rule:</span>
              <p className="leading-relaxed">
                Length beats complexity. A 5-word Diceware passphrase like <code className="text-emerald-400 font-mono">Falcon-Nebula-Beacon-Umbra-Vortex</code> takes billions of years to crack with 8x RTX 4090 GPUs, but takes under 5 seconds to type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
