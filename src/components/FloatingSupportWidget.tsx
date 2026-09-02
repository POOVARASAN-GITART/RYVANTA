import React, { useState } from 'react';
import { PhoneIcon, HeadphonesIcon, XIcon, MessageCircleIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-support-widget fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-80 overflow-hidden rounded-2xl border border-[#FF6B00] bg-[#FFFFFF] p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8FAFC] border border-[#FF6B00]/40 text-[#FF6B00]">
                <HeadphonesIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#0F172A]">
                  Official Helplines
                </h4>
                <p className="text-[10px] text-[#64748B]">Symposium &amp; Hackathon Desk</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
              aria-label="Close support card"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {SUPPORT_LINES.map((line, idx) => (
              <a
                key={idx}
                href={`tel:${line.tel}`}
                className="group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 transition-all hover:border-[#10B981] hover:bg-[#FFFFFF] hover:shadow-sm"
              >
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
                    {line.label}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                    {line.number}
                  </span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#0EA5E9] group-hover:bg-[#0F172A] group-hover:text-[#10B981] transition-colors">
                  <PhoneIcon className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 border-t border-[#E2E8F0] pt-3 text-center">
            <span className="text-[11px] font-medium text-[#64748B]">
              Hours: 8:00 AM – 9:00 PM IST
            </span>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full border border-[#FF6B00] bg-[#0F172A] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FAFAFA] shadow-xl hover:bg-[#000000] hover:shadow-2xl transition-all duration-200"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00] text-[#FFFFFF]">
          <HeadphonesIcon className="h-3 w-3" />
        </div>
        <span className="font-serif">Official Helplines</span>
        <span className="rounded-full bg-emerald-950/40 border border-[#10B981] px-2 py-0.5 font-mono text-[10px] font-bold text-[#34D399]">
          +91 95665 2006
        </span>
      </button>
    </div>
  );
}
