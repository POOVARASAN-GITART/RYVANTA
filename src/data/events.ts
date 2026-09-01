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
  fee: number;
  memberCounts: number[];
  domains?: string[];
}

export const REGISTRATION_CLOSES_AT = '2026-09-14T23:59:59';
export const EVENT_STARTS_AT = '2026-09-19T09:00:00';

export const EVENTS: EventConfig[] = [
  {
    id: 'hackathon',
    code: 'H',
    index: 1,
    name: "Hackathon '26",
    fullName: "Hackathon '26",
    tagline: 'Eight hours, one working prototype, judged on the build.',
    venue: 'Auditorium',
    fee: 300,
    memberCounts: [2, 3],
    domains: [
      'Artificial Intelligence & Machine Learning',
      'IoT, Embedded Systems & Smart Automation',
      'Robotics & Autonomous Systems',
      'Smart Energy & Sustainable Engineering',
      'Computer Vision & Intelligent Inspection',
      'Smart Mobility, Transportation & Aerospace Technology',
      'Advanced Engineering & Digital Innovation'
    ]
  },
  {
    id: 'games2d',
    code: 'D',
    index: 2,
    name: '2D Games',
    fullName: '2D Games Championship',
    tagline: 'Ship a playable 2D game from a themed domain prompt.',
    venue: 'IT Lab',
    fee: 300,
    memberCounts: [2, 3],
  },
  {
    id: 'ctf',
    code: 'C',
    index: 3,
    name: 'Capture The Flag',
    fullName: 'Capture The Flag — CTF',
    tagline: 'Jeopardy-style security challenges across five categories.',
    venue: 'FOSS Lab',
    fee: 300,
    memberCounts: [2, 3],
  },
  {
    id: 'egames',
    code: 'E',
    index: 4,
    name: 'E-Games',
    fullName: 'E-Sports Showdown — Free Fire',
    tagline: 'Squad bracket, single elimination, on-site devices.',
    venue: 'Network Lab',
    fee: 400,
    memberCounts: [4],
  },
  {
    id: 'photography',
    code: 'P',
    index: 5,
    name: 'Photography and Reels',
    fullName: "Photography and Reels '26",
    tagline: 'Capture the essence of the event through your lens.',
    venue: 'Campus Wide',
    fee: 100,
    memberCounts: [1],
  }
];

export function getEvent(id: EventId): EventConfig {
  return EVENTS.find((event) => event.id === id) ?? EVENTS[0];
}

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export const SUPPORT_LINES = [
  { label: 'Registration desk', number: '+91 95665 42006', tel: '+919566542006' },
  { label: 'Event coordination', number: '+91 90030 18088', tel: '+919003018088' }
];