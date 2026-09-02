import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LockIcon, PhoneIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import { SUPPORT_LINES } from '../data/events';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Challenge Tracks & Register' },
  { to: '/support', label: 'Helpdesk & Support' }
];

interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl shadow-lg shadow-black/60">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-display font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform duration-200 group-hover:scale-105">
            R
          </div>
          <span className="font-display text-xl font-black tracking-widest text-white">
            RYVANTA<span className="text-cyan-400 font-mono text-sm ml-1">'26</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            HACKATHON
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
                  'whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                  isActive
                    ? 'border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-white'
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md shadow-cyan-400/20 hover:from-cyan-300 hover:to-white transition-all"
          >
            <ZapIcon className="h-3.5 w-3.5 fill-current" />
            <span>Register Squad</span>
          </Link>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs font-semibold text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
            title="Organizer Admin Portal"
          >
            <LockIcon className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <nav
        aria-label="Primary mobile"
        className="flex border-t border-cyan-500/10 bg-[#030712]/95 md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 whitespace-nowrap py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors',
                isActive ? 'text-cyan-300 border-b-2 border-cyan-400' : 'text-slate-400'
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