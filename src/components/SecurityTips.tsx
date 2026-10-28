import React, { useState, useEffect } from 'react';
import {
  Lock,
  Search,
  CheckSquare,
  Square,
  BookOpen,
  Shield,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SECURITY_GUIDES } from '../data/tipsData';
import { loadChecklist, toggleChecklistItem } from '../utils/cyberSecurity';
import { StudentChecklistItem } from '../types';

export const SecurityTips: React.FC = () => {
  const [checklist, setChecklist] = useState<StudentChecklistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedGuideId, setExpandedGuideId] = useState<string>(SECURITY_GUIDES[0].id);

  useEffect(() => {
    setChecklist(loadChecklist());
  }, []);

  const handleToggleCheck = (id: string) => {
    const updated = toggleChecklistItem(id);
    setChecklist(updated);
  };

  const categories = ['All', 'Accounts', 'Wi-Fi & Networks', 'Social & Privacy', 'Gaming & Scams', 'AI & Deepfakes'];

  const filteredGuides = SECURITY_GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.threatVector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedCount = checklist.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span>Actionable Student Security Blueprints</span>
          <span aria-hidden="true">·</span>
          <span>Personal Device Hardening</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Student Security Guides & Checklist
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive defense manuals covering Single Sign-On (SSO) protection, rogue campus Wi-Fi mitigation, gaming account theft defense, and AI voice cloning countermeasures.
        </p>
      </div>

      {/* Interactive Hardening Checklist Box */}
      <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Personal Cyber Hardening Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Check off tasks as you configure your student laptop, phone, and accounts
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-emerald-400 font-bold tabular-nums">
              {completedCount} of {checklist.length} Completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggleCheck(item.id)}
              className={`p-3.5 rounded-lg border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                item.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 shrink-0 text-emerald-400">
                {item.isCompleted ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Square className="h-4 w-4 text-slate-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-semibold block ${item.isCompleted ? 'text-white line-through opacity-80' : 'text-slate-200'}`}>
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed">
                  {item.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guides Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span>Cyber Defense Manuals</span>
          </h2>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Wi-Fi, Discord)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Guides Accordion List */}
        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const isExpanded = expandedGuideId === guide.id;
            return (
              <div
                key={guide.id}
                className="rounded-xl border border-slate-800 bg-[#0c121e] overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setExpandedGuideId(isExpanded ? '' : guide.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <span>{guide.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{guide.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{guide.summary}</p>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800 space-y-5">
                    {/* Threat Vector Callout */}
                    <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs space-y-1">
                      <span className="font-semibold text-rose-300">Underlying Threat Vector:</span>
                      <p className="text-slate-300 leading-relaxed">{guide.threatVector}</p>
                    </div>

                    {/* Step-by-Step Blueprint */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Hardening Blueprint:
                      </h4>
                      <div className="space-y-2.5">
                        {guide.keySteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/30 text-xs space-y-1"
                          >
                            <span className="font-bold text-emerald-300 block">{step.heading}</span>
                            <p className="text-slate-300 leading-relaxed">{step.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-xs flex items-start gap-2.5">
                      <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-emerald-400">Student Pro-Tip:</span>
                        <p className="text-slate-200 mt-0.5 leading-relaxed">{guide.proTip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
