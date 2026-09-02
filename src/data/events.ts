import type { EventId } from '../types/registration';

export interface EventConfig {
  id: EventId;
  /** Single letter used in the participation ID (TI<code>001) */
  code: string;
  index: number;
  name: string;
  fullName: string;
  tagline: string;
  venue: string;
  memberCounts: number[];
  requiresDepartment: boolean;
  domains?: string[];
  trackList?: string[];
}

export const REGISTRATION_FEE = 300;

export const REGISTRATION_CLOSES_AT = '2026-09-15T23:59:59';
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
}

export const HACKATHON_TIMELINE: TimelineMilestone[] = [
  {
    phase: 'PHASE 01',
    title: 'Squad Registration & Track Selection',
    date: 'Active Now – 15 Sep 2026',
    timeSlot: '11:59 PM IST Deadline',
    venue: 'Online Cyber Portal',
    description: 'Squad leaders submit team details, select innovation challenge track, and complete verified payment registration.',
    status: 'active',
    badge: 'ONLINE'
  },
  {
    phase: 'PHASE 02',
    title: 'Shortlisting & Ideation Review',
    date: '16 Sep 2026',
    timeSlot: '10:00 AM – 04:00 PM',
    venue: 'Jury Evaluation Room',
    description: 'Technical evaluation of submitted problem statements and squad composition. Shortlisted squads receive digital confirmation.',
    status: 'upcoming',
    badge: 'SCREENING'
  },
  {
    phase: 'PHASE 03',
    title: 'Grand Kickoff & Keynote Briefing',
    date: '19 Sep 2026',
    timeSlot: '08:30 AM – 09:30 AM',
    venue: 'Main Tech Auditorium',
    description: 'Inaugural ceremony, challenge track rules reveal, and orientation by top industry leaders and keynote speakers.',
    status: 'upcoming',
    badge: 'ON-CAMPUS'
  },
  {
    phase: 'PHASE 04',
    title: 'The Build Sprint & Mentorship Rounds',
    date: '19 Sep 2026',
    timeSlot: '09:30 AM – 06:00 PM',
    venue: 'Advanced Computing Center',
    description: 'Non-stop hacking, prototype development, and mandatory mentor checkpoints (Mid-evaluation at 01:30 PM).',
    status: 'upcoming',
    badge: 'HACKATHON SPRINT'
  },
  {
    phase: 'PHASE 05',
    title: 'Final Code Freeze & Jury Live Demo',
    date: '19 Sep 2026',
    timeSlot: '06:00 PM – 07:30 PM',
    venue: 'Demo Arena & Smart Labs',
    description: 'Final repository commits lock and 5-minute live working prototype demonstration before the grand judging panel.',
    status: 'upcoming',
    badge: 'EVALUATION'
  },
  {
    phase: 'PHASE 06',
    title: 'Grand Finale, Results & Awards Ceremony',
    date: '19 Sep 2026',
    timeSlot: '08:00 PM – 09:30 PM',
    venue: 'Main Stage Auditorium',
    description: 'Announcement of winners, certificate distribution, internship offers, and grand prize pool presentation.',
    status: 'upcoming',
    badge: 'AWARDS'
  }
];

export const CHALLENGE_TRACKS = [
  'Artificial Intelligence & GenAI Innovations',
  'Web3, Blockchain & Decentralized Governance',
  'Cyber Defense, Threat Intelligence & CTF',
  'Smart Automation, Robotics & IoT Ecosystems',
  'CleanTech, Green Energy & Smart Mobility',
  'HealthTech & Bio-Engineering Diagnostics',
  'FinTech, Open Innovation & Next-Gen Consumer Apps'
];

export const HACKATHON_RULES = [
  'All squad members must be enrolled students carrying valid college/institution identity cards on the event day.',
  'Teams must consist of 2 to 4 members. Interdisciplinary squads across different branches are highly encouraged.',
  'All project codebase, models, and prototypes must be developed fresh during the hackathon timeline.',
  'Open-source libraries, frameworks, and APIs are permitted provided they are declared during prototype submission.',
  'Strict adherence to the Hackathon Code of Conduct and Anti-Harassment policies is mandatory for all attendees.'
];

