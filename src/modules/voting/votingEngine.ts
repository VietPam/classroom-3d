/**
 * VOTING ENGINE
 * Động cơ tính toán phiếu bầu và phân bổ học sinh theo thuật toán Hamilton (Largest Remainder Method)
 */

import type {
  VoteOption,
  VoteCounts,
  VotePercentages,
  StudentDistribution,
  VotingState,
  VoteEvent,
} from './votingTypes';

export const ALL_OPTIONS: VoteOption[] = ['A', 'B', 'C', 'D'];

/**
 * Khởi tạo trạng thái bình chọn rỗng
 */
export function createInitialVotingState(): VotingState {
  return {
    voteCounts: { A: 0, B: 0, C: 0, D: 0 },
    votePercentages: { A: 25, B: 25, C: 25, D: 25 },
    totalVotes: 0,
    recentVoters: [],
  };
}

/**
 * Tính toán tỷ lệ phần trăm tròn (%) cho từng đáp án
 */
export function calculatePercentages(counts: VoteCounts): VotePercentages {
  const total = counts.A + counts.B + counts.C + counts.D;
  if (total === 0) {
    return { A: 25, B: 25, C: 25, D: 25 };
  }

  const rawA = (counts.A / total) * 100;
  const rawB = (counts.B / total) * 100;
  const rawC = (counts.C / total) * 100;
  const rawD = (counts.D / total) * 100;

  return {
    A: Math.round(rawA),
    B: Math.round(rawB),
    C: Math.round(rawC),
    D: Math.round(rawD),
  };
}

/**
 * Thuật toán Hamilton (Largest Remainder Method)
 * Phân bổ chính xác tổng số học sinh (mặc định 20 bạn) dựa trên tỷ lệ phiếu bầu thực tế.
 * Đảm bảo: Tổng số học sinh được phân bổ luôn luôn đúng bằng totalStudents.
 */
export function calculateStudentDistribution(
  totalStudents: number,
  counts: VoteCounts,
  fallbackCorrect?: VoteOption
): StudentDistribution {
  const totalVotes = counts.A + counts.B + counts.C + counts.D;

  // Nếu chưa có ai bỏ phiếu: phân bổ phân tán tự nhiên (tập trung nhẹ vào đáp án đúng nếu có)
  if (totalVotes === 0) {
    if (fallbackCorrect) {
      const rest = ALL_OPTIONS.filter((o) => o !== fallbackCorrect);
      return {
        [fallbackCorrect]: 8,
        [rest[0]]: 4,
        [rest[1]]: 4,
        [rest[2]]: 4,
      } as StudentDistribution;
    }
    return { A: 5, B: 5, C: 5, D: 5 };
  }

  // 1. Tính toán quota nguyên và phần dư
  const quotas = ALL_OPTIONS.map((opt) => {
    const exact = (counts[opt] / totalVotes) * totalStudents;
    const integerPart = Math.floor(exact);
    const remainder = exact - integerPart;
    return { option: opt, integerPart, remainder };
  });

  // 2. Tổng số đã phân bổ ban đầu
  let allocatedTotal = quotas.reduce((sum, q) => sum + q.integerPart, 0);
  let remainingSeats = totalStudents - allocatedTotal;

  // 3. Sắp xếp các lựa chọn theo phần dư giảm dần để trao các ghế còn dư
  quotas.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < remainingSeats; i++) {
    quotas[i % quotas.length].integerPart += 1;
  }

  // 4. Đóng gói kết quả thành object StudentDistribution
  const distribution: StudentDistribution = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of quotas) {
    distribution[q.option] = q.integerPart;
  }

  return distribution;
}

/**
 * Ghi nhận thêm 1 lượt bình chọn vào state (Immutable Update)
 */
export function registerVote(
  state: VotingState,
  event: VoteEvent,
  maxRecentVoters = 10
): VotingState {
  const newCounts: VoteCounts = {
    ...state.voteCounts,
    [event.option]: state.voteCounts[event.option] + 1,
  };

  const newTotal = state.totalVotes + 1;
  const newPercentages = calculatePercentages(newCounts);

  const newRecent = [event, ...state.recentVoters].slice(0, maxRecentVoters);

  return {
    voteCounts: newCounts,
    votePercentages: newPercentages,
    totalVotes: newTotal,
    recentVoters: newRecent,
    lastVotedOption: event.option,
  };
}

/**
 * Chuyển đổi StudentDistribution thành mảng 20 lựa chọn phân tán tự nhiên cho 20 học sinh
 */
export function distributionToChoiceList(
  distribution: StudentDistribution,
  totalStudents = 20
): VoteOption[] {
  const choices: VoteOption[] = [];

  for (const opt of ALL_OPTIONS) {
    const count = distribution[opt];
    for (let i = 0; i < count; i++) {
      choices.push(opt);
    }
  }

  // Đảm bảo đủ totalStudents nếu có sai số
  while (choices.length < totalStudents) {
    choices.push('A');
  }

  // Thuật toán xáo trộn xen kẽ (Interleaved distribution) để các đáp án không bị dồn cục
  const interleaved: VoteOption[] = [];
  const buckets: Record<VoteOption, VoteOption[]> = {
    A: choices.filter((c) => c === 'A'),
    B: choices.filter((c) => c === 'B'),
    C: choices.filter((c) => c === 'C'),
    D: choices.filter((c) => c === 'D'),
  };

  let added = true;
  while (added) {
    added = false;
    for (const opt of ALL_OPTIONS) {
      if (buckets[opt].length > 0) {
        interleaved.push(buckets[opt].pop()!);
        added = true;
      }
    }
  }

  return interleaved.slice(0, totalStudents);
}
