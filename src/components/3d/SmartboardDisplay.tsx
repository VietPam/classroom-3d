import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { QuizData, QuizStatus } from '../../types/classroom';
import { BRAND_COLORS } from '../../theme/brandTokens';

interface SmartboardDisplayProps {
  quiz: QuizData;
  status: QuizStatus;
}

export function SmartboardDisplay({ quiz, status }: SmartboardDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(() => typeof document === 'undefined' || !('fonts' in document));

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

  // Anti-FOUT: Wait for brand fonts (Be Vietnam Pro & Montserrat) to be fully ready
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  // Redraw canvas whenever quiz, status, or fonts change
  const redraw = useCallback(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Dark Cyber Smartboard Background (Full Canvas)
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid Pattern across whole board
    ctx.strokeStyle = '#141d2e';
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

    // Content Outer Border (Glowing Green on Reveal, Royal Blue on Idle)
    ctx.strokeStyle = status === 'REVEAL' ? BRAND_COLORS.semanticGreen : BRAND_COLORS.primary;
    ctx.lineWidth = 6;
    ctx.strokeRect(safeX, 15, safeW, h - 30);

    // 2. Header Bar
    ctx.fillStyle = BRAND_COLORS.primaryDark;
    ctx.fillRect(safeX + 10, 25, safeW - 20, 85);

    // Live Status Pulse Dot
    ctx.fillStyle = status === 'REVEAL' ? BRAND_COLORS.semanticGreen : BRAND_COLORS.accentAmber;
    ctx.beginPath();
    ctx.arc(safeX + 45, 68, 12, 0, Math.PI * 2);
    ctx.fill();

    // Quiz Category / Title (Montserrat Bold)
    ctx.font = '800 32px "Montserrat", "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = BRAND_COLORS.textInverse;
    ctx.fillText('⚡ ' + quiz.title.toUpperCase(), safeX + 72, 78);

    // Status Pill on Right of Safe Header (Be Vietnam Pro SemiBold)
    ctx.font = '600 24px "Be Vietnam Pro", monospace';
    ctx.fillStyle = status === 'REVEAL' ? BRAND_COLORS.glowGreen : BRAND_COLORS.primaryLight;
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

    // Question Label (Be Vietnam Pro SemiBold)
    ctx.font = '600 30px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(quiz.question, boxX + 28, 172);

    // Code Snippet Box
    ctx.fillStyle = '#000000';
    ctx.fillRect(boxX + 25, 200, boxW - 50, 145);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(boxX + 25, 200, boxW - 50, 145);

    ctx.font = '700 50px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('>', boxX + 50, 290);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('console', boxX + 90, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('.', boxX + 280, 290);
    ctx.fillStyle = BRAND_COLORS.accentAmber;
    ctx.fillText('log', boxX + 300, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('(', boxX + 380, 290);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('typeof', boxX + 410, 290);
    ctx.fillStyle = BRAND_COLORS.semanticGreen;
    ctx.fillText(' NaN', boxX + 580, 290);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(');', boxX + 705, 290);

    // 4. 4 Option Cards (A, B, C, D) using Brand Palette
    const cardGap = 16;
    const cardW = (boxW - 3 * cardGap) / 4;
    const cardY = 395;
    const cardH = 265;

    // Brand color mapping for options
    const optionColorMap: Record<string, string> = {
      A: BRAND_COLORS.accentAmber,   // #F08806
      B: BRAND_COLORS.primary,       // #1F3EB7
      C: BRAND_COLORS.semanticGreen, // #059669
      D: BRAND_COLORS.semanticRed,   // #DC2626
    };

    quiz.options.forEach((opt, idx) => {
      const cardX = boxX + idx * (cardW + cardGap);
      const isCorrect = status === 'REVEAL' && opt.id === quiz.correctOption;
      const isWrong = status === 'REVEAL' && opt.id !== quiz.correctOption;
      const optBrandColor = optionColorMap[opt.id] || BRAND_COLORS.primary;

      // Card Background
      ctx.fillStyle = isCorrect ? '#064e3b' : '#0f172a';
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // Card Border
      ctx.strokeStyle = isCorrect
        ? BRAND_COLORS.glowGreen
        : isWrong
        ? '#1e293b'
        : optBrandColor;
      ctx.lineWidth = isCorrect ? 7 : 3.5;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Option Letter Badge (Montserrat 800)
      ctx.fillStyle = optBrandColor;
      ctx.beginPath();
      ctx.roundRect(cardX + 20, cardY + 20, 60, 60, 14);
      ctx.fill();

      ctx.font = '800 38px "Montserrat", "Be Vietnam Pro", monospace';
      ctx.fillStyle = BRAND_COLORS.textInverse;
      ctx.fillText(opt.id, cardX + 37, cardY + 64);

      // Option Value (Fira Code / Monospace)
      ctx.font = '700 38px "Courier New", monospace';
      ctx.fillStyle = isWrong ? BRAND_COLORS.textMuted : BRAND_COLORS.textInverse;
      ctx.fillText(opt.code, cardX + 22, cardY + 155);

      // Correct Badge if Revealed (Be Vietnam Pro Bold)
      if (isCorrect) {
        ctx.fillStyle = BRAND_COLORS.semanticGreen;
        ctx.beginPath();
        ctx.roundRect(cardX + 16, cardY + 195, cardW - 32, 48, 10);
        ctx.fill();

        ctx.font = '700 24px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = BRAND_COLORS.textInverse;
        ctx.fillText('✓ ĐÁP ÁN ĐÚNG!', cardX + cardW / 2 - 95, cardY + 228);
      }
    });

    // 5. Footer Explanation Banner with Brand Marker Highlighter
    ctx.fillStyle = status === 'REVEAL' ? '#064e3b' : '#0f172a';
    ctx.fillRect(boxX, 680, boxW, 150);
    ctx.strokeStyle = status === 'REVEAL' ? BRAND_COLORS.semanticGreen : '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, 680, boxW, 150);

    // Marker Badge Label
    ctx.fillStyle = BRAND_COLORS.markerBg;
    ctx.beginPath();
    ctx.roundRect(boxX + 24, 702, 170, 36, 8);
    ctx.fill();

    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = BRAND_COLORS.markerText;
    ctx.fillText('💡 GIẢI THÍCH', boxX + 40, 727);

    // Explanation Body Text (Be Vietnam Pro Regular)
    ctx.font = '500 25px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = BRAND_COLORS.textInverse;
    const explanationText =
      status === 'REVEAL'
        ? quiz.explanation
        : 'Hãy quan sát 4 học sinh chạy về ô tương ứng và chọn đáp án trước khi hết giờ!';
    ctx.fillText(explanationText, boxX + 24, 775);

    texture.needsUpdate = true;
  }, [quiz, status, canvas, texture]);

  useEffect(() => {
    redraw();
  }, [redraw, fontsLoaded]);

  return (
    <mesh position={[0, 2.25, 5.88]} rotation={[0, Math.PI, 0]} receiveShadow>
      <planeGeometry args={[8.92, 3.80]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
