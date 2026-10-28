import { PasswordAnalysis, ActivityLogItem, StudentChecklistItem, Badge } from '../types';

// Curated list of friendly diceware words for student-memorable passphrases
const DICEWARE_WORDLIST = [
  'falcon', 'orbit', 'pixel', 'cipher', 'quantum', 'shield', 'nebula', 'glacier',
  'aurora', 'beacon', 'canyon', 'dragon', 'eclipse', 'forest', 'granite', 'harbor',
  'island', 'jaguar', 'kayak', 'lunar', 'meteor', 'nexus', 'ocean', 'prism',
  'quasar', 'radar', 'safari', 'titan', 'umbra', 'vortex', 'walrus', 'zenith',
  'amber', 'breeze', 'comet', 'delta', 'ember', 'flint', 'galaxy', 'horizon',
  'indigo', 'jungle', 'krypton', 'laser', 'matrix', 'nova', 'oasis', 'pulsar',
  'shadow', 'thunder', 'velocity', 'winter', 'yellow', 'zephyr', 'acorn', 'blizzard'
];

// Common weak student passwords to flag immediately
const COMMON_WEAK_PASSWORDS = new Set([
  'password', 'password123', '123456', '12345678', '123456789', 'qwerty',
  'student', 'student123', 'school', 'school2024', 'school2025', 'school2026',
  'admin', 'welcome', 'welcome1', 'iloveyou', 'football', 'basketball', 'secret',
  'monkey', 'letmein', 'canvas', 'campus', 'canvas123', 'student@123'
]);

/**
 * Calculates Shannon Entropy and brute-force resistance
 */
export function analyzePasswordSecurity(password: string): PasswordAnalysis {
  const length = password.length;
  if (length === 0) {
    return {
      password: '',
      length: 0,
      entropy: 0,
      crackTimeEstimate: 'Instant',
      crackTimeOnline: 'Instant',
      score: 0,
      tier: 'VERY WEAK',
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSymbol: false,
      weaknessFlags: ['Password cannot be blank.'],
      strengths: [],
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 33;

  // Shannon Entropy in bits = Length * log2(poolSize)
  const entropy = poolSize > 0 ? length * (Math.log(poolSize) / Math.LN2) : 0;

  const weaknessFlags: string[] = [];
  const strengths: string[] = [];

  const lowerPass = password.toLowerCase();

  // 1. Common password check
  if (COMMON_WEAK_PASSWORDS.has(lowerPass)) {
    weaknessFlags.push('Matches a known top-100 breached dictionary password.');
  }

  // 2. Length evaluation
  if (length < 8) {
    weaknessFlags.push('Critically short (< 8 chars): Trivial for modern GPU clusters to crack.');
  } else if (length < 12) {
    weaknessFlags.push('Below recommended standard (aim for 14+ characters or a 4-word passphrase).');
  } else if (length >= 16) {
    strengths.push('Excellent length (16+ chars provides exponential defense).');
  } else {
    strengths.push('Solid baseline length (12-15 chars).');
  }

  // 3. Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    weaknessFlags.push('Contains repetitive character sequences (e.g. "aaa", "111").');
  }

  // 4. Sequential numbers
  if (/(012|123|234|345|456|567|678|789|890)/.test(password)) {
    weaknessFlags.push('Contains predictable sequential numbers (e.g. "123").');
  }

  // 5. Common keyboard walks
  if (/(qwerty|asdf|zxcv)/i.test(password)) {
    weaknessFlags.push('Contains keyboard pattern walk (e.g. "qwerty").');
  }

  // Diversity strengths
  const charTypesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (charTypesCount >= 4) {
    strengths.push('Full character diversity (Uppercase, Lowercase, Numbers, Symbols).');
  } else if (charTypesCount >= 3) {
    strengths.push('Good mix of character types.');
  }

  // Calculate Crack Time
  // Offline fast-hash assumption: 10^11 (100 billion) hashes/second (RTX 4090 cluster)
  // Online throttled assumption: 100 attempts / hour
  const combinations = Math.pow(poolSize, length);
  const secondsOffline = combinations / (1e11 * 2); // Average time to find = combinations / 2
  const crackTimeEstimate = formatCrackTime(secondsOffline);

  const secondsOnline = (combinations / 2) * 36; // 100/hr = 1 attempt every 36s
  const crackTimeOnline = formatCrackTime(secondsOnline);

  // Score from 0 to 100
  let score = Math.min(100, Math.round((entropy / 80) * 80));
  if (charTypesCount >= 3) score += 10;
  if (length >= 14) score += 10;
  if (weaknessFlags.length > 0) score = Math.max(10, score - weaknessFlags.length * 15);
  score = Math.min(100, Math.max(5, score));

  let tier: 'VERY WEAK' | 'WEAK' | 'FAIR' | 'STRONG' | 'VERY STRONG' = 'VERY WEAK';
  if (score >= 85) tier = 'VERY STRONG';
  else if (score >= 70) tier = 'STRONG';
  else if (score >= 50) tier = 'FAIR';
  else if (score >= 30) tier = 'WEAK';

  return {
    password,
    length,
    entropy: Math.round(entropy * 10) / 10,
    crackTimeEstimate,
    crackTimeOnline,
    score,
    tier,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    weaknessFlags,
    strengths,
  };
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instant (< 1 second)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)} thousand years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
  return `${(years / 1e9).toFixed(1)} billion years`;
}

