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
  milestones?: string[];
}

export const HACKATHON_TIMELINE: TimelineMilestone[] = [
  {
    phase: 'PHASE 01',
    title: 'Squad Registration & Track Selection',
    date: 'Active Now – 15 Sep 2026',
    timeSlot: '11:59 PM IST Deadline',
    venue: 'Online Innovation Portal',
    description: 'Squad leaders submit team details, select innovation challenge track, and complete verified payment registration.',
    status: 'active',
    badge: 'ONLINE',
    milestones: [
      'Squad identity & track submission',
      'One-time email validation',
      'Instant digital entry gate pass'
    ]
  },
  {
    phase: 'PHASE 02',
    title: 'Shortlisting & Ideation Review',
    date: '16 Sep 2026',
    timeSlot: '10:00 AM – 04:00 PM',
    venue: 'Jury Evaluation Room',
    description: 'Technical evaluation of submitted problem statements and squad composition. Shortlisted squads receive digital confirmation.',
    status: 'upcoming',
    badge: 'SCREENING',
    milestones: [
      'Problem statement feasibility check',
      'Domain expert initial scoring',
      'Finalist squad confirmation emails'
    ]
  },
  {
    phase: 'PHASE 03',
    title: 'Grand Kickoff & Keynote Briefing',
    date: '19 Sep 2026',
    timeSlot: '08:30 AM – 09:30 AM',
    venue: 'Main Tech Auditorium',
    description: 'Inaugural ceremony, challenge track rules reveal, and orientation by top industry leaders and keynote speakers.',
    status: 'upcoming',
    badge: 'ON-CAMPUS',
    milestones: [
      'Physical reporting & badge badge check',
      'Track rules & dataset release',
      'Opening keynote address'
    ]
  },
  {
    phase: 'PHASE 04',
    title: 'The Build Sprint & Mentorship Rounds',
    date: '19 Sep 2026',
    timeSlot: '09:30 AM – 06:00 PM',
    venue: 'Advanced Computing Center',
    description: 'Non-stop hacking, prototype development, and mandatory mentor checkpoints (Mid-evaluation at 01:30 PM).',
    status: 'upcoming',
    badge: 'HACKATHON SPRINT',
    milestones: [
      'High-speed prototype development',
      '1-on-1 mentor guidance check-ins',
      'Mid-sprint progress review'
    ]
  },
  {
    phase: 'PHASE 05',
    title: 'Final Code Freeze & Jury Live Demo',
    date: '19 Sep 2026',
    timeSlot: '06:00 PM – 07:30 PM',
    venue: 'Demo Arena & Smart Labs',
    description: 'Final repository commits lock and 5-minute live working prototype demonstration before the grand judging panel.',
    status: 'upcoming',
    badge: 'EVALUATION',
    milestones: [
      'Hard code freeze & repo commit lock',
      '5-Minute live project presentation',
      'Jury Q&A and rubric evaluation'
    ]
  },
  {
    phase: 'PHASE 06',
    title: 'Grand Finale, Results & Awards Ceremony',
    date: '19 Sep 2026',
    timeSlot: '08:00 PM – 09:30 PM',
    venue: 'Main Stage Auditorium',
    description: 'Announcement of winners, certificate distribution, internship offers, and grand prize pool presentation.',
    status: 'upcoming',
    badge: 'AWARDS',
    milestones: [
      'Winners announcement & trophy ceremony',
      'Internship & seed grant offers',
      'Official participation certificate release'
    ]
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
    fullName: "National Level Hackathon '26",
    tagline: '8-hour intensive build sprint across premier innovation tracks.',
    venue: 'Computing Hub, Main Block',
    memberCounts: [2, 3, 4],
    requiresDepartment: false,
    trackList: CHALLENGE_TRACKS
  },
  {
    id: 'tech-innovate',
    code: 'T',
    index: 2,
    name: 'Tech Innovate',
    fullName: 'Tech Innovate Prototype Expo',
    tagline: 'Hardware and embedded systems live product showcase.',
    venue: 'Innovation & Robotics Lab',
    memberCounts: [2, 3, 4],
    requiresDepartment: false,
    trackList: [
      'Edge AI & Embedded Intelligence',
      'Autonomous Systems & Robotics',
      'Smart City & Sustainable Hardware',
      'Biomedical & Assistive Tech'
    ]
  },
  {
    id: 'paper-presentation',
    code: 'P',
    index: 3,
    name: 'Paper Presentation',
    fullName: 'National Technical Paper Presentation',
    tagline: 'Research exposition, journal-ready papers, and peer review.',
    venue: 'Seminar Hall 1',
    memberCounts: [1, 2, 3],
    requiresDepartment: true
  },
  {
    id: 'project-display',
    code: 'D',
    index: 4,
    name: 'Project Display',
    fullName: 'National Project & Venture Expo',
    tagline: 'Working software/hardware demos, startup pitches, and jury evaluations.',
    venue: 'Central Exhibition Hall',
    memberCounts: [2, 3, 4],
    requiresDepartment: true
  },
  {
    id: 'quiz',
    code: 'Q',
    index: 5,
    name: 'Tech Quiz & Code Arena',
    fullName: 'Tech Titans Quiz & Competitive Arena',
    tagline: 'High-speed technical buzzer rounds, algorithm sprints, and CS trivia.',
    venue: 'Auditorium 2',
    memberCounts: [2],
    requiresDepartment: false,
    domains: ['Computer Science & Algorithms', 'AI & Machine Learning Trivia', 'Tech History & General Tech']
  }
];

