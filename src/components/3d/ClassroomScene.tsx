import { ClassroomStructure } from './ClassroomStructure';
import { StudentDesk } from './StudentDesk';
import { StudentAvatar } from './StudentAvatar';
import { CameraRig } from './CameraRig';
import type { ClassroomStore } from '../../hooks/useClassroomStore';

interface ClassroomSceneProps {
  store: ClassroomStore;
}

export function ClassroomScene({ store }: ClassroomSceneProps) {
  const { students, cameraResetCount } = store;

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

      {/* ================= CAMERA CONTROLS (Always OrbitControls) ================= */}
      <CameraRig resetTrigger={cameraResetCount} />

      {/* ================= CLASSROOM ROOM ARCHITECTURE ================= */}
      <ClassroomStructure />

      {/* ================= STUDENT STATIONS & AVATARS ================= */}
      {students.map((student) => (
        <group key={student.id}>
          {/* 3D Desk & Chair */}
          <StudentDesk
            position={student.deskPosition}
            seatId={student.seatId}
          />

          {/* 3D Student Avatar (peacefully writing) */}
          <StudentAvatar data={student} />
        </group>
      ))}
    </>
  );
}
