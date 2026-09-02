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
      className={`rounded-2xl border p-6 transition-all duration-200 shadow-luxury ${
        emphasis
          ? 'border-[#D8D7D5] bg-[#FFFFFF] shadow-luxury-lg ring-1 ring-[#E5E4E2]'
          : 'border-[#E5E4E2] bg-[#F3F1ED]'
      }`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C8A85]">
        {label}
      </h3>

      {countdown.isComplete ? (
        <p className="mt-4 font-display text-2xl font-bold text-[#1A1A1A]">
          {completeLabel}
        </p>
      ) : (
        <div className="mt-4 flex items-end gap-4">
          {values.map((value, index) => (
            <div key={UNITS[index]} className="flex-1">
              <div
                className={`font-display font-black tabular-nums ${
                  emphasis
                    ? 'text-3xl sm:text-4xl text-[#1A1A1A]'
                    : 'text-2xl sm:text-3xl text-[#2C2C2C]'
                }`}
              >
                {String(value).padStart(2, '0')}
              </div>
              <div className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#8C8A85]">
                {UNITS[index]}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs font-medium text-[#4A4A4A]">{caption}</p>
    </div>
  );
}