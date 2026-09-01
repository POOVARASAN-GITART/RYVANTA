import React from 'react';
import { NavLink } from 'react-router-dom';
import { LockIcon, PhoneIcon } from 'lucide-react';

import { SUPPORT_LINES } from '../data/events';

const NAV_ITEMS = [
{ to: '/', label: 'Home' },
{ to: '/events', label: 'Events & Register' },
{ to: '/support', label: 'Support' }];


interface HeaderProps {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-gunmetal/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="font-display text-xl font-black tracking-widest text-highlight">
          RYVANTA<span className="text-metallic"> '26</span>
        </NavLink>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            [
            'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-smooth',
            isActive ?
            'bg-elevated text-highlight' :
            'text-metallic hover:text-highlight'].
            join(' ')
            }>
            
              {item.label}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SUPPORT_LINES[0].tel}`}
            className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-metallic transition-colors duration-150 ease-smooth hover:border-metallic hover:text-highlight lg:flex">
            
            <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {SUPPORT_LINES[0].number}
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-metallic transition-colors duration-150 ease-smooth hover:text-highlight">
            
            <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Admin
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex border-t border-line/60 md:hidden">
        
        {NAV_ITEMS.map((item) =>
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
          [
          'flex-1 whitespace-nowrap py-3 text-center text-xs font-medium transition-colors duration-150 ease-smooth',
          isActive ? 'text-highlight' : 'text-metallic'].
          join(' ')
          }>
          
            {item.label}
          </NavLink>
        )}
      </nav>
    </header>);

}