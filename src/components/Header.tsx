import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LockIcon, SparklesIcon, ZapIcon } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Innovation Tracks & Register' },
  { to: '/support', label: 'Helpdesk & Support' }
];

interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E4E2] bg-[#F9F8F6]/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C2C2C] text-[#F9F8F6] font-display font-black text-sm shadow-md transition-transform duration-200 group-hover:scale-105">
            R
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-black tracking-widest text-[#1A1A1A]">
              RYVANTA
            </span>
            <span className="font-mono text-xs font-bold text-[#C5A059]">'26</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#D8D7D5] bg-[#F3F1ED] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#4A4A4A] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-ping" />
            NATIONAL INNOVATION
          </span>
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
                    ? 'border border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-sm'
                    : 'text-[#4A4A4A] hover:bg-[#E5E4E2]/60 hover:text-[#1A1A1A]'
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
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#2C2C2C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F9F8F6] shadow-md hover:bg-[#1A1A1A] hover:shadow-lg transition-all duration-200"
          >
            <ZapIcon className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Register Squad</span>
          </Link>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E4E2] bg-[#F3F1ED] px-3 py-2 text-xs font-semibold text-[#4A4A4A] transition-colors hover:border-[#D8D7D5] hover:bg-[#E5E4E2] hover:text-[#1A1A1A]"
            title="Organizer Admin Portal"
          >
            <LockIcon className="h-3.5 w-3.5 text-[#C5A059]" aria-hidden="true" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <nav
        aria-label="Primary mobile"
        className="flex border-t border-[#E5E4E2] bg-[#F9F8F6]/95 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 whitespace-nowrap py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors',
                isActive ? 'text-[#1A1A1A] border-b-2 border-[#2C2C2C] font-bold' : 'text-[#8C8A85]'
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