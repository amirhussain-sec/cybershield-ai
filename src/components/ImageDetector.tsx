import React, { useState } from 'react';
import {
  Scan,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Cpu,
  FileImage,
  RefreshCw,
  Eye,
  Info,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { ImageAnalysisResult } from '../types';
import { saveActivityLog } from '../utils/cyberSecurity';

export const ImageDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [imageName, setImageName] = useState<string>('sample_deepfake.jpg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Realistic student sample scenarios with SVG/Canvas generated base64 for instant testing
  const sampleScenarios = [
    {
      title: 'AI Synthetic Portrait (Impersonation Lure)',
      desc: 'Synthetic profile photo used in fake social profiles, romance lures, and student identity theft.',
      filename: 'ai_synthetic_student_avatar.jpg',
      generateBase64: () => createSampleSvgDataUrl('ai_portrait'),
      mime: 'image/jpeg',
    },
    {
      title: 'Forged Campus Emergency Alert Flyer',
      desc: 'Fabricated campus administration closure notice with mismatched typography and altered signatures.',
      filename: 'manipulated_campus_notice.jpg',
      generateBase64: () => createSampleSvgDataUrl('campus_notice'),
      mime: 'image/jpeg',
    },
    {
      title: 'Altered Exam Grade Screenshot',
      desc: 'Manipulated portal grade report with edited DOM text and unnatural pixel antialiasing.',
      filename: 'altered_grade_screenshot.jpg',
      generateBase64: () => createSampleSvgDataUrl('fake_grade'),
      mime: 'image/jpeg',
    },
  ];

  function createSampleSvgDataUrl(type: string): string {
    // Generate valid canvas-based images for robust testing
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    if (type === 'ai_portrait') {
      // Draw synthetic looking portrait
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 400);

      // Abstract stylized face silhouette
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(300, 180, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(300, 360, 130, Math.PI, 0, false);
      ctx.fill();

      // Anomalous specular reflections
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(280, 175, 12, 0, Math.PI * 2);
      ctx.arc(325, 170, 7, 0, Math.PI * 2); // Asymmetrical specular
      ctx.fill();

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('[SYNTHETIC TEST VECTOR: UNNATURAL SPECULAR & ASYMMETRY]', 40, 50);
    } else if (type === 'campus_notice') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 400);

      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(0, 0, 600, 40);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('OFFICIAL EMERGENCY CAMPUS NOTICE', 130, 26);

      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.fillText('All semester examinations canceled due to infrastructure maintenance.', 50, 100);
      ctx.fillText('Students must verify credentials via: https://univ-emergency.support', 50, 130);

      // Spliced mismatched font
      ctx.font = 'italic bold 16px Courier';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('AUTHORIZED BY THE DEAN OF STUDENTS', 50, 240);

      ctx.strokeStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(50, 300);
      ctx.bezierCurveTo(100, 250, 150, 350, 220, 290);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, 600, 400);

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('STUDENT ACADEMIC PORTAL // GRADES', 40, 50);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Computer Science 101: Midterm Exam', 40, 120);

      // Altered score with mismatched anti-aliasing
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 36px Arial';
      ctx.fillText('99% (A+)', 380, 125);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('[MODIFIED PIXEL REGION DETECTED AROUND TEXT ARTIFACTS]', 40, 320);
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 8MB.');
      return;
    }

    setImageName(file.name);
    setImageMime(file.type || 'image/jpeg');
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setSelectedImage(b64);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (scenario: typeof sampleScenarios[0]) => {
    const dataUrl = scenario.generateBase64();
    setSelectedImage(dataUrl);
    setImageName(scenario.filename);
    setImageMime(scenario.mime);
    setResult(null);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) {
      setErrorMsg('Please select or upload an image first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMime,
          filename: imageName,
        }),
      });

      if (!response.ok) {
        throw new Error('Image forensic analysis request failed.');
      }

      const data = await response.json();
      const finalResult: ImageAnalysisResult = {
        ...data,
        imageUrl: selectedImage,
        timestamp: Date.now(),
      };
      setResult(finalResult);

      saveActivityLog({
        type: 'image_audit',
        title: `Visual Forensic Audit: ${imageName}`,
        detail: `Verdict: ${finalResult.verdict} (Synthetic Prob: ${finalResult.syntheticProbability}%) · ${finalResult.forensicSummary.slice(0, 50)}...`,
        status: finalResult.verdict === 'LIKELY_AUTHENTIC' ? 'safe' : finalResult.verdict === 'LIKELY_AI_GENERATED' ? 'alert' : 'warning',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing image analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <span>Multimodal Visual Forensics & Deepfake Inspection</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Fake Image & Deepfake Forensic Detector
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Inspect suspicious photos, manipulated grade screenshots, forged campus emergency notices, and AI-generated profile pictures. Detects specular anomalies, hallucinated fonts, and digital compositing seams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-5">
            {/* Upload Zone */}
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Upload Media or Document to Audit
            </label>

            <div className="relative rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 transition-colors bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-emerald-400 transition-colors mb-2" />
              <span className="text-xs font-semibold text-slate-200">
                Click to browse or drop an image here
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                PNG, JPG, WebP up to 8MB
              </span>
            </div>

            {/* Selected Image Preview Container */}
            {selectedImage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-xs font-mono">{imageName}</span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear Image
                  </button>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Inspection preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Scanning Visual Forensics...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4" />
                      <span>Analyze Image with CyberShield AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 rounded-lg">
                <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Student Sample Scenarios */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 block">
                Or test authentic student dilemma samples:
              </span>
              <div className="space-y-2">
                {sampleScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sc)}
                    className="w-full p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 text-left transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{sc.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400">Load Test</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sc.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-6 shadow-xl space-y-6">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    result.verdict === 'LIKELY_AUTHENTIC'
                      ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                      : result.verdict === 'LIKELY_AI_GENERATED'
                      ? 'border-rose-500/40 bg-rose-950/60 text-rose-400'
                      : 'border-amber-500/40 bg-amber-950/60 text-amber-400'
                  }`}>
                    {result.verdict === 'LIKELY_AUTHENTIC' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : result.verdict === 'LIKELY_AI_GENERATED' ? (
                      <AlertTriangle className="h-6 w-6" />
                    ) : (
                      <Scan className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      result.verdict === 'LIKELY_AUTHENTIC'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : result.verdict === 'LIKELY_AI_GENERATED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {result.verdict.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      Visual Forensics Assessment
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Synthetic Probability</span>
                  <span className={`text-2xl font-bold font-mono tabular-nums ${
                    result.syntheticProbability > 65
                      ? 'text-rose-400'
                      : result.syntheticProbability > 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {result.syntheticProbability}%
                  </span>
                </div>
              </div>

              {/* Provider Engine Tag */}
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Forensics Engine:</span>
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 font-mono">
                  {result.isAiPowered ? <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> : <Cpu className="h-3.5 w-3.5 text-emerald-400" />}
                  {result.provider}
                </span>
              </div>

              {/* Forensic Summary */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Forensic Summary:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  {result.forensicSummary}
                </p>
              </div>

              {/* Identified Anomalies */}
              {result.anomalies && result.anomalies.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Spotted Artifacts & Anomalies:
                  </span>
                  <div className="space-y-2">
                    {result.anomalies.map((anom, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{anom.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            anom.severity === 'high'
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}>
                            {anom.severity} anomaly
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{anom.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Safety Context */}
              <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/20 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Student Protection Protocol:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {result.studentSafetyContext}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-8 shadow-xl text-center space-y-4 py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                <Scan className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No Image Analyzed Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload an image or pick one of the sample scenarios on the left to trigger the multimodal AI forensic scanner.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
