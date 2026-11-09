import { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  Radio,
} from 'lucide-react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';
import type { VoteOption } from '../../modules/voting/votingTypes';
import { AutoStreamSimulator } from '../../modules/simulator/liveSimulator';

interface SimulatorDockProps {
  store: ClassroomStore;
}

export function SimulatorDock({ store }: SimulatorDockProps) {
  const {
    isSimulatorOpen,
    toggleSimulator,
    votingState,
    castVote,
    castVoteBatch,
    resetVotes,
    startQuizShowdown,
    quizStatus,
  } = store;

  const [activeTab, setActiveTab] = useState<'quick' | 'stream' | 'actions'>('quick');
  const [streamSpeed, setStreamSpeed] = useState<number>(1000);
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(false);

  const autoSimRef = useRef<AutoStreamSimulator | null>(null);

  // Khởi tạo AutoStreamSimulator
  useEffect(() => {
    autoSimRef.current = new AutoStreamSimulator((vote) => {
      castVote(vote.option, vote.user, vote.rawComment);
    }, streamSpeed);

    return () => {
      if (autoSimRef.current) {
        autoSimRef.current.stop();
      }
    };
  }, [castVote, streamSpeed]);

  // Phím tắt `~` để bật/tắt dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        toggleSimulator();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSimulator]);

  const toggleAutoStream = () => {
    if (!autoSimRef.current) return;
    const running = autoSimRef.current.toggle();
    setIsAutoStreaming(running);
  };

  const handleSpeedChange = (ms: number) => {
    setStreamSpeed(ms);
    if (autoSimRef.current) {
      autoSimRef.current.setSpeed(ms);
    }
  };

  const handleRandomBurst = () => {
    const randomBatch: Record<VoteOption, number> = {
      A: Math.floor(Math.random() * 8) + 1,
      B: Math.floor(Math.random() * 6) + 1,
      C: Math.floor(Math.random() * 10) + 1,
      D: Math.floor(Math.random() * 5) + 1,
    };
    castVoteBatch(randomBatch);
  };

  if (!isSimulatorOpen) return null;

  const { voteCounts, votePercentages, totalVotes, recentVoters } = votingState;

  const padColors: Record<VoteOption, { bg: string; text: string; bar: string }> = {
    A: { bg: 'bg-amber-500/20', text: 'text-amber-400', bar: 'bg-amber-500' },
    B: { bg: 'bg-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },
    C: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    D: { bg: 'bg-rose-500/20', text: 'text-rose-400', bar: 'bg-rose-500' },
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-auto p-2 sm:p-4 select-none animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="w-full max-w-md bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs tracking-wide text-white">
              TikTok Live Simulator
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {totalVotes} votes
            </span>
            {isAutoStreaming && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sim
              </span>
            )}
          </div>
          <button
            data-testid="btn-close-simulator"
            onClick={() => toggleSimulator(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng (phím ~)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Voting Progress Bars */}
        <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>Tỷ lệ phân bổ 20 học sinh:</span>
            <span className="text-slate-400 font-mono text-[10px]">
              {quizStatus === 'RUNNING' ? '🏃 Đang di chuyển' : '⚡ Sẵn sàng'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['A', 'B', 'C', 'D'] as VoteOption[]).map((opt) => {
              const cfg = padColors[opt];
              return (
                <div
                  key={opt}
                  className={`p-1.5 rounded-xl border border-slate-800/90 ${cfg.bg} flex flex-col items-center gap-1`}
                >
                  <div className="flex items-center justify-between w-full px-0.5">
                    <span className={`font-bold text-xs ${cfg.text}`}>{opt}</span>
                    <span className="text-[10px] font-mono font-bold text-white">
                      {votePercentages[opt]}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cfg.bar} transition-all duration-300`}
                      style={{ width: `${votePercentages[opt]}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {voteCounts[opt]} phiếu
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center border-b border-slate-800 text-[11px] font-semibold bg-slate-900/60">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 text-center transition-colors cursor-pointer ${
              activeTab === 'quick'
                ? 'text-amber-300 border-b-2 border-amber-500 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Bỏ Phiếu Nhanh
          </button>
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex-1 py-1.5 text-center transition-colors cursor-pointer ${
              activeTab === 'stream'
                ? 'text-sky-300 border-b-2 border-sky-500 bg-sky-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🤖 Chat Tự Động
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-1.5 text-center transition-colors cursor-pointer ${
              activeTab === 'actions'
                ? 'text-emerald-300 border-b-2 border-emerald-500 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎮 Thao Tác
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-3">
          {/* TAB 1: QUICK VOTES */}
          {activeTab === 'quick' && (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-4 gap-1.5">
                {(['A', 'B', 'C', 'D'] as VoteOption[]).map((opt) => (
                  <button
                    key={opt}
                    data-testid={`btn-vote-1-${opt}`}
                    onClick={() => castVote(opt, 'Streamer', opt)}
                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer border border-slate-700 text-xs font-bold"
                  >
                    <span>+1 {opt}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {(['A', 'B', 'C', 'D'] as VoteOption[]).map((opt) => (
                  <button
                    key={`5_${opt}`}
                    data-testid={`btn-vote-5-${opt}`}
                    onClick={() => {
                      for (let i = 0; i < 5; i++) {
                        castVote(opt, 'Đám đông', `chọn ${opt}`);
                      }
                    }}
                    className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-850 hover:bg-slate-750 active:scale-95 transition-all cursor-pointer border border-slate-800 text-[11px] font-semibold text-slate-300"
                  >
                    <span>+5 {opt}</span>
                  </button>
                ))}
              </div>

              <button
                data-testid="btn-random-burst"
                onClick={handleRandomBurst}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-98 transition-all cursor-pointer text-white font-bold text-xs shadow-md shadow-amber-950/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎲 Bỏ phiếu ngẫu nhiên (20 votes)</span>
              </button>
            </div>
          )}

          {/* TAB 2: AUTO STREAM SIMULATOR */}
          {activeTab === 'stream' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio
                    className={`w-4 h-4 ${
                      isAutoStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">
                      {isAutoStreaming ? 'Đang giả lập live stream' : 'Đang tạm dừng giả lập'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tự động sinh bình luận chọn A/B/C/D
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleAutoStream}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                    isAutoStreaming
                      ? 'bg-rose-900/60 text-rose-300 border border-rose-700/80 hover:bg-rose-900'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/40'
                  }`}
                >
                  {isAutoStreaming ? 'Dừng lại' : 'Bật ngay'}
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-400">
                  Tốc độ bình luận khán giả:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Thong thả', ms: 1500 },
                    { label: 'Sôi động', ms: 800 },
                    { label: 'Bão vote', ms: 300 },
                  ].map((s) => (
                    <button
                      key={s.ms}
                      onClick={() => handleSpeedChange(s.ms)}
                      className={`py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                        streamSpeed === s.ms
                          ? 'bg-sky-600/30 text-sky-300 border-sky-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {s.label} ({s.ms / 1000}s)
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Voters Stream Feed */}
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] font-semibold text-slate-400">
                  Bình luận mới nhất từ người xem:
                </span>
                <div className="max-h-24 overflow-y-auto flex flex-col gap-1 pr-1 font-sans">
                  {recentVoters.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic py-1">
                      Chưa có bình luận nào...
                    </span>
                  ) : (
                    recentVoters.slice(0, 5).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded-lg text-[10px] border border-slate-800/60"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-slate-200">{v.user}:</span>
                          <span className="text-slate-400 truncate">{v.rawComment}</span>
                        </div>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded font-mono ${
                            padColors[v.option].text
                          } ${padColors[v.option].bg}`}
                        >
                          {v.option}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIONS */}
          {activeTab === 'actions' && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  startQuizShowdown();
                  toggleSimulator(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#F08806] to-[#D97706] hover:from-[#F59E0B] hover:to-[#EA580C] text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-all cursor-pointer active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chạy Đua Với Tỷ Lệ Phiếu Hiện Tại</span>
              </button>

              <button
                onClick={resetVotes}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Phiếu Bầu (Reset Votes)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
