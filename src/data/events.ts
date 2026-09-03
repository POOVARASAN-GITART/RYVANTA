import type { EventId } from '../types/registration';

export interface ScoringCriterion {
  category: string;
  marks: number;
  description: string;
}

export interface EventConfig {
  id: EventId;
  /** Letter code used in participation ID generation (TI<Code><SequentialNumber>) */
  code: string;
  index: number;
  name: string;
  fullName: string;
  tagline: string;
  venue: string;
  minMembers: number;
  maxMembers: number;
  memberCounts: number[];
  fee: number;
  requiresDepartment: boolean;
  domains?: string[];
  scoringMatrix?: ScoringCriterion[];
  formatDetails?: string[];
  hideQrCode?: boolean;
  rules?: string[];
  scheduleTime?: string;
}

export const REGISTRATION_FEE = 100; // ₹100 per person
export const REGISTRATION_FEE_PER_PERSON = 100;

export const REGISTRATION_CLOSES_AT = '2026-09-10T23:59:59';
export const EVENT_STARTS_AT = '2026-09-19T08:30:00';

export interface TimelineMilestone {
  phase: string;
  title: string;
  timeSlot: string;
  date: string;
  venue: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  badge: string;
  milestones?: string[];
}

export const HACKATHON_TIMELINE: TimelineMilestone[] = [
  {
    phase: 'PHASE 01',
    title: 'Online Team Registration & Domain Lock',
    date: 'Active Now – 10 Sep 2026',
    timeSlot: '11:59 PM IST Deadline',
    venue: 'Online Registration Portal',
    description: 'Team leaders submit squad rosters, select eligible engineering domains, and generate participation IDs upon verification.',
    status: 'active',
    badge: 'ONLINE',
    milestones: [
      'Team & member roster submission',
      'Dynamic department domain selection',
      'Instant Participation ID generation'
    ]
  },
  {
    phase: 'PHASE 02',
    title: 'Screening & Problem Briefing',
    date: '12 Sep 2026',
    timeSlot: '10:00 AM – 04:00 PM',
    venue: 'Academic Evaluation Room',
    description: 'Technical jury evaluates submitted problem statements and shortlists squads for on-campus competition rounds.',
    status: 'upcoming',
    badge: 'SCREENING',
    milestones: [
      'Problem feasibility scoring',
      'Laboratory slot assignment',
      'Digital entry gate pass issued'
    ]
  },
  {
    phase: 'PHASE 03',
    title: 'Grand Inauguration & Keynote Briefing',
    date: '19 Sep 2026',
    timeSlot: '08:30 AM – 09:30 AM',
    venue: 'Main Auditorium',
    description: 'Inauguration ceremony, release of hackathon problem briefs, rules reveal, and orientation by keynote dignitaries.',
    status: 'upcoming',
    badge: 'ON-CAMPUS',
    milestones: [
      'Physical reporting & badge check',
      'Live problem statements unlocked',
      'Keynote & evaluation rubric brief'
    ]
  },
  {
    phase: 'PHASE 04',
    title: 'Live Sprint & Mentorship Evaluation',
    date: '19 Sep 2026',
    timeSlot: '09:30 AM – 05:30 PM',
    venue: 'Auditorium / IT Lab / FOSS Lab / Network Lab / Smart Class Room',
    description: 'Non-stop hacking and technical challenge rounds across all designated laboratories and competition halls with mentor reviews.',
    status: 'upcoming',
    badge: 'LIVE SPRINT',
    milestones: [
      'High-speed prototype development',
      'Mid-sprint mentor check (01:30 PM)',
      'Security flag verification rounds'
    ]
  },
  {
    phase: 'PHASE 05',
    title: 'Code Freeze & Live Jury Demo',
    date: '19 Sep 2026',
    timeSlot: '05:30 PM – 07:30 PM',
    venue: 'Dedicated Competition Venues',
    description: 'Final repository commits locked and 5-minute live working demonstration before the esteemed judging panel.',
    status: 'upcoming',
    badge: 'EVALUATION',
    milestones: [
      'Git code freeze',
      '5-minute working demo',
      'Scoring matrix tabulation'
    ]
  },
  {
    phase: 'PHASE 06',
    title: 'Grand Finale, Results & Awards',
    date: '19 Sep 2026',
    timeSlot: '08:00 PM – 09:30 PM',
    venue: 'Main Auditorium',
    description: 'Announcement of winners across all 5 technical arenas, certificate distribution, internship offers, and cash prizes.',
    status: 'upcoming',
    badge: 'AWARDS',
    milestones: [
      'Trophies & cash prizes',
      'Internship opportunities',
      'Official certificates of achievement'
    ]
  }
];