/**
 * Generates memorable student passphrase (Diceware style)
 */
export function generatePassphrase(wordCount = 4, separator = '-', includeNumber = true): string {
  const chosenWords: string[] = [];
  const wordsLength = DICEWARE_WORDLIST.length;

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * wordsLength);
    const word = DICEWARE_WORDLIST[randomIndex];
    // Capitalize first letter
    chosenWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  }

  let phrase = chosenWords.join(separator);
  if (includeNumber) {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const symbols = ['!', '#', '$', '%', '&', '*'];
    const randomSym = symbols[Math.floor(Math.random() * symbols.length)];
    phrase += `${separator}${randomNum}${randomSym}`;
  }
  return phrase;
}

/**
 * Generates high-entropy random password
 */
export function generateComplexPassword(length = 16, useSymbols = true): string {
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charsNumbers = '0123456789';
  const charsSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let pool = charsLower + charsUpper + charsNumbers;
  if (useSymbols) pool += charsSymbols;

  let result = '';
  // Ensure at least one of each
  result += charsLower[Math.floor(Math.random() * charsLower.length)];
  result += charsUpper[Math.floor(Math.random() * charsUpper.length)];
  result += charsNumbers[Math.floor(Math.random() * charsNumbers.length)];
  if (useSymbols) result += charsSymbols[Math.floor(Math.random() * charsSymbols.length)];

  while (result.length < length) {
    result += pool[Math.floor(Math.random() * pool.length)];
  }

  // Shuffle
  return result
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

// -------------------------------------------------------------
// Local Storage Persistence & Cyber Readiness Score
// -------------------------------------------------------------
const STORAGE_KEYS = {
  ACTIVITY_LOG: 'cybershield_activity_log',
  BADGES: 'cybershield_badges',
  CHECKLIST: 'cybershield_hardening_checklist',
  QUIZ_SCORES: 'cybershield_quiz_scores',
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'phish_hunter',
    title: 'Phishing Detective',
    description: 'Successfully analyze 3 suspicious URLs or identify a fake campus portal.',
    iconName: 'ShieldAlert',
    unlocked: false,
  },
  {
    id: 'entropy_master',
    title: 'Entropy Master',
    description: 'Construct a fortress-grade password with > 75 bits of mathematical entropy.',
    iconName: 'KeyRound',
    unlocked: false,
  },
  {
    id: 'drill_champion',
    title: 'Cyber Drill Champion',
    description: 'Complete a student safety drill with 100% correct answers.',
    iconName: 'Trophy',
    unlocked: false,
  },
  {
    id: 'hardening_guardian',
    title: 'Privacy Guardian',
    description: 'Complete at least 5 student security hardening checklist tasks.',
    iconName: 'Lock',
    unlocked: false,
  },
  {
    id: 'ai_collaborator',
    title: 'Security Scholar',
    description: 'Consult CyberShield AI Mentor on an authentic cyber dilemma.',
    iconName: 'Bot',
    unlocked: false,
  },
];

