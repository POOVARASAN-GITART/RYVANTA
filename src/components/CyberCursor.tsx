import React, { useEffect, useRef, useState } from 'react';

/**
 * Cyber Arrow Mouse Cursor
 * Sleek, high-precision futuristic cursor arrow for desktop; 100% disabled on mobile touchscreens for zero lag.
 */
export function CyberCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if the current device is a touch / mobile device
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768);

    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    let isHovered = false;

    function onMouseMove(e: MouseEvent) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check for clickable elements under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, label, [role="button"], .clickable')
        );
        if (isClickable !== isHovered) {
          isHovered = isClickable;
          if (cursorRef.current) {
            cursorRef.current.classList.toggle('cursor-hovered', isClickable);
          }
        }
      }
    }

    function onMouseLeave() {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    }

    function onMouseEnter() {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-100 will-change-transform transition-opacity duration-150 ease-out select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0)'
      }}
    >
      {/* Sleek Aerodynamic Cyber Arrow Pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-100 ease-out origin-top-left drop-shadow-[0_2px_8px_rgba(14,165,233,0.5)]"
      >
        <path
          d="M3 2L19 10L11 12L9 20L3 2Z"
          fill="#000000"
          stroke="#0EA5E9"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 5.5L14.5 10L10 11L8.5 16L5.5 5.5Z"
          fill="#0EA5E9"
          fillOpacity="0.25"
        />
      </svg>
    </div>
  );
}

export default CyberCursor;
