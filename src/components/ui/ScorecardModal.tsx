import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { StudentData } from '../../types/classroom';

interface ScorecardModalProps {
  student: StudentData | null;
  onDismiss: () => void;
}

export function ScorecardModal({ student, onDismiss }: ScorecardModalProps) {
  useEffect(() => {
    if (student && (student.scorecard.grade === 'A+' || student.scorecard.grade === 'A')) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#facc15', '#f43f5e'],
      });
    }
  }, [student]);

  if (!student) return null;

  const { scorecard } = student;
  const isTopScore = scorecard.grade === 'A+' || scorecard.grade === 'A';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-lg max-h-[82vh] sm:max-h-[90vh] flex flex-col bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-slate-100 transform transition-all scale-100">
        {/* Top Header Gradient Line */}
        <div
          className={`h-2 sm:h-2.5 w-full shrink-0 ${
            isTopScore
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          title="Dismiss and let student return to seat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-0.625rem)]">
          {/* Header info */}
          <div className="flex items-start gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-800">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-md shrink-0 border border-white/10"
              style={{ backgroundColor: student.shirtColor }}
            >
              <span className="text-white drop-shadow">
                {student.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Desk {student.seatId}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {scorecard.timestamp}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1 truncate">
                {student.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{scorecard.subject}</span>
              </p>
            </div>

            {/* Score & Grade Stamp */}
            <div className="flex flex-col items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 rounded-xl border border-slate-700 shrink-0">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {scorecard.totalScore}
                <span className="text-xs font-medium text-slate-400">/100</span>
              </span>
              <span
                className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${
                  isTopScore
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                Grade {scorecard.grade}
              </span>
            </div>
          </div>

          {/* Teacher Remark Callout */}
          <div className="mt-3.5 sm:mt-4 p-3 sm:p-3.5 bg-slate-800/50 rounded-xl border border-slate-800 text-sm">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Teacher Evaluation Remarks
            </div>
            <p className="text-slate-300 text-xs italic leading-relaxed">
              &ldquo;{scorecard.feedback}&rdquo;
            </p>
          </div>

          {/* Question Breakdown */}
          <div className="mt-3.5 sm:mt-4">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> Exam Section Breakdown
            </h4>

            <div className="space-y-1.5 sm:space-y-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1">
              {scorecard.questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs hover:bg-slate-800/70 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2 pr-2 min-w-0">
                    {q.status === 'correct' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="text-slate-200 truncate">{q.question}</span>
                  </div>
                  <span className="font-semibold text-slate-100 shrink-0">
                    {q.score} / {q.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths tags */}
          <div className="mt-3.5 sm:mt-4 flex flex-wrap gap-1.5">
            {scorecard.strengths.map((str, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                ✓ {str}
              </span>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onDismiss}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Accept Paper & Return Student to Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
