import { useState } from 'react';
import { soundEngine } from '../../audio/SoundEngine';

interface TeacherStationProps {
  onBellClick?: () => void;
  hasSubmittedPaper?: boolean;
  submittedStudentName?: string;
}

export function TeacherStation({ onBellClick, hasSubmittedPaper, submittedStudentName }: TeacherStationProps) {
  const [bellClicked, setBellClicked] = useState(false);

  const handleRingBell = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playDeskBell();
    setBellClicked(true);
    setTimeout(() => setBellClicked(false), 200);
    if (onBellClick) onBellClick();
  };

  return (
    <group position={[0, 0, 4.3]}>
      {/* ================= TEACHER PODIUM / DESK ================= */}
      {/* Desk Top Plank */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 0.95]} />
        <meshStandardMaterial color="#854d0e" roughness={0.4} />
      </mesh>

      {/* Desk Front Privacy Panel */}
      <mesh position={[0, 0.38, -0.42]} castShadow>
        <boxGeometry args={[2.2, 0.7, 0.04]} />
        <meshStandardMaterial color="#713f12" roughness={0.5} />
      </mesh>

      {/* Desk Side Panels */}
      <mesh position={[-1.12, 0.38, 0]} castShadow>
        <boxGeometry args={[0.04, 0.7, 0.88]} />
        <meshStandardMaterial color="#713f12" roughness={0.5} />
      </mesh>
      <mesh position={[1.12, 0.38, 0]} castShadow>
        <boxGeometry args={[0.04, 0.7, 0.88]} />
        <meshStandardMaterial color="#713f12" roughness={0.5} />
      </mesh>

      {/* Inner Shelf / Drawer */}
      <mesh position={[0.75, 0.45, 0]}>
        <boxGeometry args={[0.65, 0.5, 0.82]} />
        <meshStandardMaterial color="#59310b" />
      </mesh>

      {/* ================= TEACHER PROPS ================= */}
      {/* Modern Teacher Laptop */}
      <group position={[-0.45, 0.77, -0.05]} rotation={[0, Math.PI * 0.95, 0]}>
        {/* Laptop Base */}
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.015, 0.24]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Laptop Screen (tilted open) */}
        <mesh position={[0, 0.12, 0.12]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.22, 0.01]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Screen Display Glow */}
        <mesh position={[0, 0.12, 0.113]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[0.32, 0.20]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Desk Service Bell (Interactive!) */}
      <group
        position={[-0.85, 0.77, -0.15]}
        onClick={handleRingBell}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        scale={bellClicked ? [0.95, 0.8, 0.95] : [1, 1, 1]}
      >
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.07, 0.02, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Brass Dome */}
        <mesh position={[0, 0.025, 0]} castShadow>
          <sphereGeometry args={[0.055, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Top Tapper Button */}
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Desk Lamp */}
      <group position={[0.9, 0.77, 0.2]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.02, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Neck stem */}
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.36]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Lamp Hood */}
        <mesh position={[-0.08, 0.34, 0]} rotation={[0, 0, 0.5]} castShadow>
          <coneGeometry args={[0.09, 0.16, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Warm light from lamp */}
        <pointLight position={[-0.1, 0.3, 0]} intensity={1.2} distance={2.5} color="#fed7aa" />
      </group>

      {/* Pen Holder with Pens */}
      <group position={[0.55, 0.77, -0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        <mesh position={[0.01, 0.07, 0]} rotation={[0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.005, 0.005, 0.14]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-0.01, 0.07, 0.01]} rotation={[-0.1, 0, -0.15]}>
          <cylinderGeometry args={[0.005, 0.005, 0.13]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* Stack of Graded Exam Papers */}
      <group position={[0.2, 0.78, -0.15]} rotation={[0, 0.08, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.03, 0.32]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </mesh>
        {/* Red pen resting across papers */}
        <mesh position={[0.02, 0.022, 0]} rotation={[0, 0.4, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, 0.16]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Submitted paper on the teacher desk tray / surface */}
      {hasSubmittedPaper && (
        <group
          position={[-0.1, 0.775, -0.22]}
          rotation={[0, -0.12, 0]}
          name={submittedStudentName ? `submitted-paper-${submittedStudentName}` : 'submitted-paper'}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.004, 0.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          {/* Subtle text lines simulation */}
          {[-0.08, -0.04, 0, 0.04, 0.08].map((offsetZ, i) => (
            <mesh key={`line-${i}`} position={[0, 0.003, offsetZ]}>
              <boxGeometry args={[0.16, 0.001, 0.01]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>
          ))}
          {/* Red grade circle at top right */}
          <mesh position={[0.07, 0.003, -0.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.002, 12]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
        </group>
      )}

      {/* ================= TEACHER CHAIR ================= */}
      <group position={[0, 0, 0.8]}>
        {/* Base star */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Center column */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Seat cushion */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.48]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.78, 0.22]} rotation={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[0.46, 0.58, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
