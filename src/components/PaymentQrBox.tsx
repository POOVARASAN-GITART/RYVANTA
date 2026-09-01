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
import { QrCodeView } from './QrCodeView';

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
    <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-[#0f1422] via-[#0b0f19] to-[#070a12] p-5 sm:p-7 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 border border-accent/40 text-accent">
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
          <div className="relative rounded-2xl bg-white p-3.5 shadow-2xl ring-4 ring-accent/30 transition-transform duration-200 hover:scale-[1.02]">
            <QrCodeView
              value={genericUpiUri}
              size={175}
              darkColor="#080c14"
              lightColor="#ffffff"
              label="UPI Payment QR Code"
            />
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
            <ZapIcon className="h-3 w-3" />
            <span>Scan with Any App</span>
          </div>
        </div>

        {/* UPI Details & 1-Click App Triggers */}
        <div className="space-y-4 w-full">
          {/* Official UPI ID box with 1-click Copy */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface/90 px-4 py-3 shadow-inner">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-metallic">
                Official UPI ID
              </span>
              <span className="font-mono text-sm font-bold text-highlight select-all">
                {upiId}
              </span>
              {payeeName && (
                <span className="block text-[11px] text-metallic/80 mt-0.5">
                  Payee: {payeeName}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => void copyToClipboard(upiId)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-gunmetal px-3 py-2 text-xs font-semibold text-highlight transition-all hover:border-accent hover:bg-surface"
              title="Copy UPI ID"
            >
              {copiedUpi ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5 text-accent" />
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
              {/* Google Pay */}
              <a
                href={gpayUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#4285F4]/40 bg-[#4285F4]/15 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#4285F4] hover:text-white shadow-sm"
              >
                <span className="font-display font-bold">GPay</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-70" />
              </a>

              {/* PhonePe */}
              <a
                href={phonepeUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#5f259f]/50 bg-[#5f259f]/20 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#5f259f] hover:text-white shadow-sm"
              >
                <span className="font-display font-bold">PhonePe</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-70" />
              </a>

              {/* Paytm */}
              <a
                href={paytmUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#00baf2]/40 bg-[#00baf2]/15 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#00baf2] hover:text-black shadow-sm"
              >
                <span className="font-display font-bold">Paytm</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-70" />
              </a>

              {/* Any UPI App */}
              <a
                href={genericUpiUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-accent/50 bg-accent/20 px-3 py-2.5 text-xs font-semibold text-highlight transition-all hover:bg-accent hover:text-gunmetal shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                <span className="font-display font-bold">BHIM / UPI</span>
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-[11px] text-emerald-300">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <p>
              Scan the QR or click your preferred UPI app button above. Once the transaction completes, click <strong>"I Have Completed Payment"</strong> below to generate your Student ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
