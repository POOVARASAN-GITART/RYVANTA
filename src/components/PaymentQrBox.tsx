import React, { useState, useRef } from 'react';
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  SmartphoneIcon,
  UploadCloudIcon,
  FileImageIcon,
  XIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { QrCodeView } from './QrCodeView';

interface PaymentQrBoxProps {
  upiId?: string;
  payeeName?: string;
  feeAmount: number;
  eventName: string;
  teamName?: string;
  upiRef?: string;
  onUpiRefChange?: (val: string) => void;
  paymentScreenshot?: string;
  onScreenshotChange?: (base64: string | undefined) => void;
}

export function PaymentQrBox({
  upiId = 'alangaram1985@okicici',
  payeeName = 'Alangaram Selvaraj',
  feeAmount,
  eventName,
  teamName,
  upiRef = '',
  onUpiRefChange,
  paymentScreenshot,
  onScreenshotChange
}: PaymentQrBoxProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Construct standard UPI payment URI
  const note = `RYVANTA ${eventName.slice(0, 12)}${teamName ? ` - ${teamName.slice(0, 10)}` : ''}`;
  const baseUpiParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
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
      // ignore
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && onScreenshotChange) {
        onScreenshotChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveScreenshot() {
    if (onScreenshotChange) {
      onScreenshotChange(undefined);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAE6DF] bg-[#FFFFFF] p-5 sm:p-7 shadow-luxury">
      {/* Payee Profile Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EAE6DF] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAFAFA] border border-[#D4AF37]/40 text-[#D4AF37] font-bold">
            <ShieldCheckIcon className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1C1C1C]">
              Official Symposium Payment Gateway
            </h3>
            <span className="text-xs text-[#767676]">Instant Automated Verification &amp; ID Issue</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/15 to-[#FFD700]/15 border border-[#D4AF37] px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#AA820A]">
            Fee Amount:
          </span>
          <span className="font-serif text-xl font-black text-[#1C1C1C]">
            ₹{feeAmount}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] items-start">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EAE6DF] bg-[#FAFAFA] p-4 text-center">
          <div className="rounded-xl border border-[#D4AF37]/50 bg-[#FFFFFF] p-3 shadow-md">
            <QrCodeView value={genericUpiUri} size={168} />
          </div>

          <span className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#767676]">
            Scan with any UPI App
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-[#AA820A]">GPay · PhonePe · Paytm · BHIM</span>
        </div>

        {/* UPI Details & Deep Links */}
        <div className="space-y-4">
          {/* UPI ID Copy Field */}
          <div className="rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#767676]">
                Official UPI ID
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                ● Active Payee
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#1C1C1C] select-all">
                {upiId}
              </span>
              <button
                type="button"
                onClick={() => void copyToClipboard(upiId)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#1C1C1C] hover:bg-[#FAFAFA] transition-colors shadow-sm"
              >
                {copiedUpi ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 text-[11px] text-[#767676]">
              Payee Name: <strong className="text-[#1C1C1C]">{payeeName}</strong>
            </div>
          </div>

          {/* Quick Pay Buttons for Mobile */}
          <div>
            <span className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-[#767676]">
              Direct App Deep-Links (Mobile Only)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={gpayUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-2.5 text-xs font-semibold text-[#1C1C1C] hover:border-[#D4AF37] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Google Pay</span>
              </a>
              <a
                href={phonepeUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-2.5 text-xs font-semibold text-[#1C1C1C] hover:border-[#D4AF37] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>PhonePe</span>
              </a>
              <a
                href={paytmUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] p-2.5 text-xs font-semibold text-[#1C1C1C] hover:border-[#D4AF37] hover:bg-[#FFFFFF] transition-colors shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Paytm</span>
              </a>
              <a
                href={genericUpiUri}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-2.5 text-xs font-bold text-[#1C1C1C] hover:bg-[#FAFAFA] transition-colors shadow-sm"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Any UPI App</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* UTR Ref & Screenshot Proof Section */}
      <div className="mt-6 border-t border-[#EAE6DF] pt-5 grid gap-4 sm:grid-cols-2">
        {/* UPI Ref / UTR Number */}
        <div>
          <label
            htmlFor="upi-ref"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]"
          >
            UPI Reference / UTR Number <span className="text-[10px] text-[#767676]">(Optional)</span>
          </label>
          <input
            id="upi-ref"
            type="text"
            value={upiRef}
            onChange={(e) => onUpiRefChange?.(e.target.value)}
            placeholder="e.g. 423984729182 (12-digit UTR)"
            className="w-full rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] px-4 py-2.5 font-mono text-xs text-[#1C1C1C] placeholder:text-[#767676] focus:border-[#D4AF37] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        {/* Screenshot Upload Proof */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
            Payment Screenshot Proof <span className="text-[10px] text-[#767676]">(Optional)</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!paymentScreenshot ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4AF37] bg-[#FAFAFA] px-4 py-2.5 text-xs font-semibold text-[#1C1C1C] hover:bg-[#FFFFFF] transition-colors"
            >
              <UploadCloudIcon className="h-4 w-4 text-[#D4AF37]" />
              <span>Attach Receipt Screenshot</span>
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
              <div className="flex items-center gap-2 truncate">
                <FileImageIcon className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="truncate font-mono">Screenshot attached</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="rounded-lg p-1 text-emerald-800 hover:bg-emerald-100"
                title="Remove screenshot"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {uploadError && <p className="mt-1 text-[11px] text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
