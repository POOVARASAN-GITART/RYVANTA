import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckIcon,
  DownloadIcon,
  IdCardIcon,
  Loader2Icon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon,
  FileImageIcon
} from 'lucide-react';
import { EVENTS, REGISTRATION_FEE } from '../data/events';
import { useRegistrationsContext } from '../contexts/RegistrationsContext';
import { authenticateAdmin, toCsv } from '../services/registrationApi';
import type { EventSettings, PaymentStatus, Registration } from '../types/registration';
import { StudentPassCard } from './StudentPassCard';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: 'border-amber-300 text-amber-800 bg-amber-50',
  verified: 'border-emerald-300 text-emerald-800 bg-emerald-50 shadow-sm',
  rejected: 'border-red-300 text-red-800 bg-red-50'
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
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return registrations;
    return registrations.filter((record) =>
      [
        record.id,
        record.teamName,
        record.eventName,
        record.email,
        record.leaderName,
        record.institution,
        record.track,
        record.domain,
        record.upiRef
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel"
    >
      <div className="w-full max-w-6xl rounded-3xl border border-[#D8D7D5] bg-[#FFFFFF] shadow-luxury-lg text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4E2] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-ping" />
            <h2 className="font-display text-lg font-bold text-[#1A1A1A] uppercase tracking-wider">
              RYVANTA Organizer Console
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#8C8A85] transition-colors hover:bg-[#F3F1ED] hover:text-[#1A1A1A]"
            aria-label="Close admin panel"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleAuth} className="mx-auto max-w-sm space-y-4 px-6 py-14">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]"
              htmlFor="passcode"
            >
              Organizer Access Passcode
            </label>
            <input
              id="passcode"
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Default: admin123"
              className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 font-mono text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
            />
            {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
            <button
              type="submit"
              disabled={isAuthenticating || !passcode}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C2C2C] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] hover:bg-[#1A1A1A] disabled:opacity-50 shadow-sm"
            >
              {isAuthenticating && <Loader2Icon className="h-4 w-4 animate-spin text-[#C5A059]" />}
              <span>Enter Console</span>
            </button>
          </form>
        ) : (
          <div className="space-y-6 p-6 sm:p-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-5 sm:grid-cols-4">
              <Stat label="Total Squads" value={registrations.length.toString()} />
              <Stat label="Verified Payments" value={collected.toString()} />
              <Stat label="Total Revenue" value={`₹${(collected * REGISTRATION_FEE).toLocaleString('en-IN')}`} />
              <Stat label="Available Tracks" value={EVENTS.length.toString()} />
            </div>

            {/* Collection Account Configuration */}
            <PayeeSettings settings={settings} onSave={saveSettings} />

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E4E2] pb-4">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search squad, leader, college, ID, or track..."
                className="w-full sm:w-80 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-3.5 py-2 text-xs text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void reload()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E4E2] bg-[#F3F1ED] px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#E5E4E2] disabled:opacity-50 shadow-sm"
                >
                  <RefreshCwIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={downloadCsv}
                  disabled={registrations.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#2C2C2C] bg-[#2C2C2C] px-3.5 py-2 text-xs font-semibold text-[#F9F8F6] hover:bg-[#1A1A1A] disabled:opacity-50 shadow-sm"
                >
                  <DownloadIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            {isLoading && registrations.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#8C8A85]">Loading registrations from database...</p>
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#8C8A85]">
                {registrations.length === 0
                  ? 'No registrations in cloud database yet. Submissions will appear live here.'
                  : 'No records match that search.'}
              </p>
            ) : (
              <div className="max-h-[52vh] overflow-auto rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF]">
                <table className="w-full min-w-[1100px] text-left text-xs">
                  <thead className="sticky top-0 bg-[#F3F1ED] text-[#4A4A4A] font-mono border-b border-[#E5E4E2]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">ID</th>
                      <th className="px-4 py-3 font-semibold">Event / Track</th>
                      <th className="px-4 py-3 font-semibold">Squad &amp; Leader</th>
                      <th className="px-4 py-3 font-semibold">Institution</th>
                      <th className="px-4 py-3 font-semibold">Members</th>
                      <th className="px-4 py-3 font-semibold">Payment / UTR</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E4E2]">
                    {filtered.map((record) => (
                      <tr key={record.id} className="align-top hover:bg-[#F9F8F6] transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#1A1A1A]">{record.id}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#1A1A1A] block">{record.eventName}</span>
                          <span className="text-[11px] text-[#C5A059] font-mono font-semibold">{record.track || record.domain || 'General'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#1A1A1A] block">{record.teamName}</span>
                          <span className="text-[11px] text-[#4A4A4A] block">{record.leaderName || record.members[0]}</span>
                          <span className="text-[10px] text-[#8C8A85] font-mono">{record.email} · {record.phone}</span>
                        </td>
                        <td className="max-w-[180px] px-4 py-3 text-[#4A4A4A] truncate">
                          {record.institution || '—'}
                        </td>
                        <td className="max-w-[200px] px-4 py-3 text-[#4A4A4A]">
                          {record.members.join(', ')}
                        </td>
                        <td className="px-4 py-3 space-y-1">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase font-mono font-bold ${STATUS_STYLES[record.paymentStatus]}`}>
                            {record.paymentStatus}
                          </span>
                          {record.upiRef && (
                            <span className="block font-mono text-[10px] text-[#8C8A85]">
                              Ref: {record.upiRef}
                            </span>
                          )}
                          {record.paymentScreenshot && (
                            <button
                              type="button"
                              onClick={() => setViewScreenshot(record.paymentScreenshot || null)}
                              className="inline-flex items-center gap-1 text-[10px] text-[#C5A059] font-bold hover:underline font-mono"
                            >
                              <FileImageIcon className="h-3 w-3" />
                              <span>View Receipt</span>
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(record)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#D8D7D5] bg-[#F3F1ED] px-2.5 py-1 text-xs text-[#1A1A1A] hover:bg-[#E5E4E2] transition-colors"
                              title="View Gate Pass"
                            >
                              <IdCardIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                              <span>Pass</span>
                            </button>
                            <button
                              type="button"
                              disabled={busyId === record.id}
                              onClick={() =>
                                void runAction(record.id, () =>
                                  setPaymentStatus(
                                    record.id,
                                    record.paymentStatus === 'verified' ? 'pending' : 'verified'
                                  )
                                )
                              }
                              className="rounded-lg border border-[#E5E4E2] bg-[#FFFFFF] px-2.5 py-1 text-xs text-[#4A4A4A] hover:border-[#D8D7D5] hover:text-[#1A1A1A] disabled:opacity-50"
                            >
                              {record.paymentStatus === 'verified' ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === record.id}
                              onClick={() => void runAction(record.id, () => remove(record.id))}
                              className="rounded-lg border border-[#E5E4E2] p-1.5 text-[#8C8A85] hover:border-red-300 hover:text-red-600 transition-colors"
                              title="Delete registration"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pass View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl">
            <StudentPassCard
              registration={selectedRecord}
              onClose={() => setSelectedRecord(null)}
              isModal
            />
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {viewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-w-lg rounded-2xl border border-[#D8D7D5] bg-[#FFFFFF] p-4 shadow-luxury-lg">
            <button
              type="button"
              onClick={() => setViewScreenshot(null)}
              className="absolute right-3 top-3 rounded-lg bg-[#F3F1ED] p-1.5 text-[#8C8A85] hover:text-[#1A1A1A]"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <h3 className="font-display text-sm font-bold text-[#1A1A1A] mb-3">
              Payment Screenshot Proof
            </h3>
            <img
              src={viewScreenshot}
              alt="Payment Proof"
              className="max-h-[70vh] w-auto rounded-xl object-contain mx-auto border border-[#E5E4E2]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-black text-[#1A1A1A]">{value}</div>
      <div className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-[#8C8A85]">
        {label}
      </div>
    </div>
  );
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
      className="rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-5 space-y-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E5E4E2] pb-2">
        <h3 className="text-xs font-display font-bold uppercase tracking-widest text-[#1A1A1A]">
          Official Collection Account
        </h3>
        <p className="text-xs text-[#8C8A85]">
          Changes update live across all registration payment QR codes and deep links.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-upi"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#4A4A4A]"
          >
            Official UPI ID
          </label>
          <input
            id="settings-upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="alangaram1985@okicici"
            className="w-full rounded-xl border border-[#E5E4E2] bg-[#FFFFFF] px-3.5 py-2 text-xs font-mono text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
          />
        </div>
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-payee"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#4A4A4A]"
          >
            Payee Display Name
          </label>
          <input
            id="settings-payee"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            placeholder="Alangaram Selvaraj"
            className="w-full rounded-xl border border-[#E5E4E2] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#1A1A1A] focus:border-[#2C2C2C] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2C2C2C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] hover:bg-[#1A1A1A] disabled:opacity-50 shadow-sm"
        >
          {isSaving && <Loader2Icon className="h-3.5 w-3.5 animate-spin text-[#C5A059]" />}
          {saved && !isDirty && <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />}
          {saved && !isDirty ? 'Saved' : 'Save'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 font-medium mt-2">{error}</p>}
    </form>
  );
}