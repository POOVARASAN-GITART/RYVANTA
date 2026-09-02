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
          ? 'border-[#D4AF37] bg-[#FFFFFF] shadow-luxury-lg ring-1 ring-[#D4AF37]/30'
          : 'border-[#EAE6DF] bg-[#FFFFFF] shadow-luxury'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#767676]">
          {label}
        </h3>
        {emphasis && (
          <span className="rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#AA820A]">
            KEY DEADLINE
          </span>
        )}
      </div>

      {countdown.isComplete ? (
        <p className="mt-4 font-serif text-2xl font-bold text-[#1C1C1C]">
          {completeLabel}
        </p>
      ) : (
        <div className="mt-4 flex items-end gap-3 sm:gap-4">
          {values.map((value, index) => (
            <div key={UNITS[index]} className="flex-1 text-center rounded-xl bg-[#FAFAFA] border border-[#EAE6DF] p-2.5">
              <div
                className={`font-mono font-black tabular-nums ${
                  emphasis
                    ? 'text-2xl sm:text-3xl text-[#1C1C1C]'
                    : 'text-xl sm:text-2xl text-[#383838]'
                }`}
              >
                {String(value).padStart(2, '0')}
              </div>
              <div className="mt-0.5 text-[9px] font-sans font-bold uppercase tracking-widest text-[#D4AF37]">
                {UNITS[index]}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs font-medium text-[#555555]">{caption}</p>
    </div>
  );
}