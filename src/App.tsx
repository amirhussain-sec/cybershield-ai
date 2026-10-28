import React, { useState, useEffect } from 'react';
import { Navigation, NavTab } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { UrlChecker } from './components/UrlChecker';
import { MessageScanner } from './components/MessageScanner';
import { ImageDetector } from './components/ImageDetector';
import { FakeNewsDetector } from './components/FakeNewsDetector';
import { HackedRecoveryCenter } from './components/HackedRecoveryCenter';
import { StudentLearningHub } from './components/StudentLearningHub';
import { PasswordAnalyzer } from './components/PasswordAnalyzer';
import { CyberQuiz } from './components/CyberQuiz';
import { SecurityTips } from './components/SecurityTips';
import { AiChatbot } from './components/AiChatbot';
import { AlertsDrawer } from './components/AlertsDrawer';
import { PremiumModelModal } from './components/PremiumModelModal';
import { Shield, Sparkles, Bell, Zap, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(4);

  // Theme State: 'dark' or 'light' (defaults to 'dark' with persistence)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('cybershield_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // Default to dark mode
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('cybershield_theme', theme);
    } catch (e) {
      console.warn('Failed saving theme preference:', e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial fetch of unread alert count
  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setUnreadAlertsCount(data.alerts.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c15] text-slate-900 dark:text-slate-100 cyber-grid transition-colors duration-200">
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
          />
        )}
        {activeTab === 'learning' && (
          <StudentLearningHub onOpenChatbot={() => setActiveTab('chatbot')} />
        )}
        {activeTab === 'url_checker' && <UrlChecker />}
        {activeTab === 'message_scanner' && <MessageScanner />}
        {activeTab === 'image_detector' && <ImageDetector />}
        {activeTab === 'fake_news' && <FakeNewsDetector />}
        {activeTab === 'hacked_sos' && (
          <HackedRecoveryCenter onOpenChatbot={() => setActiveTab('chatbot')} />
        )}
        {activeTab === 'password_shield' && <PasswordAnalyzer />}
        {activeTab === 'quiz' && <CyberQuiz />}
        {activeTab === 'chatbot' && <AiChatbot />}
        {activeTab === 'guides' && <SecurityTips />}
      </main>

      {/* Slide-over Threat Alerts Panel */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onUnreadChange={(count) => setUnreadAlertsCount(count)}
      />

      {/* Premium Vanguard Pro Studio Modal */}
      <PremiumModelModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060911] py-8 text-xs text-slate-500 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">CyberShield Aegis AI</span>
            <span>· Student Threat Defense & Recovery Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('learning')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
            >
              Academy & Blogs
            </button>
            <button
              onClick={() => setActiveTab('url_checker')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Phishing Links
            </button>
            <button
              onClick={() => setActiveTab('message_scanner')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Fake Messages
            </button>
            <button
              onClick={() => setActiveTab('fake_news')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Fake News
            </button>
            <button
              onClick={() => setActiveTab('hacked_sos')}
              className="text-rose-600 dark:text-rose-400 hover:underline transition-colors cursor-pointer font-bold flex items-center gap-1"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>🚨 Hacked SOS</span>
            </button>
            <button
              onClick={() => setActiveTab('image_detector')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              AI Deepfakes
            </button>
            <button
              onClick={() => setActiveTab('password_shield')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Passphrase Studio
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Sparkles className="h-3 w-3" />
              <span>Sentinel AI</span>
            </button>
            <button
              onClick={() => setIsPremiumOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Zap className="h-3 w-3" />
              <span>Vanguard Pro</span>
            </button>
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Bell className="h-3 w-3" />
              <span>Campus Alerts</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Zero-Knowledge Privacy · Student Safety First
          </div>
        </div>
      </footer>
    </div>
  );
}
