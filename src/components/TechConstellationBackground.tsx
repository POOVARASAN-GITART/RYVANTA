import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
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

      // 1.0 DPR on mobile for maximum responsiveness
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initPoints();
    }

    function initPoints() {
      points = [];
      const count = isMobile ? 16 : Math.min(Math.max(Math.floor((width * height) / 20000), 24), 45);

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

        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
          vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
          radius: isSilver ? Math.random() * 1.3 + 0.9 : Math.random() * 1.2 + 0.8,
          baseAlpha: Math.random() * 0.4 + 0.25,
          colorType
        });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const connectionDistance = isMobile ? 65 : 115;

    function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      const len = points.length;

      // Smooth ambient particle floating without any mouse tracking
      for (let i = 0; i < len; i++) {
        const p = points[i];

        // Motion update
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundary
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw connecting electric blue / silver lines
        for (let j = i + 1; j < len; j++) {
          const p2 = points[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === 'cyan') {
          ctx.fillStyle = `rgba(6, 182, 212, ${p.baseAlpha})`;
        } else if (p.colorType === 'electricBlue') {
          ctx.fillStyle = `rgba(14, 165, 233, ${p.baseAlpha})`;
        } else if (p.colorType === 'skyBlue') {
          ctx.fillStyle = `rgba(59, 130, 246, ${p.baseAlpha})`;
        } else if (p.colorType === 'silver') {
          ctx.fillStyle = `rgba(148, 163, 184, ${p.baseAlpha})`;
        } else {
          ctx.fillStyle = `rgba(203, 213, 225, ${p.baseAlpha})`;
        }

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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65 will-change-transform"
    />
  );
}

export default TechConstellationBackground;
