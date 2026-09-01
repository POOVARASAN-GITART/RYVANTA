import React, { useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ZapIcon
} from 'lucide-react';
import paymentQrImg from '../assets/payment_qr.jpeg';

interface PaymentQrBoxProps {
  upiId: string;
  payeeName: string;
  feeAmount: number;
  eventName: string;
  teamName?: string;
}

export function PaymentQrBox({
  upiId,
  payeeName,
  feeAmount,
  eventName,
  teamName
}: PaymentQrBoxProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Construct standard UPI payment URI
  const note = `RYVANTA ${eventName.slice(0, 12)}${teamName ? ` - ${teamName.slice(0, 10)}` : ''}`;
  const baseUpiParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName || 'RYVANTA Event'
  )}&am=${feeAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generic and App-specific deep links
  const genericUpiUri = `upi://pay?${baseUpiParams}`;
  const gpayUri = `gpay://upi/pay?${baseUpiParams}`;
  const phonepeUri = `phonepe://pay?${baseUpiParams}`;
  const paytmUri = `paytmmp://pay?${baseUpiParams}`;

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // ignore clipboard error
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-gunmetal/60 p-5 sm:p-7 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-line text-metallic">
              <QrCodeIcon className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-highlight tracking-wide">
              Scan QR Code or Pay via App
            </h3>
          </div>
          <p className="mt-1 text-xs text-metallic">
            Pay ₹{feeAmount} directly using Google Pay, PhonePe, Paytm, or BHIM.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-right shadow-inner">
          <span className="text-[10px] uppercase font-bold tracking-wider text-metallic">Registration Fee:</span>
          <span className="font-display text-xl font-black text-highlight">₹{feeAmount}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[210px_1fr] items-center">
        {/* Prominent QR Code container */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative rounded-xl bg-white p-2.5 shadow-lg border border-line">
            <img
              src={paymentQrImg}
              alt="UPI Payment QR Code"
              className="h-[175px] w-[175px] object-contain rounded-md"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-metallic">
            <ZapIcon className="h-3 w-3" />
            <span>Scan with Any App</span>
          </div>
        </div>

        {/* UPI Details & 1-Click App Triggers */}
        <div className="space-y-4 w-full">
          {/* Official UPI ID box with 1-click Copy */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface/40 px-4 py-3">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-metallic">
                Official UPI ID
              </span>
              <span className="font-mono text-sm font-bold text-highlight select-all">
                {upiId}
              </span>
              {payeeName && (
                <span className="block text-[11px] text-metallic/70 mt-0.5">
                  Payee: {payeeName}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => void copyToClipboard(upiId)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-gunmetal px-3 py-2 text-xs font-semibold text-metallic transition-all hover:border-highlight hover:text-white"
              title="Copy UPI ID"
            >
              {copiedUpi ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Mobile App Buttons (GPay, PhonePe, Paytm, All UPI) */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-metallic">
              Direct Mobile Payment Links:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={gpayUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-2 text-xs font-semibold text-highlight transition-all hover:bg-surface hover:text-white"
              >
                <span className="font-display font-bold">GPay</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-50" />
              </a>

              <a
                href={phonepeUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-2 text-xs font-semibold text-highlight transition-all hover:bg-surface hover:text-white"
              >
                <span className="font-display font-bold">PhonePe</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-50" />
              </a>

              <a
                href={paytmUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-2 text-xs font-semibold text-highlight transition-all hover:bg-surface hover:text-white"
              >
                <span className="font-display font-bold">Paytm</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-50" />
              </a>

              <a
                href={genericUpiUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-2 text-xs font-semibold text-highlight transition-all hover:bg-surface hover:text-white"
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                <span className="font-display font-bold">BHIM</span>
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/40 p-3 text-[11px] text-metallic">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
            <p>
              Scan the QR or click your preferred UPI app button above. Once the transaction completes, enter your details below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
