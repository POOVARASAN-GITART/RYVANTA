import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheckIcon, AlertCircleIcon } from 'lucide-react';
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
      <div className="flex flex-wrap gap-2.5 border-b border-[#E5E4E2] pb-5">
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
                  ? 'border border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-md'
                  : 'border border-[#E5E4E2] bg-[#F3F1ED] text-[#4A4A4A] hover:border-[#D8D7D5] hover:bg-[#FFFFFF] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="text-[#C5A059] mr-1.5">{String(event.index).padStart(2, '0')}.</span>
              {event.name}
            </button>
          );
        })}
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-amber-600" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-amber-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Generated Receipt Pass View */}
      {receipt && (
        <div className="rounded-3xl border border-[#D8D7D5] bg-[#FFFFFF] p-2 shadow-luxury-lg">
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
        <aside className="space-y-4 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 text-sm text-[#4A4A4A] shadow-luxury lg:sticky lg:top-28">
          <div className="flex items-center gap-2 border-b border-[#E5E4E2] pb-3 font-display text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
            <ShieldCheckIcon className="h-4 w-4 text-[#C5A059]" />
            <span>Important Guidelines</span>
          </div>
          <ul className="space-y-3.5 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#C5A059] font-bold">•</span>
              <span>
                <strong className="text-[#1A1A1A]">One Entry per Email:</strong> Each participant email is verified and locked to prevent duplicate submissions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C5A059] font-bold">•</span>
              <span>
                <strong className="text-[#1A1A1A]">Official Payee:</strong> Send fees strictly to <code className="text-[#1A1A1A] font-mono font-bold bg-[#F3F1ED] px-1.5 py-0.5 rounded border border-[#E5E4E2]">{settings.upiId}</code> ({settings.payeeName}).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C5A059] font-bold">•</span>
              <span>
                <strong className="text-[#1A1A1A]">Instant Digital Pass:</strong> Your squad gate pass and individual Student IDs are generated immediately upon verified submission.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C5A059] font-bold">•</span>
              <span>
                <strong className="text-[#1A1A1A]">Bring Physical ID:</strong> Carry your college ID cards on the event day (19 Sep 2026).
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}