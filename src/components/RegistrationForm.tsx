import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
  UsersIcon,
  UserCheckIcon,
  ShieldCheckIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  LayersIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckIcon,
  Gamepad2Icon,
  TerminalIcon,
  SparklesIcon,
  TrophyIcon,
  FlameIcon,
  CameraIcon,
  ClockIcon,
  MapPinIcon
} from 'lucide-react';
import {
  HACKATHON_DEPARTMENTS,
  HACKATHON_DEPARTMENT_DOMAINS,
  GAMES_2D_SCORING_MATRIX,
  CTF_FORMAT_DETAILS,
  REGISTRATION_FEE,
  getEvent
} from '../data/events';
import {
  ApiRequestError,
  checkEmailExists
} from '../services/registrationApi';
import { PaymentGateway } from '../services/paymentGateway';
import { playPortalLoginSound } from '../services/portalSound';
import type {
  RegistrationRecord,
  Registration,
  RegistrationInput,
  SquadMember
} from '../types/registration';
import { PaymentQrBox } from './PaymentQrBox';

interface RegistrationFormProps {
  eventId: EventId;
  onEventChange?: (id: EventId) => void;
  upiId?: string;
  payeeName?: string;
  takenDomains: string[];
  onRegistered: (registration: Registration) => void;
  submit: (input: RegistrationInput) => Promise<Registration>;
}

type WizardStep = 'step1_squad' | 'step2_members' | 'step3_terms' | 'step4_review' | 'step5_payment';

const EVENT_CATEGORY_CARDS: {
  id: EventId;
  name: string;
  codeBadge: string;
  teamSizeLabel: string;
  venue: string;
  icon: typeof TrophyIcon;
  colorClass: string;
  desc: string;
}[] = [
  {
    id: 'hackathon',
    name: "Hackathon '26",
    codeBadge: 'TICH###',
    teamSizeLabel: '3–4 Members',
    venue: 'Auditorium',
    icon: TrophyIcon,
    colorClass: 'text-[#0EA5E9]',
    desc: 'Multi-Department Flagship Engineering Sprint'
  },
  {
    id: '2d-games',
    name: "2D Games (SOZO '26)",
    codeBadge: 'TID###',
    teamSizeLabel: '2–3 Members',
    venue: 'IT Lab',
    icon: Gamepad2Icon,
    colorClass: 'text-[#2563EB]',
    desc: 'Game Design & 100-Mark Scoring Matrix'
  },
  {
    id: 'ctf',
    name: "Capture The Flag (NEXVORA '26)",
    codeBadge: 'TIC###',
    teamSizeLabel: '2–3 Members',
    venue: 'FOSS Lab',
    icon: TerminalIcon,
    colorClass: 'text-[#0284C7]',
    desc: '2 Rounds · Cybersecurity Offensive Challenge'
  },
  {
    id: 'egames',
    name: "E-Games (Free Fire)",
    codeBadge: 'TIE###',
    teamSizeLabel: '4 Players',
    venue: 'Network Lab',
    icon: FlameIcon,
    colorClass: 'text-[#0EA5E9]',
    desc: 'E-Sports Showdown · Mobile Squad Battle Royale'
  }
];

