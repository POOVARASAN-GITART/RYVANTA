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
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-7 shadow-luxury">
      {/* Payee Profile Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0EA5E9] font-bold">
            <ShieldCheckIcon className="h-5 w-5 text-[#0EA5E9]" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#000000]">
              Official Symposium Payment Gateway
            </h3>
            <span className="text-xs text-[#64748B]">Instant Automated Verification &amp; ID Issue</span>
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

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] items-start">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
          <div className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] p-3 shadow-md">
            <QrCodeView value={genericUpiUri} size={168} />
          </div>

          <span className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Scan with any UPI App
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-[#0284C7]">GPay · PhonePe · Paytm · BHIM</span>
        </div>

        {/* UPI Details & Deep Links */}
        <div className="space-y-4">
          {/* UPI ID Copy Field */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                Official UPI ID
              </span>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                ● Active Payee
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#000000] select-all">
                {upiId}
              </span>
              <button
                type="button"
                onClick={() => void copyToClipboard(upiId)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0EA5E9] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-50 transition-colors shadow-sm"
              >
                {copiedUpi ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    <span className="text-[#0284C7]">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 text-[11px] text-[#64748B]">
              Payee Name: <strong className="text-[#000000]">{payeeName}</strong>
            </div>
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

      {/* UTR Ref & Screenshot Proof Section */}
      <div className="mt-6 border-t border-[#E2E8F0] pt-5 grid gap-4 sm:grid-cols-2">
        {/* UPI Ref / UTR Number */}
        <div>
          <label
            htmlFor="upi-ref"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#000000]"
          >
            UPI Reference / UTR Number <span className="text-[10px] text-[#64748B]">(Optional)</span>
          </label>
          <input
            id="upi-ref"
            type="text"
            value={upiRef}
            onChange={(e) => onUpiRefChange?.(e.target.value)}
            placeholder="e.g. 423984729182 (12-digit UTR)"
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 font-mono text-xs text-[#000000] placeholder:text-[#64748B] focus:border-[#0EA5E9] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        {/* Screenshot Upload Proof */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#000000]">
            Payment Screenshot Proof <span className="text-[10px] text-[#64748B]">(Optional)</span>
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#000000] hover:border-[#0EA5E9] hover:bg-[#FFFFFF] transition-colors"
            >
              <UploadCloudIcon className="h-4 w-4 text-[#0EA5E9]" />
              <span>Attach Receipt Screenshot</span>
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-sky-300 bg-sky-50/80 px-3 py-2 text-xs text-sky-900">
              <div className="flex items-center gap-2 truncate">
                <FileImageIcon className="h-4 w-4 shrink-0 text-[#0EA5E9]" />
                <span className="truncate font-mono">Screenshot attached</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="rounded-lg p-1 text-sky-800 hover:bg-sky-100"
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
