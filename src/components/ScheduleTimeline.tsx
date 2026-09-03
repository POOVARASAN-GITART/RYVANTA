import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircle2Icon,
  TrophyIcon
} from 'lucide-react';

const EVENT_SCHEDULES = [
  {
    id: 'hackathon',
    name: "Hackathon '26",
    venue: 'Auditorium',
    agenda: [
      { time: '08:30 AM - 09:30 AM', task: 'Inauguration' },
      { time: '09:30 AM - 10:30 AM', task: 'PPT Prepare' },
      { time: '10:30 AM - 12:30 PM', task: 'PPT Presentation' },
      { time: '12:30 PM - 01:00 PM', task: 'Lunch' },
      { time: '01:15 PM - 03:00 PM', task: 'Prototype Evaluation' },
      { time: '03:00 PM - 03:30 PM', task: 'Prize Distribution' }
    ]
  },
  {
    id: 'ctf',
    name: "Capture The Flag",
    venue: 'FOSS Lab',
    agenda: [
      { time: '09:00 AM - 10:00 AM', task: 'Inauguration' },
      { time: '10:00 AM - 10:15 AM', task: 'Check-in and Rules Briefing' },
      { time: '10:15 AM - 11:30 AM', task: 'Round 1' },
      { time: '11:30 AM - 11:45 AM', task: 'Break' },
      { time: '11:45 AM - 01:00 PM', task: 'Round 2' }
    ]
  },
  {
    id: '2d-games',
    name: "2D Games (SOZO '26)",
    venue: 'IT Lab',
    agenda: [
      { time: '09:00 AM - 10:00 AM', task: 'Inauguration' },
      { time: '10:00 AM - 10:10 AM', task: 'Check-in and Rules Briefing' },
      { time: '10:10 AM - 11:10 AM', task: 'Development 1' },
      { time: '11:10 AM - 11:25 AM', task: 'Break' },
      { time: '11:25 AM - 12:40 PM', task: 'Round 2' }
    ]
  },
  {
    id: 'egames',
    name: "E-Games (Free Fire)",
    venue: 'Network Lab',
    agenda: [
      { time: '09:00 AM - 10:00 AM', task: 'Inauguration' },
      { time: '10:00 AM - 10:10 AM', task: 'Rules and Regulations' },
      { time: '10:00 AM - 10:30 AM', task: 'Setting the Team' },
      { time: '10:30 AM - 12:30 PM', task: 'Tournament Start' },
      { time: '12:30 PM - 01:30 PM', task: 'Lunch' },
      { time: '01:30 PM - 02:30 PM', task: 'Prize Distribution' }
    ]
  }
];

export function ScheduleTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-10 shadow-luxury">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-[#E2E8F0] pb-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/40 bg-[#F8FAFC] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#0284C7]">
            <SparklesIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>Tech Innovation Challenge Schedule</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#000000] sm:text-3xl lg:text-4xl">
            Event <span className="text-[#0EA5E9]">Agenda</span> &amp; Schedule
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#475569]">
            Detailed hour-by-hour breakdown for all major technical events and the grand inauguration ceremony.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#0EA5E9] bg-sky-50/70 px-4 py-2.5 text-xs font-mono font-bold text-[#0284C7] shadow-sm">
          <CalendarIcon className="h-4 w-4 text-[#0EA5E9]" />
          <span>CHALLENGE DAY: 19 SEPTEMBER 2026</span>
        </div>
      </div>

      {/* Desktop/Tablet Horizontal Event Selector */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-4">
        {EVENT_SCHEDULES.map((event, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group relative flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all duration-200 ${
                isSelected
                  ? 'border-[#0EA5E9] bg-[#000000] text-[#FFFFFF] shadow-md ring-2 ring-[#0EA5E9]/40'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#0EA5E9] hover:bg-[#FFFFFF]'
              }`}
            >
              <span
                className={`line-clamp-1 font-serif text-sm font-bold ${
                  isSelected ? 'text-[#FFFFFF]' : 'text-[#000000]'
                }`}
              >
                {event.name}
              </span>
              <span className={`mt-1 font-mono text-[10px] uppercase ${isSelected ? 'text-[#38BDF8]' : 'text-[#64748B]'}`}>
                {event.venue}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Phase Detailed View Card */}
      <div className="relative z-10 mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8 shadow-sm">
        {(() => {
          const current = EVENT_SCHEDULES[activeIndex];
          return (
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#000000]">
                    <TrophyIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    {current.name} Schedule
                  </span>
                </div>

                <div className="border border-[#E2E8F0] bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
                  {current.agenda.map((item, i) => (
                    <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 ${i !== current.agenda.length - 1 ? 'border-b border-[#F1F5F9]' : ''} hover:bg-sky-50/30 transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-[#0EA5E9]">
                          <ClockIcon className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#0EA5E9] whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      <span className="mt-2 sm:mt-0 font-serif text-sm font-bold text-[#334155] sm:text-right">
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing and Venue Sidebox */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 lg:w-72 space-y-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      Date
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#000000]">
                      19 September 2026
                    </p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                      <MapPinIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      Venue
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-[#000000]">
                      {current.venue}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#0EA5E9]/40 bg-[#F8FAFC] p-3 text-center">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
                    Attendance Requirement
                  </span>
                  <p className="text-xs font-serif font-bold text-[#000000] mt-0.5">
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
