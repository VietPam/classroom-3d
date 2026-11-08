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
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none">
      {/* ================= TOP HEADER BAR ================= */}
      <header className="flex items-center justify-between pointer-events-auto">
        {/* Title & Badge */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 m-0 p-0">
              Math 301: Advanced Calculus Exam
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Simulation
              </span>
            </h1>
            <p className="text-xs text-slate-400 m-0 p-0">
              Interactive 3D Low-Poly Classroom & Student Kinematics
            </p>
          </div>
        </div>

        {/* Status Metrics (Timer & Completed Counter) */}
        <div className="flex items-center gap-2.5">
          {/* Exam Timer */}
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs font-medium text-slate-200">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Left:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {formattedTime}
            </span>
          </div>

          {/* Submissions Counter */}
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs font-medium text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Handed In:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {completedCount} / {students.length}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-xl border shadow-lg transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-950/60 border-rose-800 text-rose-400 hover:bg-rose-900/80'
                : 'bg-slate-900/85 border-slate-700/60 text-slate-200 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ================= ACTIVE STUDENT STATUS BANNER (if walking) ================= */}
      {activeStudent && (
        <div className="self-center bg-slate-900/90 backdrop-blur-md border border-sky-500/50 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 animate-pulse pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs text-slate-200">
            <strong className="text-sky-300">{activeStudent.name}</strong> (Desk{' '}
            {activeStudent.seatId}) is walking to teacher desk...
          </span>
        </div>
      )}

      {/* ================= BOTTOM CONTROL DOCK ================= */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
        {/* Interaction hints */}
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Click any student in 3D or choose from the list to call them forward
          </span>
        </div>

        {/* Action Buttons & Selectors */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-2xl">
          {/* Quick Student Selector Dropdown */}
          <select
            value={activeStudentId || ''}
            onChange={(e) => {
              if (e.target.value) {
                callStudent(e.target.value);
              }
            }}
            disabled={isBusy}
            className="bg-slate-800 text-slate-100 text-xs font-medium rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 cursor-pointer"
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
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-xl shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Call Random Student
          </button>

          {/* Camera Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              onClick={() => setCameraMode('teacher_pov')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                cameraMode === 'teacher_pov'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Teacher POV
            </button>
            <button
              onClick={() => setCameraMode('overview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                cameraMode === 'overview'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Overview Orbit
            </button>
          </div>

          {/* Reset Exam */}
          <button
            onClick={resetExam}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Reset All Student States"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
