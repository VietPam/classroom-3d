import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { QuizData, QuizStatus } from '../../types/classroom';
import { BRAND_COLORS } from '../../theme/brandTokens';

interface SmartboardDisplayProps {
  quiz: QuizData;
  status: QuizStatus;
  votePercentages?: Record<'A' | 'B' | 'C' | 'D', number>;
  voteCounts?: Record<'A' | 'B' | 'C' | 'D', number>;
  totalVotes?: number;
}

export function SmartboardDisplay({
  quiz,
  status,
  votePercentages,
  voteCounts,
  totalVotes = 0,
}: SmartboardDisplayProps) {
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
    const catPillW = Math.max(480, catMetrics.width + 48);
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

    // Smart Prompting & Target Word (Tập trung thị giác, loại bỏ text thừa)
    let promptHeadline = '';
    const rawTarget = quiz.targetWord || 'ACCURATE';

    if (quiz.groupId === 'antonyms') {
      promptHeadline = `${rawTarget.toUpperCase()}  ≠  ?`;
    } else if (quiz.groupId === 'fill_blank') {
      promptHeadline = quiz.contextSentence
        ? quiz.contextSentence.replace(/^"|"$/g, '')
        : quiz.question || rawTarget;
    } else {
      promptHeadline = `${rawTarget.toUpperCase()}  =  ?`;
    }

    // Dynamic Font Scaling for Question Headline to prevent overflow
    let headlineFontSize = quiz.groupId === 'fill_blank' ? 44 : 76;
    ctx.font = `900 ${headlineFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
    while (ctx.measureText(promptHeadline).width > boxW - 80 && headlineFontSize > 30) {
      headlineFontSize -= 2;
      ctx.font = `900 ${headlineFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
    }

    ctx.fillStyle = quiz.groupId === 'antonyms' ? BRAND_COLORS.semanticRed : BRAND_COLORS.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(promptHeadline, w / 2, questionY + 140);
    ctx.textBaseline = 'alphabetic'; // restore baseline
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

      // 1. Option Letter Badge (Montserrat 900, Giant 56px font - CĂN GIỮA)
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

      // 2. Main Vocab Word (Extra Large - CĂN GIỮA)
      const wordText = opt.word || '';

      if (status === 'REVEAL') {
        if (isCorrect) {
          // Thẻ ĐÚNG: Nổi bật, bung nghĩa tiếng Việt và banner chúc mừng
          let wordFontSize = 64;
          ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
          while (ctx.measureText(wordText).width > cardW - 40 && wordFontSize > 36) {
            wordFontSize -= 2;
            ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
          }
          ctx.fillStyle = '#065F46';
          ctx.fillText(wordText, centerX, cardY + 225);

          // Vietnamese Meaning (Bung ra giải thích khi công bố kết quả)
          if (opt.meaning) {
            let meaningFontSize = 32;
            ctx.font = `700 ${meaningFontSize}px "Be Vietnam Pro", sans-serif`;
            while (ctx.measureText(opt.meaning).width > cardW - 36 && meaningFontSize > 22) {
              meaningFontSize -= 2;
              ctx.font = `700 ${meaningFontSize}px "Be Vietnam Pro", sans-serif`;
            }
            ctx.fillStyle = '#047857';
            ctx.fillText(opt.meaning, centerX, cardY + 310);
          }

          // Correct Celebration Banner (CĂN GIỮA ĐÁY THẺ)
          const bannerW = cardW - 56;
          const bannerH = 72;
          const bannerX = centerX - bannerW / 2;
          const bannerY = cardY + 475;

          ctx.fillStyle = BRAND_COLORS.semanticGreen;
          ctx.beginPath();
          ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 16);
          ctx.fill();

          const correctPct = votePercentages?.[opt.id] ?? 0;
          ctx.font = '800 28px "Be Vietnam Pro", sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(`✓ ĐÚNG! (${correctPct}%)`, centerX, bannerY + 46);
        } else {
          // Thẻ SAI: Dimmed nhẹ, giữ từ vựng ở trung tâm, không làm rối mắt
          let wordFontSize = 58;
          ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
          while (ctx.measureText(wordText).width > cardW - 40 && wordFontSize > 36) {
            wordFontSize -= 2;
            ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
          }
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(wordText, centerX, cardY + 345);

          // Vote Pill at bottom for wrong card
          const wrongCount = voteCounts?.[opt.id] ?? 0;
          const wrongPct = votePercentages?.[opt.id] ?? 0;
          const pillW = cardW - 56;
          const pillH = 56;
          const pillX = centerX - pillW / 2;
          const pillY = cardY + 485;

          ctx.fillStyle = '#F1F5F9';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 14);
          ctx.fill();

          ctx.font = '700 24px "Montserrat", "Be Vietnam Pro", sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${wrongPct}% • ${wrongCount} phiếu`, centerX, pillY + pillH / 2);
          ctx.textBaseline = 'alphabetic';
        }
      } else {
        // GIAI ĐOẠN ĐANG ĐỐ (RUNNING / THINKING / IDLE):
        // Tuyệt đối KHÔNG hiện IPA hoặc Tiếng Việt để tránh spoil và rác thị giác!
        // Từ vựng được phóng to cực đại, căn giữa hoàn hảo
        let wordFontSize = 68;
        ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
        while (ctx.measureText(wordText).width > cardW - 40 && wordFontSize > 40) {
          wordFontSize -= 2;
          ctx.font = `800 ${wordFontSize}px "Montserrat", "Be Vietnam Pro", sans-serif`;
        }
        ctx.fillStyle = theme.codeText;
        ctx.fillText(wordText, centerX, cardY + 355);

        // Live Crowd Vote Stats Badge (Progress bar + % + count)
        const voteCount = voteCounts?.[opt.id] ?? 0;
        const votePct = votePercentages?.[opt.id] ?? 0;
        const pillW = cardW - 56;
        const pillH = 60;
        const pillX = centerX - pillW / 2;
        const pillY = cardY + 480;

        // Pill background
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 14);
        ctx.fill();
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Progress fill inside pill
        if (votePct > 0) {
          const fillW = Math.max(14, ((pillW - 8) * votePct) / 100);
          ctx.fillStyle = theme.badgeBg;
          ctx.globalAlpha = 0.16;
          ctx.beginPath();
          ctx.roundRect(pillX + 4, pillY + 4, fillW, pillH - 8, 10);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Percentage & Votes text
        ctx.font = '800 26px "Montserrat", "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = theme.codeText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const voteLabel = totalVotes > 0 ? `${votePct}% • ${voteCount} phiếu` : '0% • 0 phiếu';
        ctx.fillText(voteLabel, centerX, pillY + pillH / 2);
        ctx.textBaseline = 'alphabetic';
      }

      ctx.textAlign = 'start';
    });

    texture.needsUpdate = true;
  }, [quiz, status, canvas, texture, votePercentages, voteCounts, totalVotes]);

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
