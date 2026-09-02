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
      className={`student-pass-root relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#081026] via-[#040816] to-[#02040b] p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-white ${
        isModal ? 'max-w-2xl w-full mx-auto' : ''
      }`}
    >
      {/* Decorative top ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-cyan-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <IdCardIcon className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-black tracking-[0.25em] text-cyan-400 uppercase">
                RYVANTA '26
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                <SparklesIcon className="h-2.5 w-2.5" />
                OFFICIAL HOLOGRAPHIC PASS
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
              {registration.eventName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
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
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-950/40 p-4 shadow-inner">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Participation ID / Squad Pass
              </span>
              <div className="font-display text-2xl sm:text-3xl font-black tracking-[0.15em] text-white">
                {registration.id}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyId()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-white"
            >
              {copiedId ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-mono">Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Squad and College Information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Squad Name</span>
              <p className="mt-0.5 font-bold text-white truncate">{registration.teamName}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Venue &amp; Hall</span>
              <p className="mt-0.5 font-bold text-cyan-400 truncate">{event.venue}</p>
            </div>
            {registration.institution && (
              <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Institution</span>
                  <p className="font-medium text-slate-200 truncate">{registration.institution}</p>
                </div>
              </div>
            )}
            {(registration.track || registration.domain) && (
              <div className="col-span-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 flex items-center gap-2">
                <CpuIcon className="h-4 w-4 text-purple-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-300 block">Challenge Track</span>
                  <p className="font-semibold text-white truncate">{registration.track || registration.domain}</p>
                </div>
              </div>
            )}
          </div>

          {/* Individual Student Pass IDs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <UsersIcon className="h-3.5 w-3.5 text-cyan-400" />
                <span>Squad Members &amp; Digital Badges</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400">{memberStudentIds.length} Members</span>
            </div>
            <div className="space-y-2">
              {memberStudentIds.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-950/80 px-3 py-2 text-xs border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-400/20 text-[10px] font-bold text-cyan-300 font-mono">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-white truncate">{member.name}</span>
                    <span className="text-[10px] text-slate-500">({member.role})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-300 shrink-0 ml-2">
                    {member.studentId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-tech Verification QR Code */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-[#060c1c] p-5 text-center shadow-lg">
          <div className="relative rounded-xl bg-white p-3 shadow-xl ring-2 ring-cyan-400/40">
            <QrCodeView
              value={qrVerificationPayload}
              size={145}
              darkColor="#030712"
              lightColor="#ffffff"
              label={`Verification QR for ${registration.id}`}
            />
          </div>

          <div className="mt-3.5">
            <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300">
              GATE PASS QR
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Scan at reception desk on 19 Sep 2026
            </p>
          </div>

          <div className="mt-3 w-full">
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-400">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Verified Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar with Printable & Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-500/20 pt-5 print:hidden">
        <div className="text-xs text-slate-400 font-mono">
          <span>Date: <strong className="text-white">19 Sep 2026</strong></span> · <span>Reporting: <strong className="text-cyan-400">08:30 AM</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400 hover:text-slate-950"
          >
            <PrinterIcon className="h-4 w-4" />
            <span>Print Pass / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
