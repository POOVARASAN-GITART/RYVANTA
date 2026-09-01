import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from 'lucide-react';

import {
  YEARS,
  getEvent
} from '../data/events';
import { ApiRequestError } from '../services/registrationApi';
import type { EventId, Registration, RegistrationInput } from '../types/registration';
import { PaymentQrBox } from './PaymentQrBox';

const FIELD_CLASS =
  'w-full rounded-lg border border-line bg-gunmetal px-3 py-2.5 text-sm text-highlight placeholder:text-metallic/50 transition-colors duration-150 ease-smooth focus:border-metallic focus:outline-none';

const LABEL_CLASS =
  'mb-1.5 block text-xs font-medium uppercase tracking-wider text-metallic';

interface RegistrationFormProps {
  eventId: EventId;
  onRegistered: (registration: Registration) => void;
  submit: (input: RegistrationInput) => Promise<Registration>;
  /** Domains already claimed for this event — one team per domain. */
  takenDomains: string[];
  upiId: string;
  payeeName: string;
}

export function RegistrationForm({
  eventId,
  onRegistered,
  submit,
  takenDomains,
  upiId,
  payeeName
}: RegistrationFormProps) {
  const event = useMemo(() => getEvent(eventId), [eventId]);

  const [step, setStep] = useState<'details' | 'payment'>('details');

  const isSoloEvent = event.memberCounts.length === 1 && event.memberCounts[0] === 1;

  // The actual total member count selected by user (leader + members)
  const [memberCount, setMemberCount] = useState(event.memberCounts[0]);
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  // Member array only stores additional members (total - 1)
  const [members, setMembers] = useState<string[]>(() =>
    Array.from({ length: Math.max(0, event.memberCounts[0] - 1) }, () => '')
  );
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [domain, setDomain] = useState('');
  const [participantUpiId, setParticipantUpiId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatusText, setVerificationStatusText] = useState('');
  const [error, setError] = useState<ApiRequestError | Error | null>(null);

  useEffect(() => {
    const nextCount = event.memberCounts[0];
    setMemberCount(nextCount);
    setMembers(Array.from({ length: Math.max(0, nextCount - 1) }, () => ''));
    setCollegeName('');
    setYear('');
    setDomain('');
    setError(null);
    setStep('details');
  }, [event]);

  function handleMemberCountChange(next: number) {
    setMemberCount(next);
    setMembers((current) =>
      Array.from({ length: Math.max(0, next - 1) }, (_, index) => current[index] ?? '')
    );
  }

  const domainOptions = event.domains ?? [];
  const takenSet = new Set(takenDomains.map((value) => value.toLowerCase()));
  const isTaken = (option: string) => takenSet.has(option.toLowerCase());
  const availableCount = domainOptions.filter((option) => !isTaken(option)).length;

  const errorField = error instanceof ApiRequestError ? error.field : undefined;

  function validateDetails(): boolean {
    if (!isSoloEvent && teamName.trim().length < 3) {
      setError(new ApiRequestError('Team name needs at least 3 characters.', 'teamName'));
      return false;
    }
    if (leaderName.trim().length < 2) {
      setError(new ApiRequestError(isSoloEvent ? 'Name must be at least 2 characters.' : 'Leader name must be at least 2 characters.', 'leaderName'));
      return false;
    }
    if (!isSoloEvent && members.some((name) => name.trim().length < 2)) {
      setError(new ApiRequestError('Every member needs a full name.', 'members'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(new ApiRequestError('Enter a reachable email address.', 'email'));
      return false;
    }
    if (!/^[0-9+\s-]{10,15}$/.test(phone.trim())) {
      setError(new ApiRequestError('Enter a valid 10-digit contact number.', 'phone'));
      return false;
    }
    if (!collegeName.trim()) {
      setError(new ApiRequestError('Enter your college name.', 'collegeName'));
      return false;
    }
    if (!year) {
      setError(new ApiRequestError('Select your year of study.', 'year'));
      return false;
    }
    if (domainOptions.length > 0 && !domain) {
      setError(new ApiRequestError('Select a domain to compete in.', 'domain'));
      return false;
    }
    if (domain && isTaken(domain)) {
      setError(
        new ApiRequestError(
          `"${domain}" is already claimed by another team. Please pick another.`,
          'domain'
        )
      );
      return false;
    }
    setError(null);
    return true;
  }

  function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  async function handleConfirmTransaction() {
    if (isSubmitting) return;
    if (!validateDetails()) {
      setStep('details');
      return;
    }

    if (!participantUpiId.trim()) {
      setError(new Error('Please enter your UPI ID used for payment.'));
      return;
    }
    if (!transactionId.trim()) {
      setError(new Error('Please enter the Transaction ID / UTR.'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setVerificationStatusText('Submitting Registration...');

    try {
      const record = await submit({
        eventId,
        teamName: isSoloEvent ? '' : teamName,
        leaderName,
        members,
        email,
        phone,
        collegeName,
        year,
        domain,
        paymentStatus: 'pending',
        upiRef: transactionId,
        participantUpiId
      });

      setTeamName('');
      setLeaderName('');
      setMembers(Array.from({ length: Math.max(0, memberCount - 1) }, () => ''));
      setEmail('');
      setPhone('');
      setCollegeName('');
      setYear('');
      setDomain('');
      setParticipantUpiId('');
      setTransactionId('');
      setStep('details');
      onRegistered(record);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError
          : new Error('Registration creation failed. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
      setVerificationStatusText('');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border-b border-line pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-bold text-highlight">
            {event.fullName}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 'details'
                  ? 'bg-highlight text-gunmetal'
                  : 'bg-surface text-metallic'
              }`}
            >
              1
            </span>
            <span className="text-xs text-metallic">Details</span>
            <span className="text-metallic/40">→</span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 'payment'
                  ? 'bg-highlight text-gunmetal'
                  : 'bg-surface text-metallic'
              }`}
            >
              2
            </span>
            <span className="text-xs text-metallic">Payment & ID</span>
          </div>
        </div>
        <p className="mt-1.5 text-sm text-metallic">
          {event.venue} · {event.memberCounts.join(' or ')} {event.memberCounts.includes(1) && event.memberCounts.length === 1 ? 'person' : 'members'} · ₹
          {event.fee} per {isSoloEvent ? 'person' : 'team'}
        </p>
      </div>

      {step === 'details' ? (
        /* STEP 1: Registration Form Details */
        <form onSubmit={handleProceedToPayment} className="space-y-6" noValidate>
          {!isSoloEvent && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="teamName">
                  Team name
                </label>
                <input
                  id="teamName"
                  className={FIELD_CLASS}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Null Pointers"
                  aria-invalid={errorField === 'teamName'}
                  required
                />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="memberCount">
                  Team size (including leader)
                </label>
                <select
                  id="memberCount"
                  className={FIELD_CLASS}
                  value={memberCount}
                  onChange={(e) => handleMemberCountChange(Number(e.target.value))}
                >
                  {event.memberCounts.map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? 'member' : 'members'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <fieldset className="rounded-xl border border-line bg-gunmetal/60 p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wider text-metallic">
              {isSoloEvent ? 'Participant Details' : 'Team Members'}
            </legend>
            <div className="mt-2 space-y-4">
              <div>
                <label className={LABEL_CLASS} htmlFor="leaderName">
                  {isSoloEvent ? 'Full Name' : 'Team Leader Name'}
                </label>
                <input
                  id="leaderName"
                  className={FIELD_CLASS}
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder={isSoloEvent ? "Your full name" : "Leader's full name"}
                  aria-invalid={errorField === 'leaderName'}
                  required
                />
              </div>
              {members.length > 0 && (
                <div className="space-y-2.5">
                  <span className="block text-xs font-medium uppercase tracking-wider text-metallic">
                    Other Members
                  </span>
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs text-metallic">
                        Member {index + 1}
                      </span>
                      <input
                        className={FIELD_CLASS}
                        value={member}
                        onChange={(e) =>
                          setMembers((current) =>
                            current.map((value, i) => (i === index ? e.target.value : value))
                          )
                        }
                        placeholder={`Full name of member ${index + 1}`}
                        aria-label={`Member ${index + 1} full name`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className={FIELD_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead@college.edu"
                aria-invalid={errorField === 'email'}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="phone">
                Contact phone
              </label>
              <input
                id="phone"
                type="tel"
                className={FIELD_CLASS}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                aria-invalid={errorField === 'phone'}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS} htmlFor="collegeName">
                College Name
              </label>
              <input
                id="collegeName"
                className={FIELD_CLASS}
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Name of your institution"
                aria-invalid={errorField === 'collegeName'}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="year">
                Year of Study
              </label>
              <select
                id="year"
                className={FIELD_CLASS}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                aria-invalid={errorField === 'year'}
                required
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {domainOptions.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-1">
              <div>
                <div className="flex items-baseline justify-between">
                  <label className={LABEL_CLASS} htmlFor="domain">
                    Domain
                  </label>
                  {domainOptions.length > 0 && (
                    <span
                      className={`mb-1.5 text-xs ${
                        availableCount === 0 ? 'text-red-300' : 'text-metallic'
                      }`}
                    >
                      {availableCount} of {domainOptions.length} available
                    </span>
                  )}
                </div>
                <select
                  id="domain"
                  className={FIELD_CLASS}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  aria-invalid={errorField === 'domain'}
                  aria-describedby="domain-hint"
                  required
                >
                  <option value="">Choose domain</option>
                  {domainOptions.map((option) => (
                    <option key={option} value={option} disabled={isTaken(option)}>
                      {option}
                      {isTaken(option) ? ' — already claimed' : ''}
                    </option>
                  ))}
                </select>
                <p id="domain-hint" className="mt-1.5 text-xs text-metallic">
                  {availableCount === 0 && domainOptions.length > 0
                    ? 'Every domain here is taken. Try another event.'
                    : 'One team per domain — claimed domains are locked out.'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {error.message}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white"
          >
            <span>Proceed to Payment · ₹{event.fee}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>
      ) : (
        /* STEP 2: Payment Confirmation & Transaction Gateway */
        <div className="space-y-6">
          {/* Order Summary Recap */}
          <div className="rounded-2xl border border-line bg-gunmetal/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-metallic">
                  Registration Summary
                </span>
                <h4 className="font-display text-base font-bold text-highlight">
                  {!isSoloEvent ? `${teamName} (${members.length + 1} Members)` : leaderName}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-metallic">
                  Payable Fee:
                </span>
                <p className="font-display text-lg font-black text-accent">
                  ₹{event.fee}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-metallic">
              <span>
                {isSoloEvent ? 'Name: ' : 'Lead: '}<strong className="text-highlight">{leaderName}</strong>
              </span>
              <span>
                Email: <strong className="text-highlight">{email}</strong>
              </span>
              {domain && (
                <span>
                  Domain: <strong className="text-highlight">{domain}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Payment QR Code Box */}
          <PaymentQrBox
            upiId={upiId}
            payeeName={payeeName}
            feeAmount={event.fee}
            eventName={event.name}
            teamName={isSoloEvent ? leaderName : teamName}
          />

          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <div>
              <label className={LABEL_CLASS} htmlFor="participantUpiId">
                Your UPI ID (used for payment)
              </label>
              <input
                id="participantUpiId"
                className={FIELD_CLASS}
                value={participantUpiId}
                onChange={(e) => setParticipantUpiId(e.target.value)}
                placeholder="e.g. name@upi"
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="transactionId">
                Transaction ID / UTR
              </label>
              <input
                id="transactionId"
                className={FIELD_CLASS}
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 123456789012"
                required
              />
            </div>
          </div>

          {/* Submission Status bar */}
          {isSubmitting && (
            <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin text-accent" />
                  <span className="font-medium text-highlight">
                    {verificationStatusText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {error.message}
            </p>
          )}

          {/* Transaction Confirmation Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep('details')}
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wider text-metallic transition-colors hover:border-metallic hover:text-highlight disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={() => void handleConfirmTransaction()}
              disabled={isSubmitting}
              className="inline-flex flex-1 w-full items-center justify-center gap-2 rounded-lg bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-gunmetal transition-colors duration-150 ease-smooth hover:bg-white disabled:cursor-not-allowed disabled:bg-metallic/40 disabled:text-gunmetal/60 shadow-lg shadow-highlight/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>{verificationStatusText || 'Verifying Transaction…'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-800" />
                  <span>I Have Completed Payment — Register</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}