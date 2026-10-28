import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Zap,
  Lock,
  Layers,
  Award
} from 'lucide-react';

interface PremiumModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModelModal: React.FC<PremiumModelModalProps> = ({ isOpen, onClose }) => {
  const [homographFilter, setHomographFilter] = useState(true);
  const [clipboardAutoScan, setClipboardAutoScan] = useState(true);
  const [deepfakePreCheck, setDeepfakePreCheck] = useState(true);
  const [dormWifiProber, setDormWifiProber] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  CyberShield Vanguard Pro
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  ALL-ACCESS PASS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Premium AI Model Engine & Autonomous Defense Configurations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Model Spotlight */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/30 dark:to-teal-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                Active Model Engine
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Gemini 3.8 Flash (Multimodal)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Provides real-time threat intelligence for phishing heuristics, deepfake forensic media audits, and zero-knowledge password security analysis.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Multimodal Forensics: ON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Persistent Memory: ON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>9-Rule Heuristics: ON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero Data Logging: ON</span>
              </div>
            </div>
          </div>

          {/* Autonomous Shield Capabilities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-emerald-500" />
              <span>Proactive Defense Automation Toggles</span>
            </h3>

            <div className="space-y-2.5">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Aggressive Punycode & Homograph Interceptor
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-blocks internationalized character domains masquerading as university portals.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHomographFilter(!homographFilter)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    homographFilter ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Autonomous Background Link Sweep
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Proactively probes clipboard URLs against known phishing signatures.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setClipboardAutoScan(!clipboardAutoScan)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    clipboardAutoScan ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Deepfake Visual Specular & Raster Filter
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Examines pixel antialiasing and specular eye reflections for synthetic manipulation.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDeepfakePreCheck(!deepfakePreCheck)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    deepfakePreCheck ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-900/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Rogue Campus Wi-Fi & Pineapple Guard
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Alerts immediately if an open hotspot demands installing custom root certificates.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDormWifiProber(!dormWifiProber)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    dormWifiProber ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>
            </div>
          </div>

          {/* Student Status Callout */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Student Plan: <strong>Campus Scholar All-Access Pass</strong>
              </span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% Free</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {savedSuccess ? 'Preferences saved successfully!' : 'All features active & unlocked'}
          </span>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm cursor-pointer"
          >
            {savedSuccess ? 'Saved!' : 'Save Pro Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
