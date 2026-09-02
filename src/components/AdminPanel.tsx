import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckIcon,
  DownloadIcon,
  IdCardIcon,
  Loader2Icon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon,
  FileImageIcon,
  SparklesIcon,
  TrophyIcon,
  LockIcon,
  DatabaseIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ServerIcon
} from 'lucide-react';
import { EVENTS, REGISTRATION_FEE } from '../data/events';
import { useRegistrationsContext } from '../contexts/RegistrationsContext';
import { authenticateAdmin, toCsv } from '../services/registrationApi';
import { playPortalLoginSound } from '../services/portalSound';
import {
  getNeonConnectionString,
  saveNeonConnectionString,
  testNeonConnection,
  initNeonTable,
  saveToNeon
} from '../services/neonDatabase';
import type { EventSettings, PaymentStatus, Registration } from '../types/registration';
import { StudentPassCard } from './StudentPassCard';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: 'border-slate-300 text-slate-700 bg-slate-100',
  verified: 'border-sky-300 text-sky-900 bg-sky-50 shadow-sm',
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
      playPortalLoginSound();
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
    const a = document.createElement('a');
    a.href = url;
    a.download = `ryvanta_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Symposium Administration Console"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#CBD5E1] bg-[#FFFFFF] shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000000] text-white">
              <SparklesIcon className="h-4 w-4 text-[#0EA5E9]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#000000]">
                RYVANTA '26 Administration Console
              </h2>
              <p className="text-xs text-[#64748B]">
                Live Registrations, Participant Passes &amp; Neon.tech PostgreSQL Manager
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#CBD5E1] p-2 text-[#64748B] hover:border-[#000000] hover:bg-[#F8FAFC] hover:text-[#000000] transition-colors"
            aria-label="Close admin modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isAuthenticated ? (
            <form
              onSubmit={handleAuth}
              className="mx-auto max-w-sm space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center shadow-luxury my-8"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000000] text-[#0EA5E9] shadow-md">
                <LockIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#000000]">
                  Convenor Passcode Required
                </h3>
                <p className="text-xs text-[#64748B]">
                  Default convenor passcode: <code className="font-mono font-bold text-[#000000] bg-white px-1.5 py-0.5 rounded border">admin123</code>
                </p>
              </div>

              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-2.5 text-center font-mono text-sm tracking-widest text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:outline-none"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || !passcode}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:from-[#0284C7] hover:to-[#1D4ED8] disabled:opacity-50 shadow-md"
              >
                {isAuthenticating && <Loader2Icon className="h-4 w-4 animate-spin" />}
                <span>Unlock Console</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Metrics & Search Bar */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]">
                    Total Registered Teams
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#000000]">
                    {registrations.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]">
                    Verified &amp; Paid
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#0284C7]">
                    {collected}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]">
                    Total Fees Collected
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#000000]">
                    ₹{collected * REGISTRATION_FEE}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => void reload()}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#000000] hover:border-[#0EA5E9] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <RefreshCwIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
                    <span>Sync</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadCsv}
                    disabled={!registrations.length}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#0EA5E9] bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:from-[#0284C7] hover:to-[#1D4ED8] shadow-sm"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search team name, leader, ID (e.g. TICH1001), college, or UTR..."
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              {/* Registrations Data Table */}
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#475569]">
                    <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] font-mono text-[10px] uppercase tracking-wider text-[#64748B]">
                      <tr>
                        <th className="px-4 py-3">Participation ID</th>
                        <th className="px-4 py-3">Team &amp; College</th>
                        <th className="px-4 py-3">Event &amp; Track</th>
                        <th className="px-4 py-3">Leader &amp; Mobile</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">
                            {query ? 'No matching registrations found.' : 'No registrations submitted yet.'}
                          </td>
                        </tr>
                      ) : (
                        filtered.map((record) => {
                          const isBusy = busyId === record.id;
                          return (
                            <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-[#0EA5E9]">
                                {record.id}
                              </td>

                              <td className="px-4 py-3">
                                <div className="font-serif font-bold text-[#000000]">
                                  {record.teamName}
                                </div>
                                <div className="text-[11px] text-[#64748B] line-clamp-1">
                                  {record.institution || 'College / Univ'}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <div className="font-semibold text-[#000000] line-clamp-1">
                                  {record.eventName}
                                </div>
                                <div className="text-[11px] text-[#0284C7] font-mono line-clamp-1">
                                  {record.track || record.domain}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <div className="text-[#000000] font-medium">
                                  {record.leaderName || record.members[0]}
                                </div>
                                <div className="text-[11px] font-mono text-[#64748B]">
                                  {record.phone}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                                    STATUS_STYLES[record.paymentStatus]
                                  }`}
                                >
                                  {record.paymentStatus}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedRecord(record)}
                                    title="View & Print Official Pass"
                                    className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-1.5 text-[#000000] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
                                  >
                                    <IdCardIcon className="h-3.5 w-3.5" />
                                  </button>

                                  {record.paymentScreenshot && (
                                    <button
                                      type="button"
                                      onClick={() => setViewScreenshot(record.paymentScreenshot || null)}
                                      title="View Screenshot Proof"
                                      className="rounded-lg border border-sky-300 bg-sky-50 p-1.5 text-sky-700 hover:bg-sky-100 transition-colors"
                                    >
                                      <FileImageIcon className="h-3.5 w-3.5" />
                                    </button>
                                  )}

                                  {record.paymentStatus !== 'verified' && (
                                    <button
                                      type="button"
                                      disabled={isBusy}
                                      onClick={() =>
                                        runAction(record.id, () => setPaymentStatus(record.id, 'verified'))
                                      }
                                      title="Approve & Mark Verified"
                                      className="rounded-lg border border-sky-300 bg-sky-50 p-1.5 text-sky-700 hover:bg-sky-100 transition-colors"
                                    >
                                      <CheckIcon className="h-3.5 w-3.5" />
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() =>
                                      runAction(record.id, () => remove(record.id))
                                    }
                                    title="Delete Record"
                                    className="rounded-lg border border-[#E2E8F0] p-1.5 text-[#64748B] hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2Icon className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Neon.tech PostgreSQL Database Manager Component */}
              <NeonDatabaseManager registrations={registrations} />

              {/* Payee Settings */}
              <PayeeSettings settings={settings} onSave={saveSettings} />
            </div>
          )}
        </div>

        {/* Modal: View Participant Pass */}
        {selectedRecord && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <div className="relative max-w-lg w-full">
              <StudentPassCard
                registration={selectedRecord}
                onClose={() => setSelectedRecord(null)}
              />
            </div>
          </div>
        )}

        {/* Modal: View Screenshot Proof */}
        {viewScreenshot && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="relative max-w-xl w-full rounded-2xl bg-[#FFFFFF] p-4">
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <h4 className="font-serif font-bold text-sm text-[#000000]">Payment Screenshot Proof</h4>
                <button
                  type="button"
                  onClick={() => setViewScreenshot(null)}
                  className="p-1 text-[#64748B] hover:text-[#000000]"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-center max-h-[70vh] overflow-auto">
                <img
                  src={viewScreenshot}
                  alt="Payment receipt proof"
                  className="max-h-[65vh] w-auto rounded-lg object-contain shadow-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Neon.tech PostgreSQL Database Connection & Synchronization Component
 */
function NeonDatabaseManager({ registrations }: { registrations: Registration[] }) {
  const [connString, setConnString] = useState(getNeonConnectionString());
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);

  async function handleTestConnection() {
    if (!connString.trim()) {
      setStatusMessage({ text: 'Please enter your Neon.tech connection string.', isError: true });
      return;
    }
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await testNeonConnection(connString.trim());
      if (res.success) {
        saveNeonConnectionString(connString.trim());
        await initNeonTable(connString.trim());
        setStatusMessage({ text: `🟢 ${res.message}`, isError: false });
      } else {
        setStatusMessage({ text: `❌ ${res.message}`, isError: true });
      }
    } catch (err: any) {
      setStatusMessage({ text: `❌ ${err?.message || 'Connection failed'}`, isError: true });
    } finally {
      setIsTesting(false);
    }
  }

  async function handleSaveConnection(e: React.FormEvent) {
    e.preventDefault();
    await handleTestConnection();
  }

  async function handleSyncAllToNeon() {
    if (!connString.trim()) {
      setStatusMessage({ text: 'Connect Neon.tech before syncing.', isError: true });
      return;
    }
    setIsSyncing(true);
    setSyncProgress(`Syncing 0 / ${registrations.length}...`);
    try {
      await initNeonTable(connString.trim());
      let count = 0;
      for (const reg of registrations) {
        await saveToNeon(reg, connString.trim());
        count++;
        setSyncProgress(`Synced ${count} / ${registrations.length}...`);
      }
      setStatusMessage({ text: `✅ Successfully synced all ${count} registrations to Neon.tech PostgreSQL!`, isError: false });
    } catch (err: any) {
      setStatusMessage({ text: `❌ Sync error: ${err?.message || 'Failed to sync'}`, isError: true });
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }

  const isConnected = Boolean(getNeonConnectionString());

  return (
    <div className="rounded-2xl border border-[#0EA5E9]/40 bg-[#F8FAFC] p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#000000] text-[#0EA5E9]">
            <DatabaseIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#000000]">
              Neon.tech Serverless PostgreSQL Gateway
            </h3>
            <span className="text-[11px] text-[#64748B]">
              Direct cloud PostgreSQL table `ryvanta_registrations` integration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold ${
              isConnected
                ? 'bg-sky-50 border border-sky-300 text-sky-800'
                : 'bg-slate-100 border border-slate-300 text-slate-600'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`} />
            {isConnected ? 'Neon DB Configured' : 'No DB Linked'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveConnection} className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-mono font-bold uppercase tracking-wider text-[#475569]">
            Neon.tech PostgreSQL Connection URI (postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={connString}
              onChange={(e) => setConnString(e.target.value)}
              placeholder="postgresql://poovarasasn:password@ep-cool-fog-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
              className="flex-1 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs font-mono text-[#000000] focus:border-[#0EA5E9] focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isTesting || !connString.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:from-[#0284C7] hover:to-[#1D4ED8] disabled:opacity-50 shadow-sm"
              >
                {isTesting && <Loader2Icon className="h-3.5 w-3.5 animate-spin" />}
                <span>{isTesting ? 'Testing...' : 'Connect & Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncAllToNeon}
                disabled={isSyncing || !registrations.length}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#0EA5E9] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0284C7] hover:bg-sky-50 disabled:opacity-50 shadow-sm"
              >
                {isSyncing ? (
                  <Loader2Icon className="h-3.5 w-3.5 animate-spin text-[#0EA5E9]" />
                ) : (
                  <ServerIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                )}
                <span>{syncProgress || 'Sync All to Neon'}</span>
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`rounded-xl border p-3 text-xs font-mono ${
              statusMessage.isError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-sky-200 bg-sky-50 text-sky-900'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </form>
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
      className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 space-y-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E2E8F0] pb-2">
        <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#000000]">
          Official Collection Account
        </h3>
        <p className="text-xs text-[#64748B]">
          Updates live across all QR codes and deep links.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-upi"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#475569]"
          >
            Official UPI ID
          </label>
          <input
            id="settings-upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="alangaram1985@okicici"
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-xs font-mono text-[#000000] focus:border-[#0EA5E9] focus:outline-none"
          />
        </div>
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="settings-payee"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#475569]"
          >
            Payee Display Name
          </label>
          <input
            id="settings-payee"
            value={payeeName}
            onChange={(e) => setPayeeName(e.target.value)}
            placeholder="Alangaram Selvaraj"
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#000000] focus:border-[#0EA5E9] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:from-[#0284C7] hover:to-[#1D4ED8] disabled:opacity-50 shadow-sm"
        >
          {isSaving && <Loader2Icon className="h-3.5 w-3.5 animate-spin text-[#E0F2FE]" />}
          {saved && !isDirty && <CheckIcon className="h-3.5 w-3.5 text-sky-200" />}
          {saved && !isDirty ? 'Saved' : 'Save'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 font-medium mt-2">{error}</p>}
    </form>
  );
}