// Department-to-Domain Mapping for Event 1: Hackathon '26
export const HACKATHON_DEPARTMENTS = [
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'Mechanical Engineering',
  'Aeronautical Engineering',
  'Interdisciplinary / Open Domain'
] as const;

export const HACKATHON_DEPARTMENT_DOMAINS: Record<string, string[]> = {
  'CSE': [
    'Artificial Intelligence & Machine Learning',
    'Computer Vision & Intelligent Inspection',
    'Cybersecurity & Digital Innovation',
    'Advanced Software & Emerging Technologies'
  ],
  'IT': [
    'Artificial Intelligence & Machine Learning',
    'Computer Vision & Intelligent Inspection',
    'Cybersecurity & Digital Innovation',
    'Cloud Computing & Smart Applications'
  ],
  'ECE': [
    'IoT, Embedded Systems & Smart Automation',
    'Robotics & Autonomous Systems',
    'Computer Vision & Intelligent Inspection',
    'Smart Communication & Connected Systems'
  ],
  'EEE': [
    'Smart Energy & Sustainable Engineering',
    'IoT, Embedded Systems & Smart Automation',
    'Robotics & Autonomous Systems',
    'Smart Grid & Energy Management'
  ],
  'Mechanical Engineering': [
    'Robotics & Autonomous Systems',
    'Smart Manufacturing & Industrial Automation',
    'Computer Vision & Intelligent Inspection',
    'Advanced Engineering & Digital Innovation'
  ],
  'Aeronautical Engineering': [
    'Smart Mobility, Transportation & Aerospace Technology',
    'Robotics & Autonomous Systems',
    'Drone & Autonomous Flight Technology',
    'Computer Vision & Intelligent Inspection'
  ],
  'Interdisciplinary / Open Domain': [
    'Advanced Engineering & Digital Innovation',
    'AI-Based Engineering Solutions',
    'Smart Systems & Automation',
    'Emerging Technologies & Innovation'
  ]
};

// 2D Games Domains & Scoring Matrix
export const GAMES_2D_DOMAINS = [
  'Cyber Detective',
  'Disaster Resources',
  'Puzzle',
  'Endless Runner',
  'Farming',
  'Space Adventure',
  'Logic',
  'Racing',
  '2D-Comebacks',
  'Eco City'
];

export const GAMES_2D_SCORING_MATRIX: ScoringCriterion[] = [
  { category: 'Gameplay', marks: 25, description: 'Core mechanics, player engagement, and challenge progression.' },
  { category: 'Creativity', marks: 25, description: 'Originality of story, theme execution, and unique mechanics.' },
  { category: 'Visual / UI', marks: 15, description: '2D art aesthetic, sprite animation, and user interface clarity.' },
  { category: 'Technical Implementation', marks: 15, description: 'Code architecture, physics simulation, and bug-free performance.' },
  { category: 'Output', marks: 10, description: 'Functional working executable / browser build quality.' },
  { category: 'Presentation', marks: 10, description: 'Demonstration clarity, narrative pitching, and jury Q&A.' }
];

// Capture The Flag (NEXVORA '26) Domains & Format
export const CTF_DOMAINS = [
  'Web Exploitation & Vulnerability Assessment',
  'Cryptography & Cipher Breaking',
  'Reverse Engineering & Binary Analysis',
  'Network Forensics & Packet Capture'
];

export const CTF_FORMAT_DETAILS = [
  'Format: 2 Competitive Rounds, 2 Flags to capture',
  'Round 1: Preliminary qualifying challenges (Crypto & Web forensics)',
  'Round 2: Advanced live offensive-defense flag submission',
  'Live Dynamic Scoreboard with time-penalty multipliers'
];

// Event 4: E-Games (Free Fire) Domains
export const EGAMES_DOMAINS = [
  'Squad Battle Royale (Bermuda / Purgatory)',
  'Clash Squad Championship',
  'Custom Room Tactical Showdown',
  'Free Fire E-Sports League'
];

// Event 5: Photography and video '26 Domains
export const PHOTOGRAPHY_DOMAINS = [
  'Photography & Video Editing',
  'Candid Campus Life Photography',
  'Cinematic Event Reel & Video Editing',
  'Creative Visual Storytelling'
];

