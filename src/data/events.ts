import type { EventId } from '../types/registration';

export interface ScoringCriterion {
  category: string;
  marks: number;
  description: string;
}

export interface EventConfig {
  id: EventId;
  /** Single letter used in the participation ID (TI<code-letter>001) */
  code: string;
  index: number;
  name: string;
  fullName: string;
  tagline: string;
  venue: string;
  memberCounts: number[];
  fee: number;
  requiresDepartment: boolean;
  domains?: string[];
  trackList?: string[];
  scoringMatrix?: ScoringCriterion[];
  formatDetails?: string[];
}

export const REGISTRATION_FEE = 300;

// Exact target dates per specification
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
    title: 'Squad Registration & Domain Claim',
    date: 'Active Now – 10 Sep 2026',
    timeSlot: '11:59 PM IST Deadline',
    venue: 'Online Registration Portal',
    description: 'Squad leaders submit team details, choose department/domain, and generate sequential TI-Participation ID upon fee verification.',
    status: 'active',
    badge: 'ONLINE',
    milestones: [
      'Team & member identity verification',
      'Department domain assignment',
      'Unique Participation ID generation'
    ]
  },
  {
    phase: 'PHASE 02',
    title: 'Shortlisting & Ideation Screening',
    date: '12 Sep 2026',
    timeSlot: '10:00 AM – 04:00 PM',
    venue: 'Academic Review Board',
    description: 'Technical evaluation of submitted problem statements and team composition. Shortlisted squads receive digital admission passes.',
    status: 'upcoming',
    badge: 'SCREENING',
    milestones: [
      'Feasibility evaluation',
      'Slot allocation by jury',
      'Digital gate pass issue'
    ]
  },
  {
    phase: 'PHASE 03',
    title: 'Grand Inauguration & Keynote Address',
    date: '19 Sep 2026',
    timeSlot: '08:30 AM – 09:30 AM',
    venue: 'Main Auditorium',
    description: 'Official opening ceremony, release of hackathon problem briefs, rules declaration, and keynote by distinguished guests.',
    status: 'upcoming',
    badge: 'ON-CAMPUS',
    milestones: [
      'Physical reporting & kit distribution',
      'Dataset & problem reveal',
      'Keynote & rubric brief'
    ]
  },
  {
    phase: 'PHASE 04',
    title: 'Live Build Sprint & Mentorship Checks',
    date: '19 Sep 2026',
    timeSlot: '09:30 AM – 05:30 PM',
    venue: 'Auditorium & Dedicated Tech Labs',
    description: 'Continuous development sprint across all 5 event arenas with mentor reviews at designated checkpoints.',
    status: 'upcoming',
    badge: 'LIVE SPRINT',
    milestones: [
      'Rapid prototype development',
      'Mid-evaluation review (01:30 PM)',
      'Mentorship refinements'
    ]
  },
  {
    phase: 'PHASE 05',
    title: 'Code Freeze & Live Jury Demonstration',
    date: '19 Sep 2026',
    timeSlot: '05:30 PM – 07:30 PM',
    venue: 'IT Lab / FOSS Lab / Seminar Halls',
    description: 'Repository commit freeze and 5-minute live working prototype demonstration with Q&A before the expert jury.',
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
    title: 'Valedictory & Grand Awards Ceremony',
    date: '19 Sep 2026',
    timeSlot: '08:00 PM – 09:30 PM',
    venue: 'Main Auditorium',
    description: 'Announcement of winners across all events, cash prize distribution, certificates, and valedictory felicitation.',
    status: 'upcoming',
    badge: 'AWARDS',
    milestones: [
      'Grand trophies & cash prizes',
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
  'Web Exploitation & Security Auditing',
  'Cryptography & Steganography',
  'Reverse Engineering & Binary Analysis',
  'Network Forensics & Packet Analysis'
];

export const CTF_FORMAT_DETAILS = [
  'Format: 2 Competitive Rounds, 2 Flags to capture',
  'Round 1: Preliminary qualifying challenges (Crypto & Web forensics)',
  'Round 2: Advanced live CTF offensive-defense flag submission',
  'Live Dynamic Scoreboard with time-penalty multipliers'
];

// E-Games / E-Sports Domains
export const EGAMES_DOMAINS = [
  'BGMI Tactical Squad Championship',
  'Free Fire Clash Squad Arena',
  'Valorant Spike Rush Tournament',
  'FIFA Competitive League'
];

// ELARIS SOZO '26 Domains
export const ELARIS_SOZO_DOMAINS = [
  'AI & Deep Tech Scientific Research',
  'Sustainable CleanTech Innovations',
  'Embedded IoT Hardware & Smart Devices',
  'Open Domain Technical Innovation'
];

export const EVENTS: EventConfig[] = [
  {
    id: 'hackathon',
    code: 'H',
    index: 1,
    name: "Hackathon '26",
    fullName: "Hackathon '26 (Multi-Department Flagship)",
    tagline: 'Premier 8-hour sprint solving department-specific and interdisciplinary engineering challenges.',
    venue: 'Auditorium',
    memberCounts: [3, 4],
    fee: REGISTRATION_FEE,
    requiresDepartment: true
  },
  {
    id: '2d-games',
    code: 'D',
    index: 2,
    name: '2D Games (SOZO)',
    fullName: "2D Games (SOZO '26)",
    tagline: 'Game development arena judged on gameplay, art, and technical brilliance.',
    venue: 'IT Lab',
    memberCounts: [2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: GAMES_2D_DOMAINS,
    scoringMatrix: GAMES_2D_SCORING_MATRIX
  },
  {
    id: 'ctf',
    code: 'C',
    index: 3,
    name: 'Capture The Flag',
    fullName: "Capture The Flag (NEXVORA '26)",
    tagline: 'Elite cybersecurity hacking challenge across 2 intensive rounds with 2 flags to capture.',
    venue: 'FOSS Lab',
    memberCounts: [2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: CTF_DOMAINS,
    formatDetails: CTF_FORMAT_DETAILS
  },
  {
    id: 'e-games',
    code: 'E',
    index: 4,
    name: 'E-Games / E-Sports',
    fullName: "E-Games & E-Sports Championship '26",
    tagline: 'Competitive multi-title gaming arena testing team strategy, reflexes, and tactical coordination.',
    venue: 'Gaming Lab / Tech Hub',
    memberCounts: [2, 3, 4],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: EGAMES_DOMAINS
  },
  {
    id: 'elaris-sozo',
    code: 'P',
    index: 5,
    name: 'ELARIS SOZO',
    fullName: "ELARIS SOZO '26 (Paper & Project Innovation)",
    tagline: 'National technical paper presentation and prototype project exposition before academic jury.',
    venue: 'Seminar Hall & Innovation Gallery',
    memberCounts: [1, 2, 3],
    fee: REGISTRATION_FEE,
    requiresDepartment: false,
    domains: ELARIS_SOZO_DOMAINS
  }
];

// Official Helpline Numbers per specification
export const SUPPORT_LINES = [
  { label: 'Convenor Helpline 1', number: '+91 95665 2006', tel: '+91956652006' },
  { label: 'Registration Helpline 2', number: '+91 90030 18088', tel: '+919003018088' }
];

export function getEvent(id: EventId): EventConfig {
  const match = EVENTS.find((e) => e.id === id);
  return match || EVENTS[0];
}