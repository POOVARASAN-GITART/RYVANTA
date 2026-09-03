import React, { useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TrophyIcon } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events & Registration' },
  { to: '/support', label: 'Helpdesk & Support' }
];

interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Secret 3-Click Admin Trigger on Brand Logo
  function handleSecretLogoClick(e: React.MouseEvent) {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      onOpenAdmin();
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1200);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & College Title (Secret 3-Click Admin Trigger) */}
        <div
          onClick={handleSecretLogoClick}
          className="flex items-center gap-3 group cursor-pointer select-none"
          title="RYVANTA '26"
        >
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0EA5E9] text-[#FFFFFF] font-serif font-black text-lg shadow-md transition-transform duration-200 group-hover:scale-105">
              R
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-black tracking-wider text-[#000000]">
                  RYVANTA
                </span>
                <span className="font-mono text-xs font-bold text-[#0EA5E9]">'26</span>
              </div>
              <span className="text-[10px] font-sans font-semibold tracking-wider text-[#64748B] uppercase line-clamp-1">
                Jaya Engineering College · National Level Tech Innovation Challenge
              </span>
            </div>
          </NavLink>
        </div>

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
                    ? 'border border-[#0EA5E9] bg-[#000000] text-[#FFFFFF] font-bold shadow-md ring-2 ring-[#0EA5E9]/30'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#000000]'
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA for Students (Clean & Free of Admin Controls) */}
        <div className="flex items-center gap-3">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] shadow-md hover:bg-[#0284C7] transition-all duration-200 hover:shadow-blue-glow"
          >
            <TrophyIcon className="h-3.5 w-3.5 text-[#E0F2FE]" />
            <span>Register Team</span>
          </Link>
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
                isActive ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9] font-bold' : 'text-[#64748B]'
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

export default Header;