import React from 'react';
import { MailIcon, PhoneIcon, HelpCircleIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function Support() {
  return (
    <div className="mx-auto max-w-3xl py-10 space-y-8">
      <div className="rounded-3xl border border-cyan-500/25 bg-[#070d1e]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
          <HelpCircleIcon className="h-3.5 w-3.5 text-cyan-400" />
          <span>Official Event Helpdesk</span>
        </div>

        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Helpdesk &amp; <span className="text-cyan-400">Support</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Have queries regarding registration, payments, challenge track domains, or need team changes?
          Contact the RYVANTA Organizing Desk directly.
        </p>

        <div className="mt-8 space-y-4">
          {SUPPORT_LINES.map((line) => (
            <a
              key={line.tel}
              href={`tel:${line.tel}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-cyan-400 hover:bg-slate-800/80 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  {line.label}
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {line.number}
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <a
            href="mailto:ryvanta26@college.edu"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-white transition-colors"
          >
            <MailIcon className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span>ryvanta26@college.edu</span>
          </a>
          <span className="text-slate-500">Available: 9:00 AM – 9:00 PM IST</span>
        </div>
      </div>
    </div>
  );
}