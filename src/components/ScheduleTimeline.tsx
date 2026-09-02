import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircle2Icon,
  TrophyIcon
} from 'lucide-react';
import { HACKATHON_TIMELINE } from '../data/events';

export function ScheduleTimeline() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EAE6DF] bg-[#FFFFFF] p-6 sm:p-10 shadow-luxury">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-[#EAE6DF] pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FAFAFA] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#AA820A]">
            <SparklesIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Symposium Day Schedule</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#1C1C1C] sm:text-3xl lg:text-4xl">
            Event <span className="text-gold-gradient">Timeline</span> &amp; Schedule
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#555555]">
            Complete milestone breakdown from online team registration (deadline 10-09-2026) to the Grand Awards Ceremony on 19-09-2026.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent px-4 py-2.5 text-xs font-mono font-bold text-[#1C1C1C] shadow-sm">
          <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
          <span>SYMPOSIUM DAY: 19 SEPTEMBER 2026</span>
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
                  ? 'border-[#D4AF37] bg-[#1C1C1C] text-[#FFFFFF] shadow-md ring-2 ring-[#D4AF37]/40'
                  : 'border-[#EAE6DF] bg-[#FAFAFA] text-[#383838] hover:border-[#D4AF37] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`font-mono text-[10px] font-bold tracking-wider ${
                    isSelected ? 'text-[#FFD700]' : 'text-[#767676]'
                  }`}
                >
                  {item.phase}
                </span>
                {item.status === 'active' ? (
                  <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-[#EAE6DF]'}`} />
                )}
              </div>
              <span
                className={`mt-2 line-clamp-1 font-serif text-xs font-bold ${
                  isSelected ? 'text-[#FFFFFF]' : 'text-[#1C1C1C]'
                }`}
              >
                {item.title}
              </span>
              <span className={`mt-1 font-mono text-[10px] ${isSelected ? 'text-slate-300' : 'text-[#767676]'}`}>
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Phase Detailed View Card */}
      <div className="relative z-10 mt-6 rounded-2xl border border-[#EAE6DF] bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
        {(() => {
          const current = HACKATHON_TIMELINE[activePhaseIndex];
          const milestones = current.milestones || [];
          return (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-[#D4AF37] bg-[#FFFFFF] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#AA820A]">
                    {current.phase}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE6DF] bg-[#FFFFFF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">
                    <TrophyIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {current.badge}
                  </span>
                  {current.status === 'active' && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                      CURRENT STAGE
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">
                  {current.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#555555]">
                  {current.description}
                </p>

                {/* Key Deliverables / Milestones */}
                {milestones.length > 0 && (
                  <div className="border-t border-[#EAE6DF] pt-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#767676]">
                      Stage Deliverables &amp; Action Items:
                    </span>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      {milestones.map((ms, msIdx) => (
                        <div
                          key={msIdx}
                          className="flex items-center gap-2 rounded-xl border border-[#EAE6DF] bg-[#FFFFFF] p-3 text-xs text-[#1C1C1C]"
                        >
                          <CheckCircle2Icon className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                          <span className="font-medium">{ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timing and Venue Sidebox */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#EAE6DF] bg-[#FFFFFF] p-6 lg:w-72 space-y-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#767676]">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Date
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#1C1C1C]">
                      {current.date}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#767676]">
                      <ClockIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Time Slot
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#1C1C1C]">
                      {current.timeSlot}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#767676]">
                      <MapPinIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Venue &amp; Hall
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#1C1C1C]">
                      {current.venue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FAFAFA] p-3 text-center">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#767676]">
                    Attendance Requirement
                  </span>
                  <p className="text-xs font-serif font-bold text-[#1C1C1C] mt-0.5">
                    Physical Presence On-Campus
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
