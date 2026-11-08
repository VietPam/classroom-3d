import { useRef } from 'react';
import * as THREE from 'three';

interface StudentDeskProps {
  position: [number, number, number];
  isHovered?: boolean;
  hasPaper?: boolean;
  chairPushedBack?: number; // 0 (standard) to 0.25 (when student stands up)
  seatId: string;
}

export function StudentDesk({
  position,
  isHovered = false,
  hasPaper = true,
  chairPushedBack = 0,
  seatId,
}: StudentDeskProps) {
  const deskRef = useRef<THREE.Group>(null);

  return (
    <group ref={deskRef} position={position}>
      {/* ================= DESK TABLE ================= */}
      {/* Desk Top */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.04, 0.54]} />
        <meshStandardMaterial
          color={isHovered ? '#fde047' : '#d4a373'}
          roughness={0.4}
        />
      </mesh>

      {/* Desk Metal Legs (4 tubular legs) */}
      {[
        [-0.35, -0.22],
        [0.35, -0.22],
        [-0.35, 0.22],
        [0.35, 0.22],
      ].map(([x, z], idx) => (
        <mesh key={`desk-leg-${idx}`} position={[x, 0.35, z]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Book rack under desk */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.68, 0.02, 0.44]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Backpack hanging on desk leg side */}
      <mesh position={[-0.42, 0.35, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.26]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
      </mesh>

      {/* ================= ACCESSORIES ON DESK ================= */}
      {/* Test Exam Paper Sheet */}
      {hasPaper && (
        <group position={[0.05, 0.742, 0.02]} rotation={[0, 0.04, 0]}>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.28]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.9}
            />
          </mesh>
          {/* Subtle printed questions lines */}
          {[-0.08, -0.04, 0, 0.04, 0.08].map((z, idx) => (
            <mesh key={`paper-line-${idx}`} position={[0, 0.001, z]}>
              <boxGeometry args={[0.16, 0.001, 0.01]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>
          ))}
        </group>
      )}

      {/* Yellow Pencil */}
      <mesh position={[-0.22, 0.745, -0.08]} rotation={[0, 0.25, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.004, 0.14]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>

      {/* Eraser */}
      <mesh position={[-0.22, 0.745, 0.1]}>
        <boxGeometry args={[0.025, 0.015, 0.045]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.5} />
      </mesh>

      {/* Water bottle on desk corner */}
      <mesh position={[0.28, 0.81, -0.15]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Seat Number Tag */}
      <group position={[0, 0.725, 0.26]} name={`seat-tag-${seatId}`}>
        <mesh>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ================= CHAIR ================= */}
      {/* Chair shifts back slightly when chairPushedBack > 0 */}
      <group position={[0, 0, -0.42 - chairPushedBack]}>
        {/* Chair Seat */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.03, 0.4]} />
          <meshStandardMaterial
            color={isHovered ? '#fef08a' : '#b45309'}
            roughness={0.5}
          />
        </mesh>

        {/* Chair Legs */}
        {[
          [-0.18, -0.17],
          [0.18, -0.17],
          [-0.18, 0.17],
          [0.18, 0.17],
        ].map(([cx, cz], idx) => (
          <mesh key={`chair-leg-${idx}`} position={[cx, 0.22, cz]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.44]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Chair Back Support Rods */}
        <mesh position={[-0.18, 0.64, -0.18]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[0.18, 0.64, -0.18]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>

        {/* Chair Backrest */}
        <mesh position={[0, 0.75, -0.19]} castShadow>
          <boxGeometry args={[0.4, 0.18, 0.025]} />
          <meshStandardMaterial
            color={isHovered ? '#fef08a' : '#b45309'}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