export const INITIAL_CHECKLIST: StudentChecklistItem[] = [
  {
    id: 'check-2fa-school',
    title: 'Enable 2FA on School SSO / Canvas Portal',
    description: 'Configure an authenticator app (e.g. Duo, Google Authenticator) for your primary student login.',
    category: 'Accounts',
    isCompleted: false,
  },
  {
    id: 'check-password-manager',
    title: 'Adopt a Dedicated Password Manager',
    description: 'Set up Bitwarden, 1Password, or Chrome/iCloud Keychain so you never reuse passwords across sites.',
    category: 'Accounts',
    isCompleted: false,
  },
  {
    id: 'check-discord-2fa',
    title: 'Secure Discord & Steam Accounts',
    description: 'Turn on 2FA and disable untrusted external app integrations and OAuth tokens.',
    category: 'Gaming',
    isCompleted: false,
  },
  {
    id: 'check-campus-wifi',
    title: 'Verify Automatic Wi-Fi Reconnect Settings',
    description: 'Disable "Connect automatically to open networks" on your phone and student laptop.',
    category: 'Network',
    isCompleted: false,
  },
  {
    id: 'check-social-privacy',
    title: 'Lock Down Instagram & TikTok Privacy',
    description: 'Set profiles to private or restrict phone number / email lookup to prevent credential harvesting.',
    category: 'Privacy',
    isCompleted: false,
  },
  {
    id: 'check-cloud-backups',
    title: 'Create an Offline or Cloud Backup for Coursework',
    description: 'Ensure papers and projects are backed up on Google Drive or OneDrive to mitigate accidental data loss.',
    category: 'Hygiene',
    isCompleted: false,
  },
];

export function loadActivityLog(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
    if (!raw) return getInitialDemoActivity();
    return JSON.parse(raw);
  } catch {
    return getInitialDemoActivity();
  }
}

export function saveActivityLog(item: Omit<ActivityLogItem, 'id' | 'timestamp'>): void {
  try {
    const current = loadActivityLog();
    const newItem: ActivityLogItem = {
      ...item,
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...current].slice(0, 20); // Keep last 20
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed saving activity item:', e);
  }
}

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (!raw) return INITIAL_BADGES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_BADGES;
  }
}

export function unlockBadge(badgeId: string): boolean {
  try {
    const current = loadBadges();
    const target = current.find((b) => b.id === badgeId);
    if (target && !target.unlocked) {
      target.unlocked = true;
      target.unlockedAt = Date.now();
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(current));
      return true; // Newly unlocked
    }
    return false;
  } catch {
    return false;
  }
}

export function loadChecklist(): StudentChecklistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (!raw) return INITIAL_CHECKLIST;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHECKLIST;
  }
}

export function toggleChecklistItem(id: string): StudentChecklistItem[] {
  try {
    const current = loadChecklist();
    const updated = current.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(updated));

    // Check if 5+ are completed to unlock badge
    const completedCount = updated.filter((i) => i.isCompleted).length;
    if (completedCount >= 5) {
      unlockBadge('hardening_guardian');
    }

    return updated;
  } catch {
    return INITIAL_CHECKLIST;
  }
}

export function calculateCyberReadinessScore(): {
  overallScore: number;
  gradeTier: string;
  phishingScore: number;
  passwordScore: number;
  hygieneScore: number;
} {
  const checklist = loadChecklist();
  const badges = loadBadges();
  const completedChecks = checklist.filter((i) => i.isCompleted).length;
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  // Base scores with progress weights
  const hygieneScore = Math.min(100, Math.round((completedChecks / checklist.length) * 100));
  const phishingScore = Math.min(100, 65 + (badges.find((b) => b.id === 'phish_hunter')?.unlocked ? 35 : 0));
  const passwordScore = Math.min(100, 60 + (badges.find((b) => b.id === 'entropy_master')?.unlocked ? 40 : 0));

  const overallScore = Math.round((phishingScore * 0.35) + (passwordScore * 0.35) + (hygieneScore * 0.30));

  let gradeTier = 'Novice Defender';
  if (overallScore >= 90) gradeTier = 'Elite Cyber Vanguard';
  else if (overallScore >= 75) gradeTier = 'Security Scholar';
  else if (overallScore >= 60) gradeTier = 'Aware Apprentice';

  return {
    overallScore,
    gradeTier,
    phishingScore,
    passwordScore,
    hygieneScore,
  };
}

function getInitialDemoActivity(): ActivityLogItem[] {
  return [
    {
      id: 'demo-1',
      type: 'url_check',
      title: 'Canvas SSO URL Analysis',
      detail: 'Verified legitimate academic domain: canvas.instructure.com',
      status: 'safe',
      timestamp: Date.now() - 1000 * 60 * 25,
    },
    {
      id: 'demo-2',
      type: 'quiz_completed',
      title: 'Phishing Drill: Fake Financial Aid SMS',
      detail: 'Score: 100% · Identified fake payment portal link',
      status: 'safe',
      timestamp: Date.now() - 1000 * 60 * 120,
    },
    {
      id: 'demo-3',
      type: 'password_audit',
      title: 'Student Passphrase Audit',
      detail: 'Audited 18-character Diceware passphrase (86.4 bits entropy)',
      status: 'safe',
      timestamp: Date.now() - 1000 * 60 * 360,
    },
  ];
}
