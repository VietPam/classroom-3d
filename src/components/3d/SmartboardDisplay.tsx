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

    // 1. Light Pastel Smartboard Background (Full Canvas Coverage)
    // Brand token SSOT: canvasBg = #FAF7F2, canvasDots = #E5D6BE
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, w, h);

    // Delicate Pastel Micro-Grid Dots across the entire board
    ctx.fillStyle = '#E5D6BE';
    for (let x = 32; x < w; x += 48) {
      for (let y = 32; y < h; y += 48) {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Board Accent Border (Revealed: Vibrant Green, Normal: Soft Slate)
    ctx.strokeStyle = status === 'REVEAL' ? BRAND_COLORS.semanticGreen : '#CBD5E1';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 12, w - 32, h - 24);

    // ================= FULL BOARD CONTENT BOUNDS (Bao quát tối đa diện tích hiển thị) =================
    const margin = 110;
    const boxX = margin;
    const boxW = w - 2 * margin; // 1828px wide - Perfectly framed within 9:16 mobile portrait view

    // 2. Question Card (Màn hình chỉ tập trung Câu hỏi & Đáp án, đã xóa header & badge góc phải)
    const questionY = 24;
    const questionH = 222;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(boxX, questionY, boxW, questionH, 18);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Category / Level Badge (Centered at top of Question Box)
    const categoryText = `⚡ ${quiz.groupName ? quiz.groupName.toUpperCase() : (quiz.category ? quiz.category.toUpperCase() : 'VOCABULARY')} • CÂU ${quiz.quizNumber || 1}/${quiz.totalQuizzes || 12}`;
    ctx.font = '700 24px "Be Vietnam Pro", sans-serif';
    const catMetrics = ctx.measureText(categoryText);
    const catPillW = Math.max(500, catMetrics.width + 48);
    const catPillH = 38;
    const catPillX = w / 2 - catPillW / 2;
    const catPillY = questionY + 16;

    ctx.fillStyle = BRAND_COLORS.primaryLight; // #EEF6FF
    ctx.beginPath();
    ctx.roundRect(catPillX, catPillY, catPillW, catPillH, 10);
    ctx.fill();
    ctx.strokeStyle = '#BFDBFE';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = BRAND_COLORS.primary;
    ctx.textAlign = 'center';
    ctx.fillText(categoryText, w / 2, catPillY + 26);

    // Question Prompt (e.g. "CHOOSE THE CLOSEST SYNONYM FOR:")
    ctx.font = '700 36px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(quiz.question, w / 2, questionY + 98);

    // Target Word (e.g. "METICULOUS" - Giant bold brand headline)
    const target = quiz.targetWord || quiz.title || 'METICULOUS';
    ctx.font = '900 64px "Montserrat", "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = BRAND_COLORS.primary;
    ctx.fillText(target, w / 2, questionY + 165);

    // Context Sentence (Optional subtle example sentence)
    if (quiz.contextSentence) {
      ctx.font = '500 26px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(quiz.contextSentence, w / 2, questionY + 204);
    }
    ctx.textAlign = 'start';

    // 3. 4 Option Cards (A, B, C, D) - ĐÁP ÁN CĂN GIỮA TUYỆT ĐỐI (Chiều cao 595px)
    const cardGap = 20;
    const cardW = (boxW - 3 * cardGap) / 4; // ~442px each
    const cardY = 262;
    const cardH = 595;

    // Pastel Theme tokens cho từng ô lựa chọn
    const pastelOptionThemes: Record<
      string,
      {
        bg: string;
        border: string;
        badgeBg: string;
        codeText: string;
      }
    > = {
      A: {
        bg: '#FFFBEB',
        border: '#FCD34D',
        badgeBg: BRAND_COLORS.accentAmber,
        codeText: '#92400E',
      },
      B: {
        bg: '#EFF6FF',
        border: '#93C5FD',
        badgeBg: BRAND_COLORS.primary,
        codeText: '#1E40AF',
      },
      C: {
        bg: '#ECFDF5',
        border: '#6EE7B7',
        badgeBg: BRAND_COLORS.semanticGreen,
        codeText: '#065F46',
      },
      D: {
        bg: '#FEF2F2',
        border: '#FCA5A5',
        badgeBg: BRAND_COLORS.semanticRed,
        codeText: '#991B1B',
      },
    };

    quiz.options.forEach((opt, idx) => {
      const cardX = boxX + idx * (cardW + cardGap);
      const centerX = cardX + cardW / 2;
      const isCorrect = status === 'REVEAL' && opt.id === quiz.correctOption;
      const isWrong = status === 'REVEAL' && opt.id !== quiz.correctOption;
      const theme = pastelOptionThemes[opt.id] || pastelOptionThemes.A;

      // Card Background (Light pastel tone, highlight bright mint on reveal correct)
      ctx.fillStyle = isCorrect ? '#D1FAE5' : isWrong ? '#F8FAFC' : theme.bg;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();

      // Card Border
      ctx.strokeStyle = isCorrect
        ? BRAND_COLORS.semanticGreen
        : isWrong
        ? '#E2E8F0'
        : theme.border;
      ctx.lineWidth = isCorrect ? 8 : isWrong ? 2 : 4;
      ctx.stroke();

      // 1. Option Letter Badge (Montserrat 900, Giant 54px font - CĂN GIỮA)
      const badgeSize = 88;
      const badgeX = centerX - badgeSize / 2;
      const badgeY = cardY + 36;

      ctx.fillStyle = isWrong ? '#94A3B8' : isCorrect ? BRAND_COLORS.semanticGreen : theme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 18);
      ctx.fill();

      ctx.font = '900 56px "Montserrat", "Be Vietnam Pro", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(opt.id, centerX, badgeY + 64);

      // 2. Main Vocab Word (Extra Large 52px - CĂN GIỮA)
      const wordText = opt.word || opt.code || '';
      ctx.font = '800 52px "Be Vietnam Pro", "Montserrat", sans-serif';
      ctx.fillStyle = isCorrect ? '#065F46' : isWrong ? '#94A3B8' : theme.codeText;
      ctx.fillText(wordText, centerX, cardY + 205);

      // 3. Phonetics IPA (32px Monospace - CĂN GIỮA)
      if (opt.ipa) {
        ctx.font = '500 32px "Be Vietnam Pro", monospace';
        ctx.fillStyle = isWrong ? '#CBD5E1' : '#64748B';
        ctx.fillText(opt.ipa, centerX, cardY + 270);
      }

      // 4. Vietnamese Meaning (30px SemiBold - CĂN GIỮA)
      if (opt.meaning) {
        ctx.font = '600 30px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = isWrong ? '#CBD5E1' : '#334155';
        ctx.fillText(opt.meaning, centerX, cardY + 340);
      }

      // 5. Correct Celebration Banner if Revealed (CĂN GIỮA ĐÁY THẺ)
      if (isCorrect) {
        const bannerW = cardW - 56;
        const bannerH = 70;
        const bannerX = centerX - bannerW / 2;
        const bannerY = cardY + 480;

        ctx.fillStyle = BRAND_COLORS.semanticGreen;
        ctx.beginPath();
        ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 16);
        ctx.fill();

        ctx.font = '800 30px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('✓ ĐÁP ÁN ĐÚNG!', centerX, bannerY + 45);
      }
      ctx.textAlign = 'start';
    });

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
