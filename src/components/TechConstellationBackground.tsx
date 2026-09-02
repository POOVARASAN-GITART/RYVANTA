import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  colorType: 'cyan' | 'electricBlue' | 'skyBlue' | 'accentOrange' | 'accentGreen';
}

export function TechConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse tracking for dynamic blue wave interactivity
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180
    };

    let points: Point[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
      initPoints();
    }

    function initPoints() {
      points = [];
      const density = Math.floor((width * height) / 14000);
      const count = Math.min(Math.max(density, 55), 110);

      const colorOptions: Point['colorType'][] = [
        'cyan',
        'electricBlue',
        'skyBlue',
        'cyan',
        'electricBlue',
        'accentOrange',
        'accentGreen'
      ];

      for (let i = 0; i < count; i++) {
        const colorType = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        const isAccent = colorType === 'accentOrange' || colorType === 'accentGreen';

        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius: isAccent ? Math.random() * 1.8 + 1.2 : Math.random() * 1.5 + 0.9,
          baseAlpha: Math.random() * 0.55 + 0.35,
          colorType
        });
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    resize();

    const connectionDistance = 145;
    let waveTime = 0;

    function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      waveTime += 0.015;

      const len = points.length;

      // Draw undulating glowing blue wave lines in background
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 30) {
        const y = height * 0.65 + Math.sin(x * 0.005 + waveTime) * 35 + Math.cos(x * 0.008 + waveTime * 1.2) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.06)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 30) {
        const y = height * 0.45 + Math.cos(x * 0.006 - waveTime * 0.8) * 30 + Math.sin(x * 0.004 + waveTime) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render living blue particle constellation
      for (let i = 0; i < len; i++) {
        const p = points[i];

        // Motion update
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundary
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Draw connecting electric blue lines
        for (let j = i + 1; j < len; j++) {
          const p2 = points[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === 'cyan') {
          ctx.fillStyle = `rgba(6, 182, 212, ${p.baseAlpha})`;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.shadowBlur = 6;
        } else if (p.colorType === 'electricBlue') {
          ctx.fillStyle = `rgba(14, 165, 233, ${p.baseAlpha})`;
          ctx.shadowColor = 'rgba(14, 165, 233, 0.6)';
          ctx.shadowBlur = 6;
        } else if (p.colorType === 'skyBlue') {
          ctx.fillStyle = `rgba(59, 130, 246, ${p.baseAlpha})`;
          ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
          ctx.shadowBlur = 5;
        } else if (p.colorType === 'accentOrange') {
          ctx.fillStyle = `rgba(255, 107, 0, ${p.baseAlpha * 1.1})`;
          ctx.shadowColor = 'rgba(255, 107, 0, 0.6)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${p.baseAlpha * 1.1})`;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
          ctx.shadowBlur = 6;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80"
    />
  );
}

export default TechConstellationBackground;
