import React, { useRef, useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
  IdCardIcon,
  PrinterIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  XIcon,
  BuildingIcon,
  CpuIcon
} from 'lucide-react';
import { QrCodeView } from './QrCodeView';
import type { Registration } from '../types/registration';
import { getEvent } from '../data/events';

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
  const [copiedId, setCopiedId] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const event = getEvent(registration.eventId);

  // Generate individual student IDs for each member
  const memberStudentIds = registration.members.map((member, idx) => ({
    name: member,
    studentId: `${registration.id}-${String(idx + 1).padStart(2, '0')}`,
    role: idx === 0 ? 'Team Leader' : `Squad Member #${idx + 1}`
  }));

  // Structured verification payload for desk scanner
  const qrVerificationPayload = JSON.stringify({
    passId: registration.id,
    event: registration.eventName,
    squad: registration.teamName,
    leader: registration.leaderName || registration.members[0],
    institution: registration.institution || 'College',
    track: registration.track || registration.domain,
    members: registration.members,
    status: registration.paymentStatus,
    fee: registration.feeAmount,
    issuedAt: registration.createdAt
  });

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(registration.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // ignore
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div
      ref={cardRef}
      className={`student-pass-root relative overflow-hidden rounded-3xl border border-[#D8D7D5] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury-lg text-[#1A1A1A] ${
        isModal ? 'max-w-2xl w-full mx-auto' : ''
      }`}
    >
      {/* Header bar */}
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E4E2] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D8D7D5] bg-[#F3F1ED] shadow-sm">
            <IdCardIcon className="h-6 w-6 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-black tracking-[0.25em] text-[#C5A059] uppercase">
                RYVANTA '26
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F1ED] border border-[#E5E4E2] px-2.5 py-0.5 text-[10px] font-bold text-[#1A1A1A]">
                <SparklesIcon className="h-2.5 w-2.5 text-[#C5A059]" />
                OFFICIAL ENTRY PASS
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#1A1A1A] mt-0.5">
              {registration.eventName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[#8C8A85] transition-colors hover:bg-[#F3F1ED] hover:text-[#1A1A1A]"
              aria-label="Close pass"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Student Pass Details */}
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_210px] items-start">
        {/* Left Column: Team & Student Metadata */}
        <div className="space-y-4">
          {/* Main Primary Pass ID banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D8D7D5] bg-[#F3F1ED] p-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8A85]">
                Participation ID / Squad Pass
              </span>
              <div className="font-display text-2xl sm:text-3xl font-black tracking-[0.15em] text-[#1A1A1A]">
                {registration.id}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyId()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D7D5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#E5E4E2] shadow-sm"
            >
              {copiedId ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Squad and College Information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8C8A85]">Squad Name</span>
              <p className="mt-0.5 font-bold text-[#1A1A1A] truncate">{registration.teamName}</p>
            </div>
            <div className="rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8C8A85]">Venue &amp; Hall</span>
              <p className="mt-0.5 font-bold text-[#C5A059] truncate">{event.venue}</p>
            </div>
            {registration.institution && (
              <div className="col-span-2 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-3 flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-[#C5A059] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] block">Institution</span>
                  <p className="font-semibold text-[#1A1A1A] truncate">{registration.institution}</p>
                </div>
              </div>
            )}
            {(registration.track || registration.domain) && (
              <div className="col-span-2 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] p-3 flex items-center gap-2">
                <CpuIcon className="h-4 w-4 text-[#C5A059] shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8A85] block">Challenge Track</span>
                  <p className="font-bold text-[#1A1A1A] truncate">{registration.track || registration.domain}</p>
                </div>
              </div>
            )}
          </div>

          {/* Individual Student Pass IDs */}
          <div className="rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E4E2]">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                <UsersIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                <span>Squad Members &amp; Digital Badges</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#C5A059]">{memberStudentIds.length} Members</span>
            </div>
            <div className="space-y-2">
              {memberStudentIds.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-[#FFFFFF] px-3 py-2 text-xs border border-[#E5E4E2] shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F3F1ED] text-[10px] font-bold text-[#1A1A1A] font-mono border border-[#E5E4E2]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[#1A1A1A] truncate">{member.name}</span>
                    <span className="text-[10px] text-[#8C8A85]">({member.role})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#C5A059] shrink-0 ml-2">
                    {member.studentId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-contrast Verification QR Code */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E4E2] bg-[#F9F8F6] p-5 text-center shadow-sm">
          <div className="relative rounded-2xl bg-[#FFFFFF] p-3 shadow-md ring-1 ring-[#E5E4E2]">
            <QrCodeView
              value={qrVerificationPayload}
              size={145}
              darkColor="#1A1A1A"
              lightColor="#ffffff"
              label={`Verification QR for ${registration.id}`}
            />
          </div>

          <div className="mt-3.5">
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#1A1A1A]">
              GATE PASS QR
            </span>
            <p className="text-[10px] text-[#8C8A85] mt-0.5">
              Scan at reception desk on 19 Sep 2026
            </p>
          </div>

          <div className="mt-3 w-full">
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
              <span>Verified Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar with Printable & Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E4E2] pt-5 print:hidden">
        <div className="text-xs text-[#4A4A4A] font-mono">
          <span>Date: <strong className="text-[#1A1A1A]">19 Sep 2026</strong></span> · <span>Reporting: <strong className="text-[#C5A059]">08:30 AM</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#2C2C2C] bg-[#2C2C2C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] transition-all hover:bg-[#1A1A1A] shadow-sm"
          >
            <PrinterIcon className="h-4 w-4 text-[#C5A059]" />
            <span>Print Pass / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
