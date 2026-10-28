import { HackingCourse, BlogArticle } from '../types';

export const ETHICAL_HACKING_COURSES: HackingCourse[] = [
  {
    id: 'course-foundations-101',
    title: 'Ethical Hacking & White-Hat Fundamentals',
    slug: 'ethical-hacking-fundamentals',
    badge: 'Core Track',
    level: 'Beginner',
    durationHours: 14,
    certificationTrack: 'CompTIA Security+ · eJPT Alignment',
    description:
      'Master the legal frameworks, hacker mindset, Linux terminal commands, TCP/IP networking, and ethical boundaries that separate white-hat penetration testers from malicious actors.',
    whatYouWillLearn: [
      'Rules of engagement, Computer Fraud and Abuse Act (CFAA), and bug bounty authorizations',
      'Essential Kali Linux terminal mastery (bash scripting, permissions, process management)',
      'TCP/IP 3-way handshake, DNS records, Wireshark packet capture analysis',
      'Passive vs. active reconnaissance and digital footprinting fundamentals',
    ],
    prerequisites: ['Basic computer literacy', 'Curiosity and commitment to ethical principles'],
    modules: [
      {
        id: 'mod-1-1',
        title: 'Module 1: The Hacker Mindset & Legal Rules of Engagement',
        durationMinutes: 45,
        summary:
          'Learn the precise legal boundary between white-hat research and criminal intrusion. Understand Written Authorization, Scope documents, and non-disclosure agreements.',
        topics: [
          'White Hat vs. Black Hat vs. Gray Hat spectrum',
          'Computer Misuse Act & CFAA implications for students',
          'Components of a Penetration Testing Scope Document',
          'Setting up isolated virtual lab boundaries',
        ],
        keyConcept:
          'Written Permission is your impenetrable shield. Scanning or interacting with any server without documented owner authorization constitutes an illegal intrusion, regardless of intent.',
        practicalExercise: {
          id: 'lab-1-1',
          title: 'Lab: Drafting a Simulated Penetration Testing Scope',
          type: 'quiz_challenge',
          scenario: 'A university professor asks you to "check if my research lab website is secure."',
          objective: 'Identify what documentation you must obtain before sending a single probe packet.',
          hint: 'Never test without signed authorization from the university registrar/CIO, not just a verbal professor request.',
        },
        quiz: {
          question: 'What is the single most critical requirement before performing any security scan on a target system?',
          options: [
            'Using a VPN to conceal your campus IP address',
            'Explicit written and signed authorization defining target scope from the authorized owner',
            'Running Kali Linux inside a VirtualBox container',
            'Publishing a disclosure announcement on GitHub or Discord',
          ],
          correctIndex: 1,
          explanation:
            'Legal offensive security requires unambiguous, signed authorization specifying explicit IP ranges, domains, and testing windows. Intent does not excuse unauthorized access under law.',
        },
      },
      {
        id: 'mod-1-2',
        title: 'Module 2: Linux Mastery for Security Researchers',
        durationMinutes: 60,
        summary:
          'Offensive security lives in the terminal. Learn bash navigation, file permissions (chmod/chown), piping (grep, awk, sed), package management, and basic bash automation.',
        topics: [
          'Linux directory hierarchy (/etc, /var/log, /proc, /dev)',
          'User permissions, SUID bits, and sudo privileges',
          'Chaining CLI utilities with pipes and regex filters',
          'Writing your first automated IP ping-sweep bash script',
        ],
        keyConcept:
          'The Linux shell allows security analysts to process gigabytes of server logs and automate repetitive reconnaissance with a few chained commands.',
        practicalExercise: {
          id: 'lab-1-2',
          title: 'Terminal Lab: Discovering SUID Binaries on Linux',
          type: 'terminal',
          scenario:
            'You suspect an escalated permission backdoor on your student lab workstation.',
          objective: 'Run the standard Linux find command to locate binaries with the SUID bit set.',
          starterCommand: 'find / -perm -u=s -type f 2>/dev/null',
          expectedOutput:
            '/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/chsh\n/usr/bin/newgrp\n/opt/lab/backup_tool (Anomaly: SUID set on non-standard binary)',
          hint: 'The 2>/dev/null redirect suppresses standard permission-denied errors so you can clearly see the output list.',
        },
        quiz: {
          question: 'In Linux permissions, what does a command like "chmod +s /bin/bash" enable?',
          options: [
            'It secures the bash shell from being read by unauthorized users',
            'It enables the SUID bit, causing bash to execute with root permissions whenever run by any user',
            'It restarts the SSH daemon securely',
            'It compresses the binary to save disk space',
          ],
          correctIndex: 1,
          explanation:
            'Setting the SUID (Set User ID) bit on bash is a classic privilege escalation misconfiguration. It allows any unprivileged local user to spawn a root shell.',
        },
      },
      {
        id: 'mod-1-3',
        title: 'Module 3: Network Protocols & Wireshark Deep Dive',
        durationMinutes: 75,
        summary:
          'Deconstruct TCP, UDP, ICMP, DNS, and HTTP/HTTPS packets. Learn how Wireshark filters identify unencrypted credentials and suspicious beaconing.',
        topics: [
          'The 7 Layers of the OSI model vs TCP/IP stack',
          'TCP 3-way handshake (SYN, SYN-ACK, ACK) and teardown',
          'DNS query resolution and DNS tunneling detection',
          'Writing Wireshark display filters (http.request.method, tcp.flags.syn==1)',
        ],
        keyConcept:
          'Traffic that does not use modern TLS encryption exposes sensitive data, session cookies, and login parameters directly to anyone sharing the Wi-Fi or local switch segment.',
        practicalExercise: {
          id: 'lab-1-3',
          title: 'Packet Lab: Filtering Unencrypted HTTP Post Credentials',
          type: 'packet_analysis',
          scenario: 'A captured .pcap file contains 1,200 campus network packets.',
          objective: 'Write the Wireshark display filter to locate form submissions containing login credentials.',
          starterCommand: 'http.request.method == "POST"',
          expectedOutput:
            'Packet #412: POST /student-login.php HTTP/1.1 -> Content-Type: application/x-www-form-urlencoded (user=student99&pass=P@ssw0rd123)',
          hint: 'Filter for HTTP POST requests to isolate form submissions rather than browsing GET requests.',
        },
        quiz: {
          question: 'Which flag combination is sent by a client machine to initiate a standard TCP connection?',
          options: [
            'RST (Reset)',
            'FIN-ACK (Finish Acknowledge)',
            'SYN (Synchronize)',
            'PSH-URG (Push Urgent)',
          ],
          correctIndex: 2,
          explanation:
            'The client sends a SYN packet to begin the TCP 3-way handshake. The server responds with SYN-ACK, and the client completes it with an ACK packet.',
        },
      },
    ],
  },
  {
    id: 'course-owasp-top-10',
    title: 'OWASP Top 10: Web Application Pentesting',
    slug: 'owasp-top-10-web-pentesting',
    badge: 'Most Popular',
    level: 'Intermediate',
    durationHours: 18,
    certificationTrack: 'eWPT · CEH · Web Bug Bounty',
    description:
      'Learn how the web breaks. Explore SQL Injection, Cross-Site Scripting (XSS), Broken Object Level Authorization (BOLA), CSRF, and Server-Side Request Forgery (SSRF) with hands-on interception proxies.',
    whatYouWillLearn: [
      'Configuring Burp Suite Community as a local interception proxy',
      'Exploiting and remediating SQL Injection (SQLi) using parameterized queries',
      'Reflected, Stored, and DOM-based Cross-Site Scripting (XSS) payloads',
      'Insecure Direct Object References (IDOR) and broken access control checks',
      'Session token hijacking and modern JSON Web Token (JWT) vulnerabilities',
    ],
    prerequisites: ['Basic HTML/JavaScript understanding', 'Fundamentals of HTTP methods (GET, POST)'],
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: Burp Suite & Request Interception',
        durationMinutes: 50,
        summary:
          'Set up your browser to proxy all HTTP/S traffic through Burp Suite. Learn how to pause, tamper with, and replay HTTP requests before they reach the server.',
        topics: [
          'Configuring local proxy (127.0.0.1:8080) and installing CA root certificate',
          'Burp Repeater for iterative parameter testing',
          'Burp Intruder for rate-limited fuzzing',
          'Target sitemap and active/passive crawl scopes',
        ],
        keyConcept:
          'Client-side validation in the browser (HTML5 "required" or JS checks) provides zero security. An attacker intercepts and modifies the raw HTTP payload directly with an interception proxy.',
        practicalExercise: {
          id: 'lab-2-1',
          title: 'Interception Lab: Bypassing Client-Side Price Fields',
          type: 'terminal',
          scenario: 'An e-commerce form sends hidden input fields: `<input name="price" value="99.99">`.',
          objective: 'Inspect the raw POST request in Burp Repeater and explain why server validation is essential.',
          starterCommand: 'curl -X POST http://lab.local/checkout -d "item_id=402&price=0.01"',
          expectedOutput:
            'Vulnerable response: 200 OK Order Placed for $0.01\nSecure response: 400 Bad Request: Price must be resolved from server database, not client payload.',
          hint: 'Never trust any data submitted by the client, including cookies, hidden form fields, and HTTP headers.',
        },
        quiz: {
          question: 'Why does disabling JavaScript in a web browser not protect a website against malicious inputs?',
          options: [
            'Because JavaScript is automatically re-enabled by the server',
            'Because attackers can send raw HTTP requests directly via proxies like Burp Suite or cURL, bypassing browser JavaScript entirely',
            'Because modern databases execute JavaScript on the server',
            'Because HTML forms cannot submit data without JavaScript',
          ],
          correctIndex: 1,
          explanation:
            'Browser client-side checks only exist for user experience. Malicious requests originate directly from HTTP tools, completely bypassing browser execution.',
        },
      },
      {
        id: 'mod-2-2',
        title: 'Module 2: SQL Injection (SQLi) Attack & Defense',
        durationMinutes: 70,
        summary:
          'Discover how unsanitized database queries allow attackers to bypass login screens, extract entire tables, and drop databases. Learn modern defense with Prepared Statements.',
        topics: [
          'Classic Authentication Bypass (`\' OR 1=1 --`)',
          'UNION-based data extraction from information_schema',
          'Blind and Time-based SQL Injection',
          'Remediation: PDO and Parameterized Queries in Node.js, Python, and PHP',
        ],
        keyConcept:
          'SQL injection happens when code and data are treated as the same stream. Prepared statements separate the SQL command structure from user data arguments, making injection syntactically impossible.',
        practicalExercise: {
          id: 'lab-2-2',
          title: 'Code Review Lab: Spotting & Fixing Vulnerable Queries',
          type: 'code_review',
          scenario:
            'Review a student gradebook lookup endpoint: `db.query("SELECT * FROM grades WHERE student_id = " + req.query.id)`',
          objective: 'Rewrite the endpoint using parameterized query bindings.',
          starterCommand: 'SELECT * FROM grades WHERE student_id = ?',
          expectedOutput:
            'Secure implementation: db.query("SELECT * FROM grades WHERE student_id = ?", [req.query.id])',
          hint: 'Replace raw string concatenation with a placeholder (?) and pass parameters as an array.',
        },
        quiz: {
          question: 'What makes Prepared Statements / Parameterized Queries the gold standard defense against SQL Injection?',
          options: [
            'They filter out single quotes and semicolons using regex',
            'They compile the SQL command structure first, treating user input strictly as literal parameter data that cannot alter the SQL syntax',
            'They encrypt the database password in memory',
            'They convert all incoming SQL queries to uppercase',
          ],
          correctIndex: 1,
          explanation:
            'Prepared statements pre-compile the SQL template on the database engine. User input is supplied separately as typed parameters, so it can never be parsed as SQL code.',
        },
      },
      {
        id: 'mod-2-3',
        title: 'Module 3: Cross-Site Scripting (XSS) & Content Security Policy',
        durationMinutes: 65,
        summary:
          'Understand how injected JavaScript executes in the context of a victim\'s browser session. Learn how to steal session tokens, deface pages, and defend with context-aware escaping & CSP headers.',
        topics: [
          'Stored XSS (persistent in forum posts, user profiles)',
          'Reflected XSS (immediate reflection in search queries, error pages)',
          'DOM-based XSS (client-side sink exploitation)',
          'Defenses: Contextual output encoding, HttpOnly cookie flags, and Content Security Policy (CSP)',
        ],
        keyConcept:
          'Setting the `HttpOnly` flag on session cookies prevents client-side JavaScript from accessing `document.cookie`, neutralizing token theft via XSS.',
        practicalExercise: {
          id: 'lab-2-3',
          title: 'Payload Lab: Neutralizing Stored Script Injections',
          type: 'code_review',
          scenario: 'A campus comment board displays comments using `element.innerHTML = commentText;`.',
          objective: 'Identify the secure DOM replacement method that treats input as plain text.',
          starterCommand: 'element.textContent = commentText;',
          expectedOutput:
            'By using element.textContent (or textContent binding in React), the browser displays `<script>alert(1)</script>` as plain characters without executing it.',
          hint: 'Avoid innerHTML and dangerouslySetInnerHTML with untrusted user input.',
        },
        quiz: {
          question: 'Which HTTP response header directive prevents a browser from loading scripts from unauthorized external domains?',
          options: [
            'X-Frame-Options: DENY',
            'Content-Security-Policy: default-src \'self\'; script-src \'self\' https://trustedcdn.com',
            'Strict-Transport-Security: max-age=31536000',
            'Access-Control-Allow-Origin: *',
          ],
          correctIndex: 1,
          explanation:
            'Content-Security-Policy (CSP) allows server administrators to declare approved sources of executable scripts, mitigating unauthorized script execution from XSS.',
        },
      },
    ],
  },
  {
    id: 'course-network-recon',
    title: 'Network Penetration Testing & Reconnaissance',
    slug: 'network-pentesting-recon',
    badge: 'Hands-on',
    level: 'Intermediate',
    durationHours: 20,
    certificationTrack: 'OSCP · eJPT · Network+ Prep',
    description:
      'Master Nmap host discovery, service enumeration, OS fingerprinting, vulnerability scanning, banner grabbing, and modern wireless defense.',
    whatYouWillLearn: [
      'Nmap scan types (SYN stealth, UDP, Version detection, NSE scripts)',
      'Banner grabbing and correlating discovered services with CVE databases',
      'Enumerating SMB, SSH, FTP, and SNMP protocols',
      'Wi-Fi security protocols (WPA2 vs WPA3 SAE, Evil Twin rogue access points)',
      'Generating professional penetration testing executive summaries',
    ],
    prerequisites: ['Completed Ethical Hacking 101 or equivalent networking foundation'],
    modules: [
      {
        id: 'mod-3-1',
        title: 'Module 1: Nmap Scanning Mechanics & NSE Scripts',
        durationMinutes: 70,
        summary:
          'Deep dive into network scanning. Understand SYN stealth scans, timing templates (-T4), service version detection (-sV), and the Nmap Scripting Engine (NSE).',
        topics: [
          'TCP SYN scan (-sS) vs TCP Connect scan (-sT)',
          'Port states: Open, Closed, Filtered (firewall drop vs reject)',
          'Running vulnerability check scripts with `--script vuln`',
          'Output formats (-oN, -oX, -oG) for documentation',
        ],
        keyConcept:
          'Nmap does not merely check if ports are open; service versioning (-sV) probes banners and protocol quirks to pinpoint exact daemon versions for CVE matching.',
        practicalExercise: {
          id: 'lab-3-1',
          title: 'Terminal Lab: Running an Nmap Service & Script Scan',
          type: 'terminal',
          scenario: 'Scan your safe sandbox virtual machine at IP 192.168.56.101.',
          objective: 'Formulate the Nmap command to scan top 100 ports with version detection and default safe scripts.',
          starterCommand: 'nmap -sV -sC -F 192.168.56.101',
          expectedOutput:
            'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp open  http    Apache httpd 2.4.52\n|_http-title: Student Research Portal\n443/tcp open ssl/http Apache httpd 2.4.52',
          hint: 'Use -sV for version detection, -sC for safe scripts, and -F for the 100 fast ports.',
        },
        quiz: {
          question: 'What is the advantage of a TCP SYN scan (-sS) over a standard full TCP connect scan (-sT)?',
          options: [
            'It cracks the remote server password automatically',
            'It does not complete the 3-way handshake, making it faster and less likely to be logged by basic application services',
            'It encrypts the network packets with AES-256',
            'It works on UDP ports as well as TCP ports',
          ],
          correctIndex: 1,
          explanation:
            'A SYN stealth scan sends a SYN packet and waits for SYN-ACK. If received, it immediately sends an RST (Reset) packet instead of completing the handshake with an ACK, avoiding complete connection logging on simple application servers.',
        },
      },
      {
        id: 'mod-3-2',
        title: 'Module 2: Enumeration Protocols (SMB, SSH, SNMP)',
        durationMinutes: 60,
        summary:
          'Information gathering is 80% of penetration testing. Learn how to query open SMB shares with enum4linux, audit SSH configurations, and inspect SNMP community strings.',
        topics: [
          'Null sessions and guest access in SMB shares',
          'SSH hardening (disabling root login, password authentication, enforcing ed25519 keys)',
          'SNMP v1/v2 default community strings ("public", "private")',
          'Mapping target attack surfaces with Spiderfoot and Amass',
        ],
        keyConcept:
          'Default credentials and unauthenticated guest shares represent the overwhelming majority of real-world enterprise entry points, not zero-day exploits.',
        practicalExercise: {
          id: 'lab-3-2',
          title: 'Audit Lab: Auditing SSH Configuration for Hardening',
          type: 'code_review',
          scenario: 'Inspect an /etc/ssh/sshd_config file on a campus server.',
          objective: 'Identify settings that must be changed to prevent brute-force intrusions.',
          starterCommand: 'PermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes',
          expectedOutput:
            'Hardened configuration verified: Root logins blocked, password guessing disabled, cryptographic SSH keys enforced.',
          hint: 'Enforce public key authentication and disable root logins.',
        },
        quiz: {
          question: 'Which of the following represents the most secure SSH authentication policy?',
          options: [
            'Using an 8-character numeric password rotated weekly',
            'Disabling password authentication entirely and enforcing ED25519/RSA public-private key pairs with a local passphrase',
            'Allowing root login over Telnet on port 23',
            'Using the default student ID as the SSH password',
          ],
          correctIndex: 1,
          explanation:
            'Public key authentication using modern ED25519 keys eliminates password brute-force attacks, as no password travels across the wire.',
        },
      },
      {
        id: 'mod-3-3',
        title: 'Module 3: Wireless Defense & Rogue APs (Evil Twin)',
        durationMinutes: 50,
        summary:
          'Analyze Wi-Fi 802.11 frames. Understand beacon frames, probe requests, 4-way WPA handshakes, and how Evil Twin rogue access points deceive student devices in cafes and libraries.',
        topics: [
          'WPA2-PSK 4-way handshake mechanics and dictionary attacks',
          'WPA3 Simultaneous Authentication of Equals (SAE) improvements',
          'Evil Twin access point anatomy and DNS spoofing captive portals',
          'Defending mobile devices: disabling auto-join and validating Wi-Fi certs',
        ],
        keyConcept:
          'Smartphones constantly broadcast probe requests for known SSIDs (e.g. "Campus-Guest"). Rogue access points listen to these probes, forge that exact SSID, and trick devices into auto-connecting.',
        practicalExercise: {
          id: 'lab-3-3',
          title: 'Simulation Lab: Detecting an Evil Twin Rogue Hotspot',
          type: 'packet_analysis',
          scenario:
            'You are connected to "Campus-Secure". Suddenly your device prompts you to log into an HTTP captive portal asking for your student password.',
          objective: 'Analyze the indicators of an Evil Twin attack.',
          starterCommand: 'iw dev wlan0 link',
          expectedOutput:
            'Alert: Connected BSSID does not match official campus access point OUI; captive portal is unencrypted HTTP.',
          hint: 'Official WPA2/WPA3 Enterprise Wi-Fi authenticates via 802.1X certificates, never plain HTTP web login forms.',
        },
        quiz: {
          question: 'Why should students disable "Auto-Join Known Networks" on their smartphones when traveling off-campus?',
          options: [
            'It saves battery and prevents the device from connecting to a malicious attacker broadcasting a duplicate SSID',
            'It prevents the phone from receiving carrier software updates',
            'It disables the phone camera',
            'It deletes cached browser cookies',
          ],
          correctIndex: 0,
          explanation:
            'Disabling auto-connect prevents your phone from automatically associating with rogue Evil Twin Wi-Fi hotspots set up by attackers mimicking familiar coffee shop or airport network names.',
        },
      },
    ],
  },
  {
    id: 'course-bug-bounty-101',
    title: 'Bug Bounty Hunting & Ethical Disclosure',
    slug: 'bug-bounty-ethical-disclosure',
    badge: 'Career Path',
    level: 'Intermediate',
    durationHours: 16,
    certificationTrack: 'HackerOne · Bugcrowd · Career Preparation',
    description:
      'Learn how to legally hunt vulnerabilities on real-world targets. Explore asset discovery, out-of-scope pitfalls, writing high-impact triage reports, and earning bounties ethically.',
    whatYouWillLearn: [
      'Rules of Engagement on HackerOne, Bugcrowd, and Intigriti platforms',
      'Subdomain enumeration, directory fuzzing, and asset discovery workflows',
      'Finding low-hanging business logic errors and rate-limiting bypasses',
      'Writing professional vulnerability disclosure reports that triage teams love',
      'Understanding Common Vulnerability Scoring System (CVSS v3.1) metrics',
    ],
    prerequisites: ['Completion of Web Application Pentesting or equivalent knowledge'],
    modules: [
      {
        id: 'mod-4-1',
        title: 'Module 1: Scoping & The Vulnerability Disclosure Policy (VDP)',
        durationMinutes: 45,
        summary:
          'Understand in-scope vs out-of-scope targets, safe harbor clauses, and how to verify if a company permits security testing before touching a single domain.',
        topics: [
          'Reading a security.txt file on production websites',
          'Safe Harbor clauses: Legal protection for good-faith researchers',
          'Common out-of-scope items (DoS/DDoS, social engineering, physical)',
          'Rate limiting etiquette so you do not disrupt production users',
        ],
        keyConcept:
          'Testing an out-of-scope asset listed on a bug bounty program will immediately lead to account disqualification and potential legal exposure. Always double-check your scope list.',
        practicalExercise: {
          id: 'lab-4-1',
          title: 'Recon Lab: Reading security.txt on Target Domains',
          type: 'terminal',
          scenario: 'Before testing an online service, check their disclosure policy.',
          objective: 'Fetch the standardized RFC 9116 security.txt file from a domain.',
          starterCommand: 'curl -s https://example.com/.well-known/security.txt',
          expectedOutput:
            'Contact: mailto:security@example.com\nPolicy: https://example.com/security-policy\nPreferred-Languages: en\nCanonical: https://example.com/.well-known/security.txt',
          hint: 'The standardized location for vulnerability disclosure policies is /.well-known/security.txt.',
        },
        quiz: {
          question: 'What is the purpose of the standardized "/.well-known/security.txt" file on a website?',
          options: [
            'It contains the administrator password hash',
            'It provides security researchers with official contact details, disclosure policies, and encryption keys for reporting vulnerabilities',
            'It blocks all web crawlers and Google bots',
            'It configures the firewall on the host machine',
          ],
          correctIndex: 1,
          explanation:
            'RFC 9116 defines /.well-known/security.txt as the machine-readable standard for organizations to publish their security contact details and vulnerability reporting guidelines.',
        },
      },
      {
        id: 'mod-4-2',
        title: 'Module 2: Writing High-Impact Vulnerability Reports',
        durationMinutes: 55,
        summary:
          'A vulnerability is only rewarded if triage analysts can reproduce it cleanly. Learn how to write concise executive summaries, reproducible steps, and accurate CVSS calculations.',
        topics: [
          'Anatomy of a 5-star report (Title, Severity, Asset, Steps, Impact, Fix)',
          'CVSS v3.1 calculation (Attack Vector, Privileges Required, Impact)',
          'Providing non-destructive Proof of Concepts (PoCs)',
          'Professional communication with triage teams and security engineers',
        ],
        keyConcept:
          'Demonstrate impact, not destruction. Prove a SQL injection by querying `SELECT @@version;` or user count, never by dumping private customer records or dropping tables.',
        practicalExercise: {
          id: 'lab-4-2',
          title: 'Report Lab: Writing a Non-Destructive Proof of Concept',
          type: 'code_review',
          scenario:
            'You discovered an IDOR allowing access to another user\'s profile picture settings.',
          objective: 'Formulate a safe PoC using two test accounts you personally own.',
          starterCommand: 'curl -H "Authorization: Bearer <AccountA_Token>" https://api.site.com/user/AccountB_ID',
          expectedOutput:
            'Document reproduction using two test accounts registered by yourself. Never touch real user data.',
          hint: 'Always register two separate test accounts to demonstrate broken access control.',
        },
        quiz: {
          question: 'When discovering a vulnerability affecting user data during bug bounty testing, what should you do immediately after verifying proof-of-concept?',
          options: [
            'Download the entire user database to prove the extent of the flaw',
            'Post a video demonstration on YouTube to alert the public',
            'Stop testing immediately, report the finding with minimum necessary evidence to the vendor, and never access or exfiltrate real customer data',
            'Sell the exploit to a third-party broker',
          ],
          correctIndex: 2,
          explanation:
            'Good-faith security research strictly requires stopping testing the moment access is proven. Exfiltrating sensitive customer records breaches legal safe harbor and turns research into a criminal intrusion.',
        },
      },
    ],
  },
  {
    id: 'course-ctf-reverse-eng',
    title: 'Capture The Flag (CTF) Drills & Binary Reverse Engineering',
    slug: 'ctf-drills-reverse-engineering',
    badge: 'Advanced',
    level: 'Advanced',
    durationHours: 22,
    certificationTrack: 'OSCP · DefCon CTF · PicoCTF Prep',
    description:
      'Compete in student CTF challenges. Learn binary inspection with Ghidra, memory corruption fundamentals (buffer overflows), steganography, and cryptographic puzzle solving.',
    whatYouWillLearn: [
      'Static vs dynamic binary analysis using Ghidra and GDB (GNU Debugger)',
      'Understanding x86/x64 assembly, registers (EAX, ESP, EBP), and stack frames',
      'Buffer overflow mechanics: Overwriting Instruction Pointers (EIP/RIP)',
      'Steganography: Extracting hidden flags from images, audio, and polyglot files',
      'Classical and modern cryptography challenges (RSA math, XOR, substitution ciphers)',
    ],
    prerequisites: ['C or Python programming knowledge', 'Linux command line fluency'],
    modules: [
      {
        id: 'mod-5-1',
        title: 'Module 1: Introduction to CTFs & Forensic Analysis',
        durationMinutes: 60,
        summary:
          'Get started with student CTF platforms (PicoCTF, OverTheWire). Learn how to inspect files using file signatures (magic bytes), strings, and hex editors.',
        topics: [
          'CTF categories: Web, Forensics, Crypto, Reverse Engineering, Pwn, OSINT',
          'File signatures and magic byte repair (PNG: 89 50 4E 47)',
          'Extracting hidden ASCII strings with `strings -n 8 binary.bin`',
          'Polyglot files and archive carving with binwalk',
        ],
        keyConcept:
          'File extensions can be easily spoofed, but file magic bytes at the very beginning of the raw header tell the operating system what the file format actually is.',
        practicalExercise: {
          id: 'lab-5-1',
          title: 'Forensics Lab: Carving Hidden Files with Binwalk',
          type: 'terminal',
          scenario: 'A suspect image "evidence.jpg" contains hidden files concatenated at the end.',
          objective: 'Use binwalk to extract embedded ZIP archives.',
          starterCommand: 'binwalk -e evidence.jpg',
          expectedOutput:
            'DECIMAL       HEXADECIMAL     DESCRIPTION\n0             0x0             JPEG image data, JFIF standard 1.01\n45020         0xAFC4          Zip archive data, at least v2.0 to extract, name: secret_flag.txt',
          hint: 'Binwalk scans the raw file for known headers and extracts embedded sub-files automatically.',
        },
        quiz: {
          question: 'What are "Magic Bytes" in digital file forensics?',
          options: [
            'A special encryption key stored in the CPU cache',
            'Specific hexadecimal byte sequences at the very beginning of a file that identify its true file format, regardless of the extension',
            'Random numbers generated for password hashing',
            'A proprietary compression algorithm used by Windows',
          ],
          correctIndex: 1,
          explanation:
            'Magic bytes (e.g. 89 50 4E 47 for PNG, 25 50 44 46 for PDF) allow operating systems and forensic tools to identify file formats independently of filename extensions.',
        },
      },
      {
        id: 'mod-5-2',
        title: 'Module 2: Peeking Inside Binaries with Ghidra',
        durationMinutes: 80,
        summary:
          'Decompile compiled C/C++ executables back into readable pseudocode with Ghidra. Track variable flow, string references, and hardcoded secrets.',
        topics: [
          'Setting up NSA Ghidra decompiler',
          'Navigating Symbol Tree: Functions, Exports, Imports',
          'Decompiler pseudocode vs assembly disassembly',
          'Identifying hardcoded password validation functions (`strcmp`, `memcmp`)',
        ],
        keyConcept:
          'Compiling source code to a binary strips comments and variable names, but decompilers can reconstruct the control flow and structural logic with incredible fidelity.',
        practicalExercise: {
          id: 'lab-5-2',
          title: 'Reverse Engineering Lab: Locating Hardcoded Secrets',
          type: 'code_review',
          scenario:
            'You are reversing a crackme binary: `int check_pass(char* input) { return strcmp(input, "FLAG{gh1dr4_c0mp1l3r_fun}") == 0; }`',
          objective: 'Identify the flaw and how static string analysis reveals the secret.',
          starterCommand: 'strings crackme | grep -i FLAG',
          expectedOutput:
            'FLAG{gh1dr4_c0mp1l3r_fun}',
          hint: 'Hardcoded comparison strings are stored in plaintext in the .rodata (read-only data) section of the binary.',
        },
        quiz: {
          question: 'Why is comparing a user-submitted password with a plaintext string using "strcmp" in a compiled binary insecure?',
          options: [
            'Because the plaintext password string is embedded in the binary file and can be recovered with a simple strings command or decompiler',
            'Because strcmp only works in Python',
            'Because compiled binaries cannot run on 64-bit systems',
            'Because strcmp slows down the CPU',
          ],
          correctIndex: 0,
          explanation:
            'Any string literal included in compiled code resides in the binary\'s readable data section. Security tools like "strings" or decompilers expose it immediately without needing to execute the binary.',
        },
      },
    ],
  },
];

