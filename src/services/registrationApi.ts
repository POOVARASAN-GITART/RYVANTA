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

const STORAGE_KEY = 'ryvanta_registrations_v4';
const SETTINGS_KEY = 'ryvanta_settings_v3';
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new ApiRequestError(
      (detail as { message?: string } | null)?.message ??
        `Request failed (${response.status})`
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * Check if an email address is already registered in any squad (One-Time Email Constraint)
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  const records = readStore();
  return records.some((r) => {
    const leaderMatch =
      r.email?.toLowerCase() === normalized ||
      r.leaderEmail?.toLowerCase() === normalized;
    const memberMatch = r.memberDetails?.some(
      (m) => m.email?.toLowerCase() === normalized
    );
    return leaderMatch || memberMatch;
  });
}

function validate(input: RegistrationInput, existing: Registration[]): void {
  const event = getEvent(input.eventId);

  if (input.teamName.trim().length < 3) {
    throw new ApiRequestError('Squad/Team name needs at least 3 characters.', 'teamName');
  }

  if (input.leaderName && input.leaderName.trim().length < 2) {
    throw new ApiRequestError('Leader full name is required.', 'leaderName');
  }

  const effectiveEmail = (input.leaderEmail || input.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(effectiveEmail)) {
    throw new ApiRequestError('Enter a valid reachable email address.', 'email');
  }

  const effectivePhone = (input.leaderPhone || input.phone || '').trim();
  if (!/^[0-9+\s-]{10,15}$/.test(effectivePhone)) {
    throw new ApiRequestError('Enter a valid 10-digit WhatsApp phone number.', 'phone');
  }

  if (input.members.some((name) => name.trim().length < 2)) {
    throw new ApiRequestError('Every squad member needs a valid full name.', 'members');
  }

  if (!event.memberCounts.includes(input.members.length)) {
    throw new ApiRequestError(
      `${event.name} accepts ${event.memberCounts.join(' or ')} members.`,
      'members'
    );
  }

  // Strict One-Time Email Validation Constraint
  const allParticipantEmails = [
    effectiveEmail,
    ...(input.memberDetails?.map((m) => (m.email || '').trim().toLowerCase()).filter(Boolean) || [])
  ];

  for (const checkEmail of allParticipantEmails) {
    if (!checkEmail) continue;
    const alreadyRegistered = existing.some((r) => {
      const leaderMatch =
        (r.email || '').toLowerCase() === checkEmail ||
        (r.leaderEmail || '').toLowerCase() === checkEmail;
      const memberMatch = r.memberDetails?.some(
        (m) => (m.email || '').toLowerCase() === checkEmail
      );
      return leaderMatch || memberMatch;
    });

    if (alreadyRegistered) {
      throw new ApiRequestError(
        `Registration Error: Email "${checkEmail}" has already been used to register. Only one registration is allowed per email address.`,
        'email'
      );
    }
  }

  // Duplicate team name check
  if (
    existing.some(
      (record) =>
        record.eventId === input.eventId &&
        record.teamName.trim().toLowerCase() === input.teamName.trim().toLowerCase()
    )
  ) {
    throw new ApiRequestError('A squad with this name is already registered for this event.', 'teamName');
  }

  // One team per domain/track lock
  const selectedTrack = input.track || input.domain;
  if (
    selectedTrack &&
    existing.some(
      (record) =>
        record.eventId === input.eventId &&
        (record.track?.trim().toLowerCase() === selectedTrack.trim().toLowerCase() ||
          record.domain?.trim().toLowerCase() === selectedTrack.trim().toLowerCase())
    )
  ) {
    throw new ApiRequestError(
      `"${selectedTrack}" was just claimed by another squad. Please pick another challenge track.`,
      'domain'
    );
  }
}

function nextId(eventId: RegistrationInput['eventId'], existing: Registration[]): string {
  const event = getEvent(eventId);
  const count = existing.filter((record) => record.eventId === eventId).length;
  const index = (count + 1).toString().padStart(3, '0');
  return `TI${event.code}${index}`;
}

export async function listRegistrations(): Promise<Registration[]> {
  if (API_BASE_URL) return request<Registration[]>('/registrations');
  await wait(NETWORK_DELAY);
  return readStore();
}

