import React, { useEffect, useRef } from 'react';

export function CyberCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isClicked = useRef(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animationFrameId: number;

    function onMouseMove(e: MouseEvent) {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Update ambient electric blue spotlight instantly
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check for clickable elements under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, label, [role="button"], .clickable')
        );
        isHovered.current = isClickable;
      }
    }

    function onMouseDown() {
      isClicked.current = true;
    }

    function onMouseUp() {
      isClicked.current = false;
    }

    function onMouseLeave() {
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (spotRef.current) spotRef.current.style.opacity = '0';
    }

    function onMouseEnter() {
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (spotRef.current) spotRef.current.style.opacity = '1';
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // High-performance RAF loop
    function updateCursor() {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.52;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.52;

      if (ringRef.current) {
        const scale = isHovered.current ? 1.4 : isClicked.current ? 0.75 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;

        if (isHovered.current) {
          ringRef.current.style.borderColor = '#0EA5E9';
          ringRef.current.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
          ringRef.current.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.5)';
        } else if (isClicked.current) {
          ringRef.current.style.borderColor = '#000000';
          ringRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
          ringRef.current.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.25)';
        } else {
          ringRef.current.style.borderColor = '#94A3B8';
          ringRef.current.style.backgroundColor = 'rgba(148, 163, 184, 0.08)';
          ringRef.current.style.boxShadow = '0 0 12px rgba(14, 165, 233, 0.3)';
        }
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    }
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Dynamic Luminous Electric Blue Spotlight */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed left-0 top-0 z-30 opacity-100 will-change-transform"
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(37, 99, 235, 0.04) 40%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      {/* Cyber Blue & Silver Cursor Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border opacity-100 will-change-transform transition-[border-color,background-color,box-shadow] duration-150 ease-out"
        style={{
          width: '32px',
          height: '32px',
          borderWidth: '2px'
        }}
      />
    </>
  );
}
