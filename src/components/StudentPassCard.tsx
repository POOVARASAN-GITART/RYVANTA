import React, { useRef, useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  IdCardIcon,
  PrinterIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCheckIcon,
  UsersIcon,
  XIcon
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
    role: idx === 0 ? 'Team Lead' : `Member ${idx + 1}`
  }));

  // Structured verification payload for desk scanner
  const qrVerificationPayload = JSON.stringify({
    passId: registration.id,
    event: registration.eventName,
    team: registration.teamName,
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
      // ignore clipboard error
    }
  }

  function handlePrint() {
    window.print();
  }

  const isVerified = registration.paymentStatus === 'verified';

  return (
    <div
      ref={cardRef}
      className={`student-pass-root relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-[#0d1322] via-[#090d18] to-[#05070d] p-6 sm:p-8 shadow-2xl text-highlight ${
        isModal ? 'max-w-2xl w-full mx-auto' : ''
      }`}
    >
      {/* Decorative top ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-line/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 shadow-inner">
            <IdCardIcon className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-extrabold tracking-[0.25em] text-accent uppercase">
                RYVANTA '26
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
                <SparklesIcon className="h-2.5 w-2.5" />
                OFFICIAL PASS
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              {registration.eventName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-metallic transition-colors hover:bg-surface hover:text-white"
              aria-label="Close pass"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Student Pass Details */}
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_210px] items-center">
        {/* Left Column: Team & Student Metadata */}
        <div className="space-y-5">
          {/* Main Primary Pass ID banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-metallic">
                Participation ID / Team Pass
              </span>
              <div className="font-display text-2xl sm:text-3xl font-black tracking-[0.15em] text-highlight">
                {registration.id}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyId()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-3 py-1.5 text-xs font-semibold text-metallic transition-colors hover:border-accent hover:text-white"
            >
              {copiedId ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Team and domain information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-line bg-surface/40 p-3">
              <span className="text-[10px] uppercase tracking-wider text-metallic">Team Name</span>
              <p className="mt-0.5 font-bold text-white truncate">{registration.teamName}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface/40 p-3">
              <span className="text-[10px] uppercase tracking-wider text-metallic">Venue & Hall</span>
              <p className="mt-0.5 font-bold text-accent truncate">{event.venue}</p>
            </div>
            {registration.department && (
              <div className="rounded-xl border border-line bg-surface/40 p-3">
                <span className="text-[10px] uppercase tracking-wider text-metallic">Department</span>
                <p className="mt-0.5 font-medium text-metallic-100 truncate">{registration.department}</p>
              </div>
            )}
            {registration.domain && (
              <div className="rounded-xl border border-line bg-surface/40 p-3">
                <span className="text-[10px] uppercase tracking-wider text-metallic">Domain / Theme</span>
                <p className="mt-0.5 font-medium text-metallic-100 truncate">{registration.domain}</p>
              </div>
            )}
          </div>

          {/* Individual Student Pass IDs */}
          <div className="rounded-2xl border border-line bg-surface/60 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/60">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-metallic">
                <UsersIcon className="h-3.5 w-3.5 text-accent" />
                Team Members & Student Pass IDs
              </span>
              <span className="text-[11px] text-metallic">{memberStudentIds.length} Members</span>
            </div>
            <div className="space-y-2">
              {memberStudentIds.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-gunmetal/70 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-white truncate">{member.name}</span>
                    <span className="text-[10px] text-metallic/70">({member.role})</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-accent shrink-0 ml-2">
                    {member.studentId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: High-tech Verification QR Code */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface/80 p-5 text-center shadow-lg">
          <div className="relative rounded-xl bg-white p-3 shadow-xl ring-2 ring-accent/30">
            <QrCodeView
              value={qrVerificationPayload}
              size={150}
              darkColor="#0b0f19"
              lightColor="#ffffff"
              label={`Verification QR for ${registration.id}`}
            />
          </div>

          <div className="mt-3.5">
            <span className="font-mono text-[11px] font-bold tracking-wider text-highlight">
              GATE PASS QR
            </span>
            <p className="text-[10px] text-metallic mt-0.5">
              Scan at venue entrance for check-in & badges
            </p>
          </div>

          {/* Payment badge status */}
          <div className="mt-3 w-full">
            {isVerified ? (
              <div className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Payment Verified</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 px-2.5 py-1.5 text-xs font-semibold text-amber-300">
                <ShieldAlertIcon className="h-4 w-4" />
                <span>Payment Under Review</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bar with Printable & Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 pt-5 print:hidden">
        <div className="text-xs text-metallic">
          <span>Event Date: <strong>19 September 2026</strong></span> · <span>Reporting: <strong>08:30 AM</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wider text-highlight transition-colors hover:border-highlight hover:bg-gunmetal"
          >
            <PrinterIcon className="h-4 w-4 text-accent" />
            <span>Print Pass / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
