import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheckIcon, AlertCircleIcon, SparklesIcon, TrophyIcon } from 'lucide-react';
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

  const activeEvent = EVENTS.find((e) => e.id === activeEventId) || EVENTS[0];

  return (
    <div className="py-6 space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-[#E2E8F0] pb-5">
        {EVENTS.map((event) => {
          const isActive = event.id === activeEventId;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => selectEvent(event.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`whitespace-nowrap rounded-xl px-4 py-3 font-serif text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'border border-[#0EA5E9] bg-[#000000] text-[#FFFFFF] shadow-md ring-2 ring-[#0EA5E9]/30'
                  : 'border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] hover:border-[#0EA5E9] hover:bg-[#F8FAFC] hover:text-[#000000]'
              }`}
            >
              <span className="text-[#0EA5E9] mr-1.5 font-mono">0{event.index}.</span>
              {event.name}
            </button>
          );
        })}
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-300 bg-sky-50 px-5 py-4 text-sm text-sky-900 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-[#0EA5E9]" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => void reload()}
            className="rounded-lg border border-sky-400 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-sky-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Generated Receipt Pass View */}
      {receipt && (
        <div className="rounded-3xl border border-[#0EA5E9] bg-[#FFFFFF] p-2 shadow-luxury-lg">
          <StudentPassCard
            registration={receipt}
            onClose={() => setReceipt(null)}
          />
        </div>
      )}

      {/* Main Registration Layout */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <RegistrationForm
            key={activeEventId}
            eventId={activeEventId}
            onEventChange={selectEvent}
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
        <aside className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 text-sm text-[#475569] shadow-luxury lg:sticky lg:top-28">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 font-serif text-sm font-bold uppercase tracking-wider text-[#000000]">
            <ShieldCheckIcon className="h-4 w-4 text-[#0EA5E9]" />
            <span>Event Registration Guide</span>
          </div>

          <div className="rounded-xl border border-[#0EA5E9]/40 bg-[#F8FAFC] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0EA5E9] block">
              Active Module Code
            </span>
            <div className="font-mono text-base font-black text-[#000000]">
              TI{activeEvent.code}###
            </div>
            <p className="text-xs text-[#475569]">
              Sequential Participation IDs are assigned automatically upon submission.
            </p>
          </div>

          <ul className="space-y-3.5 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#0EA5E9] font-bold">•</span>
              <span>
                <strong className="text-[#000000]">One Entry per Email:</strong> Each participant email is verified and locked to prevent duplicate submissions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2563EB] font-bold">•</span>
              <span>
                <strong className="text-[#000000]">Flat Team Fee:</strong> Flat entry fee of <code className="text-[#000000] font-mono font-bold bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0]">₹300</code> per team.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0284C7] font-bold">•</span>
              <span>
                <strong className="text-[#000000]">Official Payee:</strong> Send fees strictly to <code className="text-[#000000] font-mono font-bold bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0]">{settings.upiId}</code> ({settings.payeeName}).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0EA5E9] font-bold">•</span>
              <span>
                <strong className="text-[#000000]">Challenge Day:</strong> All competitions take place on <strong>19 September 2026</strong>.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}