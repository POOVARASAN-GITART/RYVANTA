import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function compute(target: number): Countdown {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff % 86_400_000 / 3_600_000),
    minutes: Math.floor(diff % 3_600_000 / 60_000),
    seconds: Math.floor(diff % 60_000 / 1000),
    isComplete: false
  };
}

export function useCountdown(isoTarget: string): Countdown {
  const target = new Date(isoTarget).getTime();
  const [countdown, setCountdown] = useState<Countdown>(() => compute(target));

  useEffect(() => {
    setCountdown(compute(target));
    const id = window.setInterval(() => setCountdown(compute(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return countdown;
}