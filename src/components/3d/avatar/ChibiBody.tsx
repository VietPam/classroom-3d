import { useRef } from 'react';
import type * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { CharacterState } from '../../../types/classroom';

interface ChibiBodyProps {
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  skinTone: string;
  studentSeed: number;
  state?: CharacterState;
  isWalking?: boolean;
}

export function ChibiBody({
  shirtColor,
  pantsColor,
  shoesColor,
  skinTone,
  studentSeed,
  state = 'IDLE',
  isWalking = false,
}: ChibiBodyProps) {
  const bodyRootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Procedural Locomotion & Emote Animation Engine
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    let bounceY = 0;

    if (isWalking) {
      // 1. DYNAMIC WALKING CYCLE
      const walkCycle = time * 9 + studentSeed;
      const legAngle = Math.sin(walkCycle) * 0.65;
      const armAngle = Math.sin(walkCycle) * 0.55;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legAngle;
        rightLegRef.current.rotation.x = -legAngle;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -armAngle;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = -0.15;

        rightArmRef.current.rotation.x = armAngle;
        rightArmRef.current.rotation.y = 0;
        rightArmRef.current.rotation.z = 0.15;
      }
      bounceY = Math.abs(Math.sin(walkCycle)) * 0.035;
    } else if (state === 'CELEBRATING') {
      // 2. CELEBRATING VICTORY JUMP & V-SIGN
      bounceY = Math.abs(Math.sin(time * 9)) * 0.16;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        // Raise both arms high in victory
        leftArmRef.current.rotation.x = 0.1;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = 2.4 + Math.sin(time * 8) * 0.1;

        rightArmRef.current.rotation.x = 0.1;
        rightArmRef.current.rotation.y = 0;
        rightArmRef.current.rotation.z = -2.4 - Math.sin(time * 8) * 0.1;
      }
    } else if (state === 'SAD') {
      // 3. SAD / DISAPPOINTED EMOTE (Hunched shoulders, arms drooping)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0.25;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = 0.08;

        rightArmRef.current.rotation.x = 0.25;
        rightArmRef.current.rotation.y = 0;
        rightArmRef.current.rotation.z = -0.08;
      }
      bounceY = 0;
    } else if (state === 'THINKING') {
      // 4. THINKING EMOTE (Hand on chin, contemplative pose)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        // Left arm across waist
        leftArmRef.current.rotation.x = -0.7;
        leftArmRef.current.rotation.y = 0.4;
        leftArmRef.current.rotation.z = -0.3;

        // Right hand to chin
        rightArmRef.current.rotation.x = -1.5;
        rightArmRef.current.rotation.y = -0.4;
        rightArmRef.current.rotation.z = 0.35;
      }
      bounceY = Math.sin(time * 2 + studentSeed) * 0.005;
    } else {
      // 6. IDLE STANDING POSE (Gentle breathing and subtle arm sway)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0.05 + Math.sin(time * 1.5 + studentSeed) * 0.04;
        leftArmRef.current.rotation.y = 0;
        leftArmRef.current.rotation.z = -0.12;

        rightArmRef.current.rotation.x = 0.05 - Math.sin(time * 1.5 + studentSeed) * 0.04;
        rightArmRef.current.rotation.y = 0;
        rightArmRef.current.rotation.z = 0.12;
      }
      bounceY = Math.sin(time * 2 + studentSeed) * 0.006;
    }

    if (bodyRootRef.current) {
      bodyRootRef.current.position.y = bounceY;
    }
  });

  return (
    <group ref={bodyRootRef} position={[0, 0, 0]}>
      {/* ================= TORSO & SWEATER ================= */}
      {/* Main Chest / Torso */}
      <mesh position={[0, 0.29, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.09, 0.12, 12, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Clean White Shirt Collar */}
      <mesh position={[0, 0.36, 0.02]} rotation={[Math.PI / 2 + 0.15, 0, 0]}>
        <torusGeometry args={[0.065, 0.015, 8, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* ================= ARMS & HANDS ================= */}
      {/* Left Arm Pivot */}
      <group ref={leftArmRef} position={[-0.13, 0.33, 0]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh position={[0, -0.13, 0.01]} castShadow>
          <capsuleGeometry args={[0.026, 0.08, 8, 12]} />
          <meshStandardMaterial color={skinTone} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm Pivot */}
      <group ref={rightArmRef} position={[0.13, 0.33, 0]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh position={[0, -0.13, 0.01]} castShadow>
          <capsuleGeometry args={[0.026, 0.08, 8, 12]} />
          <meshStandardMaterial color={skinTone} roughness={0.7} />
        </mesh>
      </group>

      {/* ================= HIPS & PELVIS ================= */}
      <mesh position={[0, 0.20, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* ================= LEGS & SHOES (Standing & Walking) ================= */}
      {/* Left Leg Pivot */}
      <group ref={leftLegRef} position={[-0.065, 0.19, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.07, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf */}
        <group position={[0, -0.09, 0]}>
          <mesh position={[0, -0.04, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.06, 8, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          {/* Left Shoe */}
          <mesh position={[0, -0.08, 0.025]} scale={[1, 0.8, 1.4]} castShadow>
            <sphereGeometry args={[0.034, 12, 12]} />
            <meshStandardMaterial color={shoesColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Right Leg Pivot */}
      <group ref={rightLegRef} position={[0.065, 0.19, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.07, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf */}
        <group position={[0, -0.09, 0]}>
          <mesh position={[0, -0.04, 0]} castShadow>
            <capsuleGeometry args={[0.028, 0.06, 8, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
          {/* Right Shoe */}
          <mesh position={[0, -0.08, 0.025]} scale={[1, 0.8, 1.4]} castShadow>
            <sphereGeometry args={[0.034, 12, 12]} />
            <meshStandardMaterial color={shoesColor} roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
