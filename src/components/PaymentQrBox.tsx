import React from 'react';
import {
  ExternalLinkIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
  LockIcon,
  ZapIcon
} from 'lucide-react';
import { QrCodeView } from './QrCodeView';

interface PaymentQrBoxProps {
  upiId?: string;
  payeeName?: string;
  feeAmount: number;
  eventName: string;
  teamName?: string;
  hideQrCode?: boolean;
}

export function PaymentQrBox({
  upiId = 'alangaram1985@okicici',
  payeeName = 'Alangaram Selvaraj',
  feeAmount,
  eventName,
  teamName,
  hideQrCode = false
}: PaymentQrBoxProps) {
  // Construct standard UPI payment URI (encrypted in QR code and direct deep links)
  const note = `RYVANTA ${eventName.slice(0, 12)}${teamName ? ` - ${teamName.slice(0, 10)}` : ''}`;
  const baseUpiParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${feeAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generic and App-specific deep links
  const genericUpiUri = `upi://pay?${baseUpiParams}`;
  const gpayUri = `gpay://upi/pay?${baseUpiParams}`;
  const phonepeUri = `phonepe://pay?${baseUpiParams}`;
  const paytmUri = `paytmmp://pay?${baseUpiParams}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-7 shadow-luxury">
      {/* Payee Profile Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0EA5E9] font-bold">
            <ShieldCheckIcon className="h-5 w-5 text-[#0EA5E9]" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#000000]">
              Official Challenge Payment Gateway
            </h3>
            <span className="text-xs text-[#64748B]">Automated Instant Verification &amp; ID Generation</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-sky-50/80 border border-[#0EA5E9] px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#0284C7]">
            Fee Amount:
          </span>
          <span className="font-serif text-xl font-black text-[#000000]">
            ₹{feeAmount}
          </span>
        </div>
      </div>

      <div className={`mt-6 grid gap-6 ${hideQrCode ? 'grid-cols-1' : 'md:grid-cols-[220px_minmax(0,1fr)]'} items-start`}>
        {/* QR Code Container (hidden if hideQrCode is true) */}
        {!hideQrCode && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
            <div className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] p-3 shadow-md">
              <QrCodeView value={genericUpiUri} size={168} />
            </div>

            <span className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Scan with any UPI App
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-[#0284C7]">GPay · PhonePe · Paytm · BHIM</span>
          </div>
        )}

        {/* Secure Gateway Channel Details & Deep Links */}
        <div className="space-y-4">
          {/* Secure Channel Card */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#000000]">
                <LockIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                Automated Gateway Channel
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <ZapIcon className="h-3 w-3 text-emerald-600 animate-pulse" />
                Auto-Callback Active
              </span>
            </div>
            <p className="mt-2 text-xs text-[#475569] leading-relaxed">
              Scan the QR code or select your preferred UPI application below. The gateway automatically verifies your transaction upon completion and programmatically issues your official Student ID and Access Pass.
            </p>
          </div>

          {/* Quick Pay Buttons for Mobile */}
          <div>
            <span className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
              Direct App Deep-Links (Mobile Only)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={gpayUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-xs font-semibold text-[#000000] hover:border-[#0EA5E9] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                <span>Google Pay</span>
              </a>
              <a
                href={phonepeUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-xs font-semibold text-[#000000] hover:border-[#0EA5E9] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                <span>PhonePe</span>
              </a>
              <a
                href={paytmUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-xs font-semibold text-[#000000] hover:border-[#0EA5E9] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                <span>Paytm</span>
              </a>
              <a
                href={genericUpiUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0EA5E9] bg-gradient-to-r from-sky-50 to-slate-100 p-2.5 text-xs font-bold text-[#000000] hover:bg-sky-100 transition-colors shadow-sm"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                <span>Any UPI App</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentQrBox;
