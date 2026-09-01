import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  Loader2Icon,
  ShieldCheckIcon,
  SparklesIcon
} from 'lucide-react';

import {
  DEPARTMENTS,
  DEPARTMENT_DOMAINS,
  REGISTRATION_FEE,
  getEvent
} from '../data/events';
import { ApiRequestError } from '../services/registrationApi';
import { PaymentGateway } from '../services/paymentGateway';
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

  const [memberCount, setMemberCount] = useState(event.memberCounts[0]);
  const [members, setMembers] = useState<string[]>(() =>
    Array.from({ length: event.memberCounts[0] }, () => '')
  );
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [domain, setDomain] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatusText, setVerificationStatusText] = useState('');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState<ApiRequestError | Error | null>(null);

  useEffect(() => {
    const nextCount = event.memberCounts[0];
    setMemberCount(nextCount);
    setMembers(Array.from({ length: nextCount }, () => ''));
    setDepartment('');
    setDomain('');
    setError(null);
    setStep('details');
  }, [event]);

  function handleMemberCountChange(next: number) {
    setMemberCount(next);
    setMembers((current) =>
      Array.from({ length: next }, (_, index) => current[index] ?? '')
    );
  }

  const domainOptions = event.requiresDepartment
    ? DEPARTMENT_DOMAINS[department] ?? []
    : event.domains ?? [];

  const takenSet = new Set(takenDomains.map((value) => value.toLowerCase()));
  const isTaken = (option: string) => takenSet.has(option.toLowerCase());
  const availableCount = domainOptions.filter((option) => !isTaken(option)).length;

  const errorField = error instanceof ApiRequestError ? error.field : undefined;

  function validateDetails(): boolean {
    if (teamName.trim().length < 3) {
      setError(new ApiRequestError('Team name needs at least 3 characters.', 'teamName'));
      return false;
    }
    if (members.some((name) => name.trim().length < 2)) {
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
    if (event.requiresDepartment && !department) {
      setError(new ApiRequestError('Select your department.', 'department'));
      return false;
    }
    if ((event.requiresDepartment || event.domains) && !domain) {
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

    setIsSubmitting(true);
    setError(null);

    await PaymentGateway.verifyAutomatedPayment({
      teamName,
      eventName: event.name,
      amount: REGISTRATION_FEE,
      upiId,
      payeeName,
      onProgress: (status, percent) => {
        setVerificationStatusText(status);
        setVerificationProgress(percent);
      },
      onSuccess: async (paymentDetails) => {
        try {
          const record = await submit({
            eventId,
            teamName,
            members,
            email,
            phone,
            department: event.requiresDepartment ? department : '',
            domain,
            paymentStatus: 'verified',
            upiRef: paymentDetails.transactionId
          });

          setTeamName('');
          setMembers(Array.from({ length: memberCount }, () => ''));
          setEmail('');
          setPhone('');
          setDepartment('');
          setDomain('');
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
          setVerificationProgress(0);
        }
      },
      onError: (err) => {
        setError(err);
        setIsSubmitting(false);
        setVerificationStatusText('');
        setVerificationProgress(0);
      }
    });
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
          {event.venue} · {event.memberCounts.join(' or ')} members · ₹
          {REGISTRATION_FEE} per team
        </p>
      </div>

      {step === 'details' ? (
        /* STEP 1: Registration Form Details */
        <form onSubmit={handleProceedToPayment} className="space-y-6" noValidate>
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
                Team size
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

          <fieldset className="rounded-xl border border-line bg-gunmetal/60 p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wider text-metallic">
              Member names
            </legend>
            <div className="mt-2 space-y-2.5">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs text-metallic">
                    No. {index + 1}
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

          {(event.requiresDepartment || event.domains) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {event.requiresDepartment && (
                <div>
                  <label className={LABEL_CLASS} htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    className={FIELD_CLASS}
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setDomain('');
                    }}
                    aria-invalid={errorField === 'department'}
                  >
                    <option value="">Choose department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className={event.requiresDepartment ? '' : 'sm:col-span-2'}>
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
                  disabled={event.requiresDepartment && !department}
                  aria-invalid={errorField === 'domain'}
                  aria-describedby="domain-hint"
                >
                  <option value="">
                    {event.requiresDepartment && !department
                      ? 'Select a department first'
                      : 'Choose domain'}
                  </option>
                  {domainOptions.map((option) => (
                    <option key={option} value={option} disabled={isTaken(option)}>
                      {option}
                      {isTaken(option) ? ' — already claimed' : ''}
                    </option>
                  ))}
                </select>
                <p id="domain-hint" className="mt-1.5 text-xs text-metallic">
                  {availableCount === 0 && domainOptions.length > 0
                    ? 'Every domain here is taken. Try another department or event.'
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
            <span>Proceed to Payment · ₹{REGISTRATION_FEE}</span>
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
                  {teamName} ({members.length} Members)
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-metallic">
                  Payable Fee:
                </span>
                <p className="font-display text-lg font-black text-accent">
                  ₹{REGISTRATION_FEE}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-metallic">
              <span>
                Lead: <strong className="text-highlight">{members[0]}</strong>
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
            feeAmount={REGISTRATION_FEE}
            eventName={event.name}
            teamName={teamName}
          />

          {/* Live Transaction Status bar */}
          <div className="space-y-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
                <span className="font-medium text-highlight">
                  {isSubmitting
                    ? verificationStatusText
                    : 'Awaiting payment: scan the QR above or pay via GPay / PhonePe / Paytm'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent font-bold">
                {isSubmitting ? `${verificationProgress}%` : 'READY'}
              </span>
            </div>

            {isSubmitting && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gunmetal">
                <div
                  className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-300 ease-out"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            )}
          </div>

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
                  <span>I Have Completed Payment — Generate Student ID</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}