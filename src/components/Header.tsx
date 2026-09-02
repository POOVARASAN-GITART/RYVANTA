import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LockIcon, TrophyIcon, SparklesIcon } from 'lucide-react';

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
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & College Title */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#10B981] text-[#FFFFFF] font-serif font-black text-lg shadow-md transition-transform duration-200 group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-black tracking-wider text-[#0F172A]">
                RYVANTA
              </span>
              <span className="font-mono text-xs font-bold text-[#FF6B00]">'26</span>
            </div>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-[#64748B] uppercase line-clamp-1">
              Jaya Engineering College · National Level Symposium &amp; Hackathon
            </span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                  isActive
                    ? 'border border-[#FF6B00] bg-[#0F172A] text-[#FFFFFF] font-bold shadow-md ring-2 ring-[#FF6B00]/30'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
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
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-md hover:from-[#EA580C] hover:to-[#C2410C] transition-all duration-200 hover:shadow-orange-glow"
          >
            <TrophyIcon className="h-3.5 w-3.5 text-[#FEF08A]" />
            <span>Register Team</span>
          </Link>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#475569] transition-colors hover:border-[#10B981] hover:bg-[#FFFFFF] hover:text-[#10B981]"
            title="Organizer Admin Command Center"
          >
            <LockIcon className="h-3.5 w-3.5 text-[#10B981]" aria-hidden="true" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <nav
        aria-label="Primary mobile"
        className="flex border-t border-[#E2E8F0] bg-[#FFFFFF]/95 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 whitespace-nowrap py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors',
                isActive ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] font-bold' : 'text-[#64748B]'
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