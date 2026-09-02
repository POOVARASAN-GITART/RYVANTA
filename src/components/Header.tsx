import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LockIcon, SparklesIcon, ZapIcon, TrophyIcon } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events & Registration' },
  { to: '/support', label: 'Helpdesk & Support' }
];

interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EAE6DF] bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] text-[#FFFFFF] font-serif font-black text-base shadow-md transition-transform duration-200 group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-black tracking-wider text-[#1C1C1C]">
                RYVANTA
              </span>
              <span className="font-mono text-xs font-bold text-[#D4AF37]">'26</span>
            </div>
            <span className="text-[10px] font-sans font-semibold tracking-widest text-[#767676] uppercase">
              National Technical Symposium &amp; Hackathon
            </span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                  isActive
                    ? 'border border-[#D4AF37] bg-[#FAFAFA] text-[#1C1C1C] font-bold shadow-sm ring-1 ring-[#D4AF37]/30'
                    : 'text-[#555555] hover:bg-[#FAFAFA] hover:text-[#1C1C1C]'
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA / Admin */}
        <div className="flex items-center gap-3">
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-md hover:from-[#B8860B] hover:to-[#8B6508] transition-all duration-200"
          >
            <TrophyIcon className="h-3.5 w-3.5 text-[#FFD700]" />
            <span>Register Team</span>
          </Link>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-[#EAE6DF] bg-[#FAFAFA] px-3 py-2 text-xs font-semibold text-[#555555] transition-colors hover:border-[#D4AF37] hover:bg-[#FFFFFF] hover:text-[#1C1C1C]"
            title="Organizer Admin Command Center"
          >
            <LockIcon className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <nav
        aria-label="Primary mobile"
        className="flex border-t border-[#EAE6DF] bg-[#FFFFFF]/95 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 whitespace-nowrap py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors',
                isActive ? 'text-[#1C1C1C] border-b-2 border-[#D4AF37] font-bold' : 'text-[#767676]'
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}