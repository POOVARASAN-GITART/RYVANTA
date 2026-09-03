import React, { useEffect, useState, useRef } from 'react';
import { SparklesIcon, LogInIcon, ArrowRightIcon, CpuIcon } from 'lucide-react';
import { playPortalLoginSound } from '../services/portalSound';

interface LetterConfig {
  char: string;
  fromX: number; // in vw
  fromY: number; // in vh
  rotate: number; // in deg
  delay: number; // in ms
}

const LETTERS_CONFIG: LetterConfig[] = [
  { char: 'R', fromX: -120, fromY: -120, rotate: -45, delay: 150 }, // Top-Left
  { char: 'Y', fromX: 0, fromY: -140, rotate: 0, delay: 280 },     // Top
  { char: 'V', fromX: -140, fromY: 140, rotate: 35, delay: 410 },   // Bottom-Left
  { char: 'A', fromX: 130, fromY: -130, rotate: -30, delay: 540 },  // Top-Right
  { char: 'N', fromX: 0, fromY: 140, rotate: 0, delay: 670 },      // Bottom
  { char: 'T', fromX: -140, fromY: 0, rotate: 20, delay: 800 },    // Far Left
  { char: 'A', fromX: 140, fromY: 0, rotate: -20, delay: 930 }     // Far Right
];

export function RyvantaIntroLoader({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'sliding' | 'assembled' | 'subtitles' | 'ready_to_enter' | 'entering' | 'done'>('sliding');
  const [progress, setProgress] = useState(0);
  const hasTriggeredLoginSound = useRef(false);

  useEffect(() => {
    // 1. Initial mounting (0s)
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 80);

    // 2. Smooth 3-Second Loading Counter Animation (0 to 100% across ~2800ms)
    const startTime = Date.now();
    const duration = 2800; // 2.8s smooth interpolation to 100%

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 40);

    // Phase 2: Assembled at 1.1s
    const assembledTimer = setTimeout(() => {
      setStage('assembled');
    }, 1100);

    // Phase 3: Subtitles reveal at 1.7s
    const subtitlesTimer = setTimeout(() => {
      setStage('subtitles');
    }, 1700);

    // Phase 4: Ready for Login after 3 full seconds (3000ms)
    const readyTimer = setTimeout(() => {
      setStage('ready_to_enter');
    }, 3000);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(progressInterval);
      clearTimeout(assembledTimer);
      clearTimeout(subtitlesTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  function handleLoginToWebsite() {
    if (stage === 'entering' || stage === 'done') return;

    // Play the multi-layered technical sound sequence exclusively upon login
    if (!hasTriggeredLoginSound.current) {
      hasTriggeredLoginSound.current = true;
      playPortalLoginSound();
    }

    setStage('entering');

    setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 750);
  }

  if (stage === 'done') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] text-white select-none overflow-hidden transition-all duration-700 ease-out ${
        stage === 'entering' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading RYVANTA 26"
    >
      {/* Laser edge beams sliding from border edges */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top edge beam */}
        <div
          className={`absolute top-0 left-0 h-[2px] w-full bg-[#0EA5E9] transition-all duration-1000 ease-out ${
            mounted ? 'translate-x-0 opacity-80' : '-translate-x-full opacity-0'
          }`}
        />
        {/* Bottom edge beam */}
        <div
          className={`absolute bottom-0 left-0 h-[2px] w-full bg-[#0EA5E9] transition-all duration-1000 ease-out ${
            mounted ? 'translate-x-0 opacity-80' : 'translate-x-full opacity-0'
          }`}
        />
        {/* Left edge beam */}
        <div
          className={`absolute top-0 left-0 w-[2px] h-full bg-[#CBD5E1] transition-all duration-1000 ease-out ${
            mounted ? 'translate-y-0 opacity-60' : '-translate-y-full opacity-0'
          }`}
        />
        {/* Right edge beam */}
        <div
          className={`absolute top-0 right-0 w-[2px] h-full bg-[#CBD5E1] transition-all duration-1000 ease-out ${
            mounted ? 'translate-y-0 opacity-60' : 'translate-y-full opacity-0'
          }`}
        />

        {/* Ambient Center Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#0EA5E9]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Top Organization Pill */}
      <div
        className={`mb-6 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-slate-300 shadow-xl transition-all duration-700 ${
          stage === 'subtitles' || stage === 'ready_to_enter' || stage === 'entering'
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
                    stage === 'assembled' || stage === 'subtitles' || stage === 'ready_to_enter'
                      ? '0 0 35px rgba(14, 165, 233, 0.65), 0 0 10px rgba(255, 255, 255, 0.4)'
                      : 'none'
                }}
              >
                <span className="text-[#FFFFFF]">
                  {item.char}
                </span>
              </span>
            );
          })}
        </div>

        {/* '26 Badge exploding into position */}
        <span
          className={`ml-2 sm:ml-3 inline-block font-mono text-3xl sm:text-5xl md:text-6xl font-black transition-all duration-500 ease-out ${
            stage === 'assembled' || stage === 'subtitles' || stage === 'ready_to_enter' || stage === 'entering'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-0 translate-y-8'
          }`}
          style={{
            textShadow: '0 0 25px rgba(14, 165, 233, 0.9)'
          }}
        >
          <span className="text-[#0EA5E9]">
            '26
          </span>
        </span>
      </div>

      {/* Subtitle Line */}
      <p
        className={`mt-4 text-center font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-slate-400 transition-all duration-700 ${
          stage === 'subtitles' || stage === 'ready_to_enter' || stage === 'entering'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >
        National Level Tech Innovation Challenge
      </p>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LOGIN TO WEBSITE ACTION (EXTENDED 3-SEC LOADING COMPLETION) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {stage === 'ready_to_enter' ? (
          <button
            type="button"
            onClick={handleLoginToWebsite}
            autoFocus
            className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-[#0EA5E9] px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest text-[#FFFFFF] shadow-2xl hover:bg-[#0284C7] hover:scale-105 hover:shadow-blue-glow transition-all duration-200 animate-bounce"
          >
            <CpuIcon className="h-4 w-4 text-white animate-spin" />
            <span>LOGIN TO RYVANTA PORTAL</span>
            <ArrowRightIcon className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          /* 3-Second Cyber Progress Indicator Bar */
          <div className="flex flex-col items-center gap-2 w-64 sm:w-80">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
              <div
                className="h-full bg-[#0EA5E9] shadow-blue-glow transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex w-full items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-ping" />
                SYSTEM INITIALIZING
              </span>
              <span className="font-bold text-[#0EA5E9]">{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RyvantaIntroLoader;
