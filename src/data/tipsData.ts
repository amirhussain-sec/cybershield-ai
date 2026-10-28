export interface SecurityGuide {
  id: string;
  title: string;
  category: 'Accounts' | 'Wi-Fi & Networks' | 'Social & Privacy' | 'Gaming & Scams' | 'AI & Deepfakes';
  readTime: string;
  summary: string;
  keySteps: {
    heading: string;
    detail: string;
  }[];
  threatVector: string;
  proTip: string;
}

export const SECURITY_GUIDES: SecurityGuide[] = [
  {
    id: 'school-sso-guide',
    title: 'Hardening School Google & Canvas SSO Accounts',
    category: 'Accounts',
    readTime: '3 min read',
    summary: 'Your institutional Single Sign-On (SSO) account controls homework submissions, student financial records, campus housing, and internal emails.',
    keySteps: [
      {
        heading: '1. Register an Authenticator App (Not SMS)',
        detail: 'SMS 2FA can be intercepted via SIM-swapping attacks. Bind your account to Google Authenticator, Microsoft Authenticator, or a hardware security key.'
      },
      {
        heading: '2. Audit Third-Party App Permissions',
        detail: 'Students frequently grant "Sign in with Google" to random quiz generators or study apps. Review authorized apps regularly and revoke unused ones.'
      },
      {
        heading: '3. Never Store Passwords in Shared Lab Browsers',
        detail: 'When using campus library or lab computers, always use Private/Incognito browsing and explicitly click "Log Out" when finishing.'
      }
    ],
    threatVector: 'Credential stuffing against student SSO portals; compromised accounts are used to send malware campaigns to all classmates.',
    proTip: 'Bookmark your actual campus login page directly in your browser rather than clicking links sent in campus emails.'
  },
  {
    id: 'campus-wifi-guide',
    title: 'Surviving Public Campus, Dorm & Cafe Wi-Fi',
    category: 'Wi-Fi & Networks',
    readTime: '4 min read',
    summary: 'Open wireless networks are susceptible to packet sniffing, Evil Twin rogue access points, and DNS spoofing.',
    keySteps: [
      {
        heading: '1. Disable Automatic Wi-Fi Connection',
        detail: 'Rogue Wi-Fi pineapple devices broadcast the exact SSIDs your phone remembers (like "Starbucks" or "Campus_Guest") to trick your device into connecting silently.'
      },
      {
        heading: '2. Enforce HTTPS Everywhere',
        detail: 'Verify the padlock icon and ensure your browser strictly warns you about certificate mismatches or insecure HTTP fallbacks.'
      },
      {
        heading: '3. Turn Off File Sharing (AirDrop & Network Discovery)',
        detail: 'Set AirDrop to "Contacts Only" or "Receiving Off" when in crowded campus lecture halls to prevent anonymous malicious file drops.'
      }
    ],
    threatVector: 'Man-In-The-Middle (MITM) session hijacking on unencrypted or spoofed wireless hot spots.',
    proTip: 'If an open network prompts you to download a security software or certificate profile, disconnect immediately.'
  },
  {
    id: 'gaming-discord-guide',
    title: 'Protecting Discord, Steam & Gaming Accounts',
    category: 'Gaming & Scams',
    readTime: '4 min read',
    summary: 'Gamers are prime targets for infostealer malware, token grabbers, fake beta playtests, and deceptive trade requests.',
    keySteps: [
      {
        heading: '1. Beware the "Try My New Game" Scam',
        detail: 'Attackers send ZIP files or links on Discord claiming they need testers for a game. The executable contains a Python/Node token stealer that exfiltrates your browser cookies and Discord tokens in seconds.'
      },
      {
        heading: '2. Guard Your Discord QR Code Login',
        detail: 'Never scan a Discord login QR code shown on a screen or stream claiming to grant "Free Nitro". Scanning it authenticates the attacker\'s browser into your account.'
      },
      {
        heading: '3. Use Steam Guard Mobile Authenticator',
        detail: 'Steam Guard requires an instant code confirmation on your phone for any new login or high-value item trade.'
      }
    ],
    threatVector: 'Infostealer malware (RedLine, Lumma, Vidar) disguised as games or mods, stealing saved browser credentials and cryptocurrency/gaming assets.',
    proTip: 'Store zero payment cards directly on Discord; use PayPal with 2FA or buy prepaid gift cards.'
  },
  {
    id: 'social-privacy-guide',
    title: 'Social Media Anti-Doxxing & Privacy Blueprint',
    category: 'Social & Privacy',
    readTime: '3 min read',
    summary: 'Doxxing occurs when attackers aggregate fragmented personal clues from your public social accounts to expose your real-world identity or address.',
    keySteps: [
      {
        heading: '1. Strip Location EXIF Data from Photos',
        detail: 'Smartphone photos often embed exact GPS coordinates in image metadata. Toggle off location permissions for camera apps before posting dorm or bedroom photos.'
      },
      {
        heading: '2. Separate School Email from Social Usernames',
        detail: 'Never use your student email (.edu) as the public recovery email on TikTok, Instagram, Reddit, or Discord.'
      },
      {
        heading: '3. Avoid Password Recovery Clues in Bios',
        detail: 'Do not disclose your birthdate, high school mascot, pet names, or childhood hometown in public profile bios.'
      }
    ],
    threatVector: 'Open Source Intelligence (OSINT) reconnaissance leading to targeted harassment, swatting, or account takeovers.',
    proTip: 'Search your own username and real name in Google every semester to see what public aggregators and people-finder directories have indexed.'
  },
  {
    id: 'ai-deepfakes-guide',
    title: 'Detecting AI Voice Clones & Urgent Impersonation',
    category: 'AI & Deepfakes',
    readTime: '4 min read',
    summary: 'Generative AI makes it trivial for criminals to clone the voice of a family member, professor, or friend using just 5 seconds of audio from a public video.',
    keySteps: [
      {
        heading: '1. Establish a Family / Dorm "Safe Word"',
        detail: 'Agree with your parents or close friends on a private, offline passphrase to verify identity if someone calls claiming an emergency or bail request.'
      },
      {
        heading: '2. Spot the Unnatural Speech Pauses and Audio Artefacts',
        detail: 'AI voice synthesizers frequently exhibit robotic breathing, abnormal cadence, or flat emotional resonance when pressed with sudden unexpected questions.'
      },
      {
        heading: '3. Always Hang Up and Call Back on a Known Number',
        detail: 'Caller ID can be spoofed trivially. If someone calls in a panic demanding urgent wire transfers or cryptocurrency, hang up and dial their real phone number directly.'
      }
    ],
    threatVector: 'AI-generated audio cloning and urgent emotional manipulation to extract financial payments or gift card codes.',
    proTip: 'Never send money via irreversible methods (wire, Bitcoin, Zelle, Apple Gift Cards) based purely on an urgent phone call or voice message.'
  }
];
