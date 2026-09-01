import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
    <div className="py-8">
      <h1 className="sr-only">Events and registration</h1>

      <div className="flex flex-wrap gap-2 border-b border-line pb-5">
        {EVENTS.map((event) => {
          const isActive = event.id === activeEventId;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => selectEvent(event.id)}
              aria-current={isActive ? 'true' : undefined}
              className={[
              'whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-colors duration-150 ease-smooth',
              isActive ?
              'bg-highlight text-gunmetal' :
              'bg-surface text-metallic hover:text-highlight'].
              join(' ')}>
              
              {String(event.index).padStart(2, '0')} · {event.name}
            </button>);

        })}
      </div>

      {loadError &&
      <div
        role="alert"
        className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
        
          <span>{loadError}</span>
          <button
          type="button"
          onClick={() => void reload()}
          className="rounded-md border border-amber-400/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ease-smooth hover:bg-amber-400/10">
          
            Retry
          </button>
        </div>
      }

      {receipt && (
        <div className="mt-6">
          <StudentPassCard
            registration={receipt}
            onClose={() => setReceipt(null)}
          />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
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
            }} />
          
        </div>

        <aside className="rounded-2xl border border-line bg-surface p-6 text-sm text-metallic lg:sticky lg:top-28">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-highlight">
            Before you submit
          </h2>
          <ul className="mt-4 space-y-3 text-xs leading-relaxed">
            <li>
              <span className="text-highlight">One team per domain.</span> Domains are
              first come, first served and lock once claimed.
            </li>
            <li>Scan the official QR code to pay the registration fee directly.</li>
            <li>
              Pay only to <code className="text-highlight">{settings.upiId}</code>. The
              desk never asks for money anywhere else.
            </li>
            <li>Your student participation ID & scannable gate pass are issued instantly on submission.</li>
          </ul>
        </aside>
      </div>
    </div>);

}