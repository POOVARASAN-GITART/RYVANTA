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
    <div className="relative z-10 bg-transparent p-3 sm:p-5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#334155]">
          {label}
        </h3>
        {emphasis ? (
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#0284C7] uppercase">
            ● KEY DEADLINE
          </span>
        ) : (
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#64748B] uppercase">
            ● EVENT DAY
          </span>
        )}
      </div>

      {countdown.isComplete ? (
        <p className="mt-4 font-serif text-2xl font-bold text-[#000000]">
          {completeLabel}
        </p>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-2 sm:gap-4 text-center">
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

      <div className="mt-3 pt-1">
        <p className="text-xs text-[#475569] font-medium leading-relaxed">{caption}</p>
      </div>
    </div>
  );
}