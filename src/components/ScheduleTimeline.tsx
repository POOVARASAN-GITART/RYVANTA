import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircle2Icon,
  CpuIcon
} from 'lucide-react';
import { HACKATHON_TIMELINE } from '../data/events';

export function ScheduleTimeline() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E5E4E2] bg-[#F3F1ED] p-6 sm:p-10 shadow-luxury">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-[#E5E4E2] pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D7D5] bg-[#FFFFFF] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059]">
            <SparklesIcon className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Official Event Schedule</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-[#1A1A1A] sm:text-3xl lg:text-4xl">
            Hackathon <span className="text-[#C5A059]">Timeline</span> &amp; Phases
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#4A4A4A]">
            Phase-wise milestone breakdown from online team registration to the Grand Finale and Awards Ceremony.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] px-4 py-2.5 text-xs font-mono font-bold text-[#1A1A1A] shadow-sm">
          <CalendarIcon className="h-4 w-4 text-[#C5A059]" />
          <span>EVENT DATE: 19 SEPTEMBER 2026</span>
        </div>
      </div>

      {/* Desktop/Tablet Horizontal Phase Selector */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {HACKATHON_TIMELINE.map((item, idx) => {
          const isSelected = activePhaseIndex === idx;
          return (
            <button
              key={item.phase}
              type="button"
              onClick={() => setActivePhaseIndex(idx)}
              className={`group relative flex flex-col items-start justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-md'
                  : 'border-[#E5E4E2] bg-[#FFFFFF] text-[#4A4A4A] hover:border-[#D8D7D5] hover:bg-[#F9F8F6]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`font-mono text-[10px] font-bold tracking-wider ${
                    isSelected ? 'text-[#C5A059]' : 'text-[#8C8A85]'
                  }`}
                >
                  {item.phase}
                </span>
                {item.status === 'active' ? (
                  <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-ping" />
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-[#D8D7D5]'}`} />
                )}
              </div>
              <span
                className={`mt-2 line-clamp-1 font-display text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-[#1A1A1A]'
                }`}
              >
                {item.title}
              </span>
              <span className={`mt-1 font-mono text-[10px] ${isSelected ? 'text-slate-300' : 'text-[#8C8A85]'}`}>
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Phase Detailed View Card */}
      <div className="relative z-10 mt-6 rounded-2xl border border-[#D8D7D5] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
        {(() => {
          const current = HACKATHON_TIMELINE[activePhaseIndex];
          const milestones = current.milestones || [];
          return (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-[#D8D7D5] bg-[#F3F1ED] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    {current.phase}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E4E2] bg-[#F9F8F6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    <CpuIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                    {current.badge}
                  </span>
                  {current.status === 'active' && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                      CURRENT STAGE
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-black text-[#1A1A1A]">
                  {current.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#4A4A4A]">
                  {current.description}
                </p>

                {/* Key Deliverables / Milestones */}
                {milestones.length > 0 && (
                  <div className="border-t border-[#E5E4E2] pt-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8C8A85]">
                      Stage Deliverables &amp; Protocol:
                    </span>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      {milestones.map((ms, msIdx) => (
                        <div
                          key={msIdx}
                          className="flex items-center gap-2 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-3 text-xs text-[#1A1A1A]"
                        >
                          <CheckCircle2Icon className="h-4 w-4 shrink-0 text-[#C5A059]" />
                          <span className="font-medium">{ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timing and Venue Sidebox */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-6 lg:w-72 space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8A85]">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                      Date
                    </span>
                    <p className="mt-1 font-display text-sm font-bold text-[#1A1A1A]">
                      {current.date}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8A85]">
                      <ClockIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                      Time Slot
                    </span>
                    <p className="mt-1 font-display text-sm font-bold text-[#1A1A1A]">
                      {current.timeSlot}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8A85]">
                      <MapPinIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                      Venue &amp; Location
                    </span>
                    <p className="mt-1 font-display text-sm font-bold text-[#1A1A1A]">
                      {current.venue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D8D7D5] bg-[#FFFFFF] p-3 text-center">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8C8A85]">
                    Reporting Instructions
                  </span>
                  <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">
                    Physical Presence Required
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
