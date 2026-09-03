import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  colorType: 'cyan' | 'electricBlue' | 'skyBlue' | 'silver' | 'platinum';
}

export function TechConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isMobile = false;
    let points: Point[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768 || window.matchMedia('(pointer: coarse)').matches;

      // 1.0 DPR on mobile for high framerate; 1.5 on desktop
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initPoints();
    }

    function initPoints() {
      points = [];
      // Generous particle count for bold, visible constellations
      const count = isMobile ? 24 : Math.min(Math.max(Math.floor((width * height) / 16000), 32), 65);

      const colorOptions: Point['colorType'][] = [
        'cyan',
        'electricBlue',
        'skyBlue',
        'silver',
        'platinum'
      ];

      for (let i = 0; i < count; i++) {
        const colorType = colorOptions[i % colorOptions.length];
        const isSilver = colorType === 'silver' || colorType === 'platinum';

        // Much larger, bolder node sizes (3.0px to 6.5px)
        const radius = isSilver
          ? Math.random() * 2.5 + 3.0
          : Math.random() * 3.5 + 3.2;

        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
          vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
          radius,
          baseAlpha: Math.random() * 0.45 + 0.45,
          pulsePhase: Math.random() * Math.PI * 2,
          colorType
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Much larger connection reach for big, visible constellation meshes
    const connectionDistance = isMobile ? 130 : 210;
    let time = 0;

    function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      time += 0.02;
      const len = points.length;

      // 1. Draw connecting geometric constellation lines (bolder & larger)
      for (let i = 0; i < len; i++) {
        const p = points[i];

        // Motion update
        p.x += p.vx;
        p.y += p.vy;

        // Bounce smoothly on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        for (let j = i + 1; j < len; j++) {
          const p2 = points[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }
        }
      }

      // 2. Draw prominent luminous constellation nodes & outer glowing halos
      for (let i = 0; i < len; i++) {
        const p = points[i];
        const pulse = Math.sin(time + p.pulsePhase) * 0.8 + p.radius;

        // Soft outer ambient halo ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.colorType === 'cyan' || p.colorType === 'electricBlue'
          ? 'rgba(14, 165, 233, 0.12)'
          : 'rgba(148, 163, 184, 0.10)';
        ctx.fill();

        // Main solid node body
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);

        if (p.colorType === 'cyan') {
          ctx.fillStyle = `rgba(6, 182, 212, ${p.baseAlpha})`;
        } else if (p.colorType === 'electricBlue') {
          ctx.fillStyle = `rgba(14, 165, 233, ${p.baseAlpha})`;
        } else if (p.colorType === 'skyBlue') {
          ctx.fillStyle = `rgba(37, 99, 235, ${p.baseAlpha})`;
        } else if (p.colorType === 'silver') {
          ctx.fillStyle = `rgba(148, 163, 184, ${p.baseAlpha * 1.1})`;
        } else {
          ctx.fillStyle = `rgba(203, 213, 225, ${p.baseAlpha * 1.1})`;
        }

        ctx.fill();

        // High-contrast central glint dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(pulse * 0.4, 1.2), 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 will-change-transform"
    />
  );
}

export default TechConstellationBackground;
