import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  KeyRound,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Trash2,
  Lock,
  Trophy,
  Bot,
  MessageSquareWarning,
  Scan,
  Bell,
  Zap,
  Play,
  Layers,
  Newspaper,
  LifeBuoy,
  BookOpen
} from 'lucide-react';
import {
  calculateCyberReadinessScore,
  loadActivityLog,
  loadBadges,
} from '../utils/cyberSecurity';
import { ActivityLogItem, Badge, ThreatAlert } from '../types';
import { NavTab } from './Navigation';
import { DemoVideoPlayer } from './DemoVideoPlayer';
import { AutoSentinelBanner } from './AutoSentinelBanner';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAlerts: () => void;
  onOpenPremium: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAlerts,
  onOpenPremium,
}) => {
  const [readiness, setReadiness] = useState(calculateCyberReadinessScore());
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [showDemoVideo, setShowDemoVideo] = useState(true);

  useEffect(() => {
    setReadiness(calculateCyberReadinessScore());
    setActivities(loadActivityLog());
    setBadges(loadBadges());

    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
      })
      .catch(() => {});
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('cybershield_activity_log');
    setActivities([]);
  };

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const className = `h-5 w-5 ${unlocked ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`;
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'KeyRound':
        return <KeyRound className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Lock':
        return <Lock className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      default:
        return <ShieldAlert className={className} />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Autonomous Background Sentinel Daemon Strip */}
      <AutoSentinelBanner />

      {/* Emergency "I've Been Hacked" Fast-Action Hotline Banner */}
      <section className="rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Post-Compromise Containment Hub
              </span>
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Think your student portal, Google Drive, or device was breached?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Run the 60-second session killswitch, evaluate cloud blast-radius, recover deleted coursework, and generate formal professor incident extensions.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('hacked_sos')}
          className="whitespace-nowrap px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-md shadow-rose-600/30 transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-95"
        >
          <LifeBuoy className="h-4 w-4" />
          <span>Launch Emergency SOS</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

      {/* Top Demo Video Showcase (Collapsible / Toggleable) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Interactive Product Walkthrough & Live Lab Demo
            </h2>
          </div>
          <button
            onClick={() => setShowDemoVideo(!showDemoVideo)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {showDemoVideo ? 'Collapse Walkthrough' : 'Watch Interactive Demo'}
          </button>
        </div>

        {showDemoVideo && <DemoVideoPlayer onNavigate={onNavigate} />}
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#0c1322] dark:via-[#090e1a] dark:to-[#060a12] p-6 lg:p-10 shadow-xl transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Next-Gen Student Threat Defense</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Flash AI Multimodal Engine</span>
              <button
                onClick={onOpenPremium}
                className="inline-flex items-center gap-1 font-bold font-mono text-[11px] text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-2 py-0.5 rounded cursor-pointer transition-colors ml-1"
              >
                <Zap className="h-3 w-3 fill-current" />
                <span>Vanguard Pro Studio</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight" style={{ textWrap: 'balance' }}>
              Defend Your Digital Life. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                Empowered by Real AI.
              </span>
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Detect deceptive student portal phishing links, audit synthetic deepfake media, expose fake emergency SMS alerts, and calculate mathematical password entropy.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('learning')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Hacking Academy & Blogs</span>
              </button>
              <button
                onClick={() => onNavigate('url_checker')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <span>Inspect URL</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('message_scanner')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <span>Scan Message / SMS</span>
              </button>
              <button
                onClick={() => onNavigate('image_detector')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/40 hover:bg-teal-200 dark:hover:bg-teal-900/40 border border-teal-300 dark:border-teal-500/30 transition-colors cursor-pointer"
              >
                <Scan className="h-4 w-4" />
                <span>Deepfake Scanner</span>
              </button>
              <button
                onClick={() => onNavigate('chatbot')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/40 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 border border-cyan-300 dark:border-cyan-500/30 transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Chat Sentinel AI</span>
              </button>
            </div>
          </div>

          {/* Visual Hero Slot */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-slate-900/60 aspect-video lg:aspect-4/3 shadow-2xl group">
              <img
                src="/src/assets/images/cyber_shield_hero_1793183819019.jpg"
                alt="CyberShield holographic security emblem"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-[#080c15] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-200 dark:border-slate-800/80 text-xs flex items-center justify-between">
                <span className="text-slate-800 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Real-Time AI Telemetry
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] tabular-nums font-bold">
                  Active Guard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Readiness Score & Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Readiness Gauge Card */}
        <div className="md:col-span-5 lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 flex flex-col justify-between transition-colors shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Student Cyber Readiness</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Scorecard</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dynamic aggregate index based on completed security drills, password audits, and checklist hardening.
            </p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={314.16}
                  strokeDashoffset={314.16 - (314.16 * readiness.overallScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {readiness.overallScore}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {readiness.gradeTier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-center">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Phishing</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {readiness.phishingScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Passwords</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {readiness.passwordScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Hygiene</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                {readiness.hygieneScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards (Grid) */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => onNavigate('learning')}
            className="rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-500 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors">
                Ethical Hacking Academy & Blogs
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                5 hands-on courses (OWASP Top 10, Nmap, Wireshark, Bug Bounty), 6 research blogs with code snippets, simulated Kali sandbox & AI mentor.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Explore Curriculum & Blogs</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('url_checker')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-emerald-500/40 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Phishing URL Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scan suspicious links from campus emails, texts, or Discord. Evaluates 9 deterministic heuristics plus Gemini AI threat intel.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Inspect Link</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('hacked_sos')}
            className="rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-500 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-500/40 text-rose-600 dark:text-rose-400">
                <LifeBuoy className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-rose-700 dark:text-rose-300 group-hover:text-rose-600 dark:group-hover:text-rose-200 transition-colors">
                🚨 Hacked? Recovery Hub
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Emergency 60s session killswitch, blast-radius assessment, cloud trash file restore guide & formal professor incident extension letter generator.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Emergency Containment</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('fake_news')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-purple-500/40 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                <Newspaper className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Fake News & Rumor Verifier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Audit viral social headlines, scholarship hoaxes, campus rumors, and emotional clickbait using lateral reading benchmarks.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Verify Headline / Claim</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('message_scanner')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-amber-500/40 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                <MessageSquareWarning className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Fake Message & SMS Scanner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste suspicious text alerts, emergency bursar emails, or strange Discord DMs to reveal hidden persuasion traps.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Scan Message</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('image_detector')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-teal-500/40 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950/80 border border-teal-500/30 text-teal-600 dark:text-teal-400">
                <Scan className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Deepfake & Image Forensics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Multimodal AI audit for synthetic portraits, manipulated grade reports, and fake campus administrative notices.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Inspect Media</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('password_shield')}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-cyan-500/40 p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Password & Passphrase Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Shannon entropy calculator, GPU crack simulation, and student Diceware generators with mobile & Wi-Fi presets.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Studio Generator</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Campus Threat Advisories + Student Badges Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Campus Threat Advisories */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 space-y-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-rose-500" />
                <span>Live Campus Threat Advisories</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active phishing campaigns & lures targeting students</p>
            </div>
            <button
              onClick={onOpenAlerts}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/20 px-2.5 py-1 rounded cursor-pointer"
            >
              Open Alert Board →
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {alerts.slice(0, 3).map((threat) => (
              <div
                key={threat.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{threat.title}</h3>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    threat.severity === 'Critical'
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/20'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20'
                  }`}>
                    {threat.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Target: {threat.targetPlatform}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{threat.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges Showcase */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 space-y-4 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Student Defense Badges</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
              </p>
            </div>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>

          <div className="space-y-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                  badge.unlocked
                    ? 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-900/30 opacity-70'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                  badge.unlocked
                    ? 'border-emerald-400 dark:border-emerald-500/40 bg-emerald-100 dark:bg-emerald-950/60'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900'
                }`}>
                  {getBadgeIcon(badge.iconName, badge.unlocked)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-semibold ${badge.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {badge.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Log */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 space-y-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Local Activity History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stored locally on your browser for privacy</p>
          </div>
          {activities.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear local history"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No recent scans recorded. Test a URL or analyze a password to start tracking your activity.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activities.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      item.status === 'safe'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20'
                        : item.status === 'alert'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{item.detail}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
