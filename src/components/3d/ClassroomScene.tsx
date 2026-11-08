import { ClassroomStructure } from './ClassroomStructure';
import { TeacherStation } from './TeacherStation';
import { StudentDesk } from './StudentDesk';
import { StudentAvatar } from './StudentAvatar';
import { CameraRig } from './CameraRig';
import type { ClassroomStore } from '../../hooks/useClassroomStore';

interface ClassroomSceneProps {
  store: ClassroomStore;
}

export function ClassroomScene({ store }: ClassroomSceneProps) {
  const {
    students,
    studentStates,
    activeStudentId,
    hoveredStudentId,
    cameraMode,
    callStudent,
    updateStudentState,
    setHoveredStudentId,
  } = store;

  // Active student state helper
  const activeStudent = students.find((s) => s.id === activeStudentId);
  const isHandingPaper = activeStudentId
    ? studentStates[activeStudentId] === 'HANDING_PAPER'
    : false;

  return (
    <>
      {/* ================= LIGHTING ================= */}
      {/* Warm ambient fill light */}
      <ambientLight intensity={0.7} color="#fffbeb" />

      {/* Main Directional Sun streaming from windows on the left (-X wall) */}
      <directionalLight
        position={[-8, 6, 1]}
        intensity={1.8}
        color="#fff7ed"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Subtle fill light from front right */}
      <directionalLight position={[6, 5, 5]} intensity={0.5} color="#e0f2fe" />

      {/* Interior ceiling panel light glow */}
      <pointLight position={[0, 3.8, 0]} intensity={0.8} distance={12} color="#ffffff" />
      <pointLight position={[0, 3.8, 3.5]} intensity={0.6} distance={8} color="#fef3c7" />

      {/* ================= CAMERA CONTROLS ================= */}
      <CameraRig mode={cameraMode} />

      {/* ================= CLASSROOM ROOM ARCHITECTURE ================= */}
      <ClassroomStructure />

      {/* ================= TEACHER PODIUM & STATION ================= */}
      <TeacherStation
        hasSubmittedPaper={isHandingPaper || store.completedCount > 0}
        submittedStudentName={activeStudent?.name}
      />

      {/* ================= STUDENT STATIONS & AVATARS ================= */}
      {students.map((student) => {
        const state = studentStates[student.id];
        const isHovered = hoveredStudentId === student.id;
        const isActive = activeStudentId === student.id;

        // Paper remains on desk only when writing or before standing
        const hasDeskPaper = state === 'SEATED_WRITING';

        // Desk chair pushes back slightly when standing or out of seat
        const isOutOfSeat =
          state === 'STANDING' ||
          state === 'STEPPING_TO_AISLE' ||
          state === 'WALKING_TO_TEACHER' ||
          state === 'HANDING_PAPER' ||
          state === 'TURNING_AROUND' ||
          state === 'WALKING_TO_SEAT';
        const chairPushedBack = isOutOfSeat ? 0.22 : 0;

        return (
          <group
            key={student.id}
            onPointerOver={() => setHoveredStudentId(student.id)}
            onPointerOut={() => {
              if (hoveredStudentId === student.id) {
                setHoveredStudentId(null);
              }
            }}
          >
            {/* 3D Desk & Chair */}
            <StudentDesk
              position={student.deskPosition}
              seatId={student.seatId}
              isHovered={isHovered}
              hasPaper={hasDeskPaper}
              chairPushedBack={chairPushedBack}
            />

            {/* 3D Student Avatar */}
            <StudentAvatar
              data={student}
              state={state}
              isActive={isActive}
              isHovered={isHovered}
              onSelect={() => callStudent(student.id)}
              onStateAdvance={(newState) => updateStudentState(student.id, newState)}
            />
          </group>
        );
      })}
    </>
  );
}
