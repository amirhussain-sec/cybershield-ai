import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Shield,
  Scan,
  MessageSquareWarning,
  KeyRound,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DemoVideoPlayerProps {
  onNavigate: (tab: any) => void;
}

interface Chapter {
  id: string;
  time: number;
  label: string;
  title: string;
  tab: string;
  description: string;
  metric: string;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const totalDuration = 72; // 72 seconds demo walkthrough

  const chapters: Chapter[] = [
    {
      id: 'phishing',
      time: 0,
      label: '0:00',
      title: '01. AI Link Inspection',
      tab: 'url_checker',
      description: 'Scanning 9 deterministic heuristics and querying Gemini 3.8 Flash for institutional impersonation vectors.',
      metric: 'Heuristics: 9 Rules Verified',
    },
    {
      id: 'deepfake',
      time: 18,
      label: '0:18',
      title: '02. Synthetic Deepfake Forensics',
      tab: 'image_detector',
      description: 'Multimodal pixel inspection detecting specular anomalies in eyes, warped text rendering, and AI artifacting.',
      metric: 'Forensic Confidence: 94.2%',
    },
    {
      id: 'smishing',
      time: 36,
      label: '0:36',
      title: '03. Smishing & Social Engineering',
      tab: 'message_scanner',
      description: 'Linguistic decomposition exposing artificial deadlines, fake FAFSA refund lures, and authority spoofing.',
      metric: 'Deception Score: 90/100',
    },
    {
      id: 'passphrase',
      time: 54,
      label: '0:54',
      title: '04. Passphrase Studio & Sentinel',
      tab: 'password_shield',
      description: 'Computing Shannon entropy bits and generating 5-word student Diceware passphrases resistant to GPU clusters.',
      metric: 'Entropy: 86.4 Bits (Fortress)',
    },
  ];

  // Auto-advance playhead when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const currentChapter =
    [...chapters].reverse().find((c) => currentTime >= c.time) || chapters[0];

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleTogglePlay = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] overflow-hidden shadow-2xl transition-colors">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              CyberShield AI Interactive Product Walkthrough
              <span className="text-[10px] font-mono font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                1080p Interactive Sim
              </span>
            </h3>
          </div>
        </div>

        {/* Jump Directly to Feature Action */}
        <button
          onClick={() => onNavigate(currentChapter.tab)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
        >
          <span>Open Active Tool: {currentChapter.title}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex flex-col justify-between p-6 select-none group">
        {/* Animated Cyber Grid / Radar Layer */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

        {/* Dynamic Simulated Telemetry HUD */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-wider uppercase">SIMULATED STUDENT THREAT LAB // TELEMETRY FEED</span>
          </div>
          <div className="text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            {currentChapter.metric}
          </div>
        </div>

        {/* Center Animated Stage */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto">
          {/* Chapter Specific Holographic Graphic */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-500/20">
            {currentChapter.id === 'phishing' && <Shield className="h-8 w-8 animate-pulse" />}
            {currentChapter.id === 'deepfake' && <Scan className="h-8 w-8 animate-pulse" />}
            {currentChapter.id === 'smishing' && <MessageSquareWarning className="h-8 w-8 animate-pulse" />}
            {currentChapter.id === 'passphrase' && <KeyRound className="h-8 w-8 animate-pulse" />}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              {currentChapter.title}
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentChapter.id === 'phishing' && 'Authenticating Campus SSO & Institutional Links'}
              {currentChapter.id === 'deepfake' && 'Detecting AI Generated Media & Forged Transcripts'}
              {currentChapter.id === 'smishing' && 'Extracting Psychological Urgency from Fake Texts'}
              {currentChapter.id === 'passphrase' && 'Generating GPU-Resistant Student Passphrases'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {currentChapter.description}
            </p>
          </div>

          {/* Interactive Play/Pause Big Center Overlay */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause Demo' : 'Play Demo'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-400/30 transition-all hover:scale-105 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Walkthrough</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{currentTime > 0 && currentTime < totalDuration ? 'Resume Walkthrough' : 'Play Walkthrough'}</span>
              </>
            )}
          </button>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="relative z-10 space-y-2 pt-4 bg-slate-950/70 backdrop-blur-md -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-800/80">
          {/* Progress Track */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * totalDuration;
              handleSeek(Math.min(totalDuration, Math.max(0, newTime)));
            }}
            className="relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden group/bar"
          >
            {/* Chapter Markers */}
            {chapters.map((ch) => (
              <div
                key={ch.id}
                style={{ left: `${(ch.time / totalDuration) * 100}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
              />
            ))}
            {/* Fill Bar */}
            <div
              className="h-full bg-emerald-400 transition-all duration-150 rounded-full"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-1 text-white hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => setCurrentTime(0)}
                title="Restart"
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-slate-400 text-[11px] tabular-nums">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Chapter Selection Links */}
            <div className="hidden md:flex items-center gap-2">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleSeek(ch.time)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    currentChapter.id === ch.id
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ch.label} {ch.title.split('. ')[1]}
                </button>
              ))}
            </div>

            {/* Speed & Volume */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer"
                title="Playback speed"
              >
                {playbackSpeed}x
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
