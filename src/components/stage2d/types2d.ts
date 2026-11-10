import type { VoteOption } from '../../modules/voting/votingTypes';
import type { ClassroomStore } from '../../hooks/useClassroomStore';

export interface Stage2DProps {
  store: ClassroomStore;
}

export interface ChibiVisualConfig {
  scale: number;
  isFlipped?: boolean;
}

/**
 * Tọa độ 2.5D theo phần trăm (0% - 100%) của khung hình stage 9:16
 */
export interface ScreenPosition2D {
  x: number; // 0% (trái) đến 100% (phải)
  y: number; // 0% (đỉnh) đến 100% (đáy)
  scale: number; // Tỉ lệ kích thước theo độ sâu phối cảnh (0.7x - 1.1x)
  zIndex: number; // Thứ tự lớp hiển thị theo trục Y
}

/**
 * 4 Vị trí trung tâm của 4 ô đáp án trên sàn đấu 2.5D (ngay dưới 4 cột của Smartboard)
 */
export const ZONE_2D_CENTERS: Record<VoteOption, { x: number; y: number }> = {
  A: { x: 14.0, y: 36.0 }, // Cột A (Trái ngoài)
  B: { x: 38.0, y: 36.0 }, // Cột B (Trái trong)
  C: { x: 62.0, y: 36.0 }, // Cột C (Phải trong)
  D: { x: 86.0, y: 36.0 }, // Cột D (Phải ngoài)
};

/**
 * Ma trận vị trí đứng của tối đa 20 học sinh bên trong mỗi ô đáp án (4 hàng x 5 bạn)
 * Khoảng cách tính theo % offset so với tâm của ô
 */
export const ZONE_SLOT_2D_OFFSETS: { dx: number; dy: number }[] = [
  // Hàng 1 (phía sau bên trong ô)
  { dx: -4.8, dy: -1.6 },
  { dx: -2.4, dy: -1.6 },
  { dx: 0.0, dy: -1.6 },
  { dx: 2.4, dy: -1.6 },
  { dx: 4.8, dy: -1.6 },

  // Hàng 2
  { dx: -4.8, dy: -0.4 },
  { dx: -2.4, dy: -0.4 },
  { dx: 0.0, dy: -0.4 },
  { dx: 2.4, dy: -0.4 },
  { dx: 4.8, dy: -0.4 },

  // Hàng 3 (ở giữa ô)
  { dx: -4.8, dy: 0.8 },
  { dx: -2.4, dy: 0.8 },
  { dx: 0.0, dy: 0.8 },
  { dx: 2.4, dy: 0.8 },
  { dx: 4.8, dy: 0.8 },

  // Hàng 4 (mép trước ô)
  { dx: -4.8, dy: 2.0 },
  { dx: -2.4, dy: 2.0 },
  { dx: 0.0, dy: 2.0 },
  { dx: 2.4, dy: 2.0 },
  { dx: 4.8, dy: 2.0 },
];

/**
 * Vị trí 20 bàn học ban đầu (4 hàng x 5 bạn) phía dưới sàn đấu
 * Đảm bảo hàng 4 (Y = 74.5%) cách xa HUD điều khiển (Y = 81%)
 */
export const DESK_2D_POSITIONS: Record<string, { x: number; y: number }> = {
  // Hàng 1 (Y = 49%)
  s4: { x: 14, y: 49 },
  s2: { x: 32, y: 49 },
  s1: { x: 50, y: 49 },
  s3: { x: 68, y: 49 },
  s5: { x: 86, y: 49 },

  // Hàng 2 (Y = 57.5%)
  s6: { x: 14, y: 57.5 },
  s7: { x: 32, y: 57.5 },
  s8: { x: 50, y: 57.5 },
  s9: { x: 68, y: 57.5 },
  s10: { x: 86, y: 57.5 },

  // Hàng 3 (Y = 66%)
  s11: { x: 14, y: 66 },
  s12: { x: 32, y: 66 },
  s13: { x: 50, y: 66 },
  s14: { x: 68, y: 66 },
  s15: { x: 86, y: 66 },

  // Hàng 4 (Y = 74.5% - cách xa HUD phía dưới)
  s16: { x: 14, y: 74.5 },
  s17: { x: 32, y: 74.5 },
  s18: { x: 50, y: 74.5 },
  s19: { x: 68, y: 74.5 },
  s20: { x: 86, y: 74.5 },
};
