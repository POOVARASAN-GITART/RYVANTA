import React from 'react';
import { IS_REMOTE_BACKEND } from '../services/registrationApi';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E5E4E2] bg-[#F9F8F6]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-[#8C8A85] sm:flex-row sm:px-6 lg:px-8">
        <p className="text-[#4A4A4A] font-medium">
          &copy; 2026 RYVANTA Organizing Committee. All rights reserved.
        </p>
        <p className="flex items-center gap-2 font-mono text-[11px]">
          <span
            className={`h-2 w-2 rounded-full ${
              IS_REMOTE_BACKEND ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-[#C5A059]'
            }`}
            aria-hidden="true"
          />
          <span className="text-[#4A4A4A]">
            {IS_REMOTE_BACKEND
              ? 'Registration Cloud Database: Online'
              : 'Registration Engine: Operational'}
          </span>
        </p>
      </div>
    </footer>
  );
}