import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheckIcon, SparklesIcon, ZapIcon, AlertCircleIcon } from 'lucide-react';
import { RegistrationForm } from '../components/RegistrationForm';
import { StudentPassCard } from '../components/StudentPassCard';
import { EVENTS } from '../data/events';
import { useRegistrationsContext } from '../contexts/RegistrationsContext';
import type { EventId, Registration } from '../types/registration';

function isEventId(value: string | null): value is EventId {
  return EVENTS.some((event) => event.id === value);
}

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramEvent = searchParams.get('event');
  const activeEventId: EventId = isEventId(paramEvent) ? paramEvent : 'hackathon';

  const { submit, loadError, reload, takenDomains, settings } = useRegistrationsContext();
  const [receipt, setReceipt] = useState<Registration | null>(null);

  function selectEvent(id: EventId) {
    setSearchParams({ event: id }, { replace: true });
  }

  return (
    <div className="py-6 space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-cyan-500/20 pb-5">
        {EVENTS.map((event) => {
          const isActive = event.id === activeEventId;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => selectEvent(event.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'border border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-cyan-400 mr-1.5">{String(event.index).padStart(2, '0')}.</span>
              {event.name}
            </button>
          );
        })}
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/30 px-5 py-4 text-sm text-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-amber-400" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded-lg border border-amber-400/50 bg-amber-900/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-amber-400/20"
          >
            Retry
          </button>
        </div>
      )}

      {/* Generated Receipt Pass View */}
      {receipt && (
        <div className="rounded-3xl border border-cyan-400 bg-cyan-950/30 p-2 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <StudentPassCard
            registration={receipt}
            onClose={() => setReceipt(null)}
          />
        </div>
      )}

      {/* Main Registration Layout */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <RegistrationForm
            key={activeEventId}
            eventId={activeEventId}
            submit={submit}
            takenDomains={takenDomains[activeEventId] ?? []}
            upiId={settings.upiId}
            payeeName={settings.payeeName}
            onRegistered={(record) => {
              setReceipt(record);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Sidebar Info Card */}
        <aside className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#070d1e]/80 p-6 text-sm text-slate-400 shadow-xl lg:sticky lg:top-28 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3 font-display text-xs font-bold uppercase tracking-widest text-white">
            <ShieldCheckIcon className="h-4 w-4 text-cyan-400" />
            <span>Important Guidelines</span>
          </div>
          <ul className="space-y-3.5 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">One Entry per Email:</strong> Each participant email is verified and locked to prevent duplicate submissions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Official Payee:</strong> Send fees strictly to <code className="text-cyan-300 font-mono font-bold">{settings.upiId}</code> ({settings.payeeName}).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Instant Digital Pass:</strong> Your squad gate pass and individual Student IDs are generated immediately upon verified submission.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Bring Physical ID:</strong> Carry your college ID cards on the event day (19 Sep 2026).
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}