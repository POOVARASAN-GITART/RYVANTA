import React from 'react';
import { MailIcon, PhoneIcon, HelpCircleIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function Support() {
  return (
    <div className="mx-auto max-w-3xl py-10 space-y-8">
      <div className="rounded-3xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 sm:p-10 shadow-luxury">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D7D5] bg-[#F3F1ED] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059]">
          <HelpCircleIcon className="h-3.5 w-3.5 text-[#C5A059]" />
          <span>Official Event Helpdesk</span>
        </div>

        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black text-[#1A1A1A] uppercase tracking-tight">
          Helpdesk &amp; <span className="text-[#C5A059]">Support</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">
          Have queries regarding registration, payments, challenge track domains, or need team changes?
          Contact the RYVANTA Organizing Desk directly.
        </p>

        <div className="mt-8 space-y-4">
          {SUPPORT_LINES.map((line) => (
            <a
              key={line.tel}
              href={`tel:${line.tel}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-5 transition-all duration-200 hover:border-[#2C2C2C] hover:bg-[#FFFFFF] hover:shadow-luxury"
            >
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  {line.label}
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  {line.number}
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F1ED] text-[#1A1A1A] group-hover:bg-[#2C2C2C] group-hover:text-[#F9F8F6] transition-colors">
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 border-t border-[#E5E4E2] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8C8A85]">
          <a
            href="mailto:ryvanta26@college.edu"
            className="inline-flex items-center gap-2 text-[#1A1A1A] font-semibold hover:text-[#C5A059] transition-colors"
          >
            <MailIcon className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
            <span>ryvanta26@college.edu</span>
          </a>
          <span className="text-[#8C8A85]">Available: 9:00 AM – 9:00 PM IST</span>
        </div>
      </div>
    </div>
  );
}