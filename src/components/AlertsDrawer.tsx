import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  ShieldAlert,
  AlertTriangle,
  Send,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { ThreatAlert } from '../types';
import { saveActivityLog } from '../utils/cyberSecurity';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  onUnreadChange,
}) => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<'Phishing Wave' | 'Malware Lure' | 'Credential Breach' | 'Campus Advisory'>('Phishing Wave');
  const [reportTarget, setReportTarget] = useState('Campus Email');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        onUnreadChange?.(data.alerts?.length || 0);
      }
    } catch (e) {
      console.warn('Failed fetching alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim()) return;

    setSubmittingReport(true);
    try {
      const res = await fetch('/api/report-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle.trim(),
          category: reportCategory,
          targetPlatform: reportTarget,
          description: reportDesc.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          setAlerts((prev) => [data.alert, ...prev]);
        }
        setReportSuccess(true);
        setReportTitle('');
        setReportDesc('');

        saveActivityLog({
          type: 'threat_reported',
          title: `Reported Campus Incident: ${reportTitle}`,
          detail: `Category: ${reportCategory} · Alert submitted to community feed`,
          status: 'warning',
        });

        setTimeout(() => {
          setReportSuccess(false);
          setShowReportForm(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error reporting threat:', err);
    } finally {
      setSubmittingReport(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div
        className="w-full max-w-md h-full bg-[#0c121e] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950 border border-rose-500/30 text-rose-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Campus Threat Advisories
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/20">
                  {alerts.length} Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Real-time alerts for student accounts and networks</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchAlerts}
              aria-label="Refresh alerts"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close alerts panel"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Have you encountered a new scam?</span>
          <button
            type="button"
            onClick={() => setShowReportForm(!showReportForm)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{showReportForm ? 'View Active Alerts' : 'Report Incident'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {showReportForm ? (
            /* Student Report Form */
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-white block">Report a Campus Threat</span>
                <p className="text-[11px] text-slate-400">
                  Submit deceptive emails, fake text messages, or rogue Wi-Fi access points to alert your classmates.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Fake Bookstore 50% Off Scholarship Link"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Phishing Wave">Phishing Wave</option>
                    <option value="Malware Lure">Malware Lure</option>
                    <option value="Credential Breach">Credential Breach</option>
                    <option value="Campus Advisory">Campus Advisory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Platform
                  </label>
                  <input
                    type="text"
                    value={reportTarget}
                    onChange={(e) => setReportTarget(e.target.value)}
                    placeholder="e.g. Student Email (.edu)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Red Flags
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe the message, sender address, or link you observed..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {reportSuccess && (
                <div className="flex items-center gap-2 p-3 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Report submitted successfully to the threat board!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submittingReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submittingReport ? (
                  <>
                    <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting Threat...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Broadcast Threat Alert</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Alerts List */
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    alert.severity === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      : alert.severity === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {alert.severity} Risk
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {alert.publishedAt}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white">{alert.title}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.description}
                </p>

                <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-[11px] text-slate-200">
                  <strong className="text-emerald-400 font-semibold block">Countermeasure:</strong>
                  {alert.mitigation}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                  <span>Target: {alert.targetPlatform}</span>
                  <span>{alert.reportedCount} Students Flagged</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
