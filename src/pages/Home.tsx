import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  MapPinIcon,
  UsersIcon,
  ZapIcon,
  ShieldCheckIcon,
  TrophyIcon,
  Gamepad2Icon,
  TerminalIcon,
  SparklesIcon,
  BuildingIcon
} from 'lucide-react';
import { CountdownCard } from '../components/CountdownCard';
import { ScheduleTimeline } from '../components/ScheduleTimeline';
import {
  EVENTS,
  EVENT_STARTS_AT,
  REGISTRATION_CLOSES_AT,
  REGISTRATION_FEE
} from '../data/events';

const EVENT_ICONS: Record<string, typeof TrophyIcon> = {
  hackathon: TrophyIcon,
  '2d-games': Gamepad2Icon,
  ctf: TerminalIcon
};

export function Home() {
  return (
    <div className="space-y-20 py-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (REGAL GOLD & WHITE LUXURY) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#FFFFFF] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#AA820A] shadow-sm">
            <SparklesIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Jaya Engineering College · National Level Symposium &amp; Hackathon</span>
          </div>

          <h1 className="mt-5 font-serif text-5xl font-black leading-[1.08] tracking-tight text-[#1C1C1C] sm:text-6xl lg:text-7xl">
            Innovate. Build.
            <br />
            <span className="text-gold-gradient">
              Conquer.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#555555] sm:text-lg">
            Three premier national technical arenas, one prestigious campus, one defining day.
            RYVANTA '26 takes off on{' '}
            <span className="font-bold text-[#1C1C1C]">19 September 2026</span> at Jaya Engineering College — a flat entry fee of{' '}
            <span className="font-bold text-[#D4AF37]">₹{REGISTRATION_FEE}</span> per team grants full access to compete and win prizes.
          </p>

          {/* Key Value Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="rounded-xl border border-[#EAE6DF] bg-[#FFFFFF] px-3.5 py-2 text-[#1C1C1C] font-semibold flex items-center gap-2 shadow-sm">
              <TrophyIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
              3 Technical Arenas
            </span>
            <span className="rounded-xl border border-[#EAE6DF] bg-[#FFFFFF] px-3.5 py-2 text-[#1C1C1C] font-semibold flex items-center gap-2 shadow-sm">
              <ZapIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
              ₹300 Flat Team Entry
            </span>
            <span className="rounded-xl border border-[#EAE6DF] bg-[#FFFFFF] px-3.5 py-2 text-[#1C1C1C] font-semibold flex items-center gap-2 shadow-sm">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
              Instant Participation ID (TICH/TID/TIC)
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury transition-all duration-200 hover:from-[#B8860B] hover:to-[#8B6508] hover:shadow-luxury-lg hover:scale-[1.02]"
            >
              <span>Register Your Team</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-[#FFD700]" />
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#FFFFFF] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1C1C1C] transition-colors hover:bg-[#FAFAFA]"
            >
              <span>Helpline &amp; Support</span>
            </Link>
          </div>
        </div>

        {/* Dual Live Countdowns (Exact 10-09-2026 & 19-09-2026) */}
        <div className="space-y-4">
          <CountdownCard
            label="Registration Closes In"
            target={REGISTRATION_CLOSES_AT}
            caption="Registration Deadline: 10 September 2026, 11:59 PM IST"
            completeLabel="Registration closed"
            emphasis
          />

          <CountdownCard
            label="Symposium Commences In"
            target={EVENT_STARTS_AT}
            caption="Reporting Time: 19 September 2026, 08:30 AM IST (All Main Events)"
            completeLabel="Live today"
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. EVENT SCHEDULE & TIMELINE COMPONENT */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ScheduleTimeline />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. DIGITAL POSTER CARDS FOR THE 3 TECHNICAL EVENTS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="lineup-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE6DF] pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Jaya Engineering College Technical Arenas
            </span>
            <h2
              id="lineup-heading"
              className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#1C1C1C] sm:text-4xl"
            >
              Official Event <span className="text-gold-gradient">Lineup</span> &amp; Modules
            </h2>
          </div>
          <span className="rounded-xl border border-[#D4AF37] bg-[#FFFFFF] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#1C1C1C] shadow-sm">
            {EVENTS.length} Flagship Events
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => {
            const Icon = EVENT_ICONS[event.id] || TrophyIcon;
            return (
              <Link
                key={event.id}
                to={`/events?event=${event.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE6DF] bg-[#FFFFFF] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-luxury-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#D4AF37]">
                      CODE: TI{event.code}1001
                    </span>
                    <span className="rounded-md border border-[#EAE6DF] bg-[#FAFAFA] px-2.5 py-1 text-[10px] font-mono font-semibold text-[#555555]">
                      {event.minMembers}–{event.maxMembers} Members
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAFAFA] border border-[#D4AF37]/30 text-[#D4AF37] group-hover:bg-[#1C1C1C] group-hover:text-[#FFD700] transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1C1C1C] group-hover:text-[#AA820A] transition-colors">
                      {event.fullName}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs text-[#555555] leading-relaxed">
                    {event.tagline}
                  </p>

                  {/* Event Badges / Format Specs */}
                  {event.scoringMatrix && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#FAFAFA] px-2.5 py-1 text-[10px] font-mono font-bold text-[#AA820A]">
                      <span>6-Category Scoring Matrix (100 Marks)</span>
                    </div>
                  )}

                  {event.formatDetails && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#FAFAFA] px-2.5 py-1 text-[10px] font-mono font-bold text-[#AA820A]">
                      <span>2 Rounds · 2 Flags to Capture</span>
                    </div>
                  )}

                  {event.requiresDepartment && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#FAFAFA] px-2.5 py-1 text-[10px] font-mono font-bold text-[#AA820A]">
                      <span>Dynamic Department Selector (7 Depts)</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#EAE6DF] pt-4 text-xs font-mono text-[#767676]">
                  <span className="inline-flex items-center gap-1.5 text-[#383838] font-semibold">
                    <MapPinIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {event.venue}
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-[#1C1C1C] group-hover:translate-x-1 group-hover:text-[#D4AF37] transition-all">
                    <span>Register</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}