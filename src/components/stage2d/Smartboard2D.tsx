import React from 'react';
import type { QuizData, QuizStatus } from '../../types/classroom';
import type { VotePercentages, VoteCounts } from '../../modules/voting/votingTypes';

interface Smartboard2DProps {
  quiz: QuizData;
  status: QuizStatus;
  votePercentages?: VotePercentages;
  voteCounts?: VoteCounts;
  totalVotes?: number;
}

export const Smartboard2D: React.FC<Smartboard2DProps> = ({
  quiz,
  status,
  votePercentages,
  voteCounts,
  totalVotes = 0,
}) => {
  const isRevealed = status === 'REVEAL';

  // Option Theme configurations
  const optionThemes: Record<
    string,
    {
      baseBg: string;
      border: string;
      badgeBg: string;
      textColor: string;
      accentBg: string;
    }
  > = {
    A: {
      baseBg: 'bg-amber-500/10',
      border: 'border-amber-400/80',
      badgeBg: 'bg-amber-500 text-white',
      textColor: 'text-amber-400',
      accentBg: 'bg-amber-500',
    },
    B: {
      baseBg: 'bg-blue-500/10',
      border: 'border-blue-400/80',
      badgeBg: 'bg-blue-600 text-white',
      textColor: 'text-blue-400',
      accentBg: 'bg-blue-500',
    },
    C: {
      baseBg: 'bg-emerald-500/10',
      border: 'border-emerald-400/80',
      badgeBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-400',
      accentBg: 'bg-emerald-500',
    },
    D: {
      baseBg: 'bg-rose-500/10',
      border: 'border-rose-400/80',
      badgeBg: 'bg-rose-600 text-white',
      textColor: 'text-rose-400',
      accentBg: 'bg-rose-500',
    },
  };

  // Headline Prompt
  const rawTarget = quiz.targetWord || 'ACCURATE';
  let promptHeadline = '';
  if (quiz.groupId === 'antonyms') {
    promptHeadline = `${rawTarget.toUpperCase()}  ≠  ?`;
  } else if (quiz.groupId === 'fill_blank') {
    promptHeadline = quiz.contextSentence
      ? quiz.contextSentence.replace(/^"|"$/g, '')
      : quiz.question || rawTarget;
  } else {
    promptHeadline = `${rawTarget.toUpperCase()}  =  ?`;
  }

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col gap-2.5 select-none transition-all duration-300">
      {/* 1. Header Category Pill */}
      <div className="flex items-center justify-between">
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5 shadow-sm">
          <span>⚡</span>
          <span>
            {quiz.groupName ? quiz.groupName.toUpperCase() : 'VOCABULARY'} • CÂU{' '}
            {quiz.quizNumber || 1}/{quiz.totalQuizzes || 12}
          </span>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          {isRevealed ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              ✓ KẾT QUẢ
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {status === 'RUNNING' ? '🏃 ĐANG CHẠY ĐUA' : '🤔 SUY NGHĨ'}
            </span>
          )}
        </div>
      </div>

      {/* 2. Headline Question Box */}
      <div className="py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[58px]">
        <h2
          className={`font-black text-2xl sm:text-3xl tracking-wide ${
            quiz.groupId === 'antonyms' ? 'text-rose-400' : 'text-sky-400'
          }`}
        >
          {promptHeadline}
        </h2>
      </div>

      {/* 3. 4 Options Grid (A, B, C, D) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {quiz.options.map((opt) => {
          const isCorrect = isRevealed && opt.id === quiz.correctOption;
          const isWrong = isRevealed && opt.id !== quiz.correctOption;
          const theme = optionThemes[opt.id] || optionThemes.A;
          const voteCount = voteCounts?.[opt.id] ?? 0;
          const votePct = votePercentages?.[opt.id] ?? 0;

          return (
            <div
              key={opt.id}
              className={`relative rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[155px] border-2 transition-all duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-900/50 scale-[1.02]'
                  : isWrong
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : `${theme.baseBg} ${theme.border}`
              }`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-sm sm:text-base shadow-sm ${
                  isCorrect
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
                    : isWrong
                    ? 'bg-slate-700 text-slate-300'
                    : theme.badgeBg
                }`}
              >
                {opt.id}
              </div>

              {/* Vocab Word */}
              <div className="my-auto py-1 text-center w-full flex flex-col items-center justify-center min-h-[42px]">
                <span
                  className={`font-black text-xs sm:text-sm md:text-base leading-tight block break-words text-center px-0.5 ${
                    isCorrect
                      ? 'text-emerald-300'
                      : isWrong
                      ? 'text-slate-400 line-through'
                      : theme.textColor
                  }`}
                >
                  {opt.word}
                </span>

                {/* Vietnamese Meaning (Bung ra khi reveal) */}
                {isRevealed && isCorrect && opt.meaning && (
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-200 block break-words mt-0.5 animate-in fade-in duration-300">
                    {opt.meaning}
                  </span>
                )}
              </div>

              {/* Vote Stats & Progress Fill Pill */}
              <div className="w-full mt-auto">
                {isRevealed && isCorrect ? (
                  <div className="w-full py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs text-center shadow-md">
                    ✓ ĐÚNG ({votePct}%)
                  </div>
                ) : (
                  <div className="relative w-full h-5 sm:h-6 rounded-lg bg-slate-950/80 border border-slate-700/80 overflow-hidden flex items-center justify-center">
                    {/* Progress Bar Fill */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 opacity-40 transition-all duration-500 ${
                        isWrong ? 'bg-slate-600' : theme.accentBg
                      }`}
                      style={{ width: `${votePct}%` }}
                    />
                    {/* Label */}
                    <span className="relative z-10 text-[10px] sm:text-[11px] font-bold text-slate-200 whitespace-nowrap">
                      {totalVotes > 0 ? `${votePct}% • ${voteCount}` : '0% • 0'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
