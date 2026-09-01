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
}

export const REGISTRATION_FEE = 300;

export const REGISTRATION_CLOSES_AT = '2026-09-10T23:59:59';
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
  memberCounts: [3, 4],
  requiresDepartment: true
},
{
  id: 'games2d',
  code: 'D',
  index: 2,
  name: '2D Games',
  fullName: '2D Games Championship',
  tagline: 'Ship a playable 2D game from a themed domain prompt.',
  venue: 'IT Lab',
  memberCounts: [2, 3],
  requiresDepartment: false,
  domains: [
  'Cyber Detective',
  'Disaster Resources',
  'Puzzle',
  'Endless Runner',
  'Farming',
  'Space Adventure',
  'Logic',
  'Racing',
  '2D-Comebacks',
  'Eco City']

},
{
  id: 'ctf',
  code: 'C',
  index: 3,
  name: 'Capture The Flag',
  fullName: 'Capture The Flag — CTF',
  tagline: 'Jeopardy-style security challenges across five categories.',
  venue: 'FOSS Lab',
  memberCounts: [2, 3],
  requiresDepartment: false
},
{
  id: 'egames',
  code: 'E',
  index: 4,
  name: 'E-Games',
  fullName: 'E-Sports Showdown — Free Fire',
  tagline: 'Squad bracket, single elimination, on-site devices.',
  venue: 'Network Lab',
  memberCounts: [1, 2, 3, 4],
  requiresDepartment: false
},
{
  id: 'elaris',
  code: 'P',
  index: 5,
  name: 'ELARIS SOZO',
  fullName: "ELARIS SOZO '26",
  tagline: 'Paper presentation and idea pitch before an industry panel.',
  venue: 'Smart Class Room',
  memberCounts: [2, 3],
  requiresDepartment: false
}];


export function getEvent(id: EventId): EventConfig {
  return EVENTS.find((event) => event.id === id) ?? EVENTS[0];
}

export const DEPARTMENTS = [
'CSE',
'IT',
'ECE',
'EEE',
'Mechanical Engineering',
'Aeronautical Engineering',
'Interdisciplinary / Open Domain'] as
const;

export const DEPARTMENT_DOMAINS: Record<string, string[]> = {
  CSE: [
  'Artificial Intelligence & Machine Learning',
  'Computer Vision & Intelligent Inspection',
  'Cybersecurity & Digital Innovation',
  'Advanced Software & Emerging Technologies'],

  IT: [
  'Artificial Intelligence & Machine Learning',
  'Computer Vision & Intelligent Inspection',
  'Cybersecurity & Digital Innovation',
  'Cloud Computing & Smart Applications'],

  ECE: [
  'IoT, Embedded Systems & Smart Automation',
  'Robotics & Autonomous Systems',
  'Computer Vision & Intelligent Inspection',
  'Smart Communication & Connected Systems'],

  EEE: [
  'Smart Energy & Sustainable Engineering',
  'IoT, Embedded Systems & Smart Automation',
  'Robotics & Autonomous Systems',
  'Smart Grid & Energy Management'],

  'Mechanical Engineering': [
  'Robotics & Autonomous Systems',
  'Smart Manufacturing & Industrial Automation',
  'Computer Vision & Intelligent Inspection',
  'Advanced Engineering & Digital Innovation'],

  'Aeronautical Engineering': [
  'Smart Mobility, Transportation & Aerospace Technology',
  'Robotics & Autonomous Systems',
  'Drone & Autonomous Flight Technology',
  'Computer Vision & Intelligent Inspection'],

  'Interdisciplinary / Open Domain': [
  'Advanced Engineering & Digital Innovation',
  'AI-Based Engineering Solutions',
  'Smart Systems & Automation',
  'Emerging Technologies & Innovation']

};

export const SUPPORT_LINES = [
{ label: 'Registration desk', number: '+91 95665 2006', tel: '+919566520060' },
{ label: 'Event coordination', number: '+91 90030 18088', tel: '+919003018088' }];