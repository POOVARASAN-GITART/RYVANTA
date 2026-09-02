import React, { useState, useRef } from 'react';
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  SmartphoneIcon,
  ZapIcon,
  UploadCloudIcon,
  FileImageIcon,
  XIcon,
  ReceiptIcon
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
    <div className="overflow-hidden rounded-2xl border border-[#E5E4E2] bg-[#FFFFFF] p-5 sm:p-7 shadow-luxury">
      {/* Payee Profile Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E4E2] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F1ED] border border-[#D8D7D5] font-display text-lg font-black text-[#C5A059] shadow-sm">
            A
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A] tracking-wide">
              {payeeName}
            </h3>
            <p className="text-xs font-mono text-[#8C8A85]">
              UPI: {upiId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#D8D7D5] bg-[#F9F8F6] px-4 py-2 text-right shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8A85]">Fee Amount:</span>
          <span className="font-display text-xl font-black text-[#1A1A1A]">₹{feeAmount}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[210px_1fr] items-start">
        {/* Prominent QR Code container */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative rounded-2xl bg-[#FFFFFF] p-3.5 shadow-md ring-1 ring-[#E5E4E2] transition-transform duration-200 hover:scale-[1.02]">
            <QrCodeView
              value={genericUpiUri}
              size={175}
              darkColor="#1A1A1A"
              lightColor="#FFFFFF"
              label="UPI Payment QR Code"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#C5A059]">
            <ZapIcon className="h-3 w-3" />
            <span>Scan to Pay with Any App</span>
          </div>
        </div>

        {/* UPI Details & 1-Click App Triggers */}
        <div className="space-y-4 w-full">
          {/* Official UPI ID box with 1-click Copy */}
          <div className="flex items-center justify-between rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-4 py-3 shadow-sm">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C8A85]">
                Official Event UPI ID
              </span>
              <span className="font-mono text-sm font-bold text-[#1A1A1A] select-all">
                {upiId}
              </span>
              <span className="block text-[11px] text-[#4A4A4A] mt-0.5">
                Beneficiary: {payeeName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void copyToClipboard(upiId)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D7D5] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] transition-all hover:bg-[#E5E4E2] shadow-sm"
              title="Copy UPI ID"
            >
              {copiedUpi ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Mobile App Buttons (GPay, PhonePe, Paytm, All UPI) */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8A85]">
              Direct Mobile Payment Deep Links:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Google Pay */}
              <a
                href={gpayUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] transition-all hover:border-[#2C2C2C] hover:bg-[#FFFFFF] shadow-sm"
              >
                <span className="font-display font-bold">GPay</span>
                <ExternalLinkIcon className="h-3 w-3 text-[#8C8A85]" />
              </a>

              {/* PhonePe */}
              <a
                href={phonepeUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] transition-all hover:border-[#2C2C2C] hover:bg-[#FFFFFF] shadow-sm"
              >
                <span className="font-display font-bold">PhonePe</span>
                <ExternalLinkIcon className="h-3 w-3 text-[#8C8A85]" />
              </a>

              {/* Paytm */}
              <a
                href={paytmUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] transition-all hover:border-[#2C2C2C] hover:bg-[#FFFFFF] shadow-sm"
              >
                <span className="font-display font-bold">Paytm</span>
                <ExternalLinkIcon className="h-3 w-3 text-[#8C8A85]" />
              </a>

              {/* Any UPI App */}
              <a
                href={genericUpiUri}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2C2C2C] bg-[#2C2C2C] px-3 py-2.5 text-xs font-semibold text-[#F9F8F6] transition-all hover:bg-[#1A1A1A] shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5 text-[#C5A059]" />
                <span className="font-display font-bold">BHIM / UPI</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction UTR & Payment Proof Upload Section */}
      <div className="mt-6 border-t border-[#E5E4E2] pt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* UTR Reference Input */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              <ReceiptIcon className="h-3.5 w-3.5 text-[#C5A059]" />
              <span>UPI Ref / UTR / Transaction No.</span>
              <span className="text-[10px] text-[#8C8A85] font-mono">(Recommended)</span>
            </label>
            <input
              type="text"
              value={upiRef}
              onChange={(e) => onUpiRefChange?.(e.target.value)}
              placeholder="e.g. 423987123456 or GPay Ref"
              className="w-full rounded-xl border border-[#E5E4E2] bg-[#F9F8F6] px-3.5 py-2.5 font-mono text-sm text-[#1A1A1A] placeholder:text-[#8C8A85] focus:border-[#2C2C2C] focus:bg-[#FFFFFF] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[#8C8A85]">
              12-digit transaction number shown in your payment receipt.
            </p>
          </div>

          {/* Screenshot Proof Upload */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              <FileImageIcon className="h-3.5 w-3.5 text-[#C5A059]" />
              <span>Payment Screenshot Proof</span>
              <span className="text-[10px] text-[#8C8A85] font-mono">(Recommended)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="payment-screenshot-upload"
            />

            {!paymentScreenshot ? (
              <label
                htmlFor="payment-screenshot-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D8D7D5] bg-[#F9F8F6] p-3 text-xs font-semibold text-[#4A4A4A] transition-all hover:border-[#2C2C2C] hover:bg-[#FFFFFF]"
              >
                <UploadCloudIcon className="h-4 w-4 text-[#C5A059]" />
                <span>Upload Payment Screenshot (Max 5MB)</span>
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={paymentScreenshot}
                    alt="Payment receipt proof"
                    className="h-10 w-10 rounded-lg object-cover border border-emerald-300"
                  />
                  <div>
                    <span className="block font-bold text-emerald-800">Screenshot Attached</span>
                    <span className="text-[10px] text-emerald-700">Receipt image ready for verification</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveScreenshot}
                  className="rounded-lg p-1 text-emerald-800 hover:bg-emerald-100 transition-colors"
                  title="Remove screenshot"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {uploadError && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{uploadError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
