import React, { useState, useRef } from 'react';
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  QrCodeIcon,
  ShieldCheckIcon,
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
    <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#080f24] via-[#050a18] to-[#030610] p-5 sm:p-7 shadow-2xl shadow-cyan-950/40">
      {/* Payee Profile Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 font-display text-lg font-black text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            A
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
              {payeeName}
            </h3>
            <p className="text-xs font-mono text-cyan-400">
              UPI: {upiId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-right shadow-inner">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Fee Amount:</span>
          <span className="font-display text-xl font-black text-white">₹{feeAmount}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[210px_1fr] items-start">
        {/* Prominent QR Code container */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative rounded-2xl bg-white p-3.5 shadow-2xl ring-4 ring-cyan-500/30 transition-transform duration-200 hover:scale-[1.02]">
            <QrCodeView
              value={genericUpiUri}
              size={175}
              darkColor="#080c14"
              lightColor="#ffffff"
              label="UPI Payment QR Code"
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
            <ZapIcon className="h-3 w-3 animate-pulse" />
            <span>Scan to Pay with Any App</span>
          </div>
        </div>

        {/* UPI Details & 1-Click App Triggers */}
        <div className="space-y-4 w-full">
          {/* Official UPI ID box with 1-click Copy */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-inner">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Official Event UPI ID
              </span>
              <span className="font-mono text-sm font-bold text-cyan-300 select-all">
                {upiId}
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Payee: {payeeName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void copyToClipboard(upiId)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-all hover:border-cyan-400 hover:bg-cyan-950/60"
              title="Copy UPI ID"
            >
              {copiedUpi ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Mobile App Buttons (GPay, PhonePe, Paytm, All UPI) */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Direct Mobile Payment Deep Links:
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
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-cyan-400/20 px-3 py-2.5 text-xs font-semibold text-cyan-200 transition-all hover:bg-cyan-400 hover:text-slate-950 shadow-sm"
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                <span className="font-display font-bold">BHIM / UPI</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction UTR & Payment Proof Upload Section */}
      <div className="mt-6 border-t border-cyan-500/20 pt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* UTR Reference Input */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <ReceiptIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span>UPI Ref / UTR / Transaction No.</span>
              <span className="text-[10px] text-cyan-400 font-mono">(Optional / Recommended)</span>
            </label>
            <input
              type="text"
              value={upiRef}
              onChange={(e) => onUpiRefChange?.(e.target.value)}
              placeholder="e.g. 423987123456 or GPay Ref"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              12-digit transaction number shown in your payment receipt.
            </p>
          </div>

          {/* Screenshot Proof Upload */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <FileImageIcon className="h-3.5 w-3.5 text-purple-400" />
              <span>Payment Screenshot Proof</span>
              <span className="text-[10px] text-purple-400 font-mono">(Recommended)</span>
            </label>

            {paymentScreenshot ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-2.5">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={paymentScreenshot}
                    alt="Payment Proof"
                    className="h-9 w-9 rounded-lg object-cover border border-emerald-400/40 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="block truncate text-xs font-semibold text-emerald-300">
                      Receipt Screenshot Attached
                    </span>
                    <span className="block text-[10px] text-emerald-400/80 font-mono">
                      Ready for Verification
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveScreenshot}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                  title="Remove Screenshot"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="screenshot-upload-input"
                />
                <label
                  htmlFor="screenshot-upload-input"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-400 hover:bg-slate-800/80 hover:text-white"
                >
                  <UploadCloudIcon className="h-4 w-4 text-cyan-400" />
                  <span>Upload Payment Screenshot (Max 5MB)</span>
                </label>
              </div>
            )}

            {uploadError && (
              <p className="mt-1 text-xs text-red-400">{uploadError}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-[11px] text-emerald-300">
          <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <p>
            Scan the QR or click your preferred UPI app button above to pay ₹{feeAmount} to <strong>{payeeName}</strong>. Once complete, click <strong>"Generate Student ID &amp; Gate Pass"</strong> below.
          </p>
        </div>
      </div>
    </div>
  );
}
