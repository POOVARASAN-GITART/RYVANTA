import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SparklesIcon,
  UsersIcon,
  UserCheckIcon,
  ShieldCheckIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  LayersIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckIcon
} from 'lucide-react';
import {
  CHALLENGE_TRACKS,
  DEPARTMENTS,
  DEPARTMENT_DOMAINS,
  HACKATHON_RULES,
  REGISTRATION_FEE,
  getEvent
} from '../data/events';
import {
  ApiRequestError,
  checkEmailExists
} from '../services/registrationApi';
import { PaymentGateway } from '../services/paymentGateway';
import type {
  EventId,
  Registration,
  RegistrationInput,
  SquadMember
} from '../types/registration';
import { PaymentQrBox } from './PaymentQrBox';

interface RegistrationFormProps {
  eventId: EventId;
  upiId?: string;
  payeeName?: string;
  takenDomains: string[];
  onRegistered: (registration: Registration) => void;
  submit: (input: RegistrationInput) => Promise<Registration>;
}

type WizardStep = 'step1_squad' | 'step2_members' | 'step3_terms' | 'step4_review' | 'step5_payment';

export function RegistrationForm({
  eventId,
  upiId = 'alangaram1985@okicici',
  payeeName = 'Alangaram Selvaraj',
  takenDomains,
  onRegistered,
  submit
}: RegistrationFormProps) {
  const event = getEvent(eventId);

  const [currentStep, setCurrentStep] = useState<WizardStep>('step1_squad');

  // Step 1: Squad & Leader State
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [track, setTrack] = useState('');
  const [department, setDepartment] = useState('');

  // Step 2: Squad Members State
  const [memberCount, setMemberCount] = useState<number>(event.memberCounts[0] || 3);
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>(() =>
    Array.from({ length: (event.memberCounts[0] || 3) - 1 }, () => ({
      name: '',
      email: '',
      phone: '',
      department: '',
      rollNo: ''
    }))
  );

  // Step 3: Terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 5: Payment
  const [upiRef, setUpiRef] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | undefined>(undefined);

  // Form Status
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatusText, setVerificationStatusText] = useState('');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState<ApiRequestError | Error | null>(null);

  // Reset/Re-sync when event changes
  useEffect(() => {
    const defaultCount = event.memberCounts[0] || 3;
    setMemberCount(defaultCount);
    setSquadMembers(
      Array.from({ length: defaultCount - 1 }, () => ({
        name: '',
        email: '',
        phone: '',
        department: '',
        rollNo: ''
      }))
    );
    setError(null);
    setCurrentStep('step1_squad');
  }, [event]);

  // Adjust squad members array when count changes
  function handleMemberCountChange(newTotalCount: number) {
    setMemberCount(newTotalCount);
    const extraCount = Math.max(0, newTotalCount - 1);
    setSquadMembers((prev) => {
      const updated = Array.from({ length: extraCount }, (_, i) => {
        return (
          prev[i] || {
            name: '',
            email: '',
            phone: '',
            department: '',
            rollNo: ''
          }
        );
      });
      return updated;
    });
  }

  function updateSquadMember(index: number, patch: Partial<SquadMember>) {
    setSquadMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  }

  // Live Email Duplicate Check
  async function handleLeaderEmailBlur() {
    if (!leaderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(leaderEmail.trim())) {
      return;
    }
    setIsCheckingEmail(true);
    try {
      const exists = await checkEmailExists(leaderEmail.trim());
      if (exists) {
        setEmailWarning(`The email "${leaderEmail.trim()}" is already registered. Only one entry is allowed per email address.`);
      } else {
        setEmailWarning(null);
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingEmail(false);
    }
  }

  const tracksAvailable = event.trackList || (event.requiresDepartment ? (DEPARTMENT_DOMAINS[department] || []) : event.domains) || CHALLENGE_TRACKS;
  const takenSet = new Set(takenDomains.map((val) => val.toLowerCase()));
  const isTrackTaken = (opt: string) => takenSet.has(opt.toLowerCase());

  // Step 1 Validation
  function validateStep1(): boolean {
    if (teamName.trim().length < 3) {
      setError(new ApiRequestError('Squad/Team name must have at least 3 characters.', 'teamName'));
      return false;
    }
    if (leaderName.trim().length < 2) {
      setError(new ApiRequestError('Leader full name is required.', 'leaderName'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(leaderEmail.trim())) {
      setError(new ApiRequestError('Enter a valid leader email address.', 'email'));
      return false;
    }
    if (emailWarning) {
      setError(new ApiRequestError(emailWarning, 'email'));
      return false;
    }
    if (!/^[0-9+\s-]{10,15}$/.test(leaderPhone.trim())) {
      setError(new ApiRequestError('Enter a valid 10-digit WhatsApp contact number.', 'phone'));
      return false;
    }
    if (institution.trim().length < 2) {
      setError(new ApiRequestError('College / Institution name is required.', 'institution'));
      return false;
    }
    if (!track) {
      setError(new ApiRequestError('Please select a Challenge Track / Problem Statement.', 'domain'));
      return false;
    }
    if (isTrackTaken(track)) {
      setError(new ApiRequestError(`Challenge track "${track}" has already been claimed by another team.`, 'domain'));
      return false;
    }
    setError(null);
    return true;
  }

  // Step 2 Validation
  function validateStep2(): boolean {
    for (let i = 0; i < squadMembers.length; i++) {
      const m = squadMembers[i];
      if (m.name.trim().length < 2) {
        setError(new ApiRequestError(`Member #${i + 2} requires a valid full name.`, 'members'));
        return false;
      }
      if (m.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) {
        setError(new ApiRequestError(`Member #${i + 2} has an invalid email format.`, 'members'));
        return false;
      }
    }
    setError(null);
    return true;
  }

  // Step 3 Validation
  function validateStep3(): boolean {
    if (!termsAccepted) {
      setError(new ApiRequestError('You must review and accept the official Hackathon terms & code of conduct.'));
      return false;
    }
    setError(null);
    return true;
  }

  function handleGoToStep2(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep('step2_members');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  function handleGoToStep3(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep('step3_terms');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  function handleGoToStep4(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep3()) {
      setCurrentStep('step4_review');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }

  function handleGoToStep5(e: React.FormEvent) {
    e.preventDefault();
    setCurrentStep('step5_payment');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  // Final Submit & Automated Verification
  async function handleFinalSubmission() {
    if (isSubmitting) return;

    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const allMemberNames = [leaderName.trim(), ...squadMembers.map((m) => m.name.trim())];
    const fullMemberDetails: SquadMember[] = [
      {
        name: leaderName.trim(),
        email: leaderEmail.trim(),
        phone: leaderPhone.trim(),
        department: department || 'Leader',
        role: 'Team Leader'
      },
      ...squadMembers.map((m, idx) => ({
        name: m.name.trim(),
        email: m.email?.trim() || '',
        phone: m.phone?.trim() || '',
        department: m.department?.trim() || '',
        rollNo: m.rollNo?.trim() || '',
        role: `Squad Member #${idx + 2}`
      }))
    ];

    await PaymentGateway.verifyAutomatedPayment({
      teamName,
      eventName: event.fullName,
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
            teamName: teamName.trim(),
            leaderName: leaderName.trim(),
            leaderEmail: leaderEmail.trim(),
            leaderPhone: leaderPhone.trim(),
            institution: institution.trim(),
            track: track.trim(),
            members: allMemberNames,
            memberDetails: fullMemberDetails,
            email: leaderEmail.trim(),
            phone: leaderPhone.trim(),
            department: department || '',
            domain: track.trim(),
            upiRef: upiRef.trim() || paymentDetails.transactionId,
            paymentScreenshot,
            termsAccepted,
            paymentStatus: 'verified'
          });

          onRegistered(record);
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError
              : new Error('Submission encountered an error. Please try again.')
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

  // Stepper Definition
  const stepsList = [
    { id: 'step1_squad', num: '01', title: 'Squad Identity' },
    { id: 'step2_members', num: '02', title: 'Squad Members' },
    { id: 'step3_terms', num: '03', title: 'Terms & Rules' },
    { id: 'step4_review', num: '04', title: 'Review Details' },
    { id: 'step5_payment', num: '05', title: 'Payment & Pass' }
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-8">
      {/* 5-Step Stepper Header */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E4E2] bg-[#F3F1ED] p-4 sm:p-6 shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E4E2] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                5-Step Registration Protocol
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-black uppercase text-[#1A1A1A] tracking-wide">
              {event.fullName}
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C8A85]">
            <span>STEP {currentStepIndex + 1} OF 5</span>
            <span className="text-[#C5A059] font-bold">({Math.round(((currentStepIndex + 1) / 5) * 100)}%)</span>
          </div>
        </div>

        {/* Stepper Progress Bar & Badges */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {stepsList.map((step, idx) => {
            const isPassed = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;
            return (
              <div
                key={step.id}
                className={`relative flex items-center gap-2.5 rounded-xl border p-2.5 transition-all ${
                  isCurrent
                    ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-md'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800'
                    : 'border-[#E5E4E2] bg-[#FFFFFF] text-[#8C8A85]'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#C5A059] text-white'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F3F1ED] text-[#8C8A85]'
                  }`}
                >
                  {isPassed ? <CheckIcon className="h-3.5 w-3.5" /> : step.num}
                </div>
                <span className="line-clamp-1 font-display text-[11px] font-bold">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm">
          <AlertTriangleIcon className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-bold block text-red-900">Validation Notice:</span>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 01: SQUAD IDENTITY & TEAM LEADER DETAILS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step1_squad' && (
        <form onSubmit={handleGoToStep2} className="space-y-6 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E5E4E2] pb-3">
            <h3 className="font-display text-lg font-bold text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-[#C5A059]" />
              <span>Step 01: Squad Identity &amp; Team Leader</span>
            </h3>
            <p className="mt-1 text-xs text-[#4A4A4A]">
              Enter your squad name, university details, and the primary team leader contact.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Squad / Team Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Squad / Team Name <span className="text-[#C5A059]">*</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. ApexInnovators, NeuralVanguard"
                className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
              />
            </div>

            {/* Institution / College Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                College / University Name <span className="text-[#C5A059]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. SRM Institute, Anna University, IIT"
                  className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] pl-10 pr-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
                />
                <BuildingIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8C8A85]" />
              </div>
            </div>

            {/* Leader Full Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Team Leader Full Name <span className="text-[#C5A059]">*</span>
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="e.g. Poovarasasn A"
                className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
              />
            </div>

            {/* Leader WhatsApp Phone */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Leader WhatsApp Phone <span className="text-[#C5A059]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] pl-10 pr-4 py-3 font-mono text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
                />
                <PhoneIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8C8A85]" />
              </div>
            </div>

            {/* Leader Email Address (with One-Time Unique Constraint) */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Leader Email Address <span className="text-[#C5A059]">*</span>
                </label>
                {isCheckingEmail && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#C5A059] font-mono font-semibold">
                    <Loader2Icon className="h-3 w-3 animate-spin" />
                    Checking email...
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={leaderEmail}
                  onChange={(e) => {
                    setLeaderEmail(e.target.value);
                    if (emailWarning) setEmailWarning(null);
                  }}
                  onBlur={handleLeaderEmailBlur}
                  placeholder="e.g. leader@college.edu"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:outline-none ${
                    emailWarning
                      ? 'border-red-500 bg-red-50/60 focus:border-red-500'
                      : 'border-[#E5E4E2] bg-[#F9F8F6] focus:border-[#2C2C2C] focus:bg-[#FFFFFF]'
                  }`}
                />
                <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8C8A85]" />
              </div>
              {emailWarning ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
                  <span>{emailWarning}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-[#8C8A85]">
                  Strict One-Time Email: Each participant email can only register once.
                </p>
              )}
            </div>

            {/* Department (if applicable) */}
            {event.requiresDepartment && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Department / Branch <span className="text-[#C5A059]">*</span>
                </label>
                <select
                  required
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setTrack('');
                  }}
                  className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
                >
                  <option value="">Select your department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Challenge Track / Problem Statement Selection */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Challenge Track / Problem Statement <span className="text-[#C5A059]">*</span>
              </label>
              <select
                required
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
              >
                <option value="">Select an innovation track to build in...</option>
                {tracksAvailable.map((t) => {
                  const taken = isTrackTaken(t);
                  return (
                    <option key={t} value={t} disabled={taken}>
                      {t} {taken ? '(Claimed by another squad)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-[#E5E4E2]">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-luxury hover:bg-[#1A1A1A] transition-all"
            >
              <span>Next: Squad Members</span>
              <ArrowRightIcon className="h-4 w-4 text-[#C5A059]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 02: SQUAD MEMBERS DETAILS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step2_members' && (
        <form onSubmit={handleGoToStep3} className="space-y-6 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E4E2] pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
                <UserCheckIcon className="h-5 w-5 text-[#C5A059]" />
                <span>Step 02: Squad Members Breakdown</span>
              </h3>
              <p className="mt-1 text-xs text-[#4A4A4A]">
                Leader is registered as Member #1. Configure additional squad members below.
              </p>
            </div>

            {/* Member Count Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8C8A85] uppercase">Squad Size:</span>
              <div className="inline-flex rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-1">
                {event.memberCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleMemberCountChange(count)}
                    className={`rounded-lg px-3.5 py-1 font-mono text-xs font-bold transition-all ${
                      memberCount === count
                        ? 'bg-[#2C2C2C] text-white shadow-sm'
                        : 'text-[#4A4A4A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {count} Members
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Member 1: Leader (Preview) */}
          <div className="rounded-xl border border-[#D8D7D5] bg-[#F9F8F6] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2C2C2C] text-white font-mono text-xs font-bold">
                  01
                </span>
                <span className="font-display text-sm font-bold text-[#1A1A1A]">
                  {leaderName || 'Team Leader'} (Leader)
                </span>
              </div>
              <span className="font-mono text-xs text-[#C5A059] font-bold">{leaderEmail}</span>
            </div>
          </div>

          {/* Additional Squad Members Input Cards */}
          <div className="space-y-4">
            {squadMembers.map((member, index) => {
              const memberNum = index + 2;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-4 sm:p-5 transition-all hover:border-[#D8D7D5]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFFFFF] border border-[#E5E4E2] font-mono text-[10px] text-[#4A4A4A]">
                        {memberNum.toString().padStart(2, '0')}
                      </span>
                      <span>Squad Member #{memberNum}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8C8A85]">Student Identity</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#4A4A4A]">
                        Full Name <span className="text-[#C5A059]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => updateSquadMember(index, { name: e.target.value })}
                        placeholder={`Member #${memberNum} Full Name`}
                        className="w-full rounded-lg border border-[#E5E4E2] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#4A4A4A]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => updateSquadMember(index, { email: e.target.value })}
                        placeholder="student@college.edu"
                        className="w-full rounded-lg border border-[#E5E4E2] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:outline-none"
                      />
                    </div>

                    {/* Department / Roll No */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#4A4A4A]">
                        Roll No. / Department
                      </label>
                      <input
                        type="text"
                        value={member.rollNo || member.department || ''}
                        onChange={(e) =>
                          updateSquadMember(index, {
                            rollNo: e.target.value,
                            department: e.target.value
                          })
                        }
                        placeholder="e.g. 21CS045 / CSE"
                        className="w-full rounded-lg border border-[#E5E4E2] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E4E2]">
            <button
              type="button"
              onClick={() => setCurrentStep('step1_squad')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-4 py-2.5 text-xs font-semibold text-[#4A4A4A] hover:bg-[#E5E4E2] hover:text-[#1A1A1A]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Squad Identity</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-luxury hover:bg-[#1A1A1A]"
            >
              <span>Next: Terms &amp; Rules</span>
              <ArrowRightIcon className="h-4 w-4 text-[#C5A059]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 03: TERMS & CONDITIONS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step3_terms' && (
        <form onSubmit={handleGoToStep4} className="space-y-6 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E5E4E2] pb-3">
            <h3 className="font-display text-lg font-bold text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-[#C5A059]" />
              <span>Step 03: Terms &amp; Code of Conduct</span>
            </h3>
            <p className="mt-1 text-xs text-[#4A4A4A]">
              Please review and agree to the official RYVANTA Hackathon &amp; Innovation Challenge rules.
            </p>
          </div>

          {/* Rules List Box */}
          <div className="space-y-3 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-4 sm:p-6 text-xs text-[#4A4A4A] max-h-72 overflow-y-auto">
            {HACKATHON_RULES.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2Icon className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-3 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] p-4 cursor-pointer hover:bg-[#E5E4E2]/60 transition-colors">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-[#D8D7D5] text-[#2C2C2C] focus:ring-[#C5A059] mt-0.5"
            />
            <div className="text-xs text-[#4A4A4A]">
              <span className="font-bold block text-[#1A1A1A]">Declaration &amp; Agreement</span>
              <span>
                I hereby declare that all provided squad details are accurate and all squad members agree to follow the RYVANTA Hackathon rules, originality policies, and campus code of conduct.
              </span>
            </div>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E4E2]">
            <button
              type="button"
              onClick={() => setCurrentStep('step2_members')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-4 py-2.5 text-xs font-semibold text-[#4A4A4A] hover:bg-[#E5E4E2] hover:text-[#1A1A1A]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Members</span>
            </button>
            <button
              type="submit"
              disabled={!termsAccepted}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-luxury hover:bg-[#1A1A1A] disabled:opacity-50"
            >
              <span>Next: Review Details</span>
              <ArrowRightIcon className="h-4 w-4 text-[#C5A059]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 04: REVIEW DETAILS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step4_review' && (
        <div className="space-y-6 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E5E4E2] pb-3">
            <h3 className="font-display text-lg font-bold text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
              <LayersIcon className="h-5 w-5 text-[#C5A059]" />
              <span>Step 04: Review Registration Summary</span>
            </h3>
            <p className="mt-1 text-xs text-[#4A4A4A]">
              Double-check your squad information before proceeding to the final payment gate.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Squad Info */}
            <div className="rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C8A85]">
                Squad Identity
              </span>
              <div className="font-display text-base font-bold text-[#1A1A1A]">{teamName}</div>
              <div className="text-xs text-[#4A4A4A]">{institution}</div>
              <div className="mt-2 rounded-lg bg-[#FFFFFF] border border-[#E5E4E2] p-2 text-xs font-mono text-[#C5A059] font-bold">
                Track: {track}
              </div>
            </div>

            {/* Leader Info */}
            <div className="rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C8A85]">
                Team Leader Contact
              </span>
              <div className="font-display text-base font-bold text-[#1A1A1A]">{leaderName}</div>
              <div className="text-xs font-mono text-[#4A4A4A]">{leaderEmail}</div>
              <div className="text-xs font-mono text-[#8C8A85]">WhatsApp: {leaderPhone}</div>
            </div>

            {/* Squad Members */}
            <div className="sm:col-span-2 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C8A85]">
                  All Squad Participants ({memberCount} Members)
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep('step2_members')}
                  className="text-xs font-bold text-[#C5A059] hover:underline"
                >
                  Edit Members
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {/* Leader */}
                <div className="rounded-lg border border-[#D8D7D5] bg-[#FFFFFF] p-3 text-xs">
                  <span className="font-bold text-[#1A1A1A] block">{leaderName} (Leader)</span>
                  <span className="text-[11px] font-mono text-[#8C8A85]">{leaderEmail}</span>
                </div>

                {/* Other members */}
                {squadMembers.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-[#E5E4E2] bg-[#FFFFFF] p-3 text-xs">
                    <span className="font-bold text-[#1A1A1A] block">
                      {m.name || `Member #${idx + 2}`}
                    </span>
                    <span className="text-[11px] font-mono text-[#8C8A85]">
                      {m.email || 'Participant'} {m.rollNo ? `(${m.rollNo})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Summary */}
            <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] p-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block">
                  Total Registration Fee
                </span>
                <span className="text-[11px] text-[#4A4A4A]">
                  Flat entry fee for the entire squad
                </span>
              </div>
              <div className="font-display text-2xl font-black text-[#1A1A1A]">
                ₹{REGISTRATION_FEE}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E4E2]">
            <button
              type="button"
              onClick={() => setCurrentStep('step3_terms')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-4 py-2.5 text-xs font-semibold text-[#4A4A4A] hover:bg-[#E5E4E2] hover:text-[#1A1A1A]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Terms</span>
            </button>
            <button
              type="button"
              onClick={handleGoToStep5}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-luxury hover:bg-[#1A1A1A]"
            >
              <span>Proceed to Payment</span>
              <ArrowRightIcon className="h-4 w-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 05: PAYMENT & FINAL SUBMISSION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step5_payment' && (
        <div className="space-y-6">
          {/* Official Payment Box */}
          <PaymentQrBox
            upiId={upiId}
            payeeName={payeeName}
            feeAmount={REGISTRATION_FEE}
            eventName={event.fullName}
            teamName={teamName}
            upiRef={upiRef}
            onUpiRefChange={setUpiRef}
            paymentScreenshot={paymentScreenshot}
            onScreenshotChange={setPaymentScreenshot}
          />

          {/* Live Automated Verification Progress Bar */}
          <div className="space-y-3 rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-5 text-xs shadow-luxury">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin text-[#C5A059]" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                )}
                <span className="font-semibold text-[#1A1A1A]">
                  {isSubmitting
                    ? verificationStatusText
                    : 'Awaiting Payment: Scan QR above or Pay via UPI App'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#C5A059]">
                {isSubmitting ? `${verificationProgress}%` : 'READY'}
              </span>
            </div>

            {isSubmitting && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E4E2]">
                <div
                  className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-500 transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Final Submission Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('step4_review')}
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-[#D8D7D5] bg-[#F3F1ED] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] hover:bg-[#E5E4E2] hover:text-[#1A1A1A] disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Review Details</span>
            </button>

            <button
              type="button"
              onClick={() => void handleFinalSubmission()}
              disabled={isSubmitting}
              className="inline-flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-[#2C2C2C] px-6 py-4 text-xs font-black uppercase tracking-wider text-[#F9F8F6] shadow-luxury transition-all hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin text-[#C5A059]" />
                  <span>{verificationStatusText || 'Verifying Transaction...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="h-5 w-5 text-[#C5A059]" />
                  <span>I Have Completed Payment — Generate Student Pass</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}