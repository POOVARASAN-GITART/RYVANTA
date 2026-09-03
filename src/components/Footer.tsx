import React, { useRef } from 'react';
import { ShieldCheckIcon, PhoneIcon, LockIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  function handleSecretLogoClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      onOpenAdmin?.();
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1200);
    }
  }

  return (
    <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-12 text-[#475569] print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E2E8F0] pb-8">
          <div>
            <div
              onClick={handleSecretLogoClick}
              className="flex items-center gap-2 cursor-pointer select-none group"
              title="RYVANTA '26"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white font-serif font-black text-xs group-hover:scale-105 transition-transform">
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

          <div className="flex items-center gap-3">
            <p>© 2026 RYVANTA Organizing Committee · Jaya Engineering College. All rights reserved.</p>
            {/* Discrete Secret Lock Button for Organizers */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[#CBD5E1] hover:text-[#0EA5E9] p-1 transition-colors"
              title="Organizer Portal"
              aria-label="Organizer Portal"
            >
              <LockIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;