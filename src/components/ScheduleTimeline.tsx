import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircle2Icon,
  FlameIcon,
  CpuIcon,
  LayersIcon
} from 'lucide-react';
import { HACKATHON_TIMELINE, TimelineMilestone } from '../data/events';

export function ScheduleTimeline() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#070d1d] via-[#040814] to-[#02050c] p-6 sm:p-10 shadow-2xl shadow-cyan-950/40">
      {/* Sci-fi corner glow effects */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-cyan-500/20 pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            <SparklesIcon className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
            <span>Official Event Schedule</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
            Hackathon <span className="text-cyan-400">Timeline</span> &amp; Phases
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-400">
            Phase-wise milestone breakdown from online team registration to the Grand Finale and Awards Ceremony.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 px-4 py-2 text-xs font-mono text-cyan-300 shadow-inner">
          <CalendarIcon className="h-4 w-4 text-cyan-400" />
          <span>EVENT DATE: 19 SEPTEMBER 2026</span>
        </div>
      </div>

      {/* Desktop/Tablet Horizontal Phase Selector */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {HACKATHON_TIMELINE.map((item, idx) => {
          const isSelected = activePhaseIndex === idx;
          return (
            <button
              key={item.phase}
              type="button"
              onClick={() => setActivePhaseIndex(idx)}
              className={`group relative flex flex-col items-start justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`font-mono text-[10px] font-bold tracking-wider ${
                    isSelected ? 'text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  {item.phase}
                </span>
                {item.status === 'active' ? (
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              <span
                className={`mt-2 line-clamp-1 font-display text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-slate-300'
                }`}
              >
                {item.title}
              </span>
              <span className="mt-1 font-mono text-[10px] text-slate-400">{item.date}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Phase Detailed View Card */}
      <div className="relative z-10 mt-6 rounded-2xl border border-cyan-500/30 bg-[#091124]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {(() => {
          const current = HACKATHON_TIMELINE[activePhaseIndex];
          return (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                    {current.phase}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <CpuIcon className="h-3.5 w-3.5 text-purple-400" />
                    {current.badge}
                  </span>
                  {current.status === 'active' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE NOW
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {current.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-300 max-w-2xl">
                  {current.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                    <ClockIcon className="h-4 w-4 text-cyan-400" />
                    <span>{current.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                    <MapPinIcon className="h-4 w-4 text-pink-400" />
                    <span>{current.venue}</span>
                  </div>
                </div>
              </div>

              {/* Navigation stepper buttons */}
              <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <button
                  type="button"
                  disabled={activePhaseIndex === 0}
                  onClick={() => setActivePhaseIndex((prev) => Math.max(0, prev - 1))}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-white disabled:opacity-40"
                >
                  &larr; Previous Phase
                </button>
                <button
                  type="button"
                  disabled={activePhaseIndex === HACKATHON_TIMELINE.length - 1}
                  onClick={() => setActivePhaseIndex((prev) => Math.min(HACKATHON_TIMELINE.length - 1, prev + 1))}
                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 disabled:opacity-40"
                >
                  Next Phase &rarr;
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Full Vertical Step-by-Step Flow Line */}
      <div className="relative z-10 mt-10 space-y-6">
        <h4 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400">
          Complete Event Trajectory
        </h4>
        <div className="relative border-l-2 border-cyan-500/30 pl-6 ml-3 sm:ml-4 space-y-8">
          {HACKATHON_TIMELINE.map((step, index) => (
            <div key={step.phase} className="relative group">
              {/* Connector Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[33px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                  activePhaseIndex === index
                    ? 'border-cyan-400 bg-cyan-500 text-black shadow-[0_0_12px_#00f0ff]'
                    : 'border-slate-700 bg-slate-900 text-slate-400 group-hover:border-cyan-400'
                }`}
              >
                <span className="font-mono text-[10px] font-bold">{index + 1}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{step.phase}:</span>
                  <h5 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h5>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>{step.date}</span>
                  <span className="text-slate-600">|</span>
                  <span>{step.timeSlot}</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-2xl">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
