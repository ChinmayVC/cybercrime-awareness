import type { GameDef } from '../types';

export const phishingScenarios: GameDef = {
  id: 'phishing',
  name: 'Phishing Detection',
  description: 'Spot fake emails and messages',
  icon: '📧',
  category: 'phishing',
  scenarios: [
    {
      id: 'p1',
      question: 'You get an email: "Urgent! Your bank account will be locked in 24h. Click here to verify." What do you do?',
      options: ['Click the link and log in', 'Call your bank using the number on your card', 'Reply with your password'],
      correctIndex: 1,
      explanation: 'Banks never ask you to verify via email links. Always use the official number on your card.',
      difficulty: 'easy',
      timeLimit: 15,
    },
    {
      id: 'p2',
      question: 'An email says "You won a prize! Send your bank details to claim." Is it safe?',
      options: ['Yes, legitimate giveaways need bank details', 'No, never send bank details to unsolicited emails'],
      correctIndex: 1,
      explanation: 'Legitimate prizes never ask for bank details via email. This is a classic scam.',
      difficulty: 'easy',
      timeLimit: 10,
    },
    {
      id: 'p3',
      question: 'Email from "support@amaz0n-safety.com" asking you to confirm your order. What do you do?',
      options: ['Click and confirm', 'Ignore and log in at amazon.com directly if needed'],
      correctIndex: 1,
      explanation: 'The domain "amaz0n" (zero instead of o) is a spoof. Always type the real URL yourself.',
      difficulty: 'medium',
      timeLimit: 12,
    },
  ],
};

export const passwordScenarios: GameDef = {
  id: 'password',
  name: 'Password Strength',
  description: 'Learn what makes passwords secure',
  icon: '🔐',
  category: 'passwords',
  scenarios: [
    {
      id: 'pw1',
      question: 'Which password is stronger?',
      options: ['password123', 'Tr0ub4dor&3', 'correct-horse-battery-staple'],
      correctIndex: 2,
      explanation: 'Long passphrases are easier to remember and harder to crack than short complex passwords.',
      difficulty: 'easy',
      timeLimit: 15,
    },
    {
      id: 'pw2',
      question: 'Is it safe to reuse the same password on multiple sites?',
      options: ['Yes, if it\'s a strong password', 'No, one breach exposes all accounts'],
      correctIndex: 1,
      explanation: 'If one site is breached, attackers try that password everywhere. Use a unique password per site.',
      difficulty: 'easy',
      timeLimit: 10,
    },
    {
      id: 'pw3',
      question: 'Best way to manage many strong passwords?',
      options: ['Write them in a notes file', 'Use a reputable password manager', 'Use browser "remember password" only'],
      correctIndex: 1,
      explanation: 'A password manager generates and stores unique passwords securely. Notes files are not secure.',
      difficulty: 'medium',
      timeLimit: 12,
    },
  ],
};

export const urlScenarios: GameDef = {
  id: 'url',
  name: 'URL Safety',
  description: 'Identify safe vs suspicious links',
  icon: '🔗',
  category: 'urls',
  scenarios: [
    {
      id: 'u1',
      question: 'Which URL looks suspicious?',
      options: ['https://www.paypal.com/account', 'https://paypa1-secure.com/login', 'https://accounts.google.com'],
      correctIndex: 1,
      explanation: '"paypa1" uses the number 1 instead of L. Scammers use lookalike domains.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'u2',
      question: 'You get a link: bit.ly/3xYzPri. Before clicking, you should:',
      options: ['Click it, short links are safe', 'Hover to see destination or use a link expander'],
      correctIndex: 1,
      explanation: 'Short links can hide the real URL. Always check where they lead before clicking.',
      difficulty: 'medium',
      timeLimit: 15,
    },
    {
      id: 'u3',
      question: 'A link shows "https://apple.com" but when you hover it goes to apple-id.secure-login.xyz. Is it safe?',
      options: ['Yes, it says Apple', 'No, the real destination is different (hover revealed it)'],
      correctIndex: 1,
      explanation: 'The visible text can say anything. The actual href is what matters. This is a phishing trick.',
      difficulty: 'hard',
      timeLimit: 15,
    },
  ],
};

