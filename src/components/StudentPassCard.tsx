import React, { useRef } from 'react';
import {
  CheckCircle2Icon,
  DownloadIcon,
  PrinterIcon,
  ShieldCheckIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  Share2Icon,
  XIcon,
  SparklesIcon,
  BuildingIcon
} from 'lucide-react';
import type { Registration } from '../types/registration';
import { QrCodeView } from './QrCodeView';

interface StudentPassCardProps {
  registration: Registration;
  onClose?: () => void;
  isModal?: boolean;
}

export function StudentPassCard({
  registration,
  onClose,
  isModal = false
}: StudentPassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE6DF] pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] text-white font-serif font-bold text-xs">
            TI
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1C1C1C]">
              Official Participation Pass &amp; Entry Badge
            </h3>
            <span className="font-mono text-xs text-[#AA820A] font-bold">
              ID: {registration.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#1C1C1C] hover:bg-[#FAFAFA] transition-colors shadow-sm"
          >
            <PrinterIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Print Pass</span>
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-2 text-[#767676] hover:text-[#1C1C1C]"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Regal Gold & White Digital Entry Pass Card */}
      <div
        ref={cardRef}
        className="student-pass-root relative overflow-hidden rounded-3xl border-2 border-[#D4AF37] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury-lg text-[#1C1C1C]"
      >
        {/* Decorative Gold Corner Flairs */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 blur-xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#EAE6DF] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#FAFAFA] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#AA820A]">
              <SparklesIcon className="h-3 w-3 text-[#D4AF37]" />
              <span>Jaya Engineering College · RYVANTA '26 Pass</span>
            </div>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-black text-[#1C1C1C]">
              {registration.eventName}
            </h2>
            <p className="text-xs text-[#555555] mt-1">{registration.institution}</p>
          </div>

          {/* Sequential Participation ID Badge */}
          <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#FAFAFA] p-4 text-center sm:text-right shadow-sm">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#767676]">
              Participation ID
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-wider">
              {registration.id}
            </span>
            <span className="mt-1 block font-mono text-[10px] text-emerald-700 font-bold uppercase">
              ● Verified Admission
            </span>
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_160px] items-start">
          <div className="space-y-4">
            {/* Squad & Leader */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-3.5">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#767676]">
                  Team Name
                </span>
                <p className="font-serif text-base font-bold text-[#1C1C1C] mt-0.5">
                  {registration.teamName}
                </p>
              </div>

              <div className="rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-3.5">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#767676]">
                  Team Leader
                </span>
                <p className="font-serif text-base font-bold text-[#1C1C1C] mt-0.5">
                  {registration.leaderName || registration.members[0]}
                </p>
              </div>
            </div>

            {/* Track / Domain */}
            <div className="rounded-xl border border-[#D4AF37]/50 bg-[#FAFAFA] p-3.5">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#AA820A]">
                Assigned Problem Domain / Track
              </span>
              <p className="font-mono text-sm font-bold text-[#1C1C1C] mt-0.5">
                {registration.track || registration.domain || 'General Track'}
              </p>
            </div>

            {/* Team Members List */}
            <div className="rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-4">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#767676] block mb-2">
                Registered Team Members ({registration.members.length} Participants)
              </span>
              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                {registration.members.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-[#FFFFFF] border border-[#EAE6DF] p-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#FAFAFA] font-mono text-[10px] font-bold text-[#D4AF37]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-[#1C1C1C] truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Validation Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EAE6DF] bg-[#FAFAFA] p-4 text-center">
            <div className="rounded-xl border border-[#D4AF37] bg-[#FFFFFF] p-2.5 shadow-sm">
              <QrCodeView
                value={`JEC-RYVANTA:${registration.id}|TEAM:${registration.teamName}|EVENT:${registration.eventId}`}
                size={128}
              />
            </div>
            <span className="mt-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[#767676]">
              Gate Scanner QR
            </span>
            <span className="font-mono text-[10px] text-[#1C1C1C] font-bold mt-0.5">
              19-09-2026
            </span>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 border-t-2 border-[#EAE6DF] pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#767676]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#1C1C1C] font-semibold">
              <CalendarIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
              19 Sep 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#1C1C1C] font-semibold">
              <ClockIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
              08:30 AM IST
            </span>
          </div>
          <span>Jaya Engineering College · Carry physical college ID cards to campus.</span>
        </div>
      </div>
    </div>
  );
}
