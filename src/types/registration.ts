export type EventId = 'hackathon' | 'games2d' | 'ctf' | 'egames' | 'elaris';

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface SquadMember {
  name: string;
  email?: string;
  phone?: string;
  rollNo?: string;
  department?: string;
  role?: string;
}

export interface RegistrationInput {
  eventId: EventId;
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string;
  institution: string;
  track: string;
  members: string[];
  memberDetails?: SquadMember[];
  email: string;
  phone: string;
  department?: string;
  domain?: string;
  upiRef?: string;
  paymentScreenshot?: string;
  termsAccepted: boolean;
  paymentStatus?: PaymentStatus;
}

export interface Registration extends RegistrationInput {
  /** Server-assigned identifier, e.g. TIH001 */
  id: string;
  eventName: string;
  eventCode: string;
  memberCount: number;
  feeAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  upiRef?: string;
  paymentScreenshot?: string;
}

export interface ApiError {
  message: string;
  field?: keyof RegistrationInput;
}

/** Organizer-controlled settings, edited from the admin panel. */
export interface EventSettings {
  /** The UPI address teams pay the registration fee to. */
  upiId: string;
  /** Display name shown beside the UPI address. */
  payeeName: string;
  /** Optional Bank account number for direct IMPS/NEFT transfers. */
  accountNumber?: string;
  /** Bank IFSC code. */
  ifscCode?: string;
  /** Bank Name. */
  bankName?: string;
  /** Branch Name. */
  branchName?: string;
}

/** Domains already claimed, keyed by event id. */
export type TakenDomains = Record<string, string[]>;