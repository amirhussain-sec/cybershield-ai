import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  CheckSquare,
  Square,
  Copy,
  Check,
  Download,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  LifeBuoy,
  KeyRound,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  Mail,
  GraduationCap
} from 'lucide-react';
import { saveActivityLog } from '../utils/cyberSecurity';

interface RecoveryStep {
  id: string;
  phase: string;
  title: string;
  instruction: string;
  isDone: boolean;
}

interface HackedRecoveryCenterProps {
  onOpenChatbot?: () => void;
}

export const HackedRecoveryCenter: React.FC<HackedRecoveryCenterProps> = ({ onOpenChatbot }) => {
  // Blast Radius Selector
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([
    'school_sso',
    'primary_email',
  ]);

  // AI Triage State
  const [scenarioInput, setScenarioInput] = useState('');
  const [triagePlan, setTriagePlan] = useState<any | null>(null);
  const [loadingTriage, setLoadingTriage] = useState(false);

  // Academic Incident Letter State
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [studentId, setStudentId] = useState('STU-94021');
  const [department, setDepartment] = useState('Computer Science Faculty / Academic Registrar');
  const [incidentType, setIncidentType] = useState('Unauthorized Student Portal & Email Access');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Interactive Checklist
  const [steps, setSteps] = useState<RecoveryStep[]>([
    {
      id: 'step-kill-sessions',
      phase: 'Phase 1: Killswitch',
      title: 'Sever All Active Login Sessions on Secondary Clean Device',
      instruction: 'Do not use the compromised laptop yet. On your clean smartphone or a library computer, navigate to Google/Apple/Microsoft "Active Devices" and click "Sign out of all other sessions".',
      isDone: false,
    },
    {
      id: 'step-secure-email',
      phase: 'Phase 2: Credentials',
      title: 'Secure Primary Recovery Email First (The Master Key)',
      instruction: 'Change your primary personal email password to a fresh 16+ character Diceware passphrase. If an attacker controls your email, they can reset every other service.',
      isDone: false,
    },
    {
      id: 'step-turn-on-mfa',
      phase: 'Phase 2: Credentials',
      title: 'Register an Authenticator App (Google/Duo) & Save Backup Codes',
      instruction: 'Switch from SMS 2FA to an Authenticator app (like Google Authenticator). Print or write down your 10 offline recovery codes.',
      isDone: false,
    },
    {
      id: 'step-revoke-oauth',
      phase: 'Phase 3: Cleanup',
      title: 'Audit & Revoke Third-Party OAuth App Permissions',
      instruction: 'Check "Third-party apps with account access" in Google, Discord, and Canvas. Revoke any unrecognized integrations or tokens.',
      isDone: false,
    },
    {
      id: 'step-notify-it',
      phase: 'Phase 4: Academic SOS',
      title: 'Notify Campus IT Desk & Submit Academic Incident Notice',
      instruction: 'Send the generated Academic Incident Letter to your professors and student helpdesk to protect assignment grades and exam deadlines.',
      isDone: false,
    },
    {
      id: 'step-check-bursar',
      phase: 'Phase 4: Academic SOS',
      title: 'Check Financial Aid & Direct Deposit Routing',
      instruction: 'Log in to your campus bursar portal and confirm your direct deposit bank account number was not altered by the attacker.',
      isDone: false,
    },
  ]);

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s))
    );
  };

  const completedStepsCount = steps.filter((s) => s.isDone).length;
  const recoveryProgress = Math.round((completedStepsCount / steps.length) * 100);

  const toggleAccountAsset = (assetId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(assetId)
        ? prev.filter((a) => a !== assetId)
        : [...prev, assetId]
    );
  };

  const handleRunAiTriage = async () => {
    if (!scenarioInput.trim()) return;
    setLoadingTriage(true);

    try {
      const res = await fetch('/api/hack-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioText: scenarioInput.trim(),
          affectedAccounts: selectedAccounts,
        }),
      });

      if (!res.ok) throw new Error('Failed to run triage');
      const data = await res.json();
      setTriagePlan(data.triage);

      saveActivityLog({
        type: 'recovery_initiated',
        title: 'Emergency Compromise Triage Initiated',
        detail: `Triage Level: ${data.triage?.triageLevel || 'HIGH'} · Affected: ${selectedAccounts.join(', ')}`,
        status: 'alert',
      });
    } catch (e) {
      console.warn('Triage error:', e);
    } finally {
      setLoadingTriage(false);
    }
  };

  const handleGenerateLetter = async () => {
    try {
      const res = await fetch('/api/generate-incident-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentId,
          courseOrDept: department,
          incidentType,
          dateOfCompromise: new Date().toLocaleDateString(),
          affectedServices: selectedAccounts.join(', '),
          details: scenarioInput || 'Credential compromise and unauthorized session takeover.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedLetter(data.reportDocument);
      }
    } catch (e) {
      console.warn('Letter generation error:', e);
    }
  };

  const handleCopyLetter = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownloadLetter = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Cyber_Incident_Report_${studentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Emergency Header Banner */}
      <div className="rounded-2xl border border-rose-300 dark:border-rose-500/40 bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-rose-950/40 dark:via-[#0c121e] dark:to-rose-950/20 p-6 sm:p-8 shadow-xl space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/30">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Emergency Post-Compromise Recovery Center
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold">
                  SOS READY
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                "I've Been Hacked" — Incident Recovery Hub
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Containment Progress</span>
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
              {recoveryProgress}% Secured
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
          <strong>Do not panic.</strong> Account compromises happen to millions of students every semester. Follow this structured triage protocol to stop data leakage, kick out attackers, and protect your academic records.
        </p>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-300 rounded-full"
            style={{ width: `${recoveryProgress}%` }}
          />
        </div>
      </div>

      {/* Grid: Blast Radius Calculator & Immediate Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Blast Radius Assessment & AI Triage */}
        <div className="lg:col-span-6 space-y-6">
          {/* Asset Selection */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                <span>1. Select Compromised Assets (Blast Radius)</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedAccounts.length} Services Flagged
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check all accounts or devices that showed strange activity or unauthorized logins:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'school_sso', label: 'School SSO / Canvas', icon: GraduationCap },
                { id: 'primary_email', label: 'Primary Email Account', icon: Mail },
                { id: 'discord_steam', label: 'Discord / Steam / Gaming', icon: Globe },
                { id: 'banking_aid', label: 'Bursar & Financial Aid', icon: CreditCard },
                { id: 'phone_sim', label: 'Phone Number / SIM', icon: Smartphone },
                { id: 'device_pc', label: 'Laptop / PC Malware', icon: Lock },
              ].map((item) => {
                const isSelected = selectedAccounts.includes(item.id);
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAccountAsset(item.id)}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-rose-400 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 shrink-0 text-rose-500" />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Emergency Triage Input */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 shadow-xl space-y-4 transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span>2. Describe What Happened (AI Emergency Triage)</span>
            </h2>

            <textarea
              rows={4}
              value={scenarioInput}
              onChange={(e) => setScenarioInput(e.target.value)}
              placeholder="e.g. Someone logged into my Discord from another country and sent scam links to all my servers, and now my email says my password was changed..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleRunAiTriage}
              disabled={loadingTriage || !scenarioInput.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors cursor-pointer shadow-md shadow-rose-500/20"
            >
              {loadingTriage ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Formulating Triage Plan...</span>
                </>
              ) : (
                <>
                  <LifeBuoy className="h-4 w-4" />
                  <span>Generate Customized Triage Plan</span>
                </>
              )}
            </button>

            {onOpenChatbot && (
              <button
                type="button"
                onClick={onOpenChatbot}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-500/30 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Need immediate guidance? Ask Sentinel AI directly</span>
              </button>
            )}

            {/* AI Triage Output */}
            {triagePlan && (
              <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/20 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-500/30">
                  <span className="font-bold text-rose-800 dark:text-rose-300">
                    Emergency Triage Directive:
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100 font-bold">
                    {triagePlan.triageLevel}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                    ⚡ First 60 Seconds Action:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {triagePlan.firstMinuteAction}
                  </p>
                </div>

                {triagePlan.orderedRecoverySteps && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Ordered Execution Steps:
                    </span>
                    {triagePlan.orderedRecoverySteps.map((step: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-2"
                      >
                        <span className="h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {step.step || idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {step.target}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 block mt-0.5">
                            {step.instruction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Step-by-Step Recovery Checklist */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-500" />
                <span>3. Step-by-Step Containment Checklist</span>
              </h2>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {completedStepsCount} / {steps.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    step.isDone
                      ? 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-slate-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-emerald-500">
                    {step.isDone ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${step.isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {step.phase}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 leading-relaxed ${step.isDone ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {step.instruction}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Academic Incident Letter Generator (Grade & Deadline Defense) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Cybersecurity Incident Letter Generator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Missed a deadline or locked out of Canvas during an exam? Generate a formal, verifiable incident letter for your professors and university registrar.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateLetter}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Generate Official Letter</span>
          </button>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student ID Number
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient Faculty / Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Letter Output Display */}
        {generatedLetter && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Official Letter Preview:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {copiedLetter ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLetter ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadLetter}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <pre className="p-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {generatedLetter}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
