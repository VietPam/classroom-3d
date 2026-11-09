import { useRef } from 'react';
import * as THREE from 'three';
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
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const leftCalfRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);

  // Procedural Locomotion & 2-Tier Articulated Kinematics Engine
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Targets for smooth lerp / damping
    let targetBounceY = 0;
    let targetRootRotZ = 0; // Hip sway (Chibi Waddle)
    let targetRootRotY = 0; // Torso counter-twist

    let targetLeftLegX = 0;
    let targetRightLegX = 0;
    let targetLeftCalfX = 0;
    let targetRightCalfX = 0;

    let targetLeftArmX = 0.05;
    let targetLeftArmY = 0;
    let targetLeftArmZ = -0.12;
    let targetLeftForearmX = -0.18; // Natural slight elbow bend at rest

    let targetRightArmX = 0.05;
    let targetRightArmY = 0;
    let targetRightArmZ = 0.12;
    let targetRightForearmX = -0.18;

    if (isWalking) {
      // 1. DYNAMIC CHIBI WALKING CYCLE WITH 2-TIER KNEE & ELBOW FLEXION
      const walkCycle = time * 8.5 + studentSeed;
      const legAngle = Math.sin(walkCycle) * 0.52;
      const armAngle = -legAngle * 0.7; // Arm swings opposite to leg

      targetLeftLegX = legAngle;
      targetRightLegX = -legAngle;

      // Knee flexion: bends backward when leg swings back into air
      targetLeftCalfX = Math.max(0, -legAngle) * 0.85;
      targetRightCalfX = Math.max(0, legAngle) * 0.85;

      // Arm swing with dynamic elbow bend
      targetLeftArmX = armAngle;
      targetLeftArmZ = -0.14;
      targetLeftForearmX = -0.28 - Math.max(0, armAngle) * 0.35;

      targetRightArmX = -armAngle;
      targetRightArmZ = 0.14;
      targetRightForearmX = -0.28 - Math.max(0, -armAngle) * 0.35;

      // Chibi Waddle: cute lateral hip sway & bounce
      targetRootRotZ = Math.sin(walkCycle) * 0.045;
      targetRootRotY = -Math.sin(walkCycle) * 0.05;
      targetBounceY = Math.abs(Math.sin(walkCycle)) * 0.032;
    } else if (state === 'CELEBRATING') {
      // 2. CELEBRATING VICTORY JUMP & DOUBLE V-RAISE
      targetBounceY = Math.abs(Math.sin(time * 9 + studentSeed)) * 0.14;
      targetRootRotZ = Math.sin(time * 6 + studentSeed) * 0.03;

      // Both arms raised high in victory with bent elbows
      targetLeftArmX = 0.05;
      targetLeftArmY = 0;
      targetLeftArmZ = 2.4 + Math.sin(time * 8 + studentSeed) * 0.1;
      targetLeftForearmX = -0.35;

      targetRightArmX = 0.05;
      targetRightArmY = 0;
      targetRightArmZ = -2.4 - Math.sin(time * 8 + studentSeed) * 0.1;
      targetRightForearmX = -0.35;
    } else if (state === 'SAD') {
      // 3. SAD / DISAPPOINTED EMOTE (Arms drooped together, quiet stance)
      targetLeftArmX = 0.22;
      targetLeftArmY = 0.05;
      targetLeftArmZ = -0.06;
      targetLeftForearmX = -0.15;

      targetRightArmX = 0.22;
      targetRightArmY = -0.05;
      targetRightArmZ = 0.06;
      targetRightForearmX = -0.15;

      targetBounceY = 0;
    } else if (state === 'THINKING') {
      // 4. THINKING EMOTE (Left arm across waist, right hand touching chin)
      // Left arm crossed
      targetLeftArmX = -0.45;
      targetLeftArmY = 0.35;
      targetLeftArmZ = -0.28;
      targetLeftForearmX = -0.85;

      // Right arm to chin
      targetRightArmX = -1.15;
      targetRightArmY = -0.25;
      targetRightArmZ = 0.22;
      targetRightForearmX = -1.35;

      targetBounceY = Math.sin(time * 2 + studentSeed) * 0.005;
    } else {
      // 5. IDLE REST POSE (Alive subtle breathing, balanced straight stance)
      const breathing = Math.sin(time * 1.8 + studentSeed) * 0.025;
      targetLeftArmX = 0.05 + breathing;
      targetRightArmX = 0.05 - breathing;
      targetBounceY = Math.sin(time * 1.8 + studentSeed) * 0.006;
    }

    // High quality damping factor for smooth transitions without popping
    const factor = Math.min(1, delta * 14);

    // Apply to Body Root
    if (bodyRootRef.current) {
      bodyRootRef.current.position.y = THREE.MathUtils.lerp(
        bodyRootRef.current.position.y,
        targetBounceY,
        factor
      );
      bodyRootRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyRootRef.current.rotation.z,
        targetRootRotZ,
        factor
      );
      bodyRootRef.current.rotation.y = THREE.MathUtils.lerp(
        bodyRootRef.current.rotation.y,
        targetRootRotY,
        factor
      );
    }

    // Apply to Legs
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
        leftLegRef.current.rotation.x,
        targetLeftLegX,
        factor
      );
    }
    if (leftCalfRef.current) {
      leftCalfRef.current.rotation.x = THREE.MathUtils.lerp(
        leftCalfRef.current.rotation.x,
        targetLeftCalfX,
        factor
      );
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
        rightLegRef.current.rotation.x,
        targetRightLegX,
        factor
      );
    }
    if (rightCalfRef.current) {
      rightCalfRef.current.rotation.x = THREE.MathUtils.lerp(
        rightCalfRef.current.rotation.x,
        targetRightCalfX,
        factor
      );
    }

    // Apply to Arms & Forearms
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        targetLeftArmX,
        factor
      );
      leftArmRef.current.rotation.y = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.y,
        targetLeftArmY,
        factor
      );
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        targetLeftArmZ,
        factor
      );
    }
    if (leftForearmRef.current) {
      leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftForearmRef.current.rotation.x,
        targetLeftForearmX,
        factor
      );
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        targetRightArmX,
        factor
      );
      rightArmRef.current.rotation.y = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.y,
        targetRightArmY,
        factor
      );
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        targetRightArmZ,
        factor
      );
    }
    if (rightForearmRef.current) {
      rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightForearmRef.current.rotation.x,
        targetRightForearmX,
        factor
      );
    }
  });

  return (
    <group ref={bodyRootRef} position={[0, 0, 0]}>
      {/* ================= TORSO & SWEATER ================= */}
      {/* Main Chest / Torso - Upright Balanced Capsule */}
      <mesh position={[0, 0.29, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.09, 0.12, 12, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Clean White Shirt Collar Anchored at Neck */}
      <mesh position={[0, 0.36, 0.02]} rotation={[Math.PI / 2 + 0.15, 0, 0]}>
        <torusGeometry args={[0.065, 0.015, 8, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* ================= 2-TIER ARTICULATED ARMS ================= */}
      {/* Left Arm Pivot (Shoulder) */}
      <group ref={leftArmRef} position={[-0.13, 0.33, 0]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.065, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm & Hand Pivot (Elbow Joint) */}
        <group ref={leftForearmRef} position={[0, -0.08, 0]}>
          <mesh position={[0, -0.045, 0.01]} castShadow>
            <capsuleGeometry args={[0.026, 0.065, 8, 12]} />
            <meshStandardMaterial color={skinTone} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Right Arm Pivot (Shoulder) */}
      <group ref={rightArmRef} position={[0.13, 0.33, 0]}>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.065, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Forearm & Hand Pivot (Elbow Joint) */}
        <group ref={rightForearmRef} position={[0, -0.08, 0]}>
          <mesh position={[0, -0.045, 0.01]} castShadow>
            <capsuleGeometry args={[0.026, 0.065, 8, 12]} />
            <meshStandardMaterial color={skinTone} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ================= HIPS & PELVIS ================= */}
      <mesh position={[0, 0.20, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* ================= 2-TIER ARTICULATED LEGS & SHOES ================= */}
      {/* Left Leg Pivot (Hip) */}
      <group ref={leftLegRef} position={[-0.065, 0.19, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.07, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf & Foot Pivot (Knee Joint) */}
        <group ref={leftCalfRef} position={[0, -0.085, 0]}>
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

      {/* Right Leg Pivot (Hip) */}
      <group ref={rightLegRef} position={[0.065, 0.19, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.045, 0]} castShadow>
          <capsuleGeometry args={[0.032, 0.07, 8, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf & Foot Pivot (Knee Joint) */}
        <group ref={rightCalfRef} position={[0, -0.085, 0]}>
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
