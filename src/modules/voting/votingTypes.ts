/**
 * VOTING TYPES & DATA CONTRACTS
 * Định nghĩa chuẩn dữ liệu cho module bình chọn đám đông (Crowd Voting Engine)
 */

export type VoteOption = 'A' | 'B' | 'C' | 'D';

export interface VoteEvent {
  id: string;
  option: VoteOption;
  user: string;
  avatar?: string;
  timestamp: number;
  rawComment?: string;
}

export type VoteCounts = Record<VoteOption, number>;

export type VotePercentages = Record<VoteOption, number>;

export type StudentDistribution = Record<VoteOption, number>;

export interface VotingState {
  voteCounts: VoteCounts;
  votePercentages: VotePercentages;
  totalVotes: number;
  recentVoters: VoteEvent[];
  lastVotedOption?: VoteOption;
}
