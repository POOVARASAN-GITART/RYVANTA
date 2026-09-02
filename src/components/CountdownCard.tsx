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
      className={`rounded-2xl border p-6 transition-all duration-200 ${
        emphasis
          ? 'border-[#FF6B00] bg-[#FFFFFF] shadow-luxury-lg ring-2 ring-[#FF6B00]/20'
          : 'border-[#E2E8F0] bg-[#FFFFFF] shadow-luxury'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#64748B]">
          {label}
        </h3>
        {emphasis ? (
          <span className="rounded-full bg-orange-50 border border-[#FF6B00] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#EA580C]">
            KEY DEADLINE
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 border border-[#10B981] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#059669]">
            EVENT DAY
          </span>
        )}
      </div>

      {countdown.isComplete ? (
        <p className="mt-4 font-serif text-2xl font-bold text-[#0F172A]">
          {completeLabel}
        </p>
      ) : (
        <div className="mt-4 flex items-end gap-3 sm:gap-4">
          {values.map((value, index) => (
            <div key={UNITS[index]} className="flex-1 text-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5">
              <div
                className={`font-mono font-black tabular-nums ${
                  emphasis
                    ? 'text-2xl sm:text-3xl text-[#0F172A]'
                    : 'text-xl sm:text-2xl text-[#334155]'
                }`}
              >
                {String(value).padStart(2, '0')}
              </div>
              <div
                className={`mt-0.5 text-[9px] font-sans font-bold uppercase tracking-widest ${
                  emphasis ? 'text-[#FF6B00]' : 'text-[#10B981]'
                }`}
              >
                {UNITS[index]}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs font-medium text-[#475569]">{caption}</p>
    </div>
  );
}