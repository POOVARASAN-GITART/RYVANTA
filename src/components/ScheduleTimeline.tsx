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
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-10 shadow-luxury">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/40 bg-[#F8FAFC] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00]">
            <SparklesIcon className="h-3.5 w-3.5 text-[#FF6B00]" />
            <span>Symposium Day Schedule</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
            Event <span className="text-orange-gradient">Timeline</span> &amp; Schedule
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#475569]">
            Complete milestone breakdown from online team registration (deadline 10-09-2026) to the Grand Awards Ceremony on 19-09-2026.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#10B981] bg-emerald-50/50 px-4 py-2.5 text-xs font-mono font-bold text-[#059669] shadow-sm">
          <CalendarIcon className="h-4 w-4 text-[#0EA5E9]" />
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
                  ? 'border-[#FF6B00] bg-[#0F172A] text-[#FFFFFF] shadow-md ring-2 ring-[#FF6B00]/40'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#10B981] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`font-mono text-[10px] font-bold tracking-wider ${
                    isSelected ? 'text-[#FF6B00]' : 'text-[#64748B]'
                  }`}
                >
                  {item.phase}
                </span>
                {item.status === 'active' ? (
                  <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-[#E2E8F0]'}`} />
                )}
              </div>
              <span
                className={`mt-2 line-clamp-1 font-serif text-xs font-bold ${
                  isSelected ? 'text-[#FFFFFF]' : 'text-[#0F172A]'
                }`}
              >
                {item.title}
              </span>
              <span className={`mt-1 font-mono text-[10px] ${isSelected ? 'text-slate-300' : 'text-[#64748B]'}`}>
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Phase Detailed View Card */}
      <div className="relative z-10 mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8 shadow-sm">
        {(() => {
          const current = HACKATHON_TIMELINE[activePhaseIndex];
          const milestones = current.milestones || [];
          return (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-[#FF6B00] bg-[#FFFFFF] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                    {current.phase}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    <TrophyIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    {current.badge}
                  </span>
                  {current.status === 'active' && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                      CURRENT STAGE
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                  {current.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#475569]">
                  {current.description}
                </p>

                {/* Key Deliverables / Milestones */}
                {milestones.length > 0 && (
                  <div className="border-t border-[#E2E8F0] pt-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#64748B]">
                      Stage Deliverables &amp; Action Items:
                    </span>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      {milestones.map((ms, msIdx) => (
                        <div
                          key={msIdx}
                          className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-xs text-[#0F172A]"
                        >
                          <CheckCircle2Icon className="h-4 w-4 shrink-0 text-[#10B981]" />
                          <span className="font-medium">{ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timing and Venue Sidebox */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 lg:w-72 space-y-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      Date
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#0F172A]">
                      {current.date}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                      <ClockIcon className="h-3.5 w-3.5 text-[#FF6B00]" />
                      Time Slot
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#0F172A]">
                      {current.timeSlot}
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                      <MapPinIcon className="h-3.5 w-3.5 text-[#10B981]" />
                      Venue &amp; Hall
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#0F172A]">
                      {current.venue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#FF6B00]/40 bg-[#F8FAFC] p-3 text-center">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                    Attendance Requirement
                  </span>
                  <p className="text-xs font-serif font-bold text-[#0F172A] mt-0.5">
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