// The Five Official Technical Events
export const EVENTS: EventConfig[] = [
  {
    id: 'hackathon',
    code: 'CH',
    index: 1,
    name: "Hackathon '26",
    fullName: "Hackathon '26 (Multi-Department Flagship)",
    tagline: 'Flagship 8-hour sprint solving department-specific and interdisciplinary engineering challenges.',
    venue: 'Auditorium',
    minMembers: 3,
    maxMembers: 4,
    memberCounts: [3, 4],
    fee: REGISTRATION_FEE,
    requiresDepartment: true,
    rules: [
      'Team Size: Minimum 3, Maximum 4 members.',
      'Department-based domain selection required.',
      'Fresh code & prototype develop on-site during hackathon.',
      'Bring college ID cards for verification.'
    ]
  },
  {
    id: '2d-games',
    code: 'D',
    index: 2,
    name: "2D Games (SOZO '26)",
    fullName: "2D Games (SOZO '26)",
    tagline: 'Game development arena judged on gameplay, creativity, visual UI, and technical excellence.',
    venue: 'IT Lab',
    minMembers: 2,
    maxMembers: 3,
    memberCounts: [2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: GAMES_2D_DOMAINS,
    scoringMatrix: GAMES_2D_SCORING_MATRIX,
    rules: [
      'Team Size: Minimum 2, Maximum 3 members.',
      '10 thematic 2D game domains available.',
      'Strict 100-mark scoring criteria matrix evaluation.',
      'All assets, engine build, and game logic must run on judge systems.'
    ]
  },
  {
    id: 'ctf',
    code: 'C',
    index: 3,
    name: 'Capture The Flag',
    fullName: "Capture The Flag (NEXVORA '26)",
    tagline: 'Elite cybersecurity hacking challenge across 2 intensive rounds with 2 flags to capture.',
    venue: 'FOSS Lab',
    minMembers: 2,
    maxMembers: 3,
    memberCounts: [2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: CTF_DOMAINS,
    formatDetails: CTF_FORMAT_DETAILS,
    rules: [
      'Team Size: Minimum 2, Maximum 3 members.',
      'Registration Fee: ₹100 per person.',
      'Format: 2 Rounds, 2 Flags to capture.',
      'Ethical hacking rules strictly enforced — no DDoS or attacking host infra.'
    ]
  },
  {
    id: 'egames',
    code: 'E',
    index: 4,
    name: 'E-Games (Free Fire)',
    fullName: 'E-Games (E-Sports Showdown - Free Fire)',
    tagline: 'High-octane mobile battle royale showdown competing for the ultimate Booyah title.',
    venue: 'Network Lab',
    minMembers: 4,
    maxMembers: 5,
    memberCounts: [4, 5],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: EGAMES_DOMAINS,
    hideQrCode: true,
    rules: [
      'Team Size: Maximum 4 players + 1 substitute (4–5 members).',
      'Venue: Network Lab.',
      'Fair Play Policy: Strictly mobile devices only. Emulators, iPad triggers, and third-party tools are banned.',
      'Room IDs and passwords will be distributed in the Network Lab.'
    ]
  },
  {
    id: 'photography',
    code: 'P',
    index: 5,
    name: "Photography & Video '26",
    fullName: "Photography and video '26",
    tagline: 'Capture the visual essence of the technical challenge with candid photography and cinematic reels.',
    venue: 'Smart Class Room',
    minMembers: 2,
    maxMembers: 3,
    memberCounts: [2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: PHOTOGRAPHY_DOMAINS,
    scheduleTime: '02:00 PM onwards',
    rules: [
      'Venue: Smart Class Room.',
      'Domain: Photography & Video Editing.',
      'Date: September 19th, 2026 | Time: 02:00 PM onwards.',
      'Team Size: Minimum 2, Maximum 3 members.',
      'All footage & shots must be captured on-campus on event day.',
      'Bring your own DSLRs / mirrorless cameras or smartphones and editing systems.'
    ]
  }
];

export const SUPPORT_LINES = [
  { label: 'Convenor Helpline 1', number: '+91 95665 42006', tel: '+919566542006' },
  { label: 'Registration Helpline 2', number: '+91 90030 18088', tel: '+919003018088' }
];

export function getEvent(id: EventId): EventConfig {
  const match = EVENTS.find((e) => e.id === id);
  return match || EVENTS[0];
}