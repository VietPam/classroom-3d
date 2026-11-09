import {
  Play,
  SkipForward,
  Radio,
  Camera,
  PartyPopper,
  Volume2,
  VolumeX,
  Hand,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';
import { useAudio } from '../../audio/useAudio';

interface HUDProps {
  store: ClassroomStore;
}

export function HUD({ store }: HUDProps) {
  const {
    resetCamera,
    startQuizShowdown,
    celebrateAll,
    triggerWaveAll,
    triggerRaiseHandAll,
    triggerDanceAll,
    triggerShockedAll,
    quizStatus,
    isAutoPlay,
    toggleAutoPlay,
    nextQuiz,
    selectGroup,
    activeGroupId,
    quizIndex,
    totalQuizzes,
  } = store;

  const { isMuted, toggleMute, playSFX } = useAudio();

  const groupFilterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'synonyms', label: 'Đồng nghĩa' },
    { id: 'antonyms', label: 'Trái nghĩa' },
    { id: 'fill_blank', label: 'Điền từ' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center p-2.5 sm:p-4 select-none pb-[calc(0.75rem+env(safe-area-inset-bottom))] font-sans">
      {/* Top Floating Status Indicator */}
      <header className="pointer-events-auto flex flex-col items-center gap-1.5 mt-1">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs font-semibold text-slate-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isAutoPlay ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className="tracking-wide font-medium">TikTok Live</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono font-bold">
            Câu {quizIndex + 1}/{totalQuizzes}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[#38BDF8] font-mono">
            {quizStatus === 'RUNNING' && '🏃 Đang chạy...'}
            {quizStatus === 'THINKING' && '🤔 Đang suy nghĩ...'}
            {quizStatus === 'REVEAL' && '🎉 Công bố kết quả!'}
            {quizStatus === 'IDLE' && '⚡ Sẵn sàng'}
          </span>
        </div>
      </header>

      {/* Bottom Control Dock: Scenario Triggers, Quick Emotes & Audio */}
      <footer className="pointer-events-auto flex flex-col items-center gap-1.5 w-full max-w-sm">
        {/* 1. Quick Emote Bar: WAVE, RAISE_HAND, DANCE, SHOCKED */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-md w-full">
          {/* WAVE */}
          <button
            data-testid="btn-emote-wave"
            onClick={triggerWaveAll}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-bold text-amber-300 hover:text-white hover:bg-amber-600/30 transition-all cursor-pointer active:scale-95"
            title="Cả lớp vẫy tay chào khán giả"
          >
            <span>👋</span>
            <span>Chào</span>
          </button>

          {/* RAISE_HAND */}
          <button
            data-testid="btn-emote-raise"
            onClick={triggerRaiseHandAll}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-bold text-sky-300 hover:text-white hover:bg-sky-600/30 transition-all cursor-pointer active:scale-95"
            title="Cả lớp giơ tay xin phát biểu"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Phát Biểu</span>
          </button>

          {/* DANCE */}
          <button
            data-testid="btn-emote-dance"
            onClick={triggerDanceAll}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-bold text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all cursor-pointer active:scale-95"
            title="Cả lớp quẩy vũ đạo Chibi vui nhộn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vũ Đạo</span>
          </button>

          {/* SHOCKED */}
          <button
            data-testid="btn-emote-shocked"
            onClick={triggerShockedAll}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-bold text-rose-300 hover:text-white hover:bg-rose-600/30 transition-all cursor-pointer active:scale-95"
            title="Cả lớp giật mình hốt hoảng (Vine Boom meme)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hốt Hoảng</span>
          </button>
        </div>

        {/* 2. Category / Group Quick Filter Tabs */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-md w-full">
          {groupFilterTabs.map((tab) => {
            const isActive = activeGroupId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSFX('click_ui');
                  selectGroup(tab.id);
                }}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Main Scenario Control Bar */}
        <div className="flex items-center justify-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 shadow-2xl w-full">
          {/* A. Auto Live Stream Loop Toggle */}
          <button
            onClick={() => {
              playSFX('click_ui');
              toggleAutoPlay();
            }}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 border ${
              isAutoPlay
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/80 shadow-md shadow-emerald-950/50'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isAutoPlay ? 'Tắt tự động chạy liên tục' : 'Bật tự động phát liên tục 24/7'}
          >
            <Radio
              className={`w-3.5 h-3.5 ${isAutoPlay ? 'text-emerald-400 animate-pulse' : ''}`}
            />
            <span>{isAutoPlay ? 'Auto Live' : 'Auto Tắt'}</span>
          </button>

          {/* B. Manual Quiz Race Trigger */}
          <button
            data-testid="btn-start-race"
            onClick={() => {
              playSFX('click_ui');
              startQuizShowdown();
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-gradient-to-r from-[#F08806] to-[#D97706] hover:from-[#F59E0B] hover:to-[#EA580C] text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-all cursor-pointer active:scale-95"
            title="Kích hoạt học sinh chạy đua chọn ô đáp án"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Chạy Đua</span>
          </button>

          {/* C. Next Quiz (Tiếp theo) */}
          <button
            onClick={() => {
              playSFX('card_slide');
              nextQuiz();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Chuyển ngay sang câu hỏi tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* D. Celebrate All */}
          <button
            data-testid="btn-celebrate"
            onClick={() => {
              playSFX('click_ui');
              celebrateAll();
            }}
            className="p-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white transition-all cursor-pointer active:scale-95 shrink-0"
            title="Cả lớp cùng nhảy ăn mừng"
          >
            <PartyPopper className="w-4 h-4" />
          </button>

          {/* E. Mute / Unmute Audio Toggle */}
          <button
            onClick={() => {
              toggleMute();
              playSFX('click_ui');
            }}
            data-testid="btn-audio-mute"
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
              isMuted
                ? 'bg-rose-950/50 text-rose-400 border-rose-800/80 hover:bg-rose-900/60'
                : 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
            }`}
            title={isMuted ? 'Bật âm thanh (BGM & SFX)' : 'Tắt âm thanh (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* F. Reset Camera View */}
          <button
            onClick={() => {
              playSFX('click_ui');
              resetCamera();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Đặt lại góc nhìn camera mặc định"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
