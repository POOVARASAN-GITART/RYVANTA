import { EVENTS, getEvent } from '../data/events';
import { CloudDatabase } from './firebase';
import { submitToWeb3Forms } from './web3forms';
import type {
  EventSettings,
  PaymentStatus,
  Registration,
  RegistrationInput,
  TakenDomains } from
'../types/registration';

/**
 * ── BACKEND WIRING ────────────────────────────────────────────────────────────
 * Point `API_BASE_URL` at your server and every call below switches from the
 * local persistence adapter to real HTTP. No UI code changes required.
 *
 * Expected contract:
 *   GET    {base}/registrations                -> Registration[]
 *   POST   {base}/registrations                -> Registration   (server assigns `id`)
 *   PATCH  {base}/registrations/:id/payment    -> Registration   ({ paymentStatus })
 *   DELETE {base}/registrations/:id            -> 204
 *   GET    {base}/domains/taken                -> TakenDomains
 *   GET    {base}/settings                     -> EventSettings
 *   PUT    {base}/settings                     -> EventSettings
 *   POST   {base}/admin/session                -> { token: string }
 */
export const API_BASE_URL: string | null = null;

export const IS_REMOTE_BACKEND = Boolean(API_BASE_URL);

const STORAGE_KEY = 'ryvanta_registrations_v3';
const SETTINGS_KEY = 'ryvanta_settings_v2';
const NETWORK_DELAY = 320;

export const DEFAULT_SETTINGS: EventSettings = {
  upiId: '9080228433@upi',
  payeeName: 'Mr VELKUMUDHAN D'
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
    return raw ? JSON.parse(raw) as Registration[] : [];
  } catch {
    return [];
  }
}

function writeStore(records: Registration[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {

    /* storage unavailable — records stay in memory for this session */}
}

function readSettings(): EventSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ?
    { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<EventSettings>) } :
    DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: EventSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {

    /* storage unavailable */}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new ApiRequestError(
      (detail as {message?: string;} | null)?.message ??
      `Request failed (${response.status})`
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function validate(input: RegistrationInput, existing: Registration[]): void {
  const event = getEvent(input.eventId);

  const isSoloEvent = event.memberCounts.length === 1 && event.memberCounts[0] === 1;

  if (!isSoloEvent && input.teamName.trim().length < 3) {
    throw new ApiRequestError('Team name needs at least 3 characters.', 'teamName');
  }
  if (input.leaderName.trim().length < 2) {
    throw new ApiRequestError('Leader name must be at least 2 characters.', 'leaderName');
  }
  if (!isSoloEvent && input.members.some((name) => name.trim().length < 2)) {
    throw new ApiRequestError('Every member needs a full name.', 'members');
  }
  
  const totalTeamSize = 1 + input.members.length; // Leader + Members
  if (!event.memberCounts.includes(totalTeamSize)) {
    throw new ApiRequestError(
      `${event.name} accepts ${event.memberCounts.join(' or ')} members total.`,
      'members'
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email.trim())) {
    throw new ApiRequestError('Enter a reachable email address.', 'email');
  }
  if (!/^[0-9+\s-]{10,15}$/.test(input.phone.trim())) {
    throw new ApiRequestError('Enter a 10-digit contact number.', 'phone');
  }
  if (!input.collegeName.trim()) {
    throw new ApiRequestError('Enter your college name.', 'collegeName');
  }
  if (!input.year) {
    throw new ApiRequestError('Select your year of study.', 'year');
  }
  if (event.domains && event.domains.length > 0 && !input.domain) {
    throw new ApiRequestError('Select a domain to compete in.', 'domain');
  }
  if (
  !isSoloEvent &&
  existing.some(
    (record) =>
    record.eventId === input.eventId &&
    record.teamName.trim().toLowerCase() === input.teamName.trim().toLowerCase()
  ))
  {
    throw new ApiRequestError('A team with this name is already registered.', 'teamName');
  }
  // One team per domain, per event — domains are claimed first come, first served.
  if (
  input.domain &&
  existing.some(
    (record) =>
    record.eventId === input.eventId &&
    record.domain.trim().toLowerCase() === input.domain.trim().toLowerCase()
  ))
  {
    throw new ApiRequestError(
      `"${input.domain}" was just claimed by another team. Pick a different domain.`,
      'domain'
    );
  }
}

function nextId(eventId: RegistrationInput['eventId'], existing: Registration[]): string {
  const event = getEvent(eventId);
  const count = existing.filter((record) => record.eventId === eventId).length;
  return `TI${event.code}${String(count + 1).padStart(3, '0')}`;
}

export async function listRegistrations(): Promise<Registration[]> {
  if (API_BASE_URL) return request<Registration[]>('/registrations');
  await wait(NETWORK_DELAY);
  return readStore();
}

export async function createRegistration(
input: RegistrationInput)
: Promise<Registration> {
  if (API_BASE_URL) {
    return request<Registration>('/registrations', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  await wait(NETWORK_DELAY + 260);
  const existing = readStore();
  validate(input, existing);

  const event = getEvent(input.eventId);
  const isSoloEvent = event.memberCounts.length === 1 && event.memberCounts[0] === 1;

  const record: Registration = {
    ...input,
    teamName: isSoloEvent ? '' : input.teamName.trim(),
    leaderName: input.leaderName.trim(),
    members: input.members.map((name) => name.trim()),
    email: input.email.trim(),
    phone: input.phone.trim(),
    collegeName: input.collegeName.trim(),
    year: input.year,
    upiRef: input.upiRef ? input.upiRef.trim() : '',
    participantUpiId: input.participantUpiId ? input.participantUpiId.trim() : '',
    id: nextId(input.eventId, existing),
    eventName: event.fullName,
    eventCode: event.code,
    memberCount: 1 + input.members.length,
    feeAmount: event.fee,
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
paymentStatus: PaymentStatus)
: Promise<Registration> {
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
    if (!record.domain) return taken;
    const claimed = taken[record.eventId] ?? [];
    return { ...taken, [record.eventId]: [...claimed, record.domain] };
  }, {});
}

export async function getSettings(): Promise<EventSettings> {
  if (API_BASE_URL) return request<EventSettings>('/settings');
  await wait(NETWORK_DELAY);
  return readSettings();
}

export async function updateSettings(
patch: Partial<EventSettings>)
: Promise<EventSettings> {
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
    const result = await request<{token: string;}>('/admin/session', {
      method: 'POST',
      body: JSON.stringify({ passcode })
    });
    return result.token;
  }

  await wait(NETWORK_DELAY);
  if (passcode !== 'admin123') {
    throw new ApiRequestError('Incorrect passcode.');
  }
  return 'local-session-token';
}

export function toCsv(records: Registration[]): string {
  const header = [
  'ID',
  'Event',
  'Team Name',
  'Leader Name',
  'Members',
  'Email',
  'Phone',
  'College',
  'Year',
  'Domain',
  'Fee',
  'Payment Status',
  'Registered At'];

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = records.map((record) =>
  [
  record.id,
  record.eventName,
  record.teamName || 'N/A',
  record.leaderName,
  record.members.join('; '),
  record.email,
  record.phone,
  record.collegeName,
  record.year,
  record.domain || 'N/A',
  `INR ${record.feeAmount}`,
  record.paymentStatus,
  new Date(record.createdAt).toLocaleString()].

  map(escape).
  join(',')
  );
  return [header.map(escape).join(','), ...rows].join('\n');
}

export const EVENT_IDS = EVENTS.map((event) => event.id);