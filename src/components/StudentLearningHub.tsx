import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Terminal,
  Sparkles,
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  Play,
  Copy,
  Check,
  HelpCircle,
  FileCode,
  Shield,
  Layers,
  Send,
  Zap,
  ArrowLeft,
  X,
  Code2,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { HackingCourse, CourseModule, BlogArticle } from '../types';
import { ETHICAL_HACKING_COURSES, STUDENT_BLOG_ARTICLES } from '../data/learningResources';
import { saveActivityLog } from '../utils/cyberSecurity';

interface StudentLearningHubProps {
  onOpenChatbot?: () => void;
}

type LearningTab = 'courses' | 'blogs' | 'sandbox' | 'ai_tutor';

export const StudentLearningHub: React.FC<StudentLearningHubProps> = ({ onOpenChatbot }) => {
  const [activeSubTab, setActiveSubTab] = useState<LearningTab>('courses');

  // Courses state
  const [courses, setCourses] = useState<HackingCourse[]>(ETHICAL_HACKING_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<HackingCourse | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cybershield_completed_modules');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Course Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Blogs state
  const [articles, setArticles] = useState<BlogArticle[]>(STUDENT_BLOG_ARTICLES);
  const [blogCategory, setBlogCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_bookmarked_blogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Terminal Sandbox State
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'uname -a && whoami',
      output: 'Linux student-offensive-lab 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC x86_64\nstudent@cybershield-sandbox:~$',
    },
    {
      cmd: 'cat /etc/motd',
      output:
        '===============================================================\n  CyberShield Aegis AI — Student Ethical Hacking Sandbox\n  Type "help" for sandbox tools or "challenge" for a live CTF prompt.\n===============================================================',
    },
  ]);
  const [generatingChallenge, setGeneratingChallenge] = useState(false);

  // AI Tutor State
  const [tutorQuestion, setTutorQuestion] = useState<string>('');
  const [tutorContext, setTutorContext] = useState<string>('Ethical Hacking Fundamentals');
  const [tutorConversation, setTutorConversation] = useState<
    Array<{ sender: 'student' | 'tutor'; text: string; isAi?: boolean }>
  >([
    {
      sender: 'tutor',
      text: `### Welcome to Your Ethical Hacking Mentorship Studio
I am your dedicated cybersecurity mentor. Ask me any technical question about:
- **Offensive Security**: How SQLi, XSS, Nmap, or Burp Suite work
- **Defensive Engineering**: Prepared statements, CSP headers, zero-trust, password hashing
- **Certifications & Career**: CompTIA Security+, CEH, eJPT, OSCP, or starting bug bounties

What ethical hacking concept would you like to master today?`,
    },
  ]);
  const [loadingTutor, setLoadingTutor] = useState<boolean>(false);

  // Save completed modules
  const toggleModuleCompletion = (moduleId: string) => {
    const updated = { ...completedModules, [moduleId]: !completedModules[moduleId] };
    setCompletedModules(updated);
    try {
      localStorage.setItem('cybershield_completed_modules', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save module progress', e);
    }
  };

  // Save bookmarks
  const toggleBookmark = (articleId: string) => {
    const updated = bookmarkedArticleIds.includes(articleId)
      ? bookmarkedArticleIds.filter((id) => id !== articleId)
      : [...bookmarkedArticleIds, articleId];
    setBookmarkedArticleIds(updated);
    try {
      localStorage.setItem('cybershield_bookmarked_blogs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save bookmark', e);
    }
  };

  // Copy code snippet helper
  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  // Handle Terminal Execution
  const handleTerminalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCmd = terminalInput.trim();
    if (!rawCmd) return;

    const lower = rawCmd.toLowerCase();
    let output = '';

    if (lower === 'help') {
      output = `Available simulated commands:
  nmap -sV -sC <ip>      - Run stealth port scan and service version discovery
  whoami                 - Show current logged-in user and permissions
  id                     - Display user ID, group ID, and security tokens
  find / -perm -u=s      - Locate SUID privilege escalation binaries
  cat /etc/passwd        - Inspect user account file
  curl <url>             - Fetch raw HTTP response headers and body
  sqlmap -u <url>        - Test parameters for automated SQL injection
  wireshark              - Launch simulated network packet inspector
  security.txt           - Check target vulnerability disclosure policy
  challenge              - Generate an AI CTF terminal challenge
  clear                  - Clear terminal scrollback history`;
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lower.startsWith('nmap')) {
      output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-28 11:24 EDT
Nmap scan report for sandbox.target.local (192.168.56.20)
Host is up (0.00045s latency).
Not shown: 97 closed tcp ports (reset)
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http        Apache httpd 2.4.52 ((Ubuntu))
|_http-title: Student Research Lab Intranet
443/tcp open  ssl/https   Apache httpd 2.4.52
|_ssl-cert: Subject: commonName=sandbox.target.local
3306/tcp open mysql       MySQL 8.0.35-0ubuntu0.22.04.1
MAC Address: 08:00:27:B4:9C:12 (Oracle VirtualBox)
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.38 seconds`;
    } else if (lower === 'whoami') {
      output = 'student_researcher (uid=1001/student gid=1001/student groups=1001/student)';
    } else if (lower === 'id') {
      output = 'uid=1001(student) gid=1001(student) groups=1001(student),27(sudo-lab-restricted)';
    } else if (lower.includes('find') && lower.includes('-perm')) {
      output = `/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/chsh\n/usr/bin/newgrp\n/usr/bin/gpasswd\n/opt/sandbox/lab_backup (NOTE: Custom SUID binary detected for privilege escalation drill!)`;
    } else if (lower.includes('cat /etc/passwd')) {
      output = `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1001:1001:Student Lab Account,,,:/home/student:/bin/bash\nmysql:x:114:120:MySQL Server,,,:/nonexistent:/bin/false\napache:x:115:121:Apache Web Server,,,:/var/www:/usr/sbin/nologin`;
    } else if (lower.startsWith('curl')) {
      output = `HTTP/1.1 200 OK\nDate: Wed, 28 Oct 2026 11:25:01 GMT\nServer: Apache/2.4.52 (Ubuntu)\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff\nContent-Type: text/html; charset=UTF-8\n\n<!DOCTYPE html><html><head><title>Student Lab</title></head><body><h1>Authorized Lab Sandbox Only</h1></body></html>`;
    } else if (lower.includes('sqlmap')) {
      output = `[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.\n[*] testing connection to the target URL\n[*] testing if the target URL content is stable\n[+] GET parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable\n[+] GET parameter 'id' is vulnerable: DBMS is MySQL >= 8.0.0`;
    } else if (lower.includes('security.txt')) {
      output = `Contact: mailto:security-response@university.edu\nPolicy: https://university.edu/cybersecurity/disclosure\nPreferred-Languages: en\nSafe-Harbor: YES - Good faith researchers acting within scope are protected against legal action.`;
    } else if (lower === 'challenge') {
      handleGenerateLabChallenge();
      setTerminalInput('');
      return;
    } else {
      output = `bash: ${rawCmd}: command not recognized in safe lab sandbox. Type "help" to see available diagnostic tools.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setTerminalInput('');
  };

  // Generate dynamic AI lab challenge
  const handleGenerateLabChallenge = async () => {
    setGeneratingChallenge(true);
    try {
      const res = await fetch('/api/learning/generate-lab-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'linux_permissions', difficulty: 'intermediate' }),
      });
      const data = await res.json();
      if (data.challenge) {
        const chal = data.challenge;
        setTerminalHistory((prev) => [
          ...prev,
          {
            cmd: 'challenge --new',
            output: `[+] NEW CTF DRILL LOADED: ${chal.title}\n--------------------------------------------------\nScenario: ${chal.scenario}\nObjective: ${chal.objective}\nStarter: ${chal.starterCommand || 'ls -la'}\nHint: Type "${chal.solution || 'cat /tmp/.secret_flag.txt'}" to extract the flag!`,
          },
        ]);
      }
    } catch {
      setTerminalHistory((prev) => [
        ...prev,
        {
          cmd: 'challenge --new',
          output: `[+] CTF DRILL LOADED: SUID Binary Inspection\nObjective: Run "find / -perm -u=s -type f 2>/dev/null" to spot misconfigured executables.`,
        },
      ]);
    } finally {
      setGeneratingChallenge(false);
    }
  };

  // Handle Ask Tutor
  const handleAskTutor = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = customQuestion || tutorQuestion.trim();
    if (!q) return;

    const studentMessage = { sender: 'student' as const, text: q };
    setTutorConversation((prev) => [...prev, studentMessage]);
    setTutorQuestion('');
    setLoadingTutor(true);

    try {
      const res = await fetch('/api/learning/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          contextTopic: tutorContext,
        }),
      });
      const data = await res.json();
      setTutorConversation((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: data.reply || 'Here are the key takeaways for your security study...',
          isAi: data.isAiPowered,
        },
      ]);
    } catch {
      setTutorConversation((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: `### Security Study Guide
- **Ethical Foundation**: In cybersecurity, always ensure you have unambiguous written scope before testing.
- **Hands-on Labs**: Practice in personal VirtualBox environments or sanctioned platforms like PicoCTF and Hack The Box.
- **Defense-in-Depth**: Pair technical controls (firewalls, parameterized queries) with user education.`,
          isAi: false,
        },
      ]);
    } finally {
      setLoadingTutor(false);
    }
  };

  // Filtered blogs
  const filteredArticles = articles.filter((art) => {
    const matchesCat = blogCategory === 'All' || art.category === blogCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            <GraduationCap className="h-4 w-4" />
            <span>STUDENT CYBERSECURITY ACADEMY</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Cost White-Hat Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Ethical Hacking Courses & Security Research Blogs
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Structured hands-on courses, offensive security walkthroughs, ethical research blogs, and an interactive virtual sandbox tailored for high school and university students.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-center min-w-[90px]">
            <div className="text-xs text-slate-500 font-mono">Courses</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{courses.length}</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-center min-w-[90px]">
            <div className="text-xs text-slate-500 font-mono">Articles</div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">{articles.length}</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-center min-w-[90px]">
            <div className="text-xs text-slate-500 font-mono">Completed</div>
            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400 font-mono">
              {Object.values(completedModules).filter(Boolean).length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Segmented Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveSubTab('courses');
              setSelectedArticle(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'courses'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-500" />
            <span>Ethical Hacking Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('blogs');
              setSelectedCourse(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'blogs'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="h-4 w-4 text-teal-500" />
            <span>Security Blogs & Research ({articles.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('sandbox');
              setSelectedCourse(null);
              setSelectedArticle(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'sandbox'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4 text-amber-500" />
            <span>Terminal Sandbox & Labs</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('ai_tutor');
              setSelectedCourse(null);
              setSelectedArticle(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'ai_tutor'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <span>AI Security Mentor</span>
          </button>
        </div>

        {/* Quick External CTF References */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium hidden sm:inline">Recommended Student Sandboxes:</span>
          <a
            href="https://picoctf.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono"
          >
            <span>PicoCTF</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://overthewire.org/wargames/bandit/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono"
          >
            <span>OverTheWire</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: ETHICAL HACKING COURSES */}
      {/* ========================================================================= */}
      {activeSubTab === 'courses' && (
        <div className="space-y-6">
          {!selectedCourse ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const completedCount = course.modules.filter((m) => completedModules[m.id]).length;
                const progressPct = Math.round((completedCount / course.modules.length) * 100);

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveModuleIndex(0);
                      setSelectedQuizAnswer(null);
                      setQuizSubmitted(false);
                    }}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {course.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{course.durationHours} hrs</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span>Aligns with: {course.certificationTrack}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {completedCount} of {course.modules.length} Modules Done
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {progressPct}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className={`text-[11px] font-mono font-semibold ${
                          course.level === 'Beginner'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : course.level === 'Intermediate'
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {course.level} Level
                        </span>

                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                          <span>Start Track</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Detailed Course & Interactive Syllabus Viewer */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Back to all courses button */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Courses</span>
              </button>

              {/* Course Header Banner */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 lg:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    {selectedCourse.level} Track
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCourse.durationHours} Hours Self-Paced</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCourse.certificationTrack}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {selectedCourse.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {selectedCourse.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                      What You Will Master:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {selectedCourse.whatYouWillLearn.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                      Prerequisites:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {selectedCourse.prerequisites.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-1.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Course Module Navigation Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Module Selector Sidebar (4 Cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Course Modules ({selectedCourse.modules.length})
                  </h3>

                  <div className="space-y-2">
                    {selectedCourse.modules.map((mod, idx) => {
                      const isCompleted = !!completedModules[mod.id];
                      const isSelected = activeModuleIndex === idx;

                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            setActiveModuleIndex(idx);
                            setSelectedQuizAnswer(null);
                            setQuizSubmitted(false);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono text-[11px] text-slate-500">
                              Module {idx + 1} ({mod.durationMinutes}m)
                            </span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleModuleCompletion(mod.id);
                              }}
                              className="cursor-pointer"
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                              )}
                            </span>
                          </div>
                          <div className="text-xs font-bold line-clamp-1">{mod.title}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Ask Tutor About this Course Quick Box */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Have a question about this module?</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Our AI mentor can explain tricky concepts or generate personalized study flashcards.
                    </p>
                    <button
                      onClick={() => {
                        setTutorContext(selectedCourse.title);
                        setActiveSubTab('ai_tutor');
                      }}
                      className="w-full text-center py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                    >
                      Ask AI Mentor
                    </button>
                  </div>
                </div>

                {/* Active Module Lesson Content (8 Cols) */}
                {selectedCourse.modules[activeModuleIndex] && (
                  <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 lg:p-8 space-y-6 shadow-sm">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          MODULE {activeModuleIndex + 1} OF {selectedCourse.modules.length}
                        </span>
                        <button
                          onClick={() => toggleModuleCompletion(selectedCourse.modules[activeModuleIndex].id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                            completedModules[selectedCourse.modules[activeModuleIndex].id]
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {completedModules[selectedCourse.modules[activeModuleIndex].id] ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Circle className="h-3.5 w-3.5" />
                              <span>Mark as Complete</span>
                            </>
                          )}
                        </button>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {selectedCourse.modules[activeModuleIndex].title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {selectedCourse.modules[activeModuleIndex].summary}
                      </p>
                    </div>

                    {/* Topics Covered */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-slate-500">
                        Syllabus Topics Covered:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedCourse.modules[activeModuleIndex].topics.map((t, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Concept Takeaway Callout */}
                    <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Award className="h-4 w-4" />
                        <span>Core Cybersecurity Principle</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedCourse.modules[activeModuleIndex].keyConcept}
                      </p>
                    </div>

                    {/* Practical Interactive Exercise */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d17] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Terminal className="h-4 w-4 text-emerald-500" />
                          <span>{selectedCourse.modules[activeModuleIndex].practicalExercise.title}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">Hands-on Lab</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {selectedCourse.modules[activeModuleIndex].practicalExercise.scenario}
                      </p>

                      <div className="p-3 rounded-lg bg-slate-900 dark:bg-black border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                        <div className="text-slate-400 text-[10px]"># Target Objective:</div>
                        <div>{selectedCourse.modules[activeModuleIndex].practicalExercise.objective}</div>
                        {selectedCourse.modules[activeModuleIndex].practicalExercise.starterCommand && (
                          <div className="pt-2">
                            <span className="text-slate-400 text-[10px] block"># Starter Command:</span>
                            <span className="text-white">
                              $ {selectedCourse.modules[activeModuleIndex].practicalExercise.starterCommand}
                            </span>
                          </div>
                        )}
                        {selectedCourse.modules[activeModuleIndex].practicalExercise.expectedOutput && (
                          <div className="pt-2 text-slate-300 text-[11px] border-t border-slate-800/80">
                            <span className="text-slate-400 text-[10px] block"># Simulated Output:</span>
                            <pre className="whitespace-pre-wrap font-mono mt-1">
                              {selectedCourse.modules[activeModuleIndex].practicalExercise.expectedOutput}
                            </pre>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                        <span>Hint: {selectedCourse.modules[activeModuleIndex].practicalExercise.hint}</span>
                      </div>
                    </div>

                    {/* Checkpoint Quiz */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1b] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                          Module Knowledge Checkpoint
                        </span>
                        <span className="text-[11px] text-slate-500">1 Question</span>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {selectedCourse.modules[activeModuleIndex].quiz.question}
                      </p>

                      <div className="space-y-2">
                        {selectedCourse.modules[activeModuleIndex].quiz.options.map((opt, oIdx) => {
                          const isSelected = selectedQuizAnswer === oIdx;
                          const isCorrect = oIdx === selectedCourse.modules[activeModuleIndex].quiz.correctIndex;

                          let btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-white font-medium';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!quizSubmitted) setSelectedQuizAnswer(oIdx);
                              }}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={() => {
                            if (selectedQuizAnswer !== null) {
                              setQuizSubmitted(true);
                              if (selectedQuizAnswer === selectedCourse.modules[activeModuleIndex].quiz.correctIndex) {
                                toggleModuleCompletion(selectedCourse.modules[activeModuleIndex].id);
                              }
                            }
                          }}
                          disabled={selectedQuizAnswer === null}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white">Explanation:</span>
                          <p className="text-slate-600 dark:text-slate-400">
                            {selectedCourse.modules[activeModuleIndex].quiz.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: CYBERSECURITY BLOGS & RESEARCH ARTICLES */}
      {/* ========================================================================= */}
      {activeSubTab === 'blogs' && (
        <div className="space-y-6">
          {!selectedArticle ? (
            <>
              {/* Blog Filter and Search Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, techniques, or topics..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills (Functional filter buttons) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    'All',
                    'Career & Ethics',
                    'Safe Labs',
                    'Web Security',
                    'Bug Bounty',
                    'Network Pentesting',
                    'CTF Walkthroughs',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBlogCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        blogCategory === cat
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Article Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => {
                  const isBookmarked = bookmarkedArticleIds.includes(article.id);

                  return (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-emerald-500/40 p-6 flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {article.category}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(article.id);
                            }}
                            className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{article.author}</span>
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3">
                          <span>Read Full Article</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Detailed Article Reader View */
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Articles</span>
              </button>

              <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 sm:p-10 space-y-6 shadow-sm">
                <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedArticle.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(selectedArticle.id)}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      {bookmarkedArticleIds.includes(selectedArticle.id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 text-amber-500" />
                          <span>Bookmarked</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          <span>Bookmark</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>By {selectedArticle.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedArticle.authorRole}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedArticle.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{selectedArticle.readTime}</span>
                  </div>
                </div>

                {/* Key Takeaways Callout */}
                <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Executive Summary & Key Takeaways</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedArticle.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">›</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Markdown Body */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed whitespace-pre-line font-sans">
                  {selectedArticle.contentMarkdown}
                </div>

                {/* Code Snippets Section */}
                {selectedArticle.codeSnippets && selectedArticle.codeSnippets.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                      Demonstration Code & Command Script
                    </h4>

                    {selectedArticle.codeSnippets.map((snippet, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs font-mono"
                      >
                        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                          <span>{snippet.description}</span>
                          <button
                            onClick={() => handleCopyCode(snippet.code, sIdx)}
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedSnippetIndex === sIdx ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                          {snippet.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  <span className="font-mono">Tags:</span>
                  {selectedArticle.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-slate-600 dark:text-slate-400 font-mono hover:text-emerald-500 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: TERMINAL SANDBOX & VIRTUAL LAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-500" />
                <span>Simulated Kali Linux Student Sandbox</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Practice essential command line reconnaissance, SUID privilege checks, and security tools safely.
              </p>
            </div>

            <button
              onClick={handleGenerateLabChallenge}
              disabled={generatingChallenge}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>{generatingChallenge ? 'Generating CTF Drill...' : 'Generate New Lab Challenge'}</span>
            </button>
          </div>

          {/* Linux Web Terminal Window */}
          <div className="rounded-xl border border-slate-800 bg-[#060911] shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400 text-[11px]">student@cybershield-sandbox: ~ (bash 5.2)</span>
              </div>
              <button
                onClick={() => setTerminalHistory([])}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                Clear Screen
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="text-slate-500">student@aegis:~$</span>
                    <span>{item.cmd}</span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap pl-4 leading-relaxed font-mono">
                    {item.output}
                  </pre>
                </div>
              ))}

              {/* Input prompt */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2">
                <span className="text-emerald-500 font-bold">student@aegis:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type command (e.g. nmap, whoami, find, help)..."
                  className="flex-1 bg-transparent text-white outline-none font-mono text-xs placeholder-slate-600"
                  autoFocus
                />
              </form>
            </div>

            {/* Quick Command Chips */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-500">Quick Commands:</span>
              {['help', 'nmap -sV 192.168.56.20', 'whoami', 'find / -perm -u=s', 'security.txt', 'challenge'].map(
                (cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTerminalInput(cmd);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors cursor-pointer"
                  >
                    {cmd}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: AI SECURITY MENTOR & TUTOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'ai_tutor' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>AI Ethical Hacking Mentor & Study Advisor</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ask questions about offensive security, penetration testing tools, code defense, or certifications.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded">
                Gemini 3.8 Flash Mentor
              </span>
            </div>

            {/* Quick Topic Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">Suggested Topics:</span>
              {[
                'How does SQL Injection work?',
                'Difference between SYN scan and Connect scan?',
                'How do I start bug bounties on HackerOne?',
                'What is an IDOR vulnerability?',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleAskTutor(undefined, prompt)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 max-h-[500px] overflow-y-auto pr-1">
              {tutorConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-[#080d17] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.sender === 'student' ? 'You' : msg.isAi ? 'Gemini 3.8 Flash Mentor' : 'Knowledge Base'}
                  </span>
                </div>
              ))}

              {loadingTutor && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                  <div className="h-3.5 w-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Consulting ethical hacking knowledge base...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleAskTutor} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="Ask your mentor (e.g. explain XSS with a code example)..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loadingTutor || !tutorQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Ask Mentor</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
