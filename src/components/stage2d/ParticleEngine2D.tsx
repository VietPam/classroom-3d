import React, { useEffect, useRef } from 'react';
import type { QuizStatus } from '../../types/classroom';

interface ParticleEngine2DProps {
  quizStatus: QuizStatus;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'star';
}

const CONFETTI_COLORS = [
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#10b981', // Green
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#facc15', // Yellow
];

export const ParticleEngine2D: React.FC<ParticleEngine2DProps> = ({ quizStatus }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Sinh chùm pháo hoa giấy rực rỡ khi REVEAL
  useEffect(() => {
    if (quizStatus !== 'REVEAL') {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const newParticles: Particle[] = [];
    const count = 120; // 120 mảnh pháo hoa giấy siêu nhẹ

    for (let i = 0; i < count; i++) {
      // Bắn ra từ 2 góc dưới hoặc giữa bục giảng
      const spawnX = width * (0.2 + Math.random() * 0.6);
      const spawnY = height * (0.35 + Math.random() * 0.15);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      newParticles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5, // Hướng lên trên
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    particlesRef.current = newParticles;
  }, [quizStatus]);

  // Vòng lặp vẽ hạt với tính năng tự ngắt khi tab ẩn (document.hidden)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      } else {
        isRunning = true;
        renderLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const renderLoop = () => {
      if (!isRunning) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      if (particles.length > 0) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          // Vật lý hạt
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // Trọng lực nhẹ rơi xuống
          p.vx *= 0.98; // Lực cản không khí
          p.rotation += p.vRot;
          p.alpha -= 0.006; // Mờ dần

          if (p.alpha <= 0 || p.y > h + 20) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Đồng bộ kích thước canvas với viewport thực tế
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
};
