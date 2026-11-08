import {
  Volume2,
  VolumeX,
  Eye,
  Camera,
  Users,
  Clock,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';

interface HUDProps {
  store: ClassroomStore;
}

export function HUD({ store }: HUDProps) {
  const {
    students,
    studentStates,
    activeStudentId,
    cameraMode,
    isMuted,
    timeRemainingSeconds,
    completedCount,
    setCameraMode,
    toggleMute,
    callStudent,
    callRandomStudent,
    resetExam,
  } = store;

  // Format time remaining MM:SS
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const activeStudent = students.find((s) => s.id === activeStudentId);
  const isBusy = activeStudentId !== null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 select-none pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-[calc(0.5rem+env(safe-area-inset-top))]">
      {/* ================= TOP HEADER BAR ================= */}
      <header className="flex items-center justify-between gap-1.5 sm:gap-3 pointer-events-auto w-full">
        {/* Title & Badge */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-700/60 shadow-xl shrink min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5 m-0 p-0 truncate">
              <span>Math 301</span>
              <span className="hidden sm:inline text-slate-300 font-normal">: Capybara Calculus Exam 🐾</span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                Capy Live
              </span>
            </h1>
            <p className="hidden md:block text-xs text-slate-400 m-0 p-0 truncate">
              Capybara 3D Low-Poly Classroom & Kinematics
            </p>
          </div>
        </div>

        {/* Status Metrics (Timer, Counter, Sound) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Exam Timer */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/85 backdrop-blur-md px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-700/60 shadow-lg text-[11px] sm:text-xs font-medium text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden md:inline">Time Left:</span>
            <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
              {formattedTime}
            </span>
          </div>

          {/* Submissions Counter */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/85 backdrop-blur-md px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-700/60 shadow-lg text-[11px] sm:text-xs font-medium text-slate-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden md:inline">Handed In:</span>
            <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
              {completedCount} / {students.length}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-1.5 sm:p-2 rounded-xl border shadow-lg transition-all cursor-pointer shrink-0 ${
              isMuted
                ? 'bg-rose-950/60 border-rose-800 text-rose-400 hover:bg-rose-900/80'
                : 'bg-slate-900/85 border-slate-700/60 text-slate-200 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </header>

      {/* ================= ACTIVE STUDENT STATUS BANNER (if walking) ================= */}
      {activeStudent && (
        <div className="self-center max-w-[92vw] bg-slate-900/90 backdrop-blur-md border border-sky-500/50 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 animate-pulse pointer-events-auto">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-400 shrink-0" />
          <span className="text-[11px] sm:text-xs text-slate-200 truncate">
            <strong className="text-sky-300">{activeStudent.name}</strong> (Desk{' '}
            {activeStudent.seatId}) is walking to teacher desk...
          </span>
        </div>
      )}

      {/* ================= BOTTOM CONTROL DOCK ================= */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto w-full">
        {/* Interaction hints (hidden on small mobile to save space) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Click any student in 3D or choose from the list to call them forward
          </span>
        </div>

        {/* Action Buttons & Selectors */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/60 shadow-2xl">
          {/* Row 1 on mobile: Student select dropdown & Call random button */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {/* Quick Student Selector Dropdown */}
            <select
              value={activeStudentId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  callStudent(e.target.value);
                }
              }}
              disabled={isBusy}
              className="flex-1 sm:flex-none min-w-0 bg-slate-800 text-slate-100 text-[11px] sm:text-xs font-medium rounded-xl px-2.5 py-2 sm:px-3 sm:py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 cursor-pointer truncate"
            >
              <option value="">Choose Student ({students.length})...</option>
              {students.map((st) => (
                <option
                  key={st.id}
                  value={st.id}
                  disabled={studentStates[st.id] === 'COMPLETED'}
                >
                  {st.seatId}: {st.name}{' '}
                  {studentStates[st.id] === 'COMPLETED' ? '✓ (Submitted)' : ''}
                </option>
              ))}
            </select>

            {/* Call Random Student Button */}
            <button
              onClick={callRandomStudent}
              disabled={isBusy || completedCount === students.length}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[11px] sm:text-xs font-semibold rounded-xl shadow transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Call Random</span>
            </button>
          </div>

          {/* Row 2 on mobile: Camera Mode Toggle & Reset */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
            {/* Camera Mode Toggle */}
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 flex-1 sm:flex-none">
              <button
                onClick={() => setCameraMode('teacher_pov')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${
                  cameraMode === 'teacher_pov'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Teacher POV</span>
              </button>
              <button
                onClick={() => setCameraMode('overview')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${
                  cameraMode === 'overview'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Overview Orbit</span>
              </button>
            </div>

            {/* Reset Exam Button */}
            <button
              onClick={resetExam}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
              title="Reset All Student States"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
