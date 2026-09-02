import React from 'react';
import { MailIcon, PhoneIcon, HelpCircleIcon, HeadphonesIcon, SparklesIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

export function Support() {
  return (
    <div className="mx-auto max-w-3xl py-10 space-y-8">
      <div className="rounded-3xl border border-[#EAE6DF] bg-[#FFFFFF] p-6 sm:p-10 shadow-luxury">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#FAFAFA] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#AA820A]">
          <HeadphonesIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>Official Event Helpdesk</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-black text-[#1C1C1C] tracking-tight">
          Helpdesk &amp; <span className="text-gold-gradient">Support</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Have queries regarding registration, payments, problem domains, or need team changes?
          Contact the RYVANTA '26 Organizing Convenors directly through the official helpline numbers.
        </p>

        <div className="mt-8 space-y-4">
          {SUPPORT_LINES.map((line, idx) => (
            <a
              key={idx}
              href={`tel:${line.tel}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[#EAE6DF] bg-[#FAFAFA] p-5 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#FFFFFF] hover:shadow-luxury"
            >
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#AA820A]">
                  {line.label}
                </span>
                <span className="mt-1 block font-mono text-xl font-bold text-[#1C1C1C] group-hover:text-[#AA820A] transition-colors">
                  {line.number}
                </span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFFFFF] border border-[#EAE6DF] text-[#D4AF37] group-hover:bg-[#1C1C1C] group-hover:text-[#FFFFFF] transition-colors shadow-sm">
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 border-t border-[#EAE6DF] pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#767676]">
          <a
            href="mailto:ryvanta26@college.edu"
            className="inline-flex items-center gap-2 text-[#1C1C1C] font-semibold hover:text-[#AA820A] transition-colors"
          >
            <MailIcon className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span>ryvanta26@college.edu</span>
          </a>
          <span className="text-[#767676]">Helpline Timings: 8:00 AM – 9:00 PM IST</span>
        </div>
      </div>
    </div>
  );
}