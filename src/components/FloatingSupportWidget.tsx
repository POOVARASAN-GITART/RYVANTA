import React, { useState } from 'react';
import { PhoneIcon, HeadphonesIcon, XIcon, MessageCircleIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-support-widget fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-80 overflow-hidden rounded-2xl border border-[#0EA5E9] bg-[#FFFFFF] p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8FAFC] border border-[#0EA5E9]/40 text-[#0EA5E9]">
                <HeadphonesIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#000000]">
                  Official Helplines
                </h4>
                <p className="text-[10px] text-[#64748B]">Tech Innovation Challenge Desk</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#000000] transition-colors"
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
                className="group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 transition-all hover:border-[#0EA5E9] hover:bg-[#FFFFFF] hover:shadow-sm"
              >
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#0EA5E9]">
                    {line.label}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#000000] group-hover:text-[#0284C7] transition-colors">
                    {line.number}
                  </span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] text-[#0EA5E9] group-hover:bg-[#000000] group-hover:text-[#FFFFFF] transition-colors">
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
        className="group flex items-center gap-2.5 rounded-full border border-[#0EA5E9] bg-[#000000] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FAFAFA] shadow-xl hover:bg-[#1E293B] hover:shadow-2xl transition-all duration-200"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA5E9] text-[#FFFFFF]">
          <HeadphonesIcon className="h-3 w-3" />
        </div>
        <span className="font-serif">Official Helplines</span>
        <span className="rounded-full bg-sky-950/60 border border-[#0EA5E9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#38BDF8]">
          +91 95665 2006
        </span>
      </button>
    </div>
  );
}
