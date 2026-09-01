import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  label?: string;
}

export function QrCodeView({
  value,
  size = 180,
  className = '',
  darkColor = '#0b0f19',
  lightColor = '#ffffff',
  margin = 1,
  label
}: QrCodeViewProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    if (!value) {
      setDataUrl('');
      return;
    }

    QRCode.toDataURL(value, {
      width: size * 2, // 2x for sharp rendering on high-DPI displays
      margin: margin,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isCurrent) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : 'QR code generation failed');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [value, size, margin, darkColor, lightColor]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-xl border border-red-500/40 bg-red-950/20 p-2 text-center text-xs text-red-300 ${className}`}
      >
        Failed to render QR
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-xl border border-line bg-surface/50 animate-pulse ${className}`}
      >
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <img
        src={dataUrl}
        alt={label || `QR Code for ${value}`}
        width={size}
        height={size}
        className="rounded-lg shadow-md transition-transform duration-200"
      />
    </div>
  );
}
