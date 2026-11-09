/**
 * LIVE SIMULATOR
 * Bộ sinh sự kiện giả lập bình luận và bình chọn đám đông
 */

import type { VoteEvent, VoteOption } from '../voting/votingTypes';
import { ALL_OPTIONS } from '../voting/votingEngine';
import { SIMULATED_USERS, VOTE_COMMENT_TEMPLATES } from './simulatorData';

/**
 * Sinh ngẫu nhiên một lượt bình chọn từ người xem giả lập
 */
export function generateMockVote(forcedOption?: VoteOption): VoteEvent {
  const option =
    forcedOption ||
    ALL_OPTIONS[Math.floor(Math.random() * ALL_OPTIONS.length)];
  const user =
    SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
  const templates = VOTE_COMMENT_TEMPLATES[option];
  const rawComment =
    templates[Math.floor(Math.random() * templates.length)];

  return {
    id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    option,
    user,
    rawComment,
    timestamp: Date.now(),
  };
}

/**
 * Sinh một mẻ nhiều lượt bình chọn cùng lúc (burst votes)
 */
export function generateRandomVoteBatch(count: number): VoteEvent[] {
  return Array.from({ length: count }, () => generateMockVote());
}

/**
 * Bộ quản lý luồng tự động bắn bình chọn giả lập theo nhịp thời gian
 */
export class AutoStreamSimulator {
  private timer: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private onVoteCallback: (vote: VoteEvent) => void;
  private intervalMs = 1200;

  constructor(onVote: (vote: VoteEvent) => void, intervalMs = 1200) {
    this.onVoteCallback = onVote;
    this.intervalMs = intervalMs;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      // 80% sinh 1 vote, 20% sinh burst 2-3 votes cùng lúc để tạo nhịp tự nhiên
      const burst = Math.random() < 0.2 ? Math.floor(Math.random() * 2) + 2 : 1;
      for (let i = 0; i < burst; i++) {
        const mock = generateMockVote();
        this.onVoteCallback(mock);
      }
    }, this.intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public setSpeed(intervalMs: number): void {
    this.intervalMs = intervalMs;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}