export const otpScenarios: GameDef = {
  id: 'otp',
  name: 'Fake OTP & SMS',
  description: 'Recognize fake verification messages',
  icon: '📱',
  category: 'phishing',
  scenarios: [
    {
      id: 'o1',
      question: 'SMS: "Your OTP is 847291. Do not share with anyone." You didn\'t request any OTP. What do you do?',
      options: ['Ignore and delete; never enter it anywhere', 'Enter it on the site that just asked for it'],
      correctIndex: 0,
      explanation: 'If you didn\'t request it, someone may be trying to use it. Never share OTPs.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'o2',
      question: 'Message: "Amazon: Your package failed. Verify at amzn-delivery.xyz or package will be returned."',
      options: ['Click and verify', 'Ignore; go to amazon.com yourself if you need to check'],
      correctIndex: 1,
      explanation: 'Fake delivery messages often use urgent language and fake links. Use the real app or site.',
      difficulty: 'medium',
      timeLimit: 15,
    },
  ],
};

export const socialScenarios: GameDef = {
  id: 'social',
  name: 'Social Media Scams',
  description: 'Avoid scams on social platforms',
  icon: '💬',
  category: 'social-engineering',
  scenarios: [
    {
      id: 's1',
      question: 'A stranger DMs: "I work for a crypto company. Invest $500 and get 10x in a week."',
      options: ['Send the money', 'Ignore; this is a classic investment scam'],
      correctIndex: 1,
      explanation: 'Unsolicited "get rich quick" offers from strangers are almost always scams.',
      difficulty: 'easy',
      timeLimit: 10,
    },
    {
      id: 's2',
      question: 'A friend\'s account messages: "I\'m stuck abroad, send $200 urgently." You should:',
      options: ['Send money quickly', 'Contact your friend another way (call/other app) to verify'],
      correctIndex: 1,
      explanation: 'Accounts get hacked. Always verify through another channel before sending money.',
      difficulty: 'medium',
      timeLimit: 12,
    },
  ],
};

export const privacyScenarios: GameDef = {
  id: 'privacy',
  name: 'Privacy & Data Sharing',
  description: 'Protect your personal information',
  icon: '🔒',
  category: 'privacy',
  scenarios: [
    {
      id: 'pv1',
      question: 'A quiz app asks for your full name, birth date, and mother\'s maiden name "just for fun." What do you do?',
      options: ['Share it; quizzes need that for results', 'Skip or use fake answers; those are common security questions'],
      correctIndex: 1,
      explanation: 'Security questions use exactly this info. Never give real answers to casual quizzes.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'pv2',
      question: 'A new app wants access to your contacts "to find friends." You don\'t know the developer. Should you allow?',
      options: ['Yes, most apps need contacts', 'No; deny unless you trust the app and need the feature'],
      correctIndex: 1,
      explanation: 'Contacts are sensitive. Only grant access to apps you trust with a clear need.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'pv3',
      question: 'You get a call: "This is tech support. We need to remote into your PC to fix a virus." You didn\'t contact them. What do you do?',
      options: ['Allow access; they sound professional', 'Hang up; real tech support won\'t cold-call and ask for remote access'],
      correctIndex: 1,
      explanation: 'Legitimate support never cold-calls. This is a common scam to install malware or steal data.',
      difficulty: 'medium',
      timeLimit: 15,
    },
  ],
};

export const socialEngineeringScenarios: GameDef = {
  id: 'social-engineering',
  name: 'Social Engineering',
  description: 'Recognize manipulation and pretexting',
  icon: '🎭',
  category: 'social-engineering',
  scenarios: [
    {
      id: 'se1',
      question: 'Someone calls claiming to be from the IRS and says you owe taxes—pay now or face arrest. What do you do?',
      options: ['Pay immediately to avoid trouble', 'Hang up; the IRS contacts by mail and never demands instant payment by phone'],
      correctIndex: 1,
      explanation: 'The IRS does not call demanding immediate payment. Scammers use urgency and fear.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'se2',
      question: 'A "delivery person" at your door says they need your signature and a one-time code sent to your phone. You didn\'t order anything. What do you do?',
      options: ['Give the code; they need it for delivery', 'Refuse; they may be trying to steal your account with the code'],
      correctIndex: 1,
      explanation: 'One-time codes are for you only. Never share them. This is a common account takeover trick.',
      difficulty: 'medium',
      timeLimit: 15,
    },
  ],
};

