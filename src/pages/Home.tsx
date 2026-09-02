import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  MapPinIcon,
  UsersIcon,
  ZapIcon,
  ShieldCheckIcon,
  TrophyIcon
} from 'lucide-react';
import { CountdownCard } from '../components/CountdownCard';
import { ScheduleTimeline } from '../components/ScheduleTimeline';
import {
  EVENTS,
  EVENT_STARTS_AT,
  REGISTRATION_CLOSES_AT,
  REGISTRATION_FEE
} from '../data/events';

export function Home() {
  return (
    <div className="space-y-20 py-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (EDITORIAL LUXURY PLATINUM & CREAM) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D7D5] bg-[#F3F1ED] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059] shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-ping" />
            <span>National Level Tech Innovation Challenge</span>
          </div>

          <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight text-[#1A1A1A] sm:text-6xl lg:text-7xl">
            Innovate. Build.
            <br />
            <span className="text-[#C5A059]">
              Conquer.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#4A4A4A] sm:text-lg">
            Five premier national innovation tracks, one prestigious campus, one defining day.
            RYVANTA '26 takes off on{' '}
            <span className="font-bold text-[#1A1A1A]">19 September 2026</span> — a flat entry fee of{' '}
            <span className="font-bold text-[#C5A059]">₹{REGISTRATION_FEE}</span> per squad grants complete access to compete.
          </p>

          {/* Key Value Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="rounded-xl border border-[#E5E4E2] bg-[#F3F1ED] px-3.5 py-2 text-[#2C2C2C] font-semibold flex items-center gap-2 shadow-sm">
              <ZapIcon className="h-3.5 w-3.5 text-[#C5A059]" />
              8-Hour Prototype Sprint
            </span>
            <span className="rounded-xl border border-[#E5E4E2] bg-[#F3F1ED] px-3.5 py-2 text-[#2C2C2C] font-semibold flex items-center gap-2 shadow-sm">
              <TrophyIcon className="h-3.5 w-3.5 text-[#C5A059]" />
              Cash Prizes &amp; Internships
            </span>
            <span className="rounded-xl border border-[#E5E4E2] bg-[#F3F1ED] px-3.5 py-2 text-[#2C2C2C] font-semibold flex items-center gap-2 shadow-sm">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
              Digital Gate Passes
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-luxury transition-all duration-200 hover:bg-[#1A1A1A] hover:shadow-luxury-lg hover:scale-[1.02]"
            >
              <span>Register Your Squad</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-[#C5A059]" />
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] transition-colors hover:bg-[#E5E4E2]"
            >
              <span>Event Helpdesk</span>
            </Link>
          </div>
        </div>

        {/* Countdowns Grid */}
        <div className="space-y-4">
          <CountdownCard
            label="Registration Window Closes In"
            target={REGISTRATION_CLOSES_AT}
            caption="Registration Deadline: 15 September 2026, 11:59 PM IST"
            completeLabel="Registration closed"
            emphasis
          />

          <CountdownCard
            label="Innovation Challenge Commences In"
            target={EVENT_STARTS_AT}
            caption="Reporting Time: 19 September 2026, 08:30 AM IST"
            completeLabel="Live today"
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. EVENT SCHEDULE & TIMELINE COMPONENT */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ScheduleTimeline />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CHALLENGE TRACKS & EVENTS LINEUP GRID */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="lineup-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E4E2] pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              National Innovation Arena
            </span>
            <h2
              id="lineup-heading"
              className="mt-1 font-display text-3xl font-black uppercase tracking-tight text-[#1A1A1A] sm:text-4xl"
            >
              Challenge <span className="text-[#C5A059]">Tracks</span> &amp; Events
            </h2>
          </div>
          <span className="rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#2C2C2C]">
            {EVENTS.length} National Categories
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              to={`/events?event=${event.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E4E2] bg-[#F3F1ED] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#2C2C2C] hover:bg-[#FFFFFF] hover:shadow-luxury-lg"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E5E4E2] pb-3">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#C5A059]">
                    TRACK #{String(event.index).padStart(2, '0')}
                  </span>
                  <span className="rounded-md border border-[#E5E4E2] bg-[#FFFFFF] px-2.5 py-1 text-[10px] font-mono font-semibold text-[#4A4A4A]">
                    {event.memberCounts.join('–')} Members
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  {event.fullName}
                </h3>
                <p className="mt-2 text-xs text-[#4A4A4A] leading-relaxed">
                  {event.tagline}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E5E4E2] pt-4 text-xs font-mono text-[#8C8A85]">
                <span className="inline-flex items-center gap-1.5 text-[#4A4A4A] font-semibold">
                  <MapPinIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                  {event.venue}
                </span>

                <span className="inline-flex items-center gap-1 font-bold text-[#1A1A1A] group-hover:translate-x-1 group-hover:text-[#C5A059] transition-all">
                  <span>Register</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}