import React from 'react';
import { UsersIcon, UserIcon, ShieldCheckIcon, GraduationCapIcon } from 'lucide-react';

export function About() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 pb-16 pt-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9] bg-sky-50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#0284C7] shadow-sm">
          <UsersIcon className="h-3.5 w-3.5" />
          <span>About Us</span>
        </div>
        <h1 className="font-serif text-4xl font-black text-[#000000] sm:text-5xl">
          College Committee
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
          Meet the visionary leadership team behind Jaya Engineering College.
        </p>
      </div>

      {/* Committee Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        {/* Chairman */}
        <div className="flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 text-center shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-luxury-lg">
          <div className="mb-6 h-56 w-56 overflow-hidden rounded-full border-4 border-sky-50 shadow-md">
            <img src="/images/chairman.png" alt="Prof.A. Kanagaraj M.A., M.Phil." className="h-full w-full object-cover" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#000000]">Prof.A. Kanagaraj M.A., M.Phil.</h2>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0284C7]">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Chairman
          </div>
          <div className="mt-6 border-t border-[#E2E8F0] pt-6">
            <p className="font-serif text-[13px] font-medium italic leading-relaxed text-[#475569]">
              "Delightful task! to rear the tender thought;<br/>
              To teach the young how to shoot;<br/>
              To pour the fresh, instruction over the mind;<br/>
              To breathe the enlivening spirit, and<br/>
              To fix the generous purpose in the glowing heart."
            </p>
            <p className="mt-3 font-mono text-[10px] font-bold text-[#94A3B8]">- Thomson, Sp. 1149</p>
          </div>
        </div>

        {/* Vice-Chairman */}
        <div className="flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 text-center shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-luxury-lg">
          <div className="mb-6 h-56 w-56 overflow-hidden rounded-full border-4 border-sky-50 shadow-md">
            <img src="/images/vice-chairman.png" alt="Er. K.Navaraj, M.Tech., (Ph.D.)" className="h-full w-full object-cover" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#000000]">Er. K.Navaraj, M.Tech., (Ph.D.)</h2>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0284C7]">
            <GraduationCapIcon className="h-3.5 w-3.5" />
            Vice – Chairman
          </div>
        </div>

        {/* Secretary */}
        <div className="flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 text-center shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-luxury-lg">
          <div className="mb-6 h-56 w-56 overflow-hidden rounded-full border-4 border-sky-50 shadow-md">
            <img src="/images/secretary.png" alt="Smt. K.Vijaya Kumari, M.A., B.Ed." className="h-full w-full object-cover" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#000000]">Smt. K.Vijaya Kumari, M.A., B.Ed.</h2>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0284C7]">
            <UserIcon className="h-3.5 w-3.5" />
            Secretary
          </div>
        </div>
      </div>
    </div>
  );
}
