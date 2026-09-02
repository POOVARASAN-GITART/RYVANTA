export type EventId = 'hackathon' | '2d-games' | 'ctf';

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface SquadMember {
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  rollNo?: string;
  role?: string;
}

export interface Registration {
  id: string; // e.g. TICH1001, TID1001, TIC1001
  eventId: EventId;
  eventName: string;
  teamName: string;
  leaderName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  institution?: string;
  track?: string;
  members: string[];
  memberDetails?: SquadMember[];
  email: string;
  phone: string;
  department?: string;
  domain?: string;
  memberCount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: 'upi' | 'desk' | 'cash';
  feeAmount: number;
  upiRef?: string;
  paymentScreenshot?: string;
  termsAccepted?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  eventId: EventId;
  teamName: string;
  leaderName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  institution?: string;
  track?: string;
  members: string[];
  memberDetails?: SquadMember[];
  email: string;
  phone: string;
  department?: string;
  domain?: string;
  upiRef?: string;
  paymentScreenshot?: string;
  termsAccepted?: boolean;
  paymentStatus?: PaymentStatus;
}

export interface EventSettings {
  upiId: string;
  payeeName: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
}

export type TakenDomains = Record<string, string[]>;