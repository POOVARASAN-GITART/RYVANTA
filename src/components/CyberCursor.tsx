import React, { useEffect, useState, useRef } from 'react';

export function CyberCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktop/laptops with mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, label, [role="button"], .clickable')
        );
        setIsHovering(isClickable);
      }
    }

    function handleMouseDown() {
      setIsClicking(true);
    }

    function handleMouseUp() {
      setIsClicking(false);
    }

    function handleMouseLeave() {
      setIsVisible(false);
    }

    function handleMouseEnter() {
      setIsVisible(true);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp Animation Loop for Trailing Ring
    function animate() {
      trailRef.current.x += (mouseRef.current.x - trailRef.current.x) * 0.18;
      trailRef.current.y += (mouseRef.current.y - trailRef.current.y) * 0.18;
      setTrailingPos({ x: trailRef.current.x, y: trailRef.current.y });
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Ambient Spotlight that follows cursor */}
      <div
        className="pointer-events-none fixed z-30 transition-opacity duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      {/* Smooth Trailing Outer Ring */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full border transition-transform duration-75 ease-out ${
          isHovering
            ? 'border-cyan-400 bg-cyan-400/15 shadow-[0_0_20px_#00f0ff] scale-150'
            : isClicking
            ? 'border-purple-400 bg-purple-500/30 scale-75'
            : 'border-cyan-500/50 bg-cyan-500/5'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          transform: 'translate(-50%, -50%)',
          width: isHovering ? '44px' : '32px',
          height: isHovering ? '44px' : '32px',
          transitionProperty: 'width, height, transform, border-color, background-color, box-shadow'
        }}
      />

      {/* Inner Precision Dot */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full transition-all duration-75 ${
          isHovering
            ? 'h-2 w-2 bg-white shadow-[0_0_10px_#ffffff]'
            : isClicking
            ? 'h-3 w-3 bg-purple-400 shadow-[0_0_12px_#a855f7]'
            : 'h-1.5 w-1.5 bg-cyan-300 shadow-[0_0_8px_#00f0ff]'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
}