export async function createRegistration(
  input: RegistrationInput
): Promise<Registration> {
  if (API_BASE_URL) {
    return request<Registration>('/registrations', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

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
    track: (input.track || input.domain || 'General Tech Innovation').trim(),
    members: input.members.map((name) => name.trim()),
    memberDetails: input.memberDetails || [],
    email: (input.leaderEmail || input.email || '').trim(),
    phone: (input.leaderPhone || input.phone || '').trim(),
    upiRef: input.upiRef ? input.upiRef.trim() : '',
    paymentScreenshot: input.paymentScreenshot,
    termsAccepted: input.termsAccepted ?? true,
    id: nextId(input.eventId, existing),
    eventName: event.fullName,
    eventCode: event.code,
    memberCount: input.members.length,
    feeAmount: REGISTRATION_FEE,
    paymentStatus: input.paymentStatus ?? 'verified',
    createdAt: new Date().toISOString()
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
  if (API_BASE_URL) {
    return request<Registration>(`/registrations/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus })
    });
  }

  await wait(NETWORK_DELAY);
  const records = readStore();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) throw new ApiRequestError('Registration not found.');
  const updated = { ...records[index], paymentStatus };
  records[index] = updated;
  writeStore(records);
  void CloudDatabase.updatePaymentStatus(id, paymentStatus);
  return updated;
}

export async function deleteRegistration(id: string): Promise<void> {
  if (API_BASE_URL) {
    await request<void>(`/registrations/${id}`, { method: 'DELETE' });
    return;
  }
  await wait(NETWORK_DELAY);
  writeStore(readStore().filter((record) => record.id !== id));
  void CloudDatabase.deleteRegistration(id);
}

export async function listTakenDomains(): Promise<TakenDomains> {
  if (API_BASE_URL) return request<TakenDomains>('/domains/taken');

  await wait(NETWORK_DELAY);
  return readStore().reduce<TakenDomains>((taken, record) => {
    const claim = record.track || record.domain;
    if (!claim) return taken;
    const claimed = taken[record.eventId] ?? [];
    return { ...taken, [record.eventId]: [...claimed, claim] };
  }, {});
}

export async function getSettings(): Promise<EventSettings> {
  if (API_BASE_URL) return request<EventSettings>('/settings');
  await wait(NETWORK_DELAY);
  return readSettings();
}

export async function updateSettings(
  patch: Partial<EventSettings>
): Promise<EventSettings> {
  const next = { ...readSettings(), ...patch };

  if (next.upiId && !/^[\w.\-]{3,}@[a-zA-Z]{2,}$/.test(next.upiId.trim())) {
    throw new ApiRequestError('Enter a valid UPI ID format, e.g. name@okaxis');
  }
  if (next.upiId) next.upiId = next.upiId.trim();
  if (next.payeeName) next.payeeName = next.payeeName.trim();
  if (next.accountNumber) next.accountNumber = next.accountNumber.trim();
  if (next.ifscCode) next.ifscCode = next.ifscCode.trim().toUpperCase();
  if (next.bankName) next.bankName = next.bankName.trim();
  if (next.branchName) next.branchName = next.branchName.trim();

  if (API_BASE_URL) {
    return request<EventSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(next)
    });
  }

  await wait(NETWORK_DELAY);
  writeSettings(next);
  void CloudDatabase.saveSettings(next);
  return next;
}

export async function authenticateAdmin(passcode: string): Promise<string> {
  if (API_BASE_URL) {
    const result = await request<{ token: string }>('/admin/session', {
      method: 'POST',
      body: JSON.stringify({ passcode })
    });
    return result.token;
  }

  await wait(NETWORK_DELAY);
  if (passcode !== 'admin123') {
    throw new ApiRequestError('Incorrect passcode.');
  }
  return 'local-admin-token';
}

export function toCsv(records: Registration[]): string {
  const headers = [
    'ID',
    'Event',
    'Squad Name',
    'Leader Name',
    'Leader Email',
    'Leader Phone',
    'Institution',
    'Challenge Track',
    'Member Count',
    'All Members',
    'Payment Status',
    'UTR Reference',
    'Registered At'
  ];

  const escapeField = (val: unknown) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeField(r.id),
    escapeField(r.eventName),
    escapeField(r.teamName),
    escapeField(r.leaderName || r.members[0] || ''),
    escapeField(r.leaderEmail || r.email || ''),
    escapeField(r.leaderPhone || r.phone || ''),
    escapeField(r.institution || ''),
    escapeField(r.track || r.domain || ''),
    escapeField(r.memberCount),
    escapeField(r.members.join('; ')),
    escapeField(r.paymentStatus),
    escapeField(r.upiRef || ''),
    escapeField(r.createdAt)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}