/**
 * BẢNG THÔNG SỐ ĐỊNH DANH BẤT BIẾN (BRAND TOKENS SSOT)
 * Nguồn: 0-rules-and-knowledge/thong-so-dinh-danh-bat-bien.md
 */

export const BRAND_COLORS = {
  // Nền Canvas & Bề mặt
  canvasBg: '#FAF7F2',
  canvasDots: '#E5D6BE',
  cardBg: '#FFFFFF',
  cardBorder: '#E7ECF3',

  // Nhận diện Thương hiệu Chính (Xanh Hoàng Gia)
  primary: '#1F3EB7',
  primaryDark: '#293486',
  primaryLight: '#EEF6FF',

  // Điểm nhấn & Badge PRO (Cam Hổ Phách)
  accentAmber: '#F08806',
  accentAmberLight: '#FFFBEB',

  // Trạng thái Ngữ nghĩa (Đúng / Sai)
  semanticGreen: '#059669', // Say / Correct / Khuyên dùng
  semanticRed: '#DC2626',   // Don't say / Error / Cần tránh

  // Bút Dạ Quang Tô Sáng (Highlighter)
  markerBg: '#FEF08A',
  markerText: '#854D0E',

  // Phân Cấp Chữ (Typography Hierarchy)
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  // Sàn Đấu 3D & Hiệu Ứng Phát Sáng Neon (3D Lighting & Emissives)
  glowAmber: '#FBBF24',
  glowBlue: '#60A5FA',
  glowGreen: '#34D399',
  glowRed: '#F87171',
  glowPodium: '#818CF8',
} as const;

export const BRAND_FONTS = {
  primary: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif",
  heading: "'Montserrat', 'Be Vietnam Pro', system-ui, sans-serif",
  code: "'Fira Code', 'Courier New', monospace",
} as const;
