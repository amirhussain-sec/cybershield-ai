import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Play,
  Pause,
  AlertTriangle,
  X,
  CheckCircle2,
  RefreshCw,
  Bell
} from 'lucide-react';

interface ToastAlert {
  id: string;
  type: 'neutralized' | 'verified' | 'advisory';
  title: string;
  detail: string;
  timestamp: string;
}

export const AutoSentinelBanner: React.FC = () => {
  const [isAutoEnabled, setIsAutoEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cybershield_autoguard_enabled');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [isSweeping, setIsSweeping] = useState(false);

  // Simulated automated events that Sentinel proactively neutralizes
  const simulatedEvents: Omit<ToastAlert, 'id' | 'timestamp'>[] = [
    {
      type: 'neutralized',
      title: 'Auto-Shield Intercepted Canvas SSO Lookalike',
      detail: 'Silently blocked a background HTTP beacon to canvas-univ-identity.support.',
    },
    {
      type: 'verified',
      title: 'Automated Wi-Fi Certificate Prober',
      detail: 'Verified cryptographic TLS integrity of local network connection.',
    },
    {
      type: 'advisory',
      title: 'Disbursement SMS Lure Detected in Regional Area',
      detail: 'Added 1 new smishing fingerprint to the local threat detection cache.',
    },
    {
      type: 'neutralized',
      title: 'Compromised Discord Executable Quarantined',
      detail: 'Flagged suspicious .scr token payload before execution.',
    },
  ];

  const toggleAutoGuard = () => {
    const next = !isAutoEnabled;
    setIsAutoEnabled(next);
    try {
      localStorage.setItem('cybershield_autoguard_enabled', String(next));
    } catch {}
  };

  const handleRunManualSweep = () => {
    setIsSweeping(true);
    setTimeout(() => {
      setIsSweeping(false);
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const newToast: ToastAlert = {
        ...randomEvent,
        id: `toast_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 3));
    }, 1200);
  };

  // Periodic automated background sweeps if enabled
  useEffect(() => {
    if (!isAutoEnabled) return;

    const timer = setInterval(() => {
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const newToast: ToastAlert = {
        ...randomEvent,
        id: `toast_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 3));
    }, 45000); // Trigger an autonomous shield event every 45s

    return () => clearInterval(timer);
  }, [isAutoEnabled]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Autonomous Guard Status Strip */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] px-4 py-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
            isAutoEnabled
              ? 'border-emerald-500/30 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Autonomous Threat Sentinel
              </span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                isAutoEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {isAutoEnabled ? 'Active Daemon' : 'Paused'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Proactive background link inspection, Wi-Fi integrity prober & token theft auto-interception
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRunManualSweep}
            disabled={isSweeping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSweeping ? 'animate-spin' : ''}`} />
            <span>{isSweeping ? 'Probing...' : 'Run Automated Sweep'}</span>
          </button>
          <button
            type="button"
            onClick={toggleAutoGuard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isAutoEnabled
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {isAutoEnabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isAutoEnabled ? 'Pause Auto-Guard' : 'Activate Auto-Guard'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Proactive Toast Notifications */}
      {toasts.length > 0 && (
        <div className="space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
                toast.type === 'neutralized'
                  ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : toast.type === 'advisory'
                  ? 'border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                  : 'border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {toast.type === 'neutralized' && <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                  {toast.type === 'advisory' && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                  {toast.type === 'verified' && <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{toast.title}</span>
                    <span className="text-[10px] opacity-75 font-mono">{toast.timestamp}</span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">{toast.detail}</p>
                </div>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="opacity-70 hover:opacity-100 p-1 cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
