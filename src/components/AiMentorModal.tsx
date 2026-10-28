import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { ChatMessage } from '../types';
import { saveActivityLog, unlockBadge } from '../utils/cyberSecurity';

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMentorModal: React.FC<AiMentorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your CyberShield AI Mentor. Whether you encountered a suspicious link, received an alarming campus email, or want advice on securing your student accounts, ask me anything.",
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'I clicked a suspicious email link, what should I do right now?',
    'Is it safe to connect to coffee shop or campus Wi-Fi?',
    'Someone on Discord sent me a game file to test. Is it safe?',
    'How do I create a password I can actually remember?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || inputText;
    if (!question || question.trim().length === 0 || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text: question.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/security-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) throw new Error('Failed to get answer from AI mentor.');
      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg_m_${Date.now()}`,
        role: 'model',
        text: data.answer || "I'm reviewing your inquiry. Please ensure you do not share sensitive credentials.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      unlockBadge('ai_collaborator');
      saveActivityLog({
        type: 'ai_consult',
        title: 'AI Security Consultation',
        detail: `Question: "${question.slice(0, 45)}..."`,
        status: 'info',
      });
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'model',
          text: 'Unable to reach the AI mentor server right now. In an emergency: change your password immediately on your official account settings and inform your school IT desk.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl h-[85vh] max-h-[680px] rounded-2xl border border-slate-800 bg-[#0c121e] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                CyberShield AI Security Mentor
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Student Cybersecurity Triage & Safety Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400 mt-1">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 font-mono ${
                    msg.role === 'user' ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 mt-1">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 w-fit">
              <div className="h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing cyber safety guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Quick student prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about a suspicious email, password, or Wi-Fi security..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              aria-label="Send inquiry"
              className="p-2.5 rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
