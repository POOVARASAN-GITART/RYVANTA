import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon,
  ZapIcon,
  ShieldCheckIcon,
  CpuIcon,
  LayersIcon,
  TrophyIcon
} from 'lucide-react';
import { CountdownCard } from '../components/CountdownCard';
import { ScheduleTimeline } from '../components/ScheduleTimeline';
import {
  EVENTS,
  EVENT_STARTS_AT,
  REGISTRATION_CLOSES_AT,
  REGISTRATION_FEE,
  CHALLENGE_TRACKS
} from '../data/events';

export function Home() {
  return (
    <div className="space-y-20 py-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (CYBER SCI-FI ORION STYLE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>National Level Tech Innovation Challenge</span>
          </div>

          <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Innovate. Build.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              Conquer.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Five premier national innovation tracks, one high-tech campus, one defining day.
            RYVANTA '26 takes off on{' '}
            <span className="font-bold text-cyan-300">19 September 2026</span> — a flat entry fee of{' '}
            <span className="font-bold text-cyan-300">₹{REGISTRATION_FEE}</span> per squad grants complete access to compete.
          </p>

          {/* Key Value Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 flex items-center gap-1.5">
              <ZapIcon className="h-3.5 w-3.5 text-cyan-400" />
              8-Hour Prototype Sprint
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 flex items-center gap-1.5">
              <TrophyIcon className="h-3.5 w-3.5 text-yellow-400" />
              Cash Prizes &amp; Internships
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 flex items-center gap-1.5">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              Digital QR Gate Passes
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-950 shadow-xl shadow-cyan-400/25 transition-all duration-200 hover:from-cyan-300 hover:to-white hover:shadow-cyan-400/40"
            >
              <span>Register Your Squad</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-white"
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
            label="Hackathon Commences In"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-cyan-500/20 pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              National Innovation Arena
            </span>
            <h2
              id="lineup-heading"
              className="mt-1 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
            >
              Challenge <span className="text-cyan-400">Tracks</span> &amp; Events
            </h2>
          </div>
          <span className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
            {EVENTS.length} National Categories
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              to={`/events?event=${event.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#080e22]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-[#0c1532] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
            >
              {/* Top ambient highlight on card */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">
                    EVENT #{String(event.index).padStart(2, '0')}
                  </span>
                  <span className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {event.memberCounts.join('–')} Members
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {event.fullName}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {event.tagline}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-400" />
                  {event.venue}
                </span>

                <span className="inline-flex items-center gap-1 font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
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