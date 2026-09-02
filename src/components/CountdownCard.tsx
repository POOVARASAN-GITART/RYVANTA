import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface CountdownCardProps {
  label: string;
  target: string;
  caption: string;
  completeLabel: string;
  emphasis?: boolean;
}

const UNITS = ['Days', 'Hours', 'Min', 'Sec'] as const;

export function CountdownCard({
  label,
  target,
  caption,
  completeLabel,
  emphasis = false
}: CountdownCardProps) {
  const countdown = useCountdown(target);
  const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds];

  return (
    <div
      className={`relative z-10 overflow-hidden rounded-3xl border bg-transparent backdrop-blur-sm p-6 sm:p-7 transition-all duration-200 ${
        emphasis
          ? 'border-[#0EA5E9] shadow-sm ring-1 ring-[#0EA5E9]/20'
          : 'border-[#CBD5E1]'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#475569]">
          {label}
        </h3>
        {emphasis ? (
          <span className="rounded-full bg-sky-50/80 border border-[#0EA5E9] px-3 py-0.5 text-[10px] font-mono font-bold text-[#0284C7]">
            KEY DEADLINE
          </span>
        ) : (
          <span className="rounded-full bg-slate-100/80 border border-slate-300 px-3 py-0.5 text-[10px] font-mono font-bold text-[#475569]">
            EVENT DAY
          </span>
        )}
      </div>

      {countdown.isComplete ? (
        <p className="mt-5 font-serif text-2xl font-bold text-[#000000]">
          {completeLabel}
        </p>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-2 sm:gap-4 text-center">
          {values.map((value, index) => (
            <div key={UNITS[index]} className="flex-1 py-1">
              <div className="font-mono text-3xl sm:text-4xl font-black tabular-nums text-[#000000] tracking-tight">
                {String(value).padStart(2, '0')}
              </div>
              <div className="mt-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0EA5E9]">
                {UNITS[index]}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-[#CBD5E1]/50 pt-3.5">
        <p className="text-xs text-[#334155] font-medium leading-relaxed">{caption}</p>
      </div>
    </div>
  );
}