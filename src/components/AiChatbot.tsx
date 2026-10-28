import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  AlertOctagon,
  KeyRound,
  Database,
  Download
} from 'lucide-react';
import { ChatMessage } from '../types';
import { saveActivityLog, unlockBadge } from '../utils/cyberSecurity';

const CHAT_MEMORY_KEY = 'cybershield_sentinel_memory_v1';

const INITIAL_GREETING: ChatMessage = {
  id: 'init-msg',
  role: 'model',
  text: `Hello! I am **CyberShield Sentinel**, your AI Cyber Safety Copilot. 

🧠 **Persistent Memory Active**: I remember all your questions, answers, and context across sessions so you don't have to repeat yourself.

I'm here to help you navigate digital threats:
- 🚨 **Emergency Triage**: Did you click a bad link or leak a password?
- 🔍 **Image & Media Checks**: Is a profile photo or screenshot AI-generated?
- 🛡️ **Account Hardening**: How to secure Canvas, Google, Discord, and Steam.
- 📱 **Mobile & Wi-Fi Defense**: Staying safe on campus, dorm, and cafe networks.

What can I assist you with today?`,
  timestamp: Date.now(),
  suggestedFollowups: [
    '🚨 Emergency: I typed my password into a suspect portal!',
    'How can I spot an AI-generated deepfake image?',
    'Is campus library Wi-Fi safe without a VPN?',
    'How do I protect my Discord account from token grabbers?',
  ],
};

export const AiChatbot: React.FC = () => {
  // Load conversation memory from localStorage on initial render
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_MEMORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load chat memory:', e);
    }
    return [INITIAL_GREETING];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist conversation memory whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat memory:', e);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend || textToSend.trim().length === 0 || loading) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customText) setInput('');
    setLoading(true);

    try {
      // Send cumulative history so the AI model remembers previous questions and answers
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) throw new Error('Chatbot request failed');
      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `m_${Date.now()}`,
        role: 'model',
        text: data.reply || 'I am ready to help you with your cybersecurity questions.',
        timestamp: Date.now(),
        suggestedFollowups: [
          'What are the best password managers for students?',
          'How do I enable 2FA on my school Google account?',
          'How do I report a phishing attempt to university IT?',
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      unlockBadge('ai_collaborator');

      saveActivityLog({
        type: 'ai_consult',
        title: 'Sentinel AI Chat Consultation',
        detail: `Q: "${textToSend.slice(0, 45)}..."`,
        status: 'info',
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: 'Unable to reach the server right now. In an emergency: immediately navigate to your official account settings and click "Change Password" and "Log out of all devices".',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMemory = () => {
    const cleared = [
      {
        ...INITIAL_GREETING,
        id: `init-${Date.now()}`,
        text: 'Memory reset. Previous questions and answers have been cleared. How can I help you stay safe online today?',
      },
    ];
    setMessages(cleared);
    localStorage.removeItem(CHAT_MEMORY_KEY);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleString()}] ${
            m.role === 'user' ? 'Student' : 'CyberShield Sentinel'
          }:\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberShield_Chat_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const userQuestionCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title & Memory Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Conversational Cyber Defense Copilot</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-mono">
              <Database className="h-3 w-3" />
              Memory Active ({userQuestionCount} questions memorized)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            CyberShield Sentinel Chatbot
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title="Download conversation transcript"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Transcript</span>
          </button>
          <button
            type="button"
            onClick={handleClearMemory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title="Clear stored conversation history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Memory</span>
          </button>
        </div>
      </div>

      {/* Emergency Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() =>
            handleSend(
              '🚨 Emergency: I clicked a suspicious link and typed my school password! What do I do right now?'
            )
          }
          className="p-3 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-left transition-colors cursor-pointer space-y-1 group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <span>Panic Triage: Clicked Link</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Immediate 60-second containment protocol to secure compromised credentials.
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSend(
              'A mutual friend on Discord is messaging me claiming they accidentally reported my Steam account. Is this real?'
            )
          }
          className="p-3 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-left transition-colors cursor-pointer space-y-1 group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Discord / Steam Trap</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Verify whether a friend DM or moderator request is an infostealer trap.
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSend(
              'How do I create a 4-word Diceware passphrase that is impossible to brute force but easy to type?'
            )
          }
          className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-left transition-colors cursor-pointer space-y-1 group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <KeyRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Memorable Passphrases</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Learn the Diceware method to create 75+ bit entropy passphrases.
          </p>
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-xl flex flex-col h-[600px] overflow-hidden transition-colors">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px]">
                  <span
                    className={
                      msg.role === 'user'
                        ? 'text-slate-900 font-mono'
                        : 'text-slate-400 dark:text-slate-500 font-mono'
                    }
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {msg.role === 'model' && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {/* Follow-up suggestion pills */}
                {msg.role === 'model' &&
                  msg.suggestedFollowups &&
                  msg.suggestedFollowups.length > 0 && (
                    <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800/60 space-y-1.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                        Related follow-up questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowups.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(q)}
                            className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 px-2 py-1 rounded transition-colors text-left cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 w-fit">
              <div className="h-3.5 w-3.5 border-2 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Sentinel is reviewing previous questions and formulating guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 transition-colors">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sentinel anything about cyber safety, deepfakes, passwords, or campus threats..."
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="p-3 rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
