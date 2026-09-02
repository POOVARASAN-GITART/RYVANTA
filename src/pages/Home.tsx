import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MapPinIcon, UsersIcon } from 'lucide-react';

import { CountdownCard } from '../components/CountdownCard';
import {
  EVENTS,
  EVENT_STARTS_AT,
  REGISTRATION_CLOSES_AT,
  REGISTRATION_FEE } from
'../data/events';

export function Home() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-metallic">
            National Level Tech Innovation Challenge
          </p>
          <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight text-highlight sm:text-6xl lg:text-7xl">
            Innovate. Build.
            <br />
            <span className="text-metallic">Conquer.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-metallic">
            Five events, one campus, one day. RYVANTA '26 runs on{' '}
            <span className="font-semibold text-highlight">19 September 2026</span> — a
            flat <span className="font-semibold text-highlight">₹{REGISTRATION_FEE}</span>{' '}
            per team gets you into any event on the roster.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-lg bg-highlight px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white">
              
              Register a team
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-150 ease-smooth group-hover:translate-x-0.5"
                aria-hidden="true" />
              
            </Link>
            <Link
              to="/support"
              className="text-sm font-medium text-metallic underline-offset-4 transition-colors duration-150 ease-smooth hover:text-highlight hover:underline">
              
              Talk to a coordinator
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <CountdownCard
            label="Registration closes in"
            target={REGISTRATION_CLOSES_AT}
            caption="Deadline: 10 September 2026, 11:59 PM IST"
            completeLabel="Registration closed"
            emphasis />
          
          <CountdownCard
            label="Event commences in"
            target={EVENT_STARTS_AT}
            caption="Reporting time: 19 September 2026, 9:00 AM"
            completeLabel="Live today" />
          
        </div>
      </section>

      <section aria-labelledby="lineup-heading">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2
            id="lineup-heading"
            className="font-display text-2xl font-bold text-highlight">
            
            The lineup
          </h2>
          <span className="text-xs uppercase tracking-widest text-metallic">
            {EVENTS.length} events
          </span>
        </div>

        <ul className="divide-y divide-line/70">
          {EVENTS.map((event) =>
          <li key={event.id}>
              <Link
              to={`/events?event=${event.id}`}
              className="group flex flex-col gap-3 py-6 transition-colors duration-150 ease-smooth sm:flex-row sm:items-center sm:gap-8">
              
                <span className="font-display text-sm font-bold text-metallic/60 sm:w-10">
                  {String(event.index).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-highlight">
                    {event.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-metallic">{event.tagline}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-5 text-xs text-metallic">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.venue}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UsersIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.memberCounts.join('–')} members
                  </span>
                  <ArrowRightIcon
                  className="h-4 w-4 text-metallic/50 transition-all duration-150 ease-smooth group-hover:translate-x-0.5 group-hover:text-highlight"
                  aria-hidden="true" />
                
                </div>
              </Link>
            </li>
          )}
        </ul>
      </section>
    </div>);

}