export const wifiScenarios: GameDef = {
  id: 'wifi',
  name: 'Secure Wi‑Fi',
  description: 'Stay safe on public and home networks',
  icon: '📶',
  category: 'network',
  scenarios: [
    {
      id: 'w1',
      question: 'You\'re at a café. You see two networks: "Cafe_Guest" and "Cafe_Guest_Free." Which is safer to use?',
      options: ['Cafe_Guest_Free; it\'s clearly the official one', 'Ask staff for the real network name; both could be fake'],
      correctIndex: 1,
      explanation: 'Anyone can create a fake hotspot. Confirm the real network name with staff.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'w2',
      question: 'On public Wi‑Fi, you need to check your bank balance. What should you do?',
      options: ['Log in on the café Wi‑Fi; it\'s fine for just checking', 'Use mobile data or wait until you\'re on a trusted network'],
      correctIndex: 1,
      explanation: 'Public Wi‑Fi can be monitored. Avoid banking or sensitive logins; use mobile data or a VPN.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'w3',
      question: 'Your home Wi‑Fi is WPA2. A friend says you should change the default router password. Is that necessary?',
      options: ['No; WPA2 is enough', 'Yes; default passwords are known and let others change your router settings'],
      correctIndex: 1,
      explanation: 'Default router passwords are often public. Change them to prevent unauthorized access.',
      difficulty: 'medium',
      timeLimit: 12,
    },
  ],
};

export const bankingScenarios: GameDef = {
  id: 'banking',
  name: 'Banking & Payment Fraud',
  description: 'Avoid payment and banking scams',
  icon: '🏦',
  category: 'banking',
  scenarios: [
    {
      id: 'b1',
      question: 'You get an email that looks like your bank: "Confirm your card for a refund. Enter card number and CVV." What do you do?',
      options: ['Enter the details; they need it for the refund', 'Ignore; banks never ask for full card number and CVV by email'],
      correctIndex: 1,
      explanation: 'Banks never ask for full card number and CVV via email. This is fraud.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'b2',
      question: 'Someone you sold an item to online wants to pay by check for more than the price and have you wire the difference. What do you do?',
      options: ['Accept; it\'s a simple mistake', 'Decline; this is a classic overpayment scam; the check will bounce'],
      correctIndex: 1,
      explanation: 'Overpayment scams use fake checks. You send real money; the check bounces later.',
      difficulty: 'medium',
      timeLimit: 15,
    },
    {
      id: 'b3',
      question: 'A "bank employee" calls and asks you to move money to a "safe account" due to fraud. What do you do?',
      options: ['Move the money; they\'re protecting you', 'Hang up and call your bank on the number on your card'],
      correctIndex: 1,
      explanation: 'Banks never ask you to move money to "safe" accounts. Call your bank yourself.',
      difficulty: 'medium',
      timeLimit: 12,
    },
  ],
};

export const malwareScenarios: GameDef = {
  id: 'malware',
  name: 'Malware & Suspicious Downloads',
  description: 'Avoid viruses and malicious software',
  icon: '🦠',
  category: 'malware',
  scenarios: [
    {
      id: 'm1',
      question: 'A pop-up says "Your PC is infected! Click here to scan now." What do you do?',
      options: ['Click to scan; it might be real', 'Close the tab; legitimate antivirus doesn\'t use scary pop-ups on websites'],
      correctIndex: 1,
      explanation: 'Fake virus alerts are common. They lead to malware or scams. Use your own antivirus.',
      difficulty: 'easy',
      timeLimit: 10,
    },
    {
      id: 'm2',
      question: 'You need PDF software. You find "FreePDF-Pro.exe" on a random download site. Is it safe?',
      options: ['Yes; it\'s free', 'Risky; download only from official or trusted sources'],
      correctIndex: 1,
      explanation: 'Unofficial download sites often bundle malware. Use official vendor or app stores.',
      difficulty: 'easy',
      timeLimit: 12,
    },
    {
      id: 'm3',
      question: 'An email attachment is named "Invoice_2024.pdf.exe." Your colleague says they sent it. What do you do?',
      options: ['Open it; it\'s from a colleague', 'Be suspicious; real invoices are .pdf; .exe could be malware—confirm with colleague another way'],
      correctIndex: 1,
      explanation: 'Double extensions like .pdf.exe hide that it\'s an executable. Verify via another channel.',
      difficulty: 'medium',
      timeLimit: 15,
    },
  ],
};

export const allGames: GameDef[] = [
  phishingScenarios,
  passwordScenarios,
  urlScenarios,
  otpScenarios,
  socialScenarios,
  privacyScenarios,
  socialEngineeringScenarios,
  wifiScenarios,
  bankingScenarios,
  malwareScenarios,
];