export const STUDENT_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    slug: 'rules-of-engagement-white-hat-boundary',
    title: 'The Legal Boundary: What Separates a White-Hat Researcher from a Cybercriminal?',
    category: 'Career & Ethics',
    author: 'Elena Rostova',
    authorRole: 'Offensive Security Researcher & Campus Cybersecurity Mentor',
    readTime: '6 min read',
    publishedDate: 'October 24, 2026',
    excerpt:
      'Understanding the strict legal threshold between authorized penetration testing and unauthorized computer intrusion under the CFAA and international cyber laws.',
    contentMarkdown: `## Intent Does Not Determine Legality

One of the most dangerous myths among computer science students is the belief that **"I was only testing it to help them"** protects you from criminal prosecution.

In legal systems across the globe—including the **Computer Fraud and Abuse Act (CFAA, 18 U.S.C. § 1030)** in the United States and the **Computer Misuse Act** in the United Kingdom—the defining legal test is **authorization**, not benevolence.

\`\`\`
[ Authorized Security Testing ]
      │
      ├─► Written Scope Agreement (Signed by Authorized Decision Maker)
      ├─► Explicit In-Scope IP / Domain List
      ├─► Predetermined Testing Window & Rules of Engagement
      └─► Direct, Private Disclosure Channel
\`\`\`

If you point a port scanner like Nmap or a vulnerability scanner like Nikto at your university portal, a local hospital, or an online shop without prior documented agreement, you have committed an unauthorized access attempt under statute.

### The 4 Cornerstones of Safe Ethical Research

1. **Bug Bounty Programs**: Only test targets explicitly declared on platforms like **HackerOne**, **Bugcrowd**, or **Intigriti**, and strictly adhere to their posted in-scope asset lists.
2. **Safe Harbor Protections**: Ensure the program contains "Gold Standard" or "Safe Harbor" language, guaranteeing the organization will not initiate legal action against good-faith researchers who follow their terms.
3. **No Data Exfiltration**: The moment you uncover a vulnerability, prove it with minimal evidence (e.g. \`SELECT @@version\` or \`alert(document.domain)\`). Never download user databases or view other people's private files.
4. **Isolated Personal Labs**: Build your own virtual sandbox. In an isolated environment (such as VirtualBox running Kali Linux and OWASP Juice Shop), you have 100% legal authority to execute any payload without fear.

> "A white hat's most valuable asset is not their technical exploit toolkit, but their unblemished ethical reputation. Once compromised, it can never be restored."`,
    keyTakeaways: [
      'Authorization is the only legal dividing line between white-hat research and criminal intrusion.',
      'Never scan or probe any system that has not explicitly published an authorized bug bounty or pentest agreement.',
      'Good-faith safe harbor requires immediately halting testing the moment access is proven.',
    ],
    codeSnippets: [
      {
        language: 'markdown',
        description: 'Standard Sample Scope Authorization Header Checklist',
        code: `# Security Research Authorization Verification
[✓] Domain listed under public security.txt / Bug Bounty Scope
[✓] Safe Harbor Policy explicitly adopted
[✓] Out-of-scope assets verified (DDoS, Social Engineering, Third-Party APIs excluded)
[✓] Custom HTTP Header attached for identification (e.g. X-BugBounty-Hunter: student@univ.edu)`,
      },
    ],
    tags: ['Ethics', 'Cyber Law', 'CFAA', 'Bug Bounty', 'Career'],
  },
  {
    id: 'blog-2',
    slug: 'setting-up-free-virtual-hacking-lab',
    title: 'Building Your Free, Safe Virtual Hacking Lab in Under 30 Minutes',
    category: 'Safe Labs',
    author: 'Marcus Vance',
    authorRole: 'Security Operations & Virtualization Engineer',
    readTime: '8 min read',
    publishedDate: 'October 21, 2026',
    excerpt:
      'Step-by-step blueprint to create an air-gapped, isolated penetration testing lab using VirtualBox, Kali Linux, and intentionally vulnerable targets like DVWA and Metasploitable.',
    contentMarkdown: `## Why You Need a Dedicated Local Lab

Practicing offensive security techniques on production networks is dangerous and illegal. Setting up your own virtual laboratory allows you to:
- Safely detonate payloads and test exploits
- Analyze network packets in real-time
- Break systems with zero real-world consequences
- Reset your targets back to pristine state with a single snapshot button

\`\`\`
 Host Operating System (Windows / macOS / Linux)
  │
  └── VirtualBox / VMware Workstation Player
       │
       ├── Host-Only Virtual Switch (192.168.56.0/24) [ISOLATED]
       │    │
       │    ├── Kali Linux (Attacker VM) ──── IP: 192.168.56.10
       │    │
       │    ├── Metasploitable 2 (Target VM) ── IP: 192.168.56.20
       │    │
       │    └── OWASP Juice Shop / DVWA ───── IP: 192.168.56.30
\`\`\`

### Step 1: Install the Hypervisor
Download **Oracle VirtualBox** (free, open source) or **VMware Workstation Player**. Ensure CPU virtualization (VT-x or AMD-V) is enabled in your computer's BIOS/UEFI.

### Step 2: Download Your Attacker Machine
Download the pre-configured **Kali Linux VirtualBox Image** (.vva/.ova) from the official Kali website. It comes pre-packaged with:
- Nmap, Wireshark, Burp Suite Community
- John the Ripper, Hashcat
- Metasploit Framework, SQLMap

### Step 3: Configure Host-Only Isolation (Crucial!)
To guarantee that your test targets cannot be reached by external devices on your home or dorm Wi-Fi:
1. In VirtualBox, go to **Tools -> Network Manager**.
2. Create a **Host-Only Network** (e.g., \`vboxnet0\` or \`192.168.56.1/24\`).
3. Set the Network Adapter for both Kali and your vulnerable targets to **Host-Only Adapter**.

### Step 4: Add Vulnerable Targets
- **DVWA (Damn Vulnerable Web Application)**: Excellent for learning SQLi, XSS, and CSRF.
- **OWASP Juice Shop**: Modern Node.js application simulating a rich e-commerce store with realistic challenges.
- **Metasploitable 2/3**: Vulnerable Linux/Windows machine packed with misconfigured services.`,
    keyTakeaways: [
      'Host-Only adapters isolate vulnerable machines from your physical local area network.',
      'Always take clean virtual machine snapshots before launching exploits.',
      'Pre-built OVA virtual appliances save hours of compilation and dependency configuration.',
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'Verify Host-Only Isolation from Kali Linux Terminal',
        code: `# 1. Check IP address assigned to host-only adapter
ip addr show eth0

# 2. Verify target virtual machine is reachable locally
ping -c 3 192.168.56.20

# 3. Verify target cannot route to public internet (must return unreachable)
ping -c 1 8.8.8.8`,
      },
    ],
    tags: ['VirtualBox', 'Kali Linux', 'DVWA', 'Lab Setup', 'Beginner'],
  },
  {
    id: 'blog-3',
    slug: 'understanding-sqli-from-vulnerable-to-prepared',
    title: 'Deconstructing SQL Injection: From Vulnerable String Concatenation to Parameterized Defense',
    category: 'Web Security',
    author: 'Devon Reed',
    authorRole: 'Application Security Engineer & Secure Code Advocate',
    readTime: '7 min read',
    publishedDate: 'October 18, 2026',
    excerpt:
      'A deep technical look at why SQL injection occurs, how the classic `\' OR 1=1 --` bypass works under the hood, and how modern parameterized queries eliminate the flaw completely.',
    contentMarkdown: `## The Root Cause: Mixing Code and Data

SQL Injection remains on the **OWASP Top 10** because developers continually fall into the trap of constructing database queries by string-concatenating untrusted user inputs.

When database engines execute a query, they follow a standard compiler pipeline:
1. **Lexical Analysis & Parsing** (Determine SQL syntax tree)
2. **Query Optimization** (Plan index scans)
3. **Execution** (Read/write rows)

### The Classic Flaw: String Concatenation

Consider a vulnerable login verification endpoint:

\`\`\`javascript
// ❌ INSECURE: Raw string concatenation
const query = "SELECT * FROM users WHERE username = '" + req.body.user + "' AND password = '" + req.body.pass + "';";
db.query(query);
\`\`\`

If an attacker supplies \`admin' --\` in the username field, the resulting string becomes:

\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...';
\`\`\`

The \`--\` characters represent a SQL comment, causing the database engine to completely ignore the password check! The query returns the \`admin\` user record, and the attacker is logged in without knowing the password.

### The Remedy: Prepared Statements (Parameterized Queries)

Parameterized queries do not simply escape characters; they fundamentally change how the query is processed by the database engine:

\`\`\`javascript
// ✅ SECURE: Parameterized Query
const sql = "SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?;";
db.query(sql, [userInput, hashedInput], (err, results) => { ... });
\`\`\`

1. The SQL template is pre-compiled by the database engine **before** user inputs are received.
2. The parameters are passed as **literal data values**, not executable commands.
3. Even if the user submits \`admin' OR '1'='1\`, the database looks literally for a user whose exact username is the literal string \`admin' OR '1'='1\`. The syntax tree cannot be altered!`,
    keyTakeaways: [
      'SQL injection occurs when user data alters the syntax tree of the database query.',
      'Parameterized queries pre-compile the SQL command, rendering syntax injection impossible.',
      'Never rely on manual regex stripping or blacklists; always use native prepared statements or modern ORMs.',
    ],
    codeSnippets: [
      {
        language: 'python',
        description: 'Vulnerable vs Secure Query in Python (sqlite3 / psycopg2)',
        code: `# ❌ VULNERABLE: Formatted string allows query hijacking
cursor.execute(f"SELECT * FROM students WHERE student_id = '{user_input}'")

# ✅ SECURE: Tuple argument parameterized query
cursor.execute("SELECT * FROM students WHERE student_id = ?", (user_input,))`,
      },
    ],
    tags: ['SQLi', 'AppSec', 'OWASP Top 10', 'Databases', 'Secure Coding'],
  },
  {
    id: 'blog-4',
    slug: 'student-guide-breaking-into-bug-bounty',
    title: 'The College Student’s Practical Roadmap to Bug Bounty Hunting',
    category: 'Bug Bounty',
    author: 'Aria Patel',
    authorRole: 'Top-500 HackerOne Researcher & CS Senior',
    readTime: '9 min read',
    publishedDate: 'October 15, 2026',
    excerpt:
      'How to land your first valid vulnerability report on public programs without getting overwhelmed by duplicate reports or burning out.',
    contentMarkdown: `## Transitioning from CTFs to Real Targets

Many students master Capture The Flag (CTF) challenges and then struggle when faced with a real-world bug bounty program. Why?
- In CTFs, **there is always a flag**, and the system is designed to be broken.
- In bug bounties, **thousands of other researchers** have already scanned the obvious endpoints.

### Strategy 1: Specialize Rather Than Generalize
Instead of trying to find every vulnerability type, pick **one vulnerability class** and become an expert at finding it:
- Focus solely on **IDORs (Insecure Direct Object References)**
- Focus on **Business Logic Errors** (e.g. coupon stacking, negative quantity cart manipulation)
- Focus on **Access Control Bypasses** in mobile API endpoints

Automated scanners like Nuclei find low-hanging misconfigurations within seconds of a program launching. As a student researcher, your competitive advantage is **human reasoning and deep application logic exploration**.

### Strategy 2: Focus on the Mobile API Surface
Most web hunters test desktop websites using Chrome and Burp Suite. Often, the mobile app (Android APK or iOS IPA) connects to older, less heavily scrutinized API endpoints.
1. Download the target's APK.
2. Decompile it with **JADX-GUI** to locate hidden API endpoints, unpublicized staging domains, and API version endpoints (\`/api/v1/\` vs \`/api/v3/\`).
3. Intercept mobile app traffic with an emulator and test those less documented endpoints.

### Strategy 3: Respectful, Clear Report Writing
The quickest way to get a bounty triaged and rewarded is submitting a crisp, professional report:
- Include clean HTTP request/response text (never just a video)
- Demonstrate real business risk
- Provide an exact remediation recommendation`,
    keyTakeaways: [
      'Specialize in human-driven business logic vulnerabilities rather than running generic automated scanners.',
      'Inspect mobile app APIs and staging domains where security scrutiny is often less saturated.',
      'A clear, concise writeup with non-destructive proof-of-concept accelerates bounty payouts.',
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'Passive Subdomain Recon Workflow for Students',
        code: `# 1. Enumerate subdomains passively using subfinder
subfinder -d target.com -silent -o subdomains.txt

# 2. Probe which subdomains are actively responding over HTTP/HTTPS
cat subdomains.txt | httpx -silent -status-code -title -o active_targets.txt

# 3. Filter for interesting HTTP response codes (200, 401, 403)
grep -E "\[(200|401|403)\]" active_targets.txt`,
      },
    ],
    tags: ['Bug Bounty', 'HackerOne', 'Recon', 'Student Career', 'API Security'],
  },
  {
    id: 'blog-5',
    slug: 'wireshark-packet-analysis-for-beginners',
    title: 'Wireshark Packet Analysis 101: Peeking Under the Network Hood',
    category: 'Network Pentesting',
    author: 'Samira Khan',
    authorRole: 'Network Security Analyst & CCNA Certified Instructor',
    readTime: '6 min read',
    publishedDate: 'October 11, 2026',
    excerpt:
      'Learn how to inspect raw network packets, filter out background noise, analyze TCP handshakes, and detect cleartext credential leaks.',
    contentMarkdown: `## Seeing What the Wire Sees

Every time you open a campus portal, send a chat message, or stream a video lecture, your operating system dices your data into discreet Ethernet frames and IP packets.

**Wireshark** is the undisputed industry standard tool for capturing and decoding these packets. It shows you the raw binary truth of network communication.

### The Essential Wireshark Display Filter Cheat Sheet

When you open Wireshark on an active network interface, thousands of packets will flood your screen per second. Display filters are your primary weapon to isolate relevant data:

| Display Filter | Purpose |
| :--- | :--- |
| \`ip.addr == 192.168.1.10\` | Shows traffic sent to or from this specific IP |
| \`tcp.port == 443\` | Shows all HTTPS traffic |
| \`dns\` | Isolates all domain name lookups and responses |
| \`http.request.method == "POST"\` | Reveals form submissions and authentication requests |
| \`tcp.flags.syn == 1 && tcp.flags.ack == 0\` | Filters for incoming connection initiation requests |

### Inspecting a Cleartext Transmission Risk

When examining an unencrypted HTTP or FTP connection, Wireshark features a powerful utility called **Follow TCP Stream**.
1. Right-click any TCP packet in the stream.
2. Select **Follow -> TCP Stream**.
3. Wireshark reassembles the fragmented packets into the complete conversation stream (Red = Client, Blue = Server).

If the service lacks TLS encryption, passwords, cookies, and tokens will appear in plain text for all to read.`,
    keyTakeaways: [
      'Mastering Wireshark display filters is essential for cutting through background network noise.',
      'The "Follow TCP Stream" feature reassembles fragmented packets into human-readable conversations.',
      'Unencrypted protocol streams expose credentials instantly to passive network sniffing.',
    ],
    codeSnippets: [
      {
        language: 'text',
        description: 'Useful Wireshark Filter Combinations',
        code: `# Filter for DNS queries resolving suspicious domains
dns.flags.response == 0 && dns.qry.name contains "university"

# Detect potential TCP SYN port scan bursts
tcp.flags.syn == 1 && tcp.flags.ack == 0

# Locate unencrypted HTTP authorization basic headers
http.authorization contains "Basic"`,
      },
    ],
    tags: ['Wireshark', 'Packet Analysis', 'Networking', 'TCP/IP', 'Blue Team'],
  },
  {
    id: 'blog-6',
    slug: 'beginners-guide-ctf-competitions',
    title: 'Beginner’s Playbook: How to Score Your First Points in Student CTFs',
    category: 'CTF Walkthroughs',
    author: 'Lucas Meyer',
    authorRole: 'Captain, University Cyber Defense Team',
    readTime: '8 min read',
    publishedDate: 'October 08, 2026',
    excerpt:
      'Tired of staring at impossible challenges? Here is how to conquer beginner friendly CTFs like PicoCTF, Bandit, and Hack The Box starting from scratch.',
    contentMarkdown: `## What is a Capture The Flag (CTF) Competition?

Cybersecurity CTFs are gamified challenges where participants solve security puzzles across cryptography, web exploitation, reverse engineering, forensics, and binary exploitation.

Your goal in every challenge is to uncover a secret string called a **flag**, typically formatted like:
\`FLAG{w3lc0m3_t0_th3_m4tr1x_2026}\`

Submitting the flag earns points for your personal or school leaderboard rank.

### Recommended Beginner Progression

1. **OverTheWire: Bandit**: 34 progressive Linux terminal levels designed for absolute beginners. Teaches you \`grep\`, \`find\`, file permissions, SSH keys, cron jobs, and basic bash redirection.
2. **PicoCTF**: Created by Carnegie Mellon University specifically for middle school, high school, and college students. Features hundreds of self-paced practice challenges with helpful hint buttons.
3. **TryHackMe (Pre-Security & Jr Penetration Tester Paths)**: Guided rooms with browser-based cloud targets and step-by-step questions.

### The CTF Toolkit Every Student Should Install
- **CyberChef (The Cyber Swiss Army Knife)**: In-browser decoder for Base64, Hex, URL encoding, XOR, and rot13.
- **Aperi\'Solve**: Automated online steganography platform for inspecting hidden layers in challenge images.
- **Ghidra**: Free, open-source reverse engineering framework for executable binaries.
- **Burp Suite**: Interception proxy for web challenges.`,
    keyTakeaways: [
      'Start with OverTheWire Bandit to cement Linux terminal fluency before attempting web or binary exploits.',
      'CyberChef is the single most valuable browser utility for rapid decoding and hash cracking.',
      'Always document your steps in a local markdown notebook to build a searchable knowledge base.',
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'First 5 Essential Terminal Commands in CTF Forensics',
        code: `# 1. Identify true file type by header magic bytes
file challenge_file

# 2. Extract readable ASCII and Unicode strings
strings -n 8 challenge_file | grep -i "flag{"

# 3. Inspect raw hexadecimal representation
xxd challenge_file | head -n 10

# 4. Extract embedded archives or images
binwalk -e challenge_file

# 5. Compute cryptographic hash for checksum matching
sha256sum challenge_file`,
      },
    ],
    tags: ['CTF', 'PicoCTF', 'Bandit', 'Forensics', 'Student Competitions'],
  },
];
