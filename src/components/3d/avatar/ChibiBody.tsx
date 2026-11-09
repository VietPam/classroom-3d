import { useRef } from 'react';
import type * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChibiBodyProps {
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  skinTone: string;
  studentSeed: number;
}

export function ChibiBody({
  shirtColor,
  pantsColor,
  shoesColor,
  skinTone,
  studentSeed,
}: ChibiBodyProps) {
  const rightArmRef = useRef<THREE.Group>(null);

  // Subtle natural pencil writing animation on desk
  useFrame(({ clock }) => {
    if (!rightArmRef.current) return;
    const time = clock.getElapsedTime();
    rightArmRef.current.rotation.z = Math.sin(time * 4 + studentSeed) * 0.05;
    rightArmRef.current.rotation.x = -0.55 + Math.cos(time * 3 + studentSeed) * 0.03;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================= TORSO & SWEATER ================= */}
      {/* Main Chest / Torso */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.09, 0.12, 12, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Clean White Shirt Collar */}
      <mesh position={[0, 0.35, 0.02]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <torusGeometry args={[0.065, 0.015, 8, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* ================= ARMS & HANDS ================= */}
      {/* Left Arm: Resting comfortably on desk holding test paper */}
      <group position={[-0.13, 0.30, 0.02]} rotation={[-0.5, 0, -0.2]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh position={[0.02, -0.13, 0.04]} rotation={[0.4, 0, 0]} castShadow>
          <capsuleGeometry args={[0.026, 0.08, 8, 12]} />
          <meshStandardMaterial color={skinTone} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm: Actively writing with pencil */}
      <group ref={rightArmRef} position={[0.13, 0.30, 0.02]} rotation={[-0.55, 0, 0.2]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.02, -0.13, 0.04]} rotation={[0.4, 0, 0]} castShadow>
          <capsuleGeometry args={[0.026, 0.08, 8, 12]} />
          <meshStandardMaterial color={skinTone} roughness={0.7} />
        </mesh>
        {/* Small Yellow Pencil in Hand */}
        <mesh position={[-0.02, -0.16, 0.08]} rotation={[0.6, 0.2, 0.4]}>
          <cylinderGeometry args={[0.004, 0.004, 0.08]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= HIPS & LEGS (Seated 90 deg) ================= */}
      {/* Seated Pelvis */}
      <mesh position={[0, 0.17, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* Left Thigh (bent 90 deg forward) */}
      <group position={[-0.06, 0.16, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.05, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.08, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Left Knee & Calf (bent 90 deg down) */}
        <group position={[0, -0.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, -0.06, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.08, 8, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          {/* Left Shoe */}
          <mesh position={[0, -0.13, 0.02]} scale={[1, 0.8, 1.4]} castShadow>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshStandardMaterial color={shoesColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Right Thigh (bent 90 deg forward) */}
      <group position={[0.06, 0.16, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.05, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.08, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Right Knee & Calf (bent 90 deg down) */}
        <group position={[0, -0.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, -0.06, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.08, 8, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          {/* Right Shoe */}
          <mesh position={[0, -0.13, 0.02]} scale={[1, 0.8, 1.4]} castShadow>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshStandardMaterial color={shoesColor} roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
