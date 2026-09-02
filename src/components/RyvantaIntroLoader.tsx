import React, { useEffect, useState } from 'react';
import { SparklesIcon, ZapIcon } from 'lucide-react';

interface LetterConfig {
  char: string;
  fromX: number; // in vw or px
  fromY: number; // in vh or px
  rotate: number; // in deg
  delay: number; // in ms
}

const LETTERS_CONFIG: LetterConfig[] = [
  { char: 'R', fromX: -120, fromY: -120, rotate: -45, delay: 100 }, // Top-Left
  { char: 'Y', fromX: 0, fromY: -140, rotate: 0, delay: 180 },     // Top
  { char: 'V', fromX: -140, fromY: 140, rotate: 35, delay: 260 },   // Bottom-Left
  { char: 'A', fromX: 130, fromY: -130, rotate: -30, delay: 340 },  // Top-Right
  { char: 'N', fromX: 0, fromY: 140, rotate: 0, delay: 420 },      // Bottom
  { char: 'T', fromX: -140, fromY: 0, rotate: 20, delay: 500 },    // Far Left
  { char: 'A', fromX: 140, fromY: 0, rotate: -20, delay: 580 }     // Far Right
];

export function RyvantaIntroLoader({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'sliding' | 'assembled' | 'subtitles' | 'closing' | 'done'>('sliding');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start sliding in immediately after mount
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 50);

    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const inc = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + inc, 100);
      });
    }, 50);

    // Timeline phases
    const assembledTimer = setTimeout(() => {
      setStage('assembled');
    }, 950);

    const subtitlesTimer = setTimeout(() => {
      setStage('subtitles');
    }, 1400);

    const closingTimer = setTimeout(() => {
      setStage('closing');
    }, 2200);

    const doneTimer = setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 2700);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(progressInterval);
      clearTimeout(assembledTimer);
      clearTimeout(subtitlesTimer);
      clearTimeout(closingTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (stage === 'done') {
    return null;
  }

  function handleSkip() {
    setStage('done');
    onComplete?.();
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] text-white select-none overflow-hidden transition-all duration-700 ease-out ${
        stage === 'closing' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading RYVANTA 26"
    >
      {/* Laser edge beams sliding from border edges */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top edge beam */}
        <div
          className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent transition-all duration-1000 ease-out ${
            mounted ? 'translate-x-0 opacity-80' : '-translate-x-full opacity-0'
          }`}
        />
        {/* Bottom edge beam */}
        <div
          className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#2563EB] to-transparent transition-all duration-1000 ease-out ${
            mounted ? 'translate-x-0 opacity-80' : 'translate-x-full opacity-0'
          }`}
        />
        {/* Left edge beam */}
        <div
          className={`absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent transition-all duration-1000 ease-out ${
            mounted ? 'translate-y-0 opacity-60' : '-translate-y-full opacity-0'
          }`}
        />
        {/* Right edge beam */}
        <div
          className={`absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent transition-all duration-1000 ease-out ${
            mounted ? 'translate-y-0 opacity-60' : 'translate-y-full opacity-0'
          }`}
        />
        
        {/* Ambient Center Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 rounded-full border border-slate-800 bg-slate-950/80 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-[#0EA5E9] hover:text-white transition-all backdrop-blur-sm"
      >
        Skip ➔
      </button>

      {/* Top Organization Pill */}
      <div
        className={`mb-6 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-slate-300 shadow-xl transition-all duration-700 ${
          stage === 'subtitles' || stage === 'closing'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-8'
        }`}
      >
        <SparklesIcon className="h-3.5 w-3.5 text-[#0EA5E9] animate-pulse" />
        <span>Jaya Engineering College</span>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN RYVANTA LETTERS CONVERGING FROM EDGES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider">
        <div className="flex items-center">
          {LETTERS_CONFIG.map((item, index) => {
            const isSlidIn = mounted;
            return (
              <span
                key={index}
                className="inline-block transition-all duration-700 ease-out"
                style={{
                  transform: isSlidIn
                    ? 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
                    : `translate3d(${item.fromX}vw, ${item.fromY}vh, 0) rotate(${item.rotate}deg) scale(0.6)`,
                  opacity: isSlidIn ? 1 : 0,
                  transitionDelay: `${item.delay}ms`,
                  textShadow:
                    stage === 'assembled' || stage === 'subtitles'
                      ? '0 0 35px rgba(14, 165, 233, 0.65), 0 0 10px rgba(255, 255, 255, 0.4)'
                      : 'none'
                }}
              >
                <span className="bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent">
                  {item.char}
                </span>
              </span>
            );
          })}
        </div>

        {/* '26 Badge exploding into position */}
        <span
          className={`ml-2 sm:ml-3 inline-block font-mono text-3xl sm:text-5xl md:text-6xl font-black transition-all duration-500 ease-out ${
            stage === 'assembled' || stage === 'subtitles' || stage === 'closing'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-0 translate-y-8'
          }`}
          style={{
            textShadow: '0 0 25px rgba(14, 165, 233, 0.9), 0 0 50px rgba(37, 99, 235, 0.6)'
          }}
        >
          <span className="bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#2563EB] bg-clip-text text-transparent">
            '26
          </span>
        </span>
      </div>

      {/* Subtitle Line */}
      <p
        className={`mt-4 text-center font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-slate-400 transition-all duration-700 ${
          stage === 'subtitles' || stage === 'closing'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >
        National Level Tech Innovation Challenge
      </p>

      {/* Cyber Progress Indicator Bar */}
      <div className="mt-10 flex flex-col items-center gap-2 w-64 sm:w-80">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#2563EB] shadow-blue-glow transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex w-full items-center justify-between font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-ping" />
            INITIALIZING PORTAL
          </span>
          <span className="font-bold text-[#0EA5E9]">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default RyvantaIntroLoader;
