/**
 * VOTING PARSER
 * Phân tích và chuẩn hóa bình luận tiếng Việt của khán giả để nhận diện đáp án A, B, C, D
 */

import type { VoteOption } from './votingTypes';

// Ký tự spam / cuneiform / zalgo gây crash hoặc lag
const BLOCKED_REGEX = /[\u1200-\u137F\u0E00-\u0E7F\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u2C00-\u2C5F\uA800-\uA82F\u{10000}-\u{10FFFF}]/u;

/**
 * Lọc sạch và chuẩn hóa chuỗi bình luận
 */
export function sanitizeComment(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kiểm tra xem comment có chứa ký tự độc hại hoặc spam không
 */
export function isSpamOrToxic(comment: string): boolean {
  if (!comment) return true;
  if (comment.length > 150) return true; // Comment quá dài
  if (BLOCKED_REGEX.test(comment)) return true;
  return false;
}

/**
 * Phân tích bình luận tìm lựa chọn A, B, C, D
 * Hỗ trợ đa dạng cấu trúc tiếng Việt thường gặp trên TikTok Live:
 * - "A", "b", "C", "d"
 * - "1" -> A, "2" -> B, "3" -> C, "4" -> D
 * - "chọn A", "đáp án B", "câu C nhé", "A nha", "d đi thầy"
 */
export function parseVoteComment(rawComment: string): VoteOption | null {
  const clean = sanitizeComment(rawComment);
  if (!clean || isSpamOrToxic(clean)) return null;

  const lower = clean.toLowerCase();

  // 1. Kiểm tra trường hợp ngắn gọn chính xác 1 ký tự: "a", "b", "c", "d" hoặc "1", "2", "3", "4"
  if (/^[abcd]$/i.test(lower)) {
    return lower.toUpperCase() as VoteOption;
  }
  if (lower === '1') return 'A';
  if (lower === '2') return 'B';
  if (lower === '3') return 'C';
  if (lower === '4') return 'D';

  // 2. Kiểm tra cụm từ có tiền tố: "đáp án a", "chọn c", "câu b", "phương án d"
  const prefixMatch = lower.match(
    /(?:^|[^\p{L}])(?:đáp án|dap an|chọn|chon|câu|cau|phương án|phuong an|là|la|chắc chắn là|chac chan la)\s*([abcd1234])(?![^\s.,!?])/iu
  );
  if (prefixMatch && prefixMatch[1]) {
    const val = prefixMatch[1].toUpperCase();
    if (val === '1') return 'A';
    if (val === '2') return 'B';
    if (val === '3') return 'C';
    if (val === '4') return 'D';
    if (['A', 'B', 'C', 'D'].includes(val)) return val as VoteOption;
  }

  // 3. Kiểm tra ký tự đáp án đứng đầu kèm từ phụ trợ: "A nha", "B nhé", "C ạ", "D đi", "A nè"
  const suffixMatch = lower.match(
    /^([abcd1234])\s+(?:nha|nhé|nhe|ạ|a|ơi|oi|đi|di|nè|ne|chắc luôn|chac luon)(?:$|[^\p{L}])/iu
  );
  if (suffixMatch && suffixMatch[1]) {
    const val = suffixMatch[1].toUpperCase();
    if (val === '1') return 'A';
    if (val === '2') return 'B';
    if (val === '3') return 'C';
    if (val === '4') return 'D';
    if (['A', 'B', 'C', 'D'].includes(val)) return val as VoteOption;
  }

  // 4. Nếu toàn bộ bình luận là 1 ký tự A/B/C/D đứng độc lập (không dính vào chữ tiếng Việt nào)
  const isolatedMatch = lower.match(/(?<!\p{L})([abcd])(?!\p{L})/iu);
  // Chỉ chấp nhận nếu câu rất ngắn (< 15 ký tự) để tránh nhận diện nhầm từ viết tắt trong câu dài
  if (isolatedMatch && isolatedMatch[1] && lower.length <= 15) {
    return isolatedMatch[1].toUpperCase() as VoteOption;
  }

  return null;
}
