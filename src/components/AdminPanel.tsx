import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckIcon,
  DownloadIcon,
  IdCardIcon,
  Loader2Icon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon } from
'lucide-react';

import { EVENTS, REGISTRATION_FEE } from '../data/events';
import { useRegistrationsContext } from '../contexts/RegistrationsContext';
import { authenticateAdmin, toCsv } from '../services/registrationApi';
import type { EventSettings, PaymentStatus, Registration } from '../types/registration';
import { StudentPassCard } from './StudentPassCard';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: 'border-amber-500/40 text-amber-300',
  verified: 'border-accent/40 text-accent',
  rejected: 'border-red-500/40 text-red-300'
};

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const {
    registrations,
    isLoading,
    loadError,
    reload,
    setPaymentStatus,
    remove,
    settings,
    saveSettings
  } = useRegistrationsContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return registrations;
    return registrations.filter((record) =>
    [record.id, record.teamName, record.eventName, record.email, record.department, record.domain].
    join(' ').
    toLowerCase().
    includes(term)
    );
  }, [query, registrations]);

  const collected = registrations.filter((r) => r.paymentStatus === 'verified').length;

  async function handleAuth(event: React.FormEvent) {
    event.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await authenticateAdmin(passcode);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function runAction(id: string, action: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(registrations)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ryvanta_registrations.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel">
      
      <div className="w-full max-w-6xl rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-bold text-highlight">Admin panel</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-metallic transition-colors duration-150 ease-smooth hover:text-highlight"
            aria-label="Close admin panel">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {!isAuthenticated ?
        <form onSubmit={handleAuth} className="mx-auto max-w-sm space-y-4 px-6 py-14">
            <label
            className="block text-xs font-medium uppercase tracking-wider text-metallic"
            htmlFor="passcode">
            
              Organizer passcode
            </label>
            <input
            id="passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full rounded-lg border border-line bg-gunmetal px-3 py-2.5 text-sm text-highlight transition-colors duration-150 ease-smooth focus:border-metallic focus:outline-none"
            placeholder="••••••••" />
          
            {authError &&
          <p role="alert" className="text-xs text-red-300">
                {authError}
              </p>
          }
            <button
            type="submit"
            disabled={isAuthenticating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-highlight px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white disabled:bg-metallic/40">
            
              {isAuthenticating &&
            <Loader2Icon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            }
              Access
            </button>
          </form> :

        <div className="space-y-5 px-6 py-6">
            <PayeeSettings settings={settings} onSave={saveSettings} />

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap gap-8">
                <Stat label="Registrations" value={String(registrations.length)} />
                <Stat label="Payments verified" value={`${collected}`} />
                <Stat
                label="Fees collected"
                value={`₹${(collected * REGISTRATION_FEE).toLocaleString('en-IN')}`} />
              
              </div>
              <div className="flex items-center gap-2">
                <button
                type="button"
                onClick={() => void reload()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-metallic transition-colors duration-150 ease-smooth hover:border-metallic hover:text-highlight">
                
                  <RefreshCwIcon
                  className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                  aria-hidden="true" />
                
                  Refresh
                </button>
                <button
                type="button"
                onClick={downloadCsv}
                disabled={registrations.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-highlight px-3 py-2 text-xs font-semibold text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white disabled:bg-metallic/40">
                
                  <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, team, event, email, department"
              aria-label="Search registrations"
              className="w-full max-w-sm rounded-lg border border-line bg-gunmetal px-3 py-2 text-sm text-highlight placeholder:text-metallic/50 transition-colors duration-150 ease-smooth focus:border-metallic focus:outline-none" />
            
              <span className="text-xs text-metallic">
                {filtered.length} of {registrations.length}
              </span>
            </div>

            {loadError &&
          <p role="alert" className="text-sm text-red-300">
                {loadError}
              </p>
          }

            {isLoading && registrations.length === 0 ?
          <p className="py-12 text-center text-sm text-metallic">
                Loading registrations…
              </p> :
          filtered.length === 0 ?
          <p className="py-12 text-center text-sm text-metallic">
                {registrations.length === 0 ?
            'No registrations yet. The first submission will appear here.' :
            'No records match that search.'}
              </p> :

          <div className="max-h-[52vh] overflow-auto rounded-xl border border-line">
                <table className="w-full min-w-[1040px] text-left text-xs">
                  <thead className="sticky top-0 bg-elevated text-metallic">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">ID</th>
                      <th scope="col" className="px-4 py-3 font-medium">Event</th>
                      <th scope="col" className="px-4 py-3 font-medium">Team</th>
                      <th scope="col" className="px-4 py-3 font-medium">Domain</th>
                      <th scope="col" className="px-4 py-3 font-medium">Members</th>
                      <th scope="col" className="px-4 py-3 font-medium">Department</th>
                      <th scope="col" className="px-4 py-3 font-medium">Payment</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70">
                    {filtered.map((record) =>
                <tr key={record.id} className="align-top text-highlight">
                        <td className="px-4 py-3 font-display font-bold">{record.id}</td>
                        <td className="px-4 py-3 text-metallic">{record.eventName}</td>
                        <td className="px-4 py-3">
                          {record.teamName}
                          <span className="mt-0.5 block text-metallic">{record.email}</span>
                        </td>
                        <td className="max-w-[200px] px-4 py-3 text-metallic">
                          {record.domain || '—'}
                        </td>
                        <td className="max-w-[200px] px-4 py-3 text-metallic">
                          {record.members.join(', ')}
                        </td>
                        <td className="px-4 py-3 text-metallic">{record.department || '—'}</td>
                        <td className="px-4 py-3">
                          <span
                      className={`inline-block rounded-full border px-2 py-0.5 capitalize ${STATUS_STYLES[record.paymentStatus]}`}>
                      
                            {record.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(record)}
                              className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-xs text-accent transition-colors duration-150 ease-smooth hover:bg-accent hover:text-gunmetal"
                              title="View Student Pass & QR"
                            >
                              <IdCardIcon className="h-3.5 w-3.5" />
                              <span>Pass</span>
                            </button>
                            <button
                              type="button"
                              disabled={busyId === record.id}
                              onClick={() =>
                                void runAction(record.id, () =>
                                  setPaymentStatus(
                                    record.id,
                                    record.paymentStatus === 'verified' ?
                                      'pending' :
                                      'verified'
                                  )
                                )
                              }
                              className="rounded-md border border-line px-2.5 py-1 text-xs text-metallic transition-colors duration-150 ease-smooth hover:border-metallic hover:text-highlight disabled:opacity-50"
                            >
                              {record.paymentStatus === 'verified' ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === record.id}
                              onClick={() => void runAction(record.id, () => remove(record.id))}
                              className="rounded-md border border-line p-1.5 text-metallic transition-colors duration-150 ease-smooth hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
                              aria-label={`Delete registration ${record.id}`}
                            >
                              <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
          }

            <p className="text-xs text-metallic">
              Event codes:{' '}
              {EVENTS.map((event) => `${event.name} → TI${event.code}###`).join(' · ')}
            </p>
          </div>
        }
      </div>

      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <StudentPassCard
            registration={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            isModal={true}
          />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <div className="font-display text-2xl font-black text-highlight">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-metallic">
        {label}
      </div>
    </div>);

}

interface PayeeSettingsProps {
  settings: EventSettings;
  onSave: (patch: Partial<EventSettings>) => Promise<EventSettings>;
}

function PayeeSettings({ settings, onSave }: PayeeSettingsProps) {
  const [upiId, setUpiId] = useState(settings.upiId);
  const [payeeName, setPayeeName] = useState(settings.payeeName);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUpiId(settings.upiId);
    setPayeeName(settings.payeeName);
  }, [settings]);

  const isDirty = upiId !== settings.upiId || payeeName !== settings.payeeName;

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave({ upiId, payeeName });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-xl border border-line bg-gunmetal/60 p-5">
      
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-highlight">
          Collection account
        </h3>
        <p className="text-xs text-metallic">
          Every team is told to pay here. Changes apply to new registrations immediately.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-upi"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-metallic">
            
            UPI ID
          </label>
          <input
            id="settings-upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="poosiju1@okaxis"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-highlight transition-colors duration-150 ease-smooth focus:border-metallic focus:outline-none" />
          
        </div>
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-payee"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-metallic">
            
            Payee name
          </label>
          <input
            id="settings-payee"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            placeholder="RYVANTA Organizing Committee"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-highlight transition-colors duration-150 ease-smooth focus:border-metallic focus:outline-none" />
          
        </div>
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-highlight px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white disabled:bg-metallic/30 disabled:text-gunmetal/60">
          
          {isSaving && <Loader2Icon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
          {saved && !isDirty &&
          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          }
          {saved && !isDirty ? 'Saved' : 'Save'}
        </button>
      </div>

      {error &&
      <p role="alert" className="mt-3 text-xs text-red-300">
          {error}
        </p>
      }
    </form>);

}