import { EVENTS, REGISTRATION_FEE, getEvent } from '../data/events';
import { CloudDatabase } from './firebase';
import { submitToWeb3Forms } from './web3forms';
import type {
  EventSettings,
  PaymentStatus,
  Registration,
  RegistrationInput,
  TakenDomains
} from '../types/registration';

export const API_BASE_URL: string | null = null;
export const IS_REMOTE_BACKEND = Boolean(API_BASE_URL);

const STORAGE_KEY = 'ryvanta_registrations_v5';
const SETTINGS_KEY = 'ryvanta_settings_v4';
const NETWORK_DELAY = 280;

export const DEFAULT_SETTINGS: EventSettings = {
  upiId: 'alangaram1985@okicici',
  payeeName: 'Alangaram Selvaraj'
};

export class ApiRequestError extends Error {
  field?: keyof RegistrationInput;

  constructor(message: string, field?: keyof RegistrationInput) {
    super(message);
    this.name = 'ApiRequestError';
    this.field = field;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStore(): Registration[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Registration[]) : [];
  } catch {
    return [];
  }
}

function writeStore(records: Registration[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* storage fallback */
  }
}

function readSettings(): EventSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<EventSettings>) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: EventSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage fallback */
  }
}

function validate(input: RegistrationInput, existing: Registration[]): void {
  const event = getEvent(input.eventId);

  // 1. Team Name (Required text field, min 3 chars)
  if (!input.teamName || input.teamName.trim().length < 3) {
    throw new ApiRequestError('Team Name is required and must have at least 3 characters.', 'teamName');
  }

  // 2. Team Members Names (Constrained strictly by event's minMembers and maxMembers)
  if (!input.members || input.members.length < event.minMembers || input.members.length > event.maxMembers) {
    throw new ApiRequestError(
      `${event.name} requires between ${event.minMembers} and ${event.maxMembers} team members.`,
      'members'
    );
  }

  if (input.members.some((name) => !name || name.trim().length < 2)) {
    throw new ApiRequestError('Every team member requires a valid full name.', 'members');
  }

  // 3. Primary Mobile Number (10-digit numeric validation)
  const cleanPhone = (input.phone || input.leaderPhone || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    throw new ApiRequestError('Enter a valid 10-digit primary mobile number (starts with 6, 7, 8, or 9).', 'phone');
  }

  // 4. Email ID (Standard email format validation)
  const cleanEmail = (input.email || input.leaderEmail || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    throw new ApiRequestError('Enter a valid email address format (e.g. name@college.edu).', 'email');
  }

  // Duplicate email check
  const alreadyUsed = existing.some((r) => {
    const leaderMatch = (r.email || '').toLowerCase() === cleanEmail || (r.leaderEmail || '').toLowerCase() === cleanEmail;
    const memberMatch = r.memberDetails?.some((m) => (m.email || '').toLowerCase() === cleanEmail);
    return leaderMatch || memberMatch;
  });

  if (alreadyUsed) {
    throw new ApiRequestError(`Email "${cleanEmail}" has already been used for registration. Only one registration is allowed per email address.`, 'email');
  }

  // Duplicate team name check per event
  if (
    existing.some(
      (record) =>
        record.eventId === input.eventId &&
        record.teamName.trim().toLowerCase() === input.teamName.trim().toLowerCase()
    )
  ) {
    throw new ApiRequestError('A team with this name is already registered for this event.', 'teamName');
  }
}

/**
 * Generate unique formatted Participation ID:
 * Format: TI[EventLetter][SequentialNumber] (e.g. TICH1001, TID1001, TIC1001)
 */
function nextId(eventId: RegistrationInput['eventId'], existing: Registration[]): string {
  const event = getEvent(eventId);
  const count = existing.filter((record) => record.eventId === eventId).length;
  const startNumber = 1001;
  const sequentialNum = (startNumber + count).toString();
  return `TI${event.code}${sequentialNum}`;
}

export async function listRegistrations(): Promise<Registration[]> {
  await wait(NETWORK_DELAY);
  return readStore();
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  const records = readStore();
  return records.some((r) => {
    const leaderMatch =
      (r.email || '').toLowerCase() === normalized ||
      (r.leaderEmail || '').toLowerCase() === normalized;
    const memberMatch = r.memberDetails?.some(
      (m) => (m.email || '').toLowerCase() === normalized
    );
    return leaderMatch || memberMatch;
  });
}

