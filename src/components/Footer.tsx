import React from 'react';
import { SparklesIcon, ShieldCheckIcon, PhoneIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-12 text-[#475569] print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E2E8F0] pb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] text-white font-serif font-black text-xs">
                R
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-[#000000]">
                RYVANTA '26
              </span>
            </div>
            <p className="mt-2 text-xs text-[#64748B] max-w-md">
              Jaya Engineering College · National Level Tech Innovation Challenge — 19 September 2026.
              All competitions and team events held on-campus.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 text-xs font-mono">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9]">
              Official Helplines
            </span>
            <div className="flex flex-wrap gap-3">
              {SUPPORT_LINES.map((l, i) => (
                <a
                  key={i}
                  href={`tel:${l.tel}`}
                  className="inline-flex items-center gap-1.5 text-[#000000] font-bold hover:text-[#0EA5E9] transition-colors"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  <span>{l.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-[#0EA5E9]" />
            <span>Secure Automated Registration &amp; Sequential ID Engine</span>
          </div>

          <p>© 2026 RYVANTA Organizing Committee · Jaya Engineering College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}