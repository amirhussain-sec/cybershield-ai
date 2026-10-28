import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Mail,
  MessageSquare,
  Wifi,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { CURATED_QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types';
import { saveActivityLog, unlockBadge } from '../utils/cyberSecurity';

export const CyberQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(CURATED_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatingAiDrill, setGeneratingAiDrill] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const filteredQuestions = questions.filter((q) =>
    activeCategoryFilter === 'all' ? true : q.category === activeCategoryFilter
  );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);

    const isCorrect = currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    } else {
      // Completed drill
      setIsCompleted(true);
      const finalScore = Math.round(((correctAnswersCount + (currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0)) / filteredQuestions.length) * 100);

      if (finalScore === 100) {
        unlockBadge('drill_champion');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore if canvas-confetti is not loaded
        }
      }

      saveActivityLog({
        type: 'quiz_completed',
        title: `Security Drill: ${activeCategoryFilter.toUpperCase()}`,
        detail: `Completed drill score: ${finalScore}% (${correctAnswersCount}/${filteredQuestions.length} correct)`,
        status: finalScore >= 80 ? 'safe' : 'warning',
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setCorrectAnswersCount(0);
    setIsCompleted(false);
  };

  const handleGenerateAiDrill = async () => {
    setGeneratingAiDrill(true);
    try {
      const response = await fetch('/api/security-drill/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategoryFilter === 'all' ? 'phishing' : activeCategoryFilter,
          difficulty: 'intermediate',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate scenario.');
      const data = await response.json();
      if (data.drill) {
        const newDrill: QuizQuestion = {
          ...data.drill,
          category: activeCategoryFilter === 'all' ? 'phishing' : (activeCategoryFilter as any),
        };
        setQuestions((prev) => [newDrill, ...prev]);
        setCurrentIndex(0);
        setSelectedOptionId(null);
        setHasSubmitted(false);
        setIsCompleted(false);
      }
    } catch (e) {
      console.warn('AI drill generation error:', e);
    } finally {
      setGeneratingAiDrill(false);
    }
  };

  // Helper to render realistic simulated payload
  const renderMockPayload = (q: QuizQuestion) => {
    if (!q.mockPayload) return null;

    if (q.scenarioType === 'email') {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden text-xs text-slate-300">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Incoming Message Header</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">{q.mockPayload.timestamp}</span>
          </div>
          <div className="p-4 space-y-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16">From:</span>
              <span className="font-mono text-emerald-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                {q.mockPayload.sender}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16">To:</span>
              <span className="font-mono text-slate-300">{q.mockPayload.recipient}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16">Subject:</span>
              <span className="font-bold text-white">{q.mockPayload.subject}</span>
            </div>
          </div>
          <div className="p-4 space-y-3 bg-slate-900/60">
            <p className="whitespace-pre-line leading-relaxed font-sans text-slate-200">
              {q.mockPayload.content}
            </p>
            {q.mockPayload.actionButtonLabel && (
              <div className="pt-2">
                <span className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-semibold pointer-events-none">
                  {q.mockPayload.actionButtonLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (q.scenarioType === 'sms') {
      return (
        <div className="max-w-md mx-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 space-y-2 text-xs">
          <div className="text-center text-[11px] text-slate-400 pb-2 border-b border-slate-800">
            SMS Message from {q.mockPayload.sender} · {q.mockPayload.timestamp}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-slate-200 leading-relaxed font-sans space-y-2">
            <p className="whitespace-pre-line">{q.mockPayload.content}</p>
          </div>
        </div>
      );
    }

    if (q.scenarioType === 'network_alert') {
      return (
        <div className="max-w-md mx-auto rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Wifi className="h-4 w-4" />
            <span>{q.mockPayload.subject}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{q.mockPayload.content}</p>
          {q.mockPayload.actionButtonLabel && (
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 text-center font-semibold pointer-events-none">
              {q.mockPayload.actionButtonLabel}
            </div>
          )}
        </div>
      );
    }

    // Default chat
    return (
      <div className="max-w-md mx-auto rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 pb-1 border-b border-slate-800">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-white">{q.mockPayload.sender}</span>
          <span>· {q.mockPayload.timestamp}</span>
        </div>
        <p className="text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900 p-3 rounded-lg border border-slate-800">
          {q.mockPayload.content}
        </p>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span>Realistic Student Threat Simulations</span>
            <span aria-hidden="true">·</span>
            <span>Educational Spotting Drills</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Cyber Safety Drill Arena
          </h1>
        </div>

        {/* AI Generator Button */}
        <button
          type="button"
          onClick={handleGenerateAiDrill}
          disabled={generatingAiDrill}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          {generatingAiDrill ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
              <span>Generating AI Drill...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Generate Fresh AI Drill</span>
            </>
          )}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
        {[
          { id: 'all', label: 'All Scenarios' },
          { id: 'phishing', label: 'Phishing & Email' },
          { id: 'wifi', label: 'Campus Wi-Fi' },
          { id: 'gaming', label: 'Discord & Gaming' },
          { id: 'privacy', label: 'Social & Privacy' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveCategoryFilter(tab.id);
              setCurrentIndex(0);
              setSelectedOptionId(null);
              setHasSubmitted(false);
              setIsCompleted(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeCategoryFilter === tab.id
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Card */}
      {!isCompleted ? (
        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 lg:p-8 shadow-xl space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
            <span>
              Scenario <strong className="text-white font-mono">{currentIndex + 1}</strong> of{' '}
              <strong className="text-white font-mono">{filteredQuestions.length}</strong>
            </span>
            <span className="font-mono text-emerald-400">
              Score: {correctAnswersCount} Correct
            </span>
          </div>

          {/* Context & Title */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">{currentQ.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{currentQ.context}</p>
          </div>

          {/* Mock Payload Simulation Display */}
          {renderMockPayload(currentQ)}

          {/* Question Text */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{currentQ.question}</span>
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

              if (hasSubmitted) {
                if (opt.isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'border-emerald-500/60 bg-emerald-950/30 text-white';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-4 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span className="h-5 w-5 rounded-full border border-slate-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {opt.id.toUpperCase().slice(-1)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt.text}</span>
                  {hasSubmitted && opt.isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  )}
                  {hasSubmitted && isSelected && !opt.isCorrect && (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout upon Submission */}
          {hasSubmitted && (
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/90 space-y-2 text-xs">
              <span className="font-bold text-white block">Educational Breakdown:</span>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Student Rule: {currentQ.securityTakeaway}</span>
              </div>
            </div>
          )}

          {/* Action Button Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            {!hasSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                <span>{currentIndex + 1 < filteredQuestions.length ? 'Next Scenario' : 'View Results'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Completion Card */
        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Trophy className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Drill Series Completed!</h2>
            <p className="text-sm text-slate-400">
              You correctly solved{' '}
              <strong className="text-white font-mono">{correctAnswersCount}</strong> out of{' '}
              <strong className="text-white font-mono">{filteredQuestions.length}</strong> scenarios.
            </p>
          </div>

          <div className="inline-block p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Readiness Accuracy
            </span>
            <span className="text-4xl font-extrabold text-emerald-400 font-mono">
              {Math.round((correctAnswersCount / filteredQuestions.length) * 100)}%
            </span>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Drill</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateAiDrill}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate New AI Scenarios</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