export async function createRegistration(
  input: RegistrationInput
): Promise<Registration> {
  await wait(NETWORK_DELAY + 100);
  const existing = readStore();
  validate(input, existing);

  const event = getEvent(input.eventId);
  const record: Registration = {
    ...input,
    teamName: input.teamName.trim(),
    leaderName: (input.leaderName || input.members[0] || '').trim(),
    leaderPhone: (input.leaderPhone || input.phone || '').trim(),
    leaderEmail: (input.leaderEmail || input.email || '').trim(),
    institution: (input.institution || 'College / Institution').trim(),
    track: (input.track || input.domain || 'General Track').trim(),
    members: input.members.map((name) => name.trim()),
    memberDetails: input.memberDetails || [],
    email: (input.leaderEmail || input.email || '').trim(),
    phone: (input.leaderPhone || input.phone || '').trim(),
    upiRef: input.upiRef ? input.upiRef.trim() : '',
    paymentScreenshot: input.paymentScreenshot,
    termsAccepted: input.termsAccepted ?? true,
    id: nextId(input.eventId, existing),
    eventName: event.fullName,
    memberCount: input.members.length,
    paymentMethod: 'upi',
    feeAmount: REGISTRATION_FEE,
    paymentStatus: input.paymentStatus ?? 'verified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  writeStore([...existing, record]);
  void CloudDatabase.saveRegistration(record);
  void submitToWeb3Forms(record);
  return record;
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<Registration> {
  await wait(NETWORK_DELAY);
  const existing = readStore();
  const target = existing.find((record) => record.id === id);
  if (!target) throw new ApiRequestError('Registration record not found.');

  const updated: Registration = {
    ...target,
    paymentStatus,
    updatedAt: new Date().toISOString()
  };

  writeStore(existing.map((record) => (record.id === id ? updated : record)));
  void CloudDatabase.updatePaymentStatus(id, paymentStatus);
  return updated;
}

export async function deleteRegistration(id: string): Promise<void> {
  await wait(NETWORK_DELAY);
  const existing = readStore();
  writeStore(existing.filter((record) => record.id !== id));
  void CloudDatabase.deleteRegistration(id);
}

export async function listTakenDomains(): Promise<TakenDomains> {
  const records = readStore();
  const taken: TakenDomains = {};
  for (const record of records) {
    const val = record.track || record.domain;
    if (val) {
      taken[record.eventId] = [...(taken[record.eventId] ?? []), val];
    }
  }
  return taken;
}

export async function getStoredSettings(): Promise<EventSettings> {
  return readSettings();
}

export async function saveStoredSettings(
  patch: Partial<EventSettings>
): Promise<EventSettings> {
  const current = readSettings();
  const updated: EventSettings = { ...current, ...patch };
  writeSettings(updated);
  void CloudDatabase.saveSettings(updated);
  return updated;
}

export const getSettings = getStoredSettings;
export const updateSettings = saveStoredSettings;

export async function authenticateAdmin(passcode: string): Promise<boolean> {
  await wait(NETWORK_DELAY);
  if (passcode === 'admin123') return true;
  throw new ApiRequestError('Incorrect admin passcode.');
}

export function toCsv(records: Registration[]): string {
  const headers = [
    'Participation ID',
    'Event Name',
    'Team Name',
    'Team Leader',
    'Leader Email',
    'Leader Phone',
    'Institution',
    'Department',
    'Domain / Track',
    'Member Count',
    'All Members',
    'Fee (INR)',
    'Payment Status',
    'UPI Ref',
    'Registered At'
  ];

  const rows = records.map((r) => [
    r.id,
    `"${r.eventName}"`,
    `"${r.teamName.replace(/"/g, '""')}"`,
    `"${(r.leaderName || r.members[0] || '').replace(/"/g, '""')}"`,
    r.email,
    r.phone,
    `"${(r.institution || '').replace(/"/g, '""')}"`,
    `"${(r.department || '').replace(/"/g, '""')}"`,
    `"${(r.track || r.domain || '').replace(/"/g, '""')}"`,
    r.memberCount,
    `"${r.members.join('; ').replace(/"/g, '""')}"`,
    r.feeAmount,
    r.paymentStatus,
    `"${r.upiRef || ''}"`,
    r.createdAt
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}