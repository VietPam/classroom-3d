import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { QuizData, QuizStatus } from '../../types/classroom';

interface SmartboardDisplayProps {
  quiz: QuizData;
  status: QuizStatus;
}

export function SmartboardDisplay({ quiz, status }: SmartboardDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Setup high-res 2048 x 880 canvas
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 880;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return { canvas: c, texture: tex };
  }, []);

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);

  // Redraw canvas whenever quiz or status changes
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Dark Cyber Smartboard Background (Full Canvas)
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid Pattern across whole board
    ctx.strokeStyle = '#162033';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 64) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 64) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // ================= MOBILE PORTRAIT SAFE CONTENT BOUNDS =================
    // Camera in 9:16 portrait views the central ~65% of the 9m wide board
    const safeX = 360;
    const safeW = 1328;

    // Content Border
    ctx.strokeStyle = status === 'REVEAL' ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(safeX, 15, safeW, h - 30);

    // 2. Header Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(safeX + 10, 25, safeW - 20, 85);

    // Live Status Pulse Dot
    ctx.fillStyle = status === 'REVEAL' ? '#10b981' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(safeX + 45, 68, 12, 0, Math.PI * 2);
    ctx.fill();

    // Quiz Category / Title
    ctx.font = 'bold 32px "Segoe UI", Roboto, system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('⚡ ' + quiz.title.toUpperCase(), safeX + 72, 78);

    // Status Pill on Right of Safe Header
    ctx.font = 'bold 24px "Segoe UI", Roboto, monospace';
    ctx.fillStyle = status === 'REVEAL' ? '#34d399' : '#94a3b8';
    const statusText =
      status === 'RUNNING'
        ? '🏃 ĐANG CHẠY ĐUA CHỌN Ô...'
        : status === 'THINKING'
        ? '🤔 ĐANG CÂN NHẮC ĐÁP ÁN...'
        : status === 'REVEAL'
        ? '🎉 CÔNG BỐ: Ô A ĐÚNG!'
        : status === 'PRESENTING'
        ? '🎤 HỌC SINH ĐANG LÊN BẢNG'
        : '⚡ SẴN SÀNG - CHỜ BẮT ĐẦU';
    ctx.fillText(statusText, safeX + safeW - 440, 77);

    // 3. Question & Code Box
    const boxX = safeX + 25;
    const boxW = safeW - 50;

    ctx.fillStyle = '#020617';
    ctx.fillRect(boxX, 125, boxW, 250);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxX, 125, boxW, 250);

    // Question Label
    ctx.font = 'bold 30px "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(quiz.question, boxX + 28, 172);

    // Code Snippet Box
    ctx.fillStyle = '#000000';
    ctx.fillRect(boxX + 25, 200, boxW - 50, 145);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(boxX + 25, 200, boxW - 50, 145);

    ctx.font = 'bold 50px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('>', boxX + 50, 290);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('console', boxX + 90, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('.', boxX + 280, 290);
    ctx.fillStyle = '#facc15';
    ctx.fillText('log', boxX + 300, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('(', boxX + 380, 290);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('typeof', boxX + 410, 290);
    ctx.fillStyle = '#34d399';
    ctx.fillText(' NaN', boxX + 580, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(');', boxX + 705, 290);

    // 4. 4 Option Cards (A, B, C, D) inside Safe Bounds
    const cardGap = 16;
    const cardW = (boxW - 3 * cardGap) / 4;
    const cardY = 395;
    const cardH = 265;

    quiz.options.forEach((opt, idx) => {
      const cardX = boxX + idx * (cardW + cardGap);
      const isCorrect = status === 'REVEAL' && opt.id === quiz.correctOption;
      const isWrong = status === 'REVEAL' && opt.id !== quiz.correctOption;

      // Card Background
      ctx.fillStyle = isCorrect ? '#064e3b' : '#0f172a';
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // Card Border
      ctx.strokeStyle = isCorrect
        ? '#34d399'
        : isWrong
        ? '#1e293b'
        : opt.id === 'A'
        ? '#f59e0b'
        : opt.id === 'B'
        ? '#38bdf8'
        : opt.id === 'C'
        ? '#10b981'
        : '#f43f5e';
      ctx.lineWidth = isCorrect ? 7 : 3;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Option Letter Badge
      ctx.fillStyle = opt.id === 'A'
        ? '#f59e0b'
        : opt.id === 'B'
        ? '#38bdf8'
        : opt.id === 'C'
        ? '#10b981'
        : '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(cardX + 20, cardY + 20, 60, 60, 14);
      ctx.fill();

      ctx.font = 'bold 38px "Segoe UI", Roboto, monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(opt.id, cardX + 37, cardY + 64);

      // Option Value
      ctx.font = 'bold 38px "Courier New", monospace';
      ctx.fillStyle = isWrong ? '#475569' : '#f8fafc';
      ctx.fillText(opt.code, cardX + 22, cardY + 155);

      // Correct Badge if Revealed
      if (isCorrect) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(cardX + 16, cardY + 195, cardW - 32, 48, 10);
        ctx.fill();

        ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('✓ ĐÁP ÁN ĐÚNG!', cardX + cardW / 2 - 95, cardY + 228);
      }
    });

    // 5. Footer Explanation Banner
    ctx.fillStyle = status === 'REVEAL' ? '#064e3b' : '#0f172a';
    ctx.fillRect(boxX, 680, boxW, 150);
    ctx.strokeStyle = status === 'REVEAL' ? '#10b981' : '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, 680, boxW, 150);

    ctx.font = 'bold 26px "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = status === 'REVEAL' ? '#34d399' : '#94a3b8';
    ctx.fillText('💡 GIẢI THÍCH:', boxX + 24, 725);

    ctx.font = '24px "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    const explanationText =
      status === 'REVEAL'
        ? quiz.explanation
        : 'Hãy quan sát 4 học sinh chạy về ô tương ứng và chọn đáp án trước khi hết giờ!';
    ctx.fillText(explanationText, boxX + 24, 770);

    texture.needsUpdate = true;
  }, [quiz, status, canvas, texture]);

  return (
    <mesh position={[0, 2.25, 5.88]} rotation={[0, Math.PI, 0]} receiveShadow>
      <planeGeometry args={[8.92, 3.80]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
