export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';

export interface HeuristicItem {
  rule: string;
  triggered: boolean;
  severity: 'high' | 'medium' | 'low' | 'safe';
  explanation: string;
}

export interface UrlAnalysisResult {
  url: string;
  isAiPowered: boolean;
  provider: string;
  verdict: Verdict;
  riskScore: number;
  threatType: string;
  targetedService: string;
  technicalAnalysis: string;
  keyRedFlags: string[];
  studentAction: string;
  heuristics: HeuristicItem[];
  hostDetails: {
    host: string;
    protocol: string;
    isIp: boolean;
  };
  timestamp: number;
}

export interface ImageAnomaly {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ImageAnalysisResult {
  isAiPowered: boolean;
  provider: string;
  verdict: 'LIKELY_AI_GENERATED' | 'SUSPICIOUS_MANIPULATION' | 'LIKELY_AUTHENTIC';
  syntheticProbability: number;
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  primaryIndicators: string[];
  anomalies: ImageAnomaly[];
  forensicSummary: string;
  studentSafetyContext: string;
  imageUrl?: string;
  timestamp: number;
}

export interface DeceptiveSegment {
  text: string;
  tactic: string;
  severity: 'high' | 'medium';
}

export interface MessageAnalysisResult {
  isAiPowered: boolean;
  provider: string;
  verdict: Verdict;
  riskScore: number;
  threatType: string;
  impersonatedEntity: string;
  psychologicalTriggers: string[];
  deceptiveSegments: DeceptiveSegment[];
  detailedAnalysis: string;
  recommendedAction: string;
  timestamp: number;
}

export interface NewsAnalysisResult {
  headlineOrClaim: string;
  isAiPowered: boolean;
  provider: string;
  verdict: 'HIGH_CREDIBILITY' | 'QUESTIONABLE_MISINFORMATION' | 'FABRICATED_FAKE_NEWS' | 'SATIRE_PARODY';
  credibilityScore: number; // 0 to 100
  sensationalismLevel: 'LOW' | 'MEDIUM' | 'EXTREME';
  biasRating: string;
  primaryRedFlags: string[];
  evidenceSummary: string;
  factCheckingSources: string[];
  studentVerificationSteps: string[];
  timestamp: number;
}

export interface CompromiseAssessment {
  compromisedAssets: string[];
  severityLevel: 'CRITICAL_IDENTITY_RISK' | 'HIGH_ACCOUNT_RISK' | 'MODERATE_SERVICE_RISK';
  immediateActions: string[];
  recoveryChecklist: {
    id: string;
    title: string;
    detail: string;
    completed: boolean;
  }[];
}

export interface PasswordAnalysis {
  password: string;
  length: number;
  entropy: number;
  crackTimeEstimate: string;
  crackTimeOnline: string;
  score: number;
  tier: 'VERY WEAK' | 'WEAK' | 'FAIR' | 'STRONG' | 'VERY STRONG';
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  weaknessFlags: string[];
  strengths: string[];
}

export interface PasswordAdvice {
  isAiPowered: boolean;
  strengthTier: 'WEAK' | 'MODERATE' | 'STRONG' | 'FORTRESS';
  coachSummary: string;
  mnemonicTip: string;
  recommendations: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizScenarioPayload {
  sender?: string;
  recipient?: string;
  subject?: string;
  timestamp?: string;
  content: string;
  actionButtonLabel?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  category: 'phishing' | 'wifi' | 'privacy' | 'gaming';
  scenarioType?: 'email' | 'sms' | 'chat' | 'network_alert';
  context: string;
  mockPayload?: QuizScenarioPayload;
  question: string;
  options: QuizOption[];
  explanation: string;
  securityTakeaway: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface ActivityLogItem {
  id: string;
  type: 'url_check' | 'password_audit' | 'quiz_completed' | 'ai_consult' | 'image_audit' | 'message_scan' | 'threat_reported' | 'news_check' | 'recovery_initiated';
  title: string;
  detail: string;
  status: 'safe' | 'warning' | 'alert' | 'info';
  timestamp: number;
}

export interface StudentChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestedFollowups?: string[];
}

export interface ThreatAlert {
  id: string;
  title: string;
  category: 'Phishing Wave' | 'Malware Lure' | 'Credential Breach' | 'Campus Advisory';
  severity: 'Critical' | 'High' | 'Medium' | 'Info';
  targetPlatform: string;
  description: string;
  mitigation: string;
  publishedAt: string;
  reportedCount: number;
  isStudentReported?: boolean;
}

export interface CourseLab {
  id: string;
  title: string;
  type: 'terminal' | 'code_review' | 'packet_analysis' | 'quiz_challenge';
  scenario: string;
  objective: string;
  starterCommand?: string;
  expectedOutput?: string;
  hint: string;
}

export interface CourseQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  topics: string[];
  keyConcept: string;
  practicalExercise: CourseLab;
  quiz: CourseQuizItem;
}

export interface HackingCourse {
  id: string;
  title: string;
  slug: string;
  badge: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  certificationTrack: string;
  description: string;
  whatYouWillLearn: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Web Security' | 'Network Pentesting' | 'CTF Walkthroughs' | 'Bug Bounty' | 'Career & Ethics' | 'Safe Labs';
  author: string;
  authorRole: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  codeSnippets?: {
    language: string;
    description: string;
    code: string;
  }[];
  tags: string[];
}

