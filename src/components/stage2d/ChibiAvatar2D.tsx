import React from 'react';
import type { StudentData, CharacterState } from '../../types/classroom';

interface ChibiAvatar2DProps {
  data: StudentData;
  state?: CharacterState;
  onClick?: () => void;
  showName?: boolean;
}

export const ChibiAvatar2D: React.FC<ChibiAvatar2DProps> = ({
  data,
  state = data.currentState || 'IDLE',
  onClick,
  showName = true,
}) => {
  const {
    name,
    skinTone,
    hairColor,
    hairStyle,
    shirtColor,
    pantsColor,
    shoesColor,
    accessory = 'none',
  } = data;

  // Quyết định biểu cảm khuôn mặt và tư thế tay/chân
  const isJumping = state === 'CELEBRATING';
  const isRunning = state === 'WALKING';
  const isWaving = state === 'WAVE';
  const isRaisingHand = state === 'RAISE_HAND';
  const isDancing = state === 'DANCE';
  const isShocked = state === 'SHOCKED';
  const isThinking = state === 'THINKING';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none cursor-pointer group transition-transform duration-300 ${
        isJumping ? 'animate-bounce' : isDancing ? 'animate-pulse' : ''
      }`}
      style={{
        width: '68px',
        height: '92px',
      }}
    >
      {/* 1. Bảng tên nổi trên đầu */}
      {showName && (
        <div
          className={`absolute -top-5 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-md whitespace-nowrap pointer-events-none transition-all duration-200 z-20 ${
            isJumping
              ? 'bg-amber-400 text-amber-950 scale-110 ring-2 ring-amber-300'
              : 'bg-slate-900/85 text-slate-100 border border-slate-700/80 backdrop-blur-xs'
          }`}
        >
          {name}
        </div>
      )}

      {/* 2. Vector SVG Chibi Character */}
      <svg
        viewBox="0 0 100 135"
        className="w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Đổ bóng cho tóc */}
          <filter id={`shadow_${data.id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ================= BÓNG ĐỔ DƯỚI CHÂN ================= */}
        <ellipse
          cx="50"
          cy="126"
          rx={isJumping ? '14' : '22'}
          ry={isJumping ? '3.5' : '6'}
          fill="rgba(15, 23, 42, 0.35)"
          className="transition-all duration-300"
        />

        {/* ================= HAI CHÂN & GIÀY ================= */}
        <g
          className={`transition-transform duration-200 ${
            isRunning ? 'animate-pulse' : ''
          }`}
        >
          {/* Chân trái */}
          <rect
            x="36"
            y="94"
            width="10"
            height="24"
            rx="5"
            fill={pantsColor}
          />
          {/* Giày trái */}
          <ellipse cx="40" cy="120" rx="8" ry="5" fill={shoesColor} />
          <ellipse cx="38" cy="119" rx="4" ry="2.5" fill="#ffffff" opacity="0.3" />

          {/* Chân phải */}
          <rect
            x="54"
            y="94"
            width="10"
            height="24"
            rx="5"
            fill={pantsColor}
          />
          {/* Giày phải */}
          <ellipse cx="60" cy="120" rx="8" ry="5" fill={shoesColor} />
          <ellipse cx="58" cy="119" rx="4" ry="2.5" fill="#ffffff" opacity="0.3" />
        </g>

        {/* ================= THÂN & ÁO ĐỒNG PHỤC ================= */}
        <g>
          {/* Áo thân trên */}
          <path
            d="M 28 66 L 72 66 L 68 100 L 32 100 Z"
            fill={shirtColor}
          />

          {/* Cổ áo trắng học sinh */}
          <polygon points="50,78 40,66 60,66" fill="#ffffff" />
          <line x1="50" y1="78" x2="50" y2="94" stroke="#ffffff" strokeWidth="2" strokeDasharray="3,2" />

          {/* Nơ / Cà vạt nhỏ */}
          <circle cx="50" cy="74" r="3.5" fill="#e11d48" />

          {/* Viền gấu quần */}
          <rect x="31" y="96" width="38" height="6" fill={pantsColor} />
        </g>

        {/* ================= TAY TRÁI & TAY PHẢI ================= */}
        {/* Tay trái */}
        {isJumping ? (
          // Bung hai tay lên trời ăn mừng
          <path d="M 30 68 Q 15 48 20 34" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : isDancing ? (
          <path d="M 30 70 Q 14 75 16 60" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 30 68 Q 20 82 24 95" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        )}
        {/* Bàn tay trái */}
        <circle
          cx={isJumping ? 20 : isDancing ? 16 : 24}
          cy={isJumping ? 32 : isDancing ? 58 : 96}
          r="4.5"
          fill={skinTone}
        />

        {/* Tay phải */}
        {isJumping ? (
          // Bung hai tay lên trời
          <path d="M 70 68 Q 85 48 80 34" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : isRaisingHand ? (
          // Giơ tay phát biểu thẳng đứng
          <path d="M 70 68 Q 80 45 80 28" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : isWaving ? (
          // Vẫy tay chào
          <path d="M 70 68 Q 88 55 86 42" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : isDancing ? (
          <path d="M 70 70 Q 86 75 84 60" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 70 68 Q 80 82 76 95" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        )}
        {/* Bàn tay phải */}
        <circle
          cx={isJumping ? 80 : isRaisingHand ? 80 : isWaving ? 86 : isDancing ? 84 : 76}
          cy={isJumping ? 32 : isRaisingHand ? 26 : isWaving ? 40 : isDancing ? 58 : 96}
          r="4.5"
          fill={skinTone}
        />

        {/* ================= ĐẦU CHIBI TRÒN TRỊA ================= */}
        {/* Cổ */}
        <rect x="44" y="58" width="12" height="10" fill={skinTone} />

        {/* Khuôn mặt tròn */}
        <ellipse cx="50" cy="42" rx="27" ry="25" fill={skinTone} />

        {/* Hai tai */}
        <circle cx="23" cy="44" r="5.5" fill={skinTone} />
        <circle cx="77" cy="44" r="5.5" fill={skinTone} />

        {/* Má hồng hào Kawaii */}
        <ellipse cx="33" cy="48" rx="5" ry="3" fill="#fb7185" opacity="0.5" />
        <ellipse cx="67" cy="48" rx="5" ry="3" fill="#fb7185" opacity="0.5" />

        {/* ================= BIỂU CẢM MẮT & MIỆNG ================= */}
        {isJumping ? (
          // Mắt cười híp hình vòng cung hạnh phúc (^^)
          <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 32 40 Q 38 34 44 40" />
            <path d="M 56 40 Q 62 34 68 40" />
            {/* Miệng cười to hạnh phúc */}
            <path d="M 42 49 Q 50 60 58 49 Z" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" />
          </g>
        ) : isShocked ? (
          // Mắt tròn xoe giật mình (O_O)
          <g>
            <circle cx="38" cy="40" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="38" cy="40" r="2.5" fill="#1e293b" />
            <circle cx="62" cy="40" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="62" cy="40" r="2.5" fill="#1e293b" />
            {/* Miệng tròn chữ O */}
            <ellipse cx="50" cy="52" rx="4" ry="5.5" fill="#e11d48" />
            {/* Giọt mồ hôi lo lắng */}
            <path d="M 76 30 Q 74 38 72 40 Q 70 38 72 32 Z" fill="#38bdf8" />
          </g>
        ) : isThinking ? (
          // Mắt liếc lên suy nghĩ
          <g>
            <ellipse cx="38" cy="40" rx="5" ry="6" fill="#1e293b" />
            <circle cx="39" cy="38" r="2" fill="#ffffff" />
            <ellipse cx="62" cy="40" rx="5" ry="6" fill="#1e293b" />
            <circle cx="63" cy="38" r="2" fill="#ffffff" />
            {/* Miệng mím nhẹ */}
            <path d="M 46 51 Q 50 53 54 50" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Mắt anime to tròn long lanh bình thường
          <g>
            <ellipse cx="38" cy="40" rx="5" ry="6.5" fill="#1e293b" />
            <circle cx="37" cy="38" r="2.2" fill="#ffffff" />
            <circle cx="40" cy="43" r="1.2" fill="#ffffff" />

            <ellipse cx="62" cy="40" rx="5" ry="6.5" fill="#1e293b" />
            <circle cx="61" cy="38" r="2.2" fill="#ffffff" />
            <circle cx="64" cy="43" r="1.2" fill="#ffffff" />

            {/* Lông mày nhẹ */}
            <path d="M 33 32 Q 38 30 43 32" stroke={hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 57 32 Q 62 30 67 32" stroke={hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Nụ cười mỉm đáng yêu */}
            <path d="M 45 50 Q 50 55 55 50" stroke="#be123c" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ================= KIỂU TÓC (4 STYLES) ================= */}
        {hairStyle === 'short' && (
          // Tóc ngắn nam / tomboy gọn gàng
          <path
            d="M 23 40 C 20 22 34 16 50 16 C 66 16 80 22 77 40 C 72 32 68 30 64 33 C 58 28 52 28 48 34 C 42 29 36 30 31 35 C 27 34 24 38 23 40 Z"
            fill={hairColor}
          />
        )}

        {hairStyle === 'curly' && (
          // Tóc xoăn bồng bềnh
          <g fill={hairColor}>
            <circle cx="30" cy="24" r="11" />
            <circle cx="50" cy="18" r="13" />
            <circle cx="70" cy="24" r="11" />
            <circle cx="22" cy="36" r="9" />
            <circle cx="78" cy="36" r="9" />
            {/* Mái xoăn nhẹ trước trán */}
            <path d="M 30 34 Q 40 28 50 35 Q 60 28 70 34" stroke={hairColor} strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        )}

        {hairStyle === 'ponytail' && (
          // Tóc đuôi ngựa buộc cao nữ sinh
          <g fill={hairColor}>
            {/* Tóc mái */}
            <path
              d="M 23 42 C 20 24 34 18 50 18 C 66 18 80 24 77 42 C 72 32 64 30 50 32 C 36 30 28 32 23 42 Z"
            />
            {/* Đuôi tóc vểnh sang một bên */}
            <path
              d="M 68 18 Q 86 10 90 26 Q 84 32 72 24 Z"
            />
            {/* Dây buộc tóc xinh xắn */}
            <circle cx="70" cy="20" r="4" fill="#f43f5e" />
          </g>
        )}

        {hairStyle === 'buzz' && (
          // Tóc đầu đinh cá tính
          <path
            d="M 25 40 C 22 26 34 20 50 20 C 66 20 78 26 75 40 C 72 34 66 32 50 32 C 34 32 28 34 25 40 Z"
            fill={hairColor}
          />
        )}

        {/* ================= PHỤ KIỆN (ACCESSORIES) ================= */}
        {accessory === 'orange' && (
          // Quả cam nhỏ trên đầu (linh vật Capybara)
          <g>
            <circle cx="50" cy="14" r="7.5" fill="#f97316" />
            <ellipse cx="52" cy="12" rx="2" ry="1" fill="#fdba74" />
            <path d="M 50 7 Q 53 4 56 6" stroke="#15803d" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {accessory === 'red_bow' && (
          // Nơ đỏ to trên tóc
          <g fill="#e11d48">
            <polygon points="50,18 40,12 40,24" />
            <polygon points="50,18 60,12 60,24" />
            <circle cx="50" cy="18" r="3.5" fill="#be123c" />
          </g>
        )}

        {accessory === 'glasses' && (
          // Cặp kính tròn trí thức
          <g stroke="#334155" strokeWidth="2" fill="none">
            <circle cx="38" cy="40" r="8" fill="rgba(255,255,255,0.25)" />
            <circle cx="62" cy="40" r="8" fill="rgba(255,255,255,0.25)" />
            <line x1="46" y1="40" x2="54" y2="40" />
          </g>
        )}

        {accessory === 'scholar_hat' && (
          // Mũ tốt nghiệp / học giả tí hon
          <g>
            <polygon points="50,6 28,14 50,20 72,14" fill="#0f172a" />
            <rect x="42" y="16" width="16" height="6" fill="#1e293b" />
            <line x1="50" y1="13" x2="68" y2="24" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="68" cy="24" r="2" fill="#d97706" />
          </g>
        )}

        {accessory === 'lotus' && (
          // Hoa sen hồng cài tóc
          <g fill="#f43f5e">
            <ellipse cx="70" cy="24" rx="4" ry="6" transform="rotate(25 70 24)" />
            <ellipse cx="74" cy="26" rx="4" ry="6" transform="rotate(60 74 26)" />
            <circle cx="71" cy="26" r="2.5" fill="#fef08a" />
          </g>
        )}
      </svg>
    </div>
  );
};
