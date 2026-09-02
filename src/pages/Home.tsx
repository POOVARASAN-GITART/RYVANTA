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
  FlameIcon,
  CameraIcon,
  SparklesIcon,
  ClockIcon
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
  ctf: TerminalIcon,
  egames: FlameIcon,
  photography: CameraIcon
};

const EVENT_COLOR_CLASSES: Record<string, { iconBg: string; iconColor: string; badgeColor: string }> = {
  hackathon: {
    iconBg: 'bg-sky-50',
    iconColor: 'text-[#0EA5E9]',
    badgeColor: 'border-[#0EA5E9]/40 text-[#0284C7]'
  },
  '2d-games': {
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#2563EB]',
    badgeColor: 'border-[#2563EB]/40 text-[#2563EB]'
  },
  ctf: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#0F172A]',
    badgeColor: 'border-[#64748B]/40 text-[#0F172A]'
  },
  egames: {
    iconBg: 'bg-sky-50',
    iconColor: 'text-[#0EA5E9]',
    badgeColor: 'border-[#0EA5E9]/40 text-[#0284C7]'
  },
  photography: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#2563EB]',
    badgeColor: 'border-[#2563EB]/40 text-[#2563EB]'
  }
};

export function Home() {
  return (
    <div className="space-y-20 py-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (CYBER BLUE & POLISHED SILVER LUXURY) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9] bg-[#FFFFFF] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#0284C7] shadow-sm">
            <SparklesIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Jaya Engineering College · National Level Tech Innovation Challenge</span>
          </div>

          <h1 className="mt-5 font-serif text-5xl font-black leading-[1.08] tracking-tight text-[#000000] sm:text-6xl lg:text-7xl">
            Innovate. Build.
            <br />
            <span className="text-blue-gradient">
              Conquer.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#475569] sm:text-lg">
            Five premier national technical arenas, one prestigious campus, one defining day.
            RYVANTA '26 takes off on{' '}
            <span className="font-bold text-[#000000]">19 September 2026</span> at Jaya Engineering College — a flat entry fee of{' '}
            <span className="font-bold text-[#0EA5E9]">₹{REGISTRATION_FEE}</span> per team grants full access to compete and win prizes.
          </p>

          {/* Key Value Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-[#000000] font-semibold flex items-center gap-2 shadow-sm">
              <TrophyIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
              {EVENTS.length} Technical Arenas
            </span>
            <span className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-[#000000] font-semibold flex items-center gap-2 shadow-sm">
              <ZapIcon className="h-3.5 w-3.5 text-[#2563EB]" />
              ₹300 Flat Team Entry
            </span>
            <span className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-[#000000] font-semibold flex items-center gap-2 shadow-sm">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
              Instant Participation ID (TICH/TID/TIC/TIE/TIP)
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury hover:from-[#0284C7] hover:to-[#1D4ED8] hover:shadow-blue-glow transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Register Your Team</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-[#E0F2FE]" />
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#000000] transition-colors hover:border-[#0EA5E9] hover:bg-sky-50/40"
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
            label="Challenge Commences In"
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
      {/* 3. DIGITAL POSTER CARDS FOR THE 5 TECHNICAL EVENTS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="lineup-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0EA5E9]">
              Jaya Engineering College Technical Arenas
            </span>
            <h2
              id="lineup-heading"
              className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#000000] sm:text-4xl"
            >
              Official Event <span className="text-blue-gradient">Lineup</span> &amp; Modules
            </h2>
          </div>
          <span className="rounded-xl border border-[#0EA5E9] bg-[#FFFFFF] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#000000] shadow-sm">
            {EVENTS.length} Flagship Events
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => {
            const Icon = EVENT_ICONS[event.id] || TrophyIcon;
            const colors = EVENT_COLOR_CLASSES[event.id] || EVENT_COLOR_CLASSES.hackathon;
            return (
              <Link
                key={event.id}
                to={`/events?event=${event.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-luxury-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#0EA5E9]">
                      CODE: TI{event.code}1001
                    </span>
                    <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-semibold text-[#475569]">
                      {event.id === 'egames'
                        ? '4 + 1 Sub'
                        : `${event.minMembers}–${event.maxMembers} Members`}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg} border border-[#CBD5E1] ${colors.iconColor} group-hover:bg-[#000000] group-hover:text-[#FFFFFF] transition-colors`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#000000] group-hover:text-[#0EA5E9] transition-colors">
                      {event.fullName}
                    </h3>
                  </div>

                  <p className="mt-3 text-xs text-[#475569] leading-relaxed">
                    {event.tagline}
                  </p>

                  {/* Event Badges / Format Specs */}
                  {event.scoringMatrix && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-bold text-[#2563EB]">
                      <span>6-Category Scoring Matrix (100 Marks)</span>
                    </div>
                  )}

                  {event.formatDetails && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/40 bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-bold text-[#0EA5E9]">
                      <span>2 Rounds · 2 Flags to Capture</span>
                    </div>
                  )}

                  {event.requiresDepartment && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/40 bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-bold text-[#0EA5E9]">
                      <span>Dynamic Department Selector (7 Depts)</span>
                    </div>
                  )}

                  {event.id === 'egames' && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/40 bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-bold text-[#0EA5E9]">
                      <span>Max 4 Players + 1 Substitute · Network Lab</span>
                    </div>
                  )}

                  {event.id === 'photography' && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#2563EB]/40 bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-mono font-bold text-[#2563EB]">
                      <span>19 Sep 2026 · 02:00 PM onwards · Smart Class Room</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-4 text-xs font-mono text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5 text-[#334155] font-semibold">
                    <MapPinIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    {event.venue}
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-[#000000] group-hover:translate-x-1 group-hover:text-[#0EA5E9] transition-all">
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