export const DEPARTMENTS = [
  'CSE / IT / AI / Data Science',
  'ECE / Electronics & Communication',
  'EEE / Electrical Engineering',
  'Mechanical / Mechatronics',
  'Civil & Environmental Engineering',
  'Biotechnology & Bio-Engineering',
  'Other Interdisciplinary'
];

export const DEPARTMENT_DOMAINS: Record<string, string[]> = {
  'CSE / IT / AI / Data Science': [
    'Deep Learning & Large Language Models',
    'Distributed Systems & Cloud Computing',
    'Quantum Computing & Cryptography',
    'Computer Vision & Autonomous Perception'
  ],
  'ECE / Electronics & Communication': [
    '5G/6G Wireless & RF Communications',
    'VLSI Design & Embedded Systems',
    'IoT Architectures & Sensor Networks',
    'Signal & Image Processing'
  ],
  'EEE / Electrical Engineering': [
    'Smart Grids & Renewable Energy Integration',
    'Electric Vehicles & Battery Tech',
    'Power Electronics & Drives',
    'Industrial Automation & PLC'
  ],
  'Mechanical / Mechatronics': [
    'Additive Manufacturing & 3D Printing',
    'Robotics, Kinematics & Drone Dynamics',
    'Thermodynamics & HVAC Innovations',
    'Computational Fluid Dynamics'
  ],
  'Civil & Environmental Engineering': [
    'Smart Infrastructure & BIM',
    'Sustainable Construction Materials',
    'Water Resource Engineering & Treatment',
    'Geotechnical Seismic Analysis'
  ],
  'Biotechnology & Bio-Engineering': [
    'Bioinformatics & Genomic Analysis',
    'Biomedical Instrumentation',
    'Synthetic Biology & Fermentation',
    'Pharmaceutical Drug Delivery'
  ],
  'Other Interdisciplinary': [
    'Open Innovation & Cross-Domain Research',
    'Tech for Social Impact',
    'SpaceTech & Geospatial Systems'
  ]
};

export const SUPPORT_LINES = [
  { label: 'Convenor & Registration Desk', number: '+91 98765 43210', tel: '+919876543210' },
  { label: 'Technical & Challenge Tracks', number: '+91 98765 43211', tel: '+919876543211' },
  { label: 'Payment & ID Helpdesk', number: '+91 98765 43212', tel: '+919876543212' }
];

export function getEvent(id: EventId): EventConfig {
  const match = EVENTS.find((e) => e.id === id);
  return match || EVENTS[0];
}