export const EVENTS: EventConfig[] = [
  {
    id: 'hackathon',
    code: 'H',
    index: 1,
    name: "Hackathon '26",
    fullName: "National Level Tech Innovation Challenge",
    tagline: '8-Hour intense build sprint: prototype, iterate, and pitch to industry judges.',
    venue: 'Tech Auditorium & Innovation Labs',
    memberCounts: [2, 3, 4],
    requiresDepartment: true,
    trackList: CHALLENGE_TRACKS
  },
  {
    id: 'games2d',
    code: 'D',
    index: 2,
    name: '2D Games',
    fullName: '2D Game Dev Championship',
    tagline: 'Design and ship a playable 2D game engine prototype from scratch.',
    venue: 'IT Lab',
    memberCounts: [2, 3],
    requiresDepartment: false,
    domains: [
      'Cyber Detective',
      'Disaster Resources',
      'Puzzle & Physics',
      'Endless Runner',
      'Farming & Economy',
      'Space Adventure',
      'Logic Simulation',
      'Arcade Racing',
      '2D-Comebacks',
      'Eco City Defense'
    ]
  },
  {
    id: 'ctf',
    code: 'C',
    index: 3,
    name: 'Capture The Flag',
    fullName: 'Capture The Flag — CTF Defense',
    tagline: 'Jeopardy-style offensive and defensive security challenge across web, pwn, and crypto.',
    venue: 'FOSS Security Lab',
    memberCounts: [2, 3],
    requiresDepartment: false
  },
  {
    id: 'egames',
    code: 'E',
    index: 4,
    name: 'E-Sports Showdown',
    fullName: 'E-Sports Tactical Showdown',
    tagline: 'Battle Royale squad tournament bracket with live streaming on big screens.',
    venue: 'Network Arena',
    memberCounts: [1, 2, 3, 4],
    requiresDepartment: false
  },
  {
    id: 'elaris',
    code: 'P',
    index: 5,
    name: 'ELARIS SOZO',
    fullName: "ELARIS SOZO '26 — Research Pitch",
    tagline: 'Paper presentation, deep-tech research, and venture pitch before investors.',
    venue: 'Smart Seminar Hall',
    memberCounts: [2, 3],
    requiresDepartment: false
  }
];

export function getEvent(id: EventId): EventConfig {
  return EVENTS.find((event) => event.id === id) ?? EVENTS[0];
}

export const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI&DS)',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical & Automation Engineering',
  'Aeronautical & Aerospace Engineering',
  'Interdisciplinary / Multi-Department Squad'
] as const;

export const DEPARTMENT_DOMAINS: Record<string, string[]> = {
  'Computer Science & Engineering (CSE)': [
    'Artificial Intelligence & Machine Learning',
    'Computer Vision & Intelligent Inspection',
    'Cybersecurity & Digital Innovation',
    'Advanced Software & Emerging Technologies'
  ],
  'Information Technology (IT)': [
    'Artificial Intelligence & Machine Learning',
    'Computer Vision & Intelligent Inspection',
    'Cybersecurity & Digital Innovation',
    'Cloud Computing & Smart Applications'
  ],
  'Artificial Intelligence & Data Science (AI&DS)': [
    'Generative AI & LLM Systems',
    'Autonomous Intelligence & Agents',
    'Big Data Analytics & Predictive Engines',
    'Deep Learning & Neural Vision'
  ],
  'Electronics & Communication (ECE)': [
    'IoT, Embedded Systems & Smart Automation',
    'Robotics & Autonomous Systems',
    'Computer Vision & Intelligent Inspection',
    'Smart Communication & Connected Systems'
  ],
  'Electrical & Electronics (EEE)': [
    'Smart Energy & Sustainable Engineering',
    'IoT, Embedded Systems & Smart Automation',
    'Robotics & Autonomous Systems',
    'Smart Grid & Energy Management'
  ],
  'Mechanical & Automation Engineering': [
    'Robotics & Autonomous Systems',
    'Smart Manufacturing & Industrial Automation',
    'Computer Vision & Intelligent Inspection',
    'Advanced Engineering & Digital Innovation'
  ],
  'Aeronautical & Aerospace Engineering': [
    'Smart Mobility, Transportation & Aerospace Technology',
    'Robotics & Autonomous Systems',
    'Drone & Autonomous Flight Technology',
    'Computer Vision & Intelligent Inspection'
  ],
  'Interdisciplinary / Multi-Department Squad': [
    'Advanced Engineering & Digital Innovation',
    'AI-Based Engineering Solutions',
    'Smart Systems & Automation',
    'Emerging Technologies & Innovation'
  ]
};

export const SUPPORT_LINES = [
  { label: 'Registration Desk', number: '+91 95665 20060', tel: '+919566520060' },
  { label: 'Event Coordination', number: '+91 90030 18088', tel: '+919003018088' }
];