import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData } from '../../types/classroom';
import { ChibiHead } from './avatar/ChibiHead';
import { ChibiHair } from './avatar/ChibiHair';
import { ChibiBody } from './avatar/ChibiBody';
import { CapybaraAccessories } from './CapybaraAccessories';

interface StudentAvatarProps {
  data: StudentData;
}

export function StudentAvatar({ data }: StudentAvatarProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);

  // Position & Rotation Tracking
  const currentPos = useRef(
    new THREE.Vector3(data.deskPosition[0], 0, data.deskPosition[2])
  );
  const currentYaw = useRef(0);
  const [isWalking, setIsWalking] = useState(false);

  const studentSeed =
    parseInt(data.id.replace('student-', '').replace('s', ''), 10) * 1.37;

  // Target destination
  const targetX = data.targetPosition ? data.targetPosition[0] : data.deskPosition[0];
  const targetZ = data.targetPosition ? data.targetPosition[2] : data.deskPosition[2];

  // Character state
  const state = data.currentState || 'IDLE';

  // Smooth Movement & Procedural Head Animation in useFrame
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Calculate vector to target
    const dx = targetX - currentPos.current.x;
    const dz = targetZ - currentPos.current.z;
    const dist = Math.hypot(dx, dz);

    let walkingNow = false;

    if (dist > 0.06) {
      walkingNow = true;
      // Moving towards target: steer toward movement vector
      const targetYaw = Math.atan2(dx, dz);
      let diff = targetYaw - currentYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentYaw.current += diff * Math.min(1, delta * 12);

      // Move along vector (speed: 2.6 m/s)
      const step = Math.min(dist, 2.6 * delta);
      currentPos.current.x += (dx / dist) * step;
      currentPos.current.z += (dz / dist) * step;
    } else {
      // Arrived at destination
      walkingNow = false;

      // Desired idle facing angle:
      // When at Quiz Zone or Podium, face forward towards the camera (yaw = Math.PI)
      // When back at Spawn, face the blackboard (yaw = 0)
      let targetYaw = 0;
      if (
        state === 'THINKING' ||
        state === 'CELEBRATING' ||
        state === 'SAD' ||
        state === 'PRESENTING'
      ) {
        targetYaw = Math.PI;
      }

      let diff = targetYaw - currentYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentYaw.current += diff * Math.min(1, delta * 6);
    }

    if (walkingNow !== isWalking) {
      setIsWalking(walkingNow);
    }

    // Apply position & rotation to 3D group
    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(
        currentPos.current.x,
        0,
        currentPos.current.z
      );
      rootGroupRef.current.rotation.y = currentYaw.current;
    }

    // 2. Procedural Head Gestures
    if (headGroupRef.current) {
      if (state === 'CELEBRATING') {
        headGroupRef.current.rotation.x =
          -0.15 + Math.sin(time * 9 + studentSeed) * 0.12;
        headGroupRef.current.rotation.y =
          Math.sin(time * 5 + studentSeed) * 0.08;
        headGroupRef.current.rotation.z = 0;
      } else if (state === 'SAD') {
        headGroupRef.current.rotation.x = 0.35;
        headGroupRef.current.rotation.y =
          Math.sin(time * 3 + studentSeed) * 0.18;
        headGroupRef.current.rotation.z = 0;
      } else if (state === 'THINKING') {
        headGroupRef.current.rotation.x = 0.12;
        headGroupRef.current.rotation.y = 0.1;
        headGroupRef.current.rotation.z = 0.15;
      } else if (state === 'PRESENTING') {
        headGroupRef.current.rotation.x = 0.05;
        headGroupRef.current.rotation.y =
          Math.sin(time * 2 + studentSeed) * 0.15;
        headGroupRef.current.rotation.z = 0;
      } else {
        // IDLE natural bobbing
        headGroupRef.current.rotation.x =
          0.04 + Math.sin(time * 1.5 + studentSeed) * 0.03;
        headGroupRef.current.rotation.y =
          Math.cos(time * 1.1 + studentSeed) * 0.04;
        headGroupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[data.deskPosition[0], 0, data.deskPosition[2]]}
      scale={[0.88, 0.88, 0.88]}
    >
      {/* 1. STANDING & WALKING HUMANOID CHIBI BODY */}
      <ChibiBody
        shirtColor={data.shirtColor}
        pantsColor={data.pantsColor}
        shoesColor={data.shoesColor}
        skinTone={data.skinTone}
        studentSeed={studentSeed}
        state={state}
        isWalking={isWalking}
      />

      {/* 2. CHIBI HEAD, HAIR & ACCESSORIES */}
      <group ref={headGroupRef}>
        {/* Cute Chibi Head with Obsidian Eyes & Rosy Cheeks */}
        <ChibiHead skinTone={data.skinTone} />

        {/* Personalized Hair Style & Color */}
        <ChibiHair hairStyle={data.hairStyle} hairColor={data.hairColor} />

        {/* Iconic Student Accessories */}
        {data.accessory && data.accessory !== 'none' && (
          <CapybaraAccessories accessory={data.accessory} />
        )}
      </group>
    </group>
  );
}
