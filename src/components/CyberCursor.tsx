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

      // Update ambient spotlight instantly
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
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.48;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.48;

      if (ringRef.current) {
        const scale = isHovered.current ? 1.4 : isClicked.current ? 0.75 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;

        if (isHovered.current) {
          ringRef.current.style.borderColor = '#D4AF37';
          ringRef.current.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
          ringRef.current.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.45)';
        } else if (isClicked.current) {
          ringRef.current.style.borderColor = '#1C1C1C';
          ringRef.current.style.backgroundColor = 'rgba(28, 28, 28, 0.15)';
          ringRef.current.style.boxShadow = '0 0 15px rgba(28, 28, 28, 0.2)';
        } else {
          ringRef.current.style.borderColor = '#D4AF37';
          ringRef.current.style.backgroundColor = 'rgba(212, 175, 55, 0.04)';
          ringRef.current.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.3)';
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
      {/* Soft Metallic Gold Ambient Spotlight */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed left-0 top-0 z-30 opacity-100 will-change-transform"
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(255, 215, 0, 0.03) 40%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      {/* Regal Metallic Gold Cursor Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border opacity-100 will-change-transform transition-[border-color,background-color,box-shadow] duration-150 ease-out"
        style={{
          width: '34px',
          height: '34px',
          borderWidth: '1.5px'
        }}
      />
    </>
  );
}