export function RegistrationForm({
  eventId: initialEventId,
  onEventChange,
  upiId = 'alangaram1985@okicici',
  payeeName = 'Alangaram Selvaraj',
  takenDomains,
  onRegistered,
  submit
}: RegistrationFormProps) {
  const [selectedEventId, setSelectedEventId] = useState<EventId>(initialEventId);
  const event = getEvent(selectedEventId);

  const [currentStep, setCurrentStep] = useState<WizardStep>('step1_squad');

  // Step 1: Team & Leader Details
  const [teamName, setTeamName] = useState('');
  const [institution, setInstitution] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');

  // Step 2: Department, Domain & Team Members
  const [department, setDepartment] = useState('');
  const [domain, setDomain] = useState('');
  const [memberCount, setMemberCount] = useState<number>(event.minMembers);
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>(() =>
    Array.from({ length: event.minMembers - 1 }, () => ({
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

  // Live status
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatusText, setVerificationStatusText] = useState('');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [error, setError] = useState<ApiRequestError | Error | null>(null);

  useEffect(() => {
    setSelectedEventId(initialEventId);
  }, [initialEventId]);

  function handleSelectCategory(newId: EventId) {
    setSelectedEventId(newId);
    if (onEventChange) onEventChange(newId);

    const targetEvent = getEvent(newId);
    setMemberCount(targetEvent.minMembers);
    setSquadMembers(
      Array.from({ length: targetEvent.minMembers - 1 }, () => ({
        name: '',
        email: '',
        phone: '',
        department: '',
        rollNo: ''
      }))
    );
    setDepartment('');
    setDomain('');
    setError(null);
  }

  function handleMemberCountChange(newTotalCount: number) {
    if (newTotalCount < event.minMembers || newTotalCount > event.maxMembers) return;
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

  async function handleLeaderEmailBlur() {
    if (!leaderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(leaderEmail.trim())) {
      return;
    }
    setIsCheckingEmail(true);
    try {
      const exists = await checkEmailExists(leaderEmail.trim());
      if (exists) {
        setEmailWarning(`The email "${leaderEmail.trim()}" is already registered. Only one team per email.`);
      } else {
        setEmailWarning(null);
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingEmail(false);
    }
  }

  const availableDomains = (() => {
    if (selectedEventId === 'hackathon') {
      return department ? HACKATHON_DEPARTMENT_DOMAINS[department] || [] : [];
    }
    return event.domains || [];
  })();

  const takenSet = new Set(takenDomains.map((val) => val.toLowerCase()));
  const isDomainTaken = (opt: string) => takenSet.has(opt.toLowerCase());

  function validateStep1(): boolean {
    if (teamName.trim().length < 3) {
      setError(new ApiRequestError('Team Name is required (minimum 3 characters).', 'teamName'));
      return false;
    }
    if (institution.trim().length < 2) {
      setError(new ApiRequestError('College / University name is required.', 'institution'));
      return false;
    }
    if (leaderName.trim().length < 2) {
      setError(new ApiRequestError('Team Leader full name is required.', 'leaderName'));
      return false;
    }
    const cleanPhone = leaderPhone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError(new ApiRequestError('Enter a valid 10-digit primary mobile number starting with 6, 7, 8, or 9.', 'phone'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(leaderEmail.trim())) {
      setError(new ApiRequestError('Enter a valid email address for the team leader.', 'email'));
      return false;
    }
    if (emailWarning) {
      setError(new ApiRequestError(emailWarning, 'email'));
      return false;
    }
    if (!selectedEventId) {
      setError(new ApiRequestError('Please select one of the competition categories below.'));
      return false;
    }

    setError(null);
    return true;
  }

  function validateStep2(): boolean {
    if (event.requiresDepartment && !department) {
      setError(new ApiRequestError('Please select your Engineering Department.', 'department'));
      return false;
    }
    if (!domain) {
      setError(new ApiRequestError('Please select a domain / challenge problem statement.', 'domain'));
      return false;
    }
    if (isDomainTaken(domain)) {
      setError(new ApiRequestError(`The domain "${domain}" has already been claimed. Please pick another.`, 'domain'));
      return false;
    }

    if (memberCount < event.minMembers || memberCount > event.maxMembers) {
      setError(new ApiRequestError(`${event.name} requires between ${event.minMembers} and ${event.maxMembers} members.`, 'members'));
      return false;
    }

    for (let i = 0; i < squadMembers.length; i++) {
      const m = squadMembers[i];
      if (m.name.trim().length < 2) {
        setError(new ApiRequestError(`Team Member #${i + 2} requires a valid full name.`, 'members'));
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

  function validateStep3(): boolean {
    if (!termsAccepted) {
      setError(new ApiRequestError('You must accept the official rules and code of conduct.'));
      return false;
    }
    setError(null);
    return true;
  }

  function handleGoToStep2(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep('step2_members');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function handleGoToStep3(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep('step3_terms');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function handleGoToStep4(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep3()) {
      setCurrentStep('step4_review');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function handleGoToStep5(e: React.FormEvent) {
    e.preventDefault();
    setCurrentStep('step5_payment');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  async function handleFinalSubmission() {
    if (isSubmitting) return;

    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    // Check payment received proof (12-digit UTR or screenshot receipt)
    const isUtrProvided = upiRef.trim().length >= 8;
    const isReceiptProvided = Boolean(paymentScreenshot);

    if (!isUtrProvided && !isReceiptProvided) {
      setError(
        new Error(
          'Payment authentication proof required: Please enter your 12-digit UPI UTR reference number or attach your payment receipt screenshot to verify that payment has been received before generating your Student ID.'
        )
      );
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
        role: 'Team Lead'
      },
      ...squadMembers.map((m, idx) => ({
        name: m.name.trim(),
        email: m.email?.trim() || '',
        phone: m.phone?.trim() || '',
        department: m.department?.trim() || '',
        rollNo: m.rollNo?.trim() || '',
        role: `Member #${idx + 2}`
      }))
    ];

    const totalMembersCount = 1 + squadMembers.length;
    const totalFeeAmount = totalMembersCount * REGISTRATION_FEE;

    await PaymentGateway.initiatePayment({
      teamName: teamName.trim(),
      eventName: event.fullName,
      amount: totalFeeAmount,
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: leaderPhone.trim(),
      upiId,
      payeeName,
      onProgress: (status, percent) => {
        setVerificationStatusText(status);
        setVerificationProgress(percent);
      },
      onSuccess: async (paymentDetails) => {
        try {
          const record = await submit({
            eventId: selectedEventId,
            teamName: teamName.trim(),
            leaderName: leaderName.trim(),
            leaderEmail: leaderEmail.trim(),
            leaderPhone: leaderPhone.trim(),
            institution: institution.trim(),
            track: domain.trim(),
            members: allMemberNames,
            memberDetails: fullMemberDetails,
            email: leaderEmail.trim(),
            phone: leaderPhone.trim(),
            department: department || '',
            domain: domain.trim(),
            upiRef: upiRef.trim() || paymentDetails.transactionId,
            paymentScreenshot,
            feeAmount: totalFeeAmount,
            termsAccepted,
            paymentStatus: 'verified'
          });

          // Play rewarding confirmation sound upon verified ID generation
          playPortalLoginSound();
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

  const stepsList = [
    { id: 'step1_squad', num: '01', title: 'Team Identity' },
    { id: 'step2_members', num: '02', title: 'Members & Domain' },
    { id: 'step3_terms', num: '03', title: 'Terms & Code' },
    { id: 'step4_review', num: '04', title: 'Review Details' },
    { id: 'step5_payment', num: '05', title: 'Payment & ID' }
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-8">
      {/* 5-Step Stepper Header */}
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-6 shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#0EA5E9] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0284C7]">
                Format ID: TI{event.code}1001
              </span>
            </div>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#000000]">
              {event.fullName}
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B]">
            <span>STEP {currentStepIndex + 1} OF 5</span>
            <span className="text-[#0EA5E9] font-bold">({Math.round(((currentStepIndex + 1) / 5) * 100)}%)</span>
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
                    ? 'border-[#0EA5E9] bg-[#000000] text-white shadow-md'
                    : isPassed
                    ? 'border-sky-200 bg-sky-50/80 text-sky-900'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#0EA5E9] text-white'
                      : isPassed
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#64748B]'
                  }`}
                >
                  {isPassed ? <CheckIcon className="h-3.5 w-3.5" /> : step.num}
                </div>
                <span className="line-clamp-1 font-serif text-[11px] font-bold">
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
      {/* STEP 01: TEAM IDENTITY & 5 COMPETITION CATEGORIES */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step1_squad' && (
        <form onSubmit={handleGoToStep2} className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#000000] flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-[#0EA5E9]" />
              <span>Step 01: Team Identity &amp; Mandatory Contact Fields</span>
            </h3>
            <p className="mt-1 text-xs text-[#475569]">
              Provide your official team name, institution, 10-digit primary contact details, and choose your event category.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Team Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#000000]">
                Team Name <span className="text-[#0EA5E9]">*</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. ApexInnovators, CyberKnights"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none shadow-sm"
              />
            </div>

            {/* College / University Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#000000]">
                College / University Name <span className="text-[#0EA5E9]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. SRM Institute, Anna University, MIT"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 py-3 text-sm text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none shadow-sm"
                />
                <BuildingIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              </div>
            </div>

            {/* Team Leader Full Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#000000]">
                Team Leader Full Name <span className="text-[#0EA5E9]">*</span>
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="e.g. John"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none shadow-sm"
              />
            </div>

            {/* Primary Mobile Number (10-Digit Validation) */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#000000]">
                Primary Mobile Number <span className="text-[#0EA5E9]">* (10-digit number)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 py-3 font-mono text-sm text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none shadow-sm"
                />
                <PhoneIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              </div>
              <p className="mt-1 text-[11px] text-[#64748B]">
                SMS updates and participation ID confirmation will be sent here.
              </p>
            </div>

            {/* Team Leader Email ID */}
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#000000]">
                  Team Leader Email ID <span className="text-[#0EA5E9]">*</span>
                </label>
                {isCheckingEmail && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#0EA5E9] font-mono font-bold">
                    <Loader2Icon className="h-3 w-3 animate-spin" />
                    Checking availability...
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
                  placeholder="e.g. teamleader@college.edu"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm text-[#000000] placeholder:text-[#64748B] focus:outline-none shadow-sm ${
                    emailWarning
                      ? 'border-red-500 bg-red-50/60 focus:border-red-500'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] focus:border-[#0EA5E9] focus:bg-[#FFFFFF]'
                  }`}
                />
                <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              </div>
              {emailWarning ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
                  <span>{emailWarning}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-[#64748B]">
                  Strict validation: Only one team registration is permitted per participant email.
                </p>
              )}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* THE 5 COMPETITION CATEGORIES (BELOW TEAM LEADER EMAIL ID) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-[#000000]">
                Select Competition Category ({EVENT_CATEGORY_CARDS.length} Technical Arenas) <span className="text-[#0EA5E9]">*</span>
              </label>
              <span className="text-[11px] font-mono text-[#0284C7] font-bold">
                ₹{REGISTRATION_FEE} per person
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {EVENT_CATEGORY_CARDS.map((cat) => {
                const isSelected = selectedEventId === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-2 border-[#0EA5E9] bg-[#000000] text-[#FFFFFF] shadow-luxury scale-[1.02] ring-2 ring-[#0EA5E9]/30'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#000000] hover:border-[#0EA5E9]/60 hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA5E9] text-white font-bold shadow-sm">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                            isSelected
                              ? 'bg-[#0EA5E9] text-[#FFFFFF]'
                              : 'bg-[#FFFFFF] border border-[#CBD5E1] ' + cat.colorClass
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isSelected ? 'text-[#38BDF8]' : 'text-[#0284C7]'
                          }`}
                        >
                          {cat.codeBadge}
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-bold leading-snug">
                        {cat.name}
                      </h4>
                      <p
                        className={`text-[11px] mt-1 line-clamp-2 ${
                          isSelected ? 'text-slate-300' : 'text-[#475569]'
                        }`}
                      >
                        {cat.desc}
                      </p>
                    </div>

                    <div
                      className={`mt-3.5 flex items-center justify-between border-t pt-2.5 text-[10px] font-mono ${
                        isSelected ? 'border-slate-800 text-slate-300' : 'border-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      <span>{cat.teamSizeLabel}</span>
                      <span className="font-bold text-[#0EA5E9]">{cat.venue}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury hover:bg-[#0284C7] hover:shadow-blue-glow transition-all"
            >
              <span>Next: Team Members &amp; Domains</span>
              <ArrowRightIcon className="h-4 w-4 text-[#E0F2FE]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 02: DOMAIN SELECTION & TEAM MEMBERS ROSTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step2_members' && (
        <form onSubmit={handleGoToStep3} className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#000000] flex items-center gap-2">
              <UserCheckIcon className="h-5 w-5 text-[#0EA5E9]" />
              <span>Step 02: Domain Selection &amp; Team Members Roster</span>
            </h3>
            <p className="mt-1 text-xs text-[#475569]">
              Select your problem statement / track and register all team members ({event.minMembers} to {event.maxMembers} members for {event.name}).
            </p>
          </div>

          {/* Section A: Domain Selection */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 space-y-4">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#000000] block">
              1. Choose Problem Statement / Domain for {event.name}
            </span>

            {/* If Hackathon: Dynamic Department Selector */}
            {event.requiresDepartment && (
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                  Engineering Department <span className="text-[#0EA5E9]">*</span>
                </label>
                <select
                  required
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDomain('');
                  }}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 text-xs text-[#000000] focus:border-[#0EA5E9] focus:outline-none shadow-sm"
                >
                  <option value="">Select your Engineering Department...</option>
                  {HACKATHON_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-[#64748B]">
                  Selecting department dynamically loads eligible problem statements below.
                </p>
              </div>
            )}

            {/* Dynamic Domain Dropdown */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                {event.requiresDepartment ? 'Department-Specific Problem Domain' : 'Challenge Track / Domain'}{' '}
                <span className="text-[#0EA5E9]">*</span>
              </label>
              <select
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={event.requiresDepartment && !department}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 text-xs text-[#000000] focus:border-[#0EA5E9] focus:outline-none disabled:bg-[#F1F5F9] disabled:cursor-not-allowed shadow-sm"
              >
                <option value="">
                  {event.requiresDepartment && !department
                    ? '— Please select your department above first —'
                    : 'Select domain / problem statement...'}
                </option>
                {availableDomains.map((d) => {
                  const taken = isDomainTaken(d);
                  return (
                    <option key={d} value={d} disabled={taken}>
                      {d} {taken ? '(Claimed by another team)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Event Specific Criteria Banners */}
            {event.scoringMatrix && (
              <div className="mt-3 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-3 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#000000]">
                  <Gamepad2Icon className="h-4 w-4 text-[#0EA5E9]" />
                  <span>2D Games Official Scoring Criteria Matrix (100 Marks)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                  {GAMES_2D_SCORING_MATRIX.map((c, i) => (
                    <div key={i} className="rounded bg-[#F8FAFC] border border-[#E2E8F0] p-2">
                      <span className="font-bold text-[#000000] block">{c.category}</span>
                      <span className="font-mono text-[#0284C7] font-bold">{c.marks} Marks</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.formatDetails && (
              <div className="mt-3 rounded-lg border border-[#0EA5E9]/40 bg-[#FFFFFF] p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#000000]">
                  <TerminalIcon className="h-4 w-4 text-[#0EA5E9]" />
                  <span>Capture The Flag Challenge Protocol</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#475569]">
                  {CTF_FORMAT_DETAILS.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-[#0EA5E9] font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEventId === 'egames' && (
              <div className="mt-3 rounded-lg border border-[#0EA5E9]/40 bg-[#FFFFFF] p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#000000]">
                  <FlameIcon className="h-4 w-4 text-[#0EA5E9]" />
                  <span>E-Sports Free Fire Battle Royale Protocol</span>
                </div>
                <p className="text-[11px] text-[#475569]">
                  Squads play in Network Lab with mobile devices. Team consists of 4 main players plus 1 optional substitute.
                </p>
              </div>
            )}


          </div>

          {/* Section B: Team Members Names */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#000000]">
                2. Team Members Names Roster
              </span>

              {/* Team Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">Team Size:</span>
                <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                  {event.memberCounts.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleMemberCountChange(count)}
                      className={`rounded-lg px-3.5 py-1 font-mono text-xs font-bold transition-all ${
                        memberCount === count
                          ? 'bg-[#000000] text-[#FFFFFF] shadow-sm'
                          : 'text-[#475569] hover:text-[#000000]'
                      }`}
                    >
                      {count} {selectedEventId === 'egames' && count === 5 ? 'Members (4 + 1 Sub)' : 'Members'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Member 1: Leader (Preview) */}
            <div className="rounded-xl border border-[#0EA5E9]/40 bg-[#F8FAFC] p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0EA5E9] text-white font-mono text-xs font-bold">
                    01
                  </span>
                  <span className="font-serif text-sm font-bold text-[#000000]">
                    {leaderName || 'Team Leader'} (Team Lead)
                  </span>
                </div>
                <span className="font-mono text-xs text-[#0284C7] font-bold">{leaderEmail}</span>
              </div>
            </div>

            {/* Dynamic Members List */}
            {squadMembers.map((member, index) => {
              const memberNum = index + 2;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5 transition-all hover:border-[#0EA5E9]/60"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wider text-[#000000]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-[10px] text-[#475569]">
                        {memberNum.toString().padStart(2, '0')}
                      </span>
                      <span>Team Member #{memberNum}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Student Identity
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Full Name */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                        Full Name <span className="text-[#0EA5E9]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => updateSquadMember(index, { name: e.target.value })}
                        placeholder={`Member #${memberNum} Full Name`}
                        className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => updateSquadMember(index, { email: e.target.value })}
                        placeholder="student@college.edu"
                        className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:outline-none"
                      />
                    </div>

                    {/* Department / Roll No */}
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
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
                        className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setCurrentStep('step1_squad')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#FFFFFF] hover:text-[#000000]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Team Identity</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury hover:bg-[#0284C7] hover:shadow-blue-glow"
            >
              <span>Next: Terms &amp; Rules</span>
              <ArrowRightIcon className="h-4 w-4 text-[#E0F2FE]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 03: TERMS & CODE OF CONDUCT */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step3_terms' && (
        <form onSubmit={handleGoToStep4} className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#000000] flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-[#0EA5E9]" />
              <span>Step 03: Event Rules &amp; Code of Conduct</span>
            </h3>
            <p className="mt-1 text-xs text-[#475569]">
              Please review and accept the official rules for {event.fullName}.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-6 text-xs text-[#475569]">
            {(event.rules || [
              'All squad members must carry valid college identity cards on the event day (19 Sep 2026).',
              'All projects and solutions must be developed fresh on-site.',
              'Jury scoring decisions are final and binding.'
            ]).map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2Icon className="h-4 w-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-[#0EA5E9]/40 bg-[#F8FAFC] p-4 cursor-pointer hover:bg-[#FFFFFF] transition-colors">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-[#E2E8F0] text-[#0EA5E9] focus:ring-[#0EA5E9] mt-0.5"
            />
            <div className="text-xs text-[#475569]">
              <span className="font-bold block text-[#000000]">Team Declaration &amp; Acceptance</span>
              <span>
                I hereby declare that all provided team details are accurate and all participants agree to follow the RYVANTA '26 rules and campus regulations.
              </span>
            </div>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setCurrentStep('step2_members')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#FFFFFF] hover:text-[#000000]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Members</span>
            </button>
            <button
              type="submit"
              disabled={!termsAccepted}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury hover:bg-[#0284C7] hover:shadow-blue-glow disabled:opacity-50"
            >
              <span>Next: Review Details</span>
              <ArrowRightIcon className="h-4 w-4 text-[#E0F2FE]" />
            </button>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 04: REVIEW DETAILS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step4_review' && (
        <div className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-luxury">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#000000] flex items-center gap-2">
              <LayersIcon className="h-5 w-5 text-[#0EA5E9]" />
              <span>Step 04: Review Registration Summary</span>
            </h3>
            <p className="mt-1 text-xs text-[#475569]">
              Verify your team information before proceeding to generate the participation ID.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                Event &amp; Domain
              </span>
              <div className="font-serif text-base font-bold text-[#000000]">{event.fullName}</div>
              <div className="text-xs text-[#475569]">{institution}</div>
              {department && <div className="text-xs text-[#475569]">Dept: {department}</div>}
              <div className="mt-2 rounded-lg bg-[#FFFFFF] border border-[#CBD5E1] p-2 text-xs font-mono text-[#0284C7] font-bold">
                Domain: {domain}
              </div>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                Team &amp; Leader Contact
              </span>
              <div className="font-serif text-base font-bold text-[#000000]">{teamName}</div>
              <div className="text-xs text-[#475569]">Lead: {leaderName}</div>
              <div className="text-xs font-mono text-[#475569]">{leaderEmail}</div>
              <div className="text-xs font-mono text-[#64748B]">Mobile: +91 {leaderPhone}</div>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#64748B]">
                  Team Roster ({memberCount} Members)
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep('step2_members')}
                  className="text-xs font-bold text-[#0EA5E9] hover:underline"
                >
                  Edit Members
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-[#0EA5E9]/40 bg-[#FFFFFF] p-3 text-xs">
                  <span className="font-bold text-[#000000] block">{leaderName} (Team Lead)</span>
                  <span className="text-[11px] font-mono text-[#64748B]">{leaderEmail}</span>
                </div>

                {squadMembers.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-xs">
                    <span className="font-bold text-[#000000] block">
                      {m.name || `Member #${idx + 2}`}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      {m.email || 'Participant'} {m.rollNo ? `(${m.rollNo})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-[#0EA5E9] bg-sky-50 p-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#000000] block">
                  Registration Fee (₹{REGISTRATION_FEE} / person)
                </span>
                <span className="text-[11px] text-[#475569]">
                  ₹{REGISTRATION_FEE} × {1 + squadMembers.length} participants ({leaderName.trim() || 'Leader'} + {squadMembers.length} squad member{squadMembers.length !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="font-serif text-2xl font-black text-[#000000]">
                ₹{(1 + squadMembers.length) * REGISTRATION_FEE}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setCurrentStep('step3_terms')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#475569] hover:bg-[#FFFFFF] hover:text-[#000000]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>Back: Terms</span>
            </button>
            <button
              type="button"
              onClick={handleGoToStep5}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-luxury hover:bg-[#0284C7] hover:shadow-blue-glow"
            >
              <span>Proceed to Payment</span>
              <ArrowRightIcon className="h-4 w-4 text-[#E0F2FE]" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 05: AUTOMATED PAYMENT AUTHENTICATION & STUDENT ID ISSUANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {currentStep === 'step5_payment' && (
        <div className="space-y-6">
          <PaymentQrBox
            upiId={upiId}
            payeeName={payeeName}
            feeAmount={(1 + squadMembers.length) * REGISTRATION_FEE}
            eventName={event.fullName}
            teamName={teamName}
            upiRef={upiRef}
            onUpiRefChange={setUpiRef}
            paymentScreenshot={paymentScreenshot}
            onScreenshotChange={setPaymentScreenshot}
            hideQrCode={Boolean(event.hideQrCode)}
          />

          <div className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 text-xs shadow-luxury">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin text-[#0EA5E9]" />
                ) : (
                  <div className={`h-2.5 w-2.5 rounded-full ${upiRef.trim().length >= 8 || paymentScreenshot ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                )}
                <span className="font-semibold text-[#000000]">
                  {isSubmitting
                    ? verificationStatusText
                    : upiRef.trim().length >= 8 || paymentScreenshot
                    ? 'Payment Proof Received: Ready for Verification'
                    : 'Awaiting Payment Proof: Enter 12-digit UTR or attach screenshot to verify payment received'}
                </span>
              </div>
              <span className={`font-mono text-xs font-bold ${upiRef.trim().length >= 8 || paymentScreenshot ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isSubmitting ? `${verificationProgress}%` : upiRef.trim().length >= 8 || paymentScreenshot ? 'READY' : 'PROOF REQUIRED'}
              </span>
            </div>

            {isSubmitting && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full bg-[#0EA5E9] transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('step4_review')}
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#475569] hover:bg-[#FFFFFF] hover:text-[#000000] disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Review Details</span>
            </button>

            <button
              type="button"
              onClick={() => void handleFinalSubmission()}
              disabled={isSubmitting || (!upiRef.trim() && !paymentScreenshot)}
              className="inline-flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-4 text-xs font-black uppercase tracking-wider text-[#FFFFFF] shadow-luxury transition-all hover:bg-[#0284C7] hover:shadow-blue-glow disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin text-[#E0F2FE]" />
                  <span>{verificationStatusText || 'Authenticating & Generating ID...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="h-5 w-5 text-[#E0F2FE]" />
                  <span>Authenticate Payment &amp; Generate TI{event.code}1001 ID (₹{(1 + squadMembers.length) * REGISTRATION_FEE})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}