import React from 'react';
import type { QuizStatus } from '../../types/classroom';
import type { VotePercentages, VoteCounts } from '../../modules/voting/votingTypes';

interface FloorPads2DProps {
  quizStatus: QuizStatus;
  correctOption?: 'A' | 'B' | 'C' | 'D';
  votePercentages?: VotePercentages;
  voteCounts?: VoteCounts;
  totalVotes?: number;
}

export const FloorPads2D: React.FC<FloorPads2DProps> = ({
  quizStatus,
  correctOption = 'A',
  votePercentages,
  voteCounts,
}) => {
  const isRevealed = quizStatus === 'REVEAL';

  const padConfigs: Record<
    'A' | 'B' | 'C' | 'D',
    {
      baseBg: string;
      borderColor: string;
      glowColor: string;
      letterColor: string;
      pillBg: string;
    }
  > = {
    A: {
      baseBg: 'bg-amber-100/90',
      borderColor: 'border-amber-500',
      glowColor: 'shadow-amber-500/50',
      letterColor: 'text-amber-700',
      pillBg: 'bg-amber-200/90 text-amber-950',
    },
    B: {
      baseBg: 'bg-blue-100/90',
      borderColor: 'border-blue-500',
      glowColor: 'shadow-blue-500/50',
      letterColor: 'text-blue-700',
      pillBg: 'bg-blue-200/90 text-blue-950',
    },
    C: {
      baseBg: 'bg-emerald-100/90',
      borderColor: 'border-emerald-500',
      glowColor: 'shadow-emerald-500/50',
      letterColor: 'text-emerald-700',
      pillBg: 'bg-emerald-200/90 text-emerald-950',
    },
    D: {
      baseBg: 'bg-rose-100/90',
      borderColor: 'border-rose-500',
      glowColor: 'shadow-rose-500/50',
      letterColor: 'text-rose-700',
      pillBg: 'bg-rose-200/90 text-rose-950',
    },
  };

  return (
    <div className="w-full grid grid-cols-4 gap-2 sm:gap-3 select-none pointer-events-none">
      {(['A', 'B', 'C', 'D'] as const).map((letter) => {
        const isCorrect = isRevealed && letter === correctOption;
        const isWrong = isRevealed && letter !== correctOption;
        const cfg = padConfigs[letter];
        const count = voteCounts?.[letter] ?? 0;
        const pct = votePercentages?.[letter] ?? 0;

        return (
          <div
            key={letter}
            className={`relative rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-between p-2 shadow-xl ${
              isCorrect
                ? 'bg-emerald-200/95 border-emerald-500 shadow-2xl shadow-emerald-500/80 scale-105 ring-4 ring-emerald-300'
                : isWrong
                ? 'bg-slate-300/40 border-slate-400/50 opacity-60'
                : `${cfg.baseBg} ${cfg.borderColor} ${cfg.glowColor}`
            }`}
            style={{
              height: '98px',
              transform: 'perspective(500px) rotateX(15deg)',
            }}
          >
            {/* Big Bold Letter */}
            <span
              className={`font-black text-4xl sm:text-5xl leading-none drop-shadow-sm ${
                isCorrect ? 'text-emerald-800 animate-pulse' : isWrong ? 'text-slate-500' : cfg.letterColor
              }`}
            >
              {letter}
            </span>

            {/* Live Vote Badge at front bottom */}
            <div
              className={`w-full py-0.5 px-1.5 rounded-lg border font-black text-[11px] sm:text-xs text-center shadow-xs flex items-center justify-center gap-1 ${
                isCorrect
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : isWrong
                  ? 'bg-slate-400 text-slate-800 border-slate-500'
                  : `${cfg.pillBg} border-black/10`
              }`}
            >
              <span>{pct}%</span>
              <span className="text-[9px] font-semibold opacity-80">({count}p)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
