import { useRef } from 'react';
import type * as THREE from 'three';
import { Laptop } from './workspace/Laptop';

interface StudentDeskProps {
  position: [number, number, number];
  seatId: string;
}

export function StudentDesk({ position }: StudentDeskProps) {
  const deskRef = useRef<THREE.Group>(null);

  return (
    <group ref={deskRef} position={position}>
      {/* ================= COMPACT MODERN DESK (Downscaled ~20%) ================= */}
      {/* Desk Top Wood Plate: Compact 0.64m x 0.40m */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.64, 0.026, 0.40]} />
        <meshStandardMaterial color="#d4a373" roughness={0.35} />
      </mesh>

      {/* Desk Legs (4 Clean Modern Tubular Metal Legs) */}
      {[
        [-0.28, -0.16],
        [0.28, -0.16],
        [-0.28, 0.16],
        [0.28, 0.16],
      ].map(([x, z], idx) => (
        <mesh key={`desk-leg-${idx}`} position={[x, 0.21, z]} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.42, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Under-desk Storage Rack */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.54, 0.014, 0.30]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Backpack Hanging on Desk Side */}
      <mesh position={[-0.34, 0.24, 0]} rotation={[0, 0, 0.08]} castShadow>
        <boxGeometry args={[0.07, 0.25, 0.18]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* ================= LAPTOP & ACCESSORIES ON DESK ================= */}
      {/* High-tech Glowing Coding Laptop (Facing Student) */}
      <Laptop position={[0, 0.455, -0.02]} rotation={[0, Math.PI, 0]} />

      {/* Modern Tumbler / Water Bottle */}
      <mesh position={[0.24, 0.50, -0.10]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.09, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.9} />
      </mesh>

      {/* Small Notepad Sheet */}
      <mesh position={[-0.21, 0.455, 0.06]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[0.09, 0.13]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>

      {/* ================= COMPACT ERGONOMIC CHAIR ================= */}
      <group position={[0, 0, -0.28]}>
        {/* Chair Seat Pad (Matching student pelvis Y = 0.27m) */}
        <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.02, 0.30]} />
          <meshStandardMaterial color="#b45309" roughness={0.45} />
        </mesh>

        {/* 4 Metal Chair Legs */}
        {[
          [-0.13, -0.12],
          [0.13, -0.12],
          [-0.13, 0.12],
          [0.13, 0.12],
        ].map(([cx, cz], idx) => (
          <mesh key={`chair-leg-${idx}`} position={[cx, 0.135, cz]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.27, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Chair Back Support Rods */}
        <mesh position={[-0.13, 0.42, -0.13]}>
          <cylinderGeometry args={[0.008, 0.008, 0.30, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[0.13, 0.42, -0.13]}>
          <cylinderGeometry args={[0.008, 0.008, 0.30, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>

        {/* Curved Ergonomic Backrest */}
        <mesh position={[0, 0.48, -0.14]} castShadow>
          <boxGeometry args={[0.34, 0.11, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
}
