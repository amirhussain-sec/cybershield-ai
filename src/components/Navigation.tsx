import React, { useState } from 'react';
import { Shield, Menu, X, Bell, Sparkles, Sun, Moon, ShieldAlert } from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'learning'
  | 'url_checker'
  | 'message_scanner'
  | 'image_detector'
  | 'fake_news'
  | 'hacked_sos'
  | 'password_shield'
  | 'quiz'
  | 'chatbot'
  | 'guides';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenAlerts,
  unreadAlertsCount,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'learning', label: 'Academy & Blogs' },
    { id: 'url_checker', label: 'Phishing Links' },
    { id: 'message_scanner', label: 'Fake Messages' },
    { id: 'image_detector', label: 'AI Deepfakes' },
    { id: 'fake_news', label: 'Fake News' },
    { id: 'password_shield', label: 'Password Shield' },
    { id: 'quiz', label: 'Drills' },
  ];

  const handleNavClick = (id: NavTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#080c15]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Shield className="h-5 w-5" />
          </div>
          <span className="flex items-center gap-1.5 font-bold tracking-wide">
            CyberShield <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/30">AEGIS AI</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single-line, unboxed, hover states) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Theme Toggle + Threat Alerts Bell + Primary Action) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Campus Threat Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            aria-label="View Campus Threat Advisories"
            className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title="Campus Threat Advisories"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm font-mono">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Emergency Hacked SOS Quick Trigger */}
          <button
            onClick={() => handleNavClick('hacked_sos')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
              activeTab === 'hacked_sos'
                ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-400/40'
                : 'border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40'
            }`}
            title="Emergency Incident & Blast-Radius Containment"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">Hacked?</span>
            <span>SOS</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('chatbot')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'chatbot'
                ? 'bg-emerald-300 text-slate-950 shadow-emerald-500/20'
                : 'text-slate-950 bg-emerald-400 hover:bg-emerald-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chat Sentinel AI</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="xl:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090e1a] px-4 pt-3 pb-5 transition-colors">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
              <button
                onClick={() => handleNavClick('hacked_sos')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer shadow-sm shadow-rose-600/30"
              >
                <ShieldAlert className="h-4 w-4 animate-pulse" />
                <span>🚨 Emergency: I Think I&apos;ve Been Hacked! (SOS)</span>
              </button>
              <button
                onClick={() => handleNavClick('chatbot')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Launch Sentinel AI Chatbot</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAlerts();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 rounded-lg cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span>View {unreadAlertsCount} Campus Threat Advisories</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
