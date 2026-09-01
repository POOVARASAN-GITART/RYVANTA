import React from 'react';
import { MailIcon, PhoneIcon } from 'lucide-react';

import { SUPPORT_LINES } from '../data/events';

export function Support() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="font-display text-3xl font-black text-highlight">
        Official support
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-metallic">
        Payment not reflecting, team size change, or an ID you never received — call the
        desk between 9 AM and 8 PM IST. Keep your participation ID handy.
      </p>

      <ul className="mt-8 divide-y divide-line/70 border-y border-line">
        {SUPPORT_LINES.map((line) =>
        <li key={line.tel}>
            <a
            href={`tel:${line.tel}`}
            className="group flex items-center justify-between gap-4 py-5 transition-colors duration-150 ease-smooth">
            
              <span>
                <span className="block text-xs uppercase tracking-widest text-metallic">
                  {line.label}
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-highlight">
                  {line.number}
                </span>
              </span>
              <PhoneIcon
              className="h-5 w-5 shrink-0 text-metallic transition-colors duration-150 ease-smooth group-hover:text-highlight"
              aria-hidden="true" />
            
            </a>
          </li>
        )}
      </ul>

      <a
        href="mailto:ryvanta26@college.edu"
        className="mt-6 inline-flex items-center gap-2 text-sm text-metallic transition-colors duration-150 ease-smooth hover:text-highlight">
        
        <MailIcon className="h-4 w-4" aria-hidden="true" />
        ryvanta26@college.edu
      </a>
    </div>);

}