import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function ClassroomStructure() {
  const clockSecondRef = useRef<THREE.Mesh>(null);

  // Animate clock second hand realistically
  useFrame(({ clock }) => {
    if (clockSecondRef.current) {
      const elapsed = clock.getElapsedTime();
      clockSecondRef.current.rotation.z = -elapsed * (Math.PI / 30);
    }
  });

  return (
    <group>
      {/* ================= FLOOR ================= */}
      {/* Main Wood Parquet Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 20]} />
        <meshStandardMaterial
          color="#d4a373"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle floor grid plank lines for realism */}
      <gridHelper
        args={[20, 20, '#b08968', '#c99a6b']}
        position={[0, 0.001, 0]}
      />

      {/* ================= CEILING & ROOF ================= */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[16, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>

      {/* Ceiling Recessed Fluorescent Panels */}
      {[-2, 2].map((x) =>
        [-4, 0, 4].map((z) => (
          <group key={`light-${x}-${z}`} position={[x, 4.18, z]}>
            <mesh>
              <boxGeometry args={[1.2, 0.05, 2.4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.03, 0]}>
              <boxGeometry args={[1.26, 0.02, 2.46]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>
        ))
      )}

      {/* ================= WALLS ================= */}
      {/* Front Wall (Z = 6.0, behind teacher) */}
      <mesh position={[0, 2.1, 6.0]} receiveShadow>
        <planeGeometry args={[16, 4.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Back Wall (Z = -9.0, behind last row of students) */}
      <mesh position={[0, 2.1, -9.0]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[16, 4.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Left Wall (X = -7.0, with windows) */}
      <mesh position={[-7.0, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 4.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Right Wall (X = 7.0, hallway side with posters) */}
      <mesh position={[7.0, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 4.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Baseboards around room perimeter */}
      <mesh position={[0, 0.1, 5.95]}>
        <boxGeometry args={[16, 0.2, 0.05]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, -8.95]}>
        <boxGeometry args={[16, 0.2, 0.05]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[-6.95, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.2, 20]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <mesh position={[6.95, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.2, 20]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* ================= WINDOWS (Left Wall) ================= */}
      {[-5, -1, 3].map((z) => (
        <group key={`window-${z}`} position={[-6.92, 2.4, z]}>
          {/* Outer Window Frame */}
          <mesh>
            <boxGeometry args={[0.1, 2.2, 2.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Glass pane with sky glow */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.02, 2.0, 2.4]} />
            <meshStandardMaterial
              color="#bae6fd"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Window Sill */}
          <mesh position={[0.1, -1.15, 0]}>
            <boxGeometry args={[0.3, 0.08, 2.8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ================= CLASSROOM DOOR (Right Wall) ================= */}
      <group position={[6.92, 1.4, 4.0]}>
        <mesh>
          <boxGeometry args={[0.08, 2.6, 1.4]} />
          <meshStandardMaterial color="#92400e" roughness={0.5} />
        </mesh>
        {/* Door frame */}
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.04, 2.68, 1.48]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        {/* Door handle */}
        <mesh position={[-0.06, 0, -0.5]}>
          <cylinderGeometry args={[0.025, 0.025, 0.12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= BLACKBOARD (Front Wall, Behind Teacher) ================= */}
      <group position={[0, 2.2, 5.92]}>
        {/* Wood frame */}
        <mesh castShadow>
          <boxGeometry args={[5.2, 2.0, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Slate dark green blackboard surface */}
        <mesh position={[0, 0, -0.03]} receiveShadow>
          <planeGeometry args={[5.0, 1.8]} />
          <meshStandardMaterial color="#1a2e22" roughness={0.8} />
        </mesh>

        {/* Chalk tray */}
        <mesh position={[0, -0.95, -0.08]}>
          <boxGeometry args={[5.0, 0.06, 0.14]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Chalk pieces & Eraser on tray */}
        <mesh position={[-0.6, -0.91, -0.08]}>
          <boxGeometry args={[0.15, 0.04, 0.07]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.4, -0.91, -0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.09]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.55, -0.91, -0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.09]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* ================= WALL CLOCK ================= */}
      <group position={[0, 3.5, 5.9]}>
        {/* Outer Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Clock Face */}
        <mesh position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.01, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Center pin */}
        <mesh position={[0, 0, -0.042]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Hour Hand */}
        <mesh position={[0.06, 0.06, -0.04]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.02, 0.16, 0.005]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Minute Hand */}
        <mesh position={[0, 0.1, -0.04]}>
          <boxGeometry args={[0.015, 0.22, 0.005]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Animated Second Hand */}
        <mesh ref={clockSecondRef} position={[0, 0, -0.042]}>
          <group position={[0, 0.1, 0]}>
            <boxGeometry args={[0.008, 0.24, 0.004]} />
            <meshStandardMaterial color="#dc2626" />
          </group>
        </mesh>
      </group>

      {/* ================= WALL POSTERS / BULLETIN BOARDS ================= */}
      {/* Right wall posters */}
      <group position={[6.92, 2.3, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 1.4, 0.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.0, 1.2]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>
        {/* Pinned memos */}
        <mesh position={[-0.5, 0.2, 0.035]}>
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial color="#dbeafe" />
        </mesh>
        <mesh position={[0.3, 0.1, 0.035]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
        <mesh position={[-0.1, -0.25, 0.035]}>
          <planeGeometry args={[0.5, 0.35]} />
          <meshStandardMaterial color="#dcfce7" />
        </mesh>
      </group>

      {/* Periodic Table / Calculus Chart Poster */}
      <group position={[6.92, 2.3, -3.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 1.2, 0.02]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[1.72, 1.12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Classroom Speaker on wall */}
      <mesh position={[-6.85, 3.6, 5.0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}
