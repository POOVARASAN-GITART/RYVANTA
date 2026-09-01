import React from 'react';

import { IS_REMOTE_BACKEND } from '../services/registrationApi';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line/80 bg-gunmetal">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-metallic sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; 2026 RYVANTA Organizing Committee. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
            IS_REMOTE_BACKEND ? 'bg-accent' : 'bg-amber-400'}`
            }
            aria-hidden="true" />
          
          {IS_REMOTE_BACKEND ?
          'Connected to registration service' :
          'Registration service: local mode'}
        </p>
      </div>
    </footer>);

}