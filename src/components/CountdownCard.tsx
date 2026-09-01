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
      className={[
      'rounded-2xl border p-6',
      emphasis ? 'border-metallic/40 bg-elevated' : 'border-line bg-surface'].
      join(' ')}>
      
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-metallic">
        {label}
      </h3>

      {countdown.isComplete ?
      <p className="mt-4 font-display text-2xl font-black text-highlight">
          {completeLabel}
        </p> :

      <div className="mt-4 flex items-end gap-4">
          {values.map((value, index) =>
        <div key={UNITS[index]}>
              <div
            className={[
            'font-display font-black tabular-nums text-highlight',
            emphasis ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'].
            join(' ')}>
            
                {String(value).padStart(2, '0')}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-metallic">
                {UNITS[index]}
              </div>
            </div>
        )}
        </div>
      }

      <p className="mt-4 text-xs text-metallic">{caption}</p>
    </div>);

}