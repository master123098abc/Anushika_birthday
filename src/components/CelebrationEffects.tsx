import { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  shape: 'rect' | 'circle';
}

const CONFETTI_COLORS = [
  '#F472B6', // Pastel rose
  '#EC4899', // Berry pink
  '#C084FC', // Soft lavender
  '#A78BFA', // Periwinkle
  '#FBBF24', // Champagne gold
  '#FDE68A', // Pale gold
  '#FBCFE8', // Blush pink
];

interface ConfettiCanvasProps {
  burstKey: number;
  continuousBirthdayMode: boolean;
}

export function ConfettiCanvas({
  burstKey,
  continuousBirthdayMode,
}: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const rafRef = useRef<number | null>(null);

  const spawnBurst = (count: number, originYRatio = 0.42) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width * (0.25 + Math.random() * 0.5);
    const originY = height * originYRatio;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5.5,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.22,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        opacity: 1,
        shape: Math.random() > 0.35 ? 'rect' : 'circle',
      });
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.vx *= 0.988;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.78) {
          p.opacity -= 0.025;
        }

        if (p.opacity <= 0 || p.y > canvas.height + 40) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (burstKey === 0) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    spawnBurst(95, 0.45);
  }, [burstKey]);

  useEffect(() => {
    if (!continuousBirthdayMode) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    spawnBurst(110, 0.35);
    const interval = window.setInterval(() => {
      spawnBurst(38, 0.25);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [continuousBirthdayMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}

const AMBIENT_SPARKLES = [
  { left: '8%', top: '14%', size: 14, delay: '0s', type: 'sparkle' },
  { left: '86%', top: '18%', size: 12, delay: '1.2s', type: 'heart' },
  { left: '16%', top: '42%', size: 10, delay: '2.1s', type: 'heart' },
  { left: '90%', top: '52%', size: 15, delay: '0.8s', type: 'sparkle' },
  { left: '12%', top: '76%', size: 13, delay: '3.0s', type: 'sparkle' },
  { left: '82%', top: '82%', size: 11, delay: '1.7s', type: 'heart' },
] as const;

export function FloatingAmbient() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Drifting pastel aurora bokeh glows */}
      <div className="animate-aurora absolute -top-28 -left-24 w-96 h-96 rounded-full bg-pink-200/45 blur-3xl" />
      <div
        className="animate-aurora absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-purple-200/45 blur-3xl"
        style={{ animationDelay: '-5s' }}
      />
      <div
        className="animate-aurora absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-amber-100/55 blur-3xl"
        style={{ animationDelay: '-9s' }}
      />

      {AMBIENT_SPARKLES.map((item, idx) => (
        <div
          key={idx}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
          }}
          className="absolute animate-float-slow text-pink-400/55"
        >
          {item.type === 'heart' ? (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400/65"
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

const BALLOONS = [
  { left: '8%', color: '#F9A8D4', duration: '13s', delay: '0s', scale: 0.9 },
  { left: '24%', color: '#DDD6FE', duration: '15s', delay: '2.5s', scale: 1.05 },
  { left: '46%', color: '#FDE68A', duration: '14s', delay: '1.2s', scale: 0.85 },
  { left: '68%', color: '#FBCFE8', duration: '16s', delay: '3.8s', scale: 1.0 },
  { left: '84%', color: '#C4B5FD', duration: '12.5s', delay: '0.6s', scale: 0.95 },
];

export function BirthdayBalloons() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
    >
      {BALLOONS.map((b, idx) => (
        <div
          key={idx}
          style={{
            left: b.left,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
          className="absolute bottom-0 animate-balloon"
        >
          <svg
            width={48 * b.scale}
            height={88 * b.scale}
            viewBox="0 0 48 88"
            fill="none"
          >
            <ellipse cx="24" cy="24" rx="18" ry="22" fill={b.color} fillOpacity="0.88" />
            <ellipse cx="18" cy="17" rx="4" ry="7" fill="white" fillOpacity="0.45" />
            <path d="M21 46 L24 49 L27 46 Z" fill={b.color} />
            <path
              d="M24 49 C22 60, 27 70, 23 86"
              stroke="#C4A6B8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
