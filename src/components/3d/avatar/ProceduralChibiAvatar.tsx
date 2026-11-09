import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData, CharacterState } from '../../../types/classroom';
import { ChibiHead } from './ChibiHead';
import { ChibiHair } from './ChibiHair';
import { ChibiBody } from './ChibiBody';
import { StudentAccessories } from './StudentAccessories';

export interface ProceduralChibiAvatarProps {
  data: StudentData;
  isWalking: boolean;
  state?: CharacterState;
}

export function ProceduralChibiAvatar({
  data,
  isWalking,
  state = 'IDLE',
}: ProceduralChibiAvatarProps) {
  const headGroupRef = useRef<THREE.Group>(null);

  const numericId = parseInt(data.id.replace(/\D/g, ''), 10);
  const studentSeed = (Number.isNaN(numericId) ? 1 : numericId) * 1.37;

  // Procedural Head Gestures with smooth damping & look-at camera tilt
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    if (!headGroupRef.current) return;

    let targetRotX = -0.08; // Base tilt: gently looking up towards camera (+4.5 deg)
    let targetRotY = 0;
    let targetRotZ = 0;

    if (state === 'CELEBRATING') {
      // Cheerful victory nodding & bouncing look-up
      targetRotX = -0.20 + Math.sin(time * 10 + studentSeed) * 0.08;
      targetRotY = Math.sin(time * 6 + studentSeed) * 0.08;
      targetRotZ = Math.sin(time * 5 + studentSeed) * 0.04;
    } else if (state === 'SAD') {
      // Disappointed gentle drop (anchored at neck, never dislocating)
      targetRotX = 0.06;
      targetRotY = Math.sin(time * 2.5 + studentSeed) * 0.12;
      targetRotZ = 0;
    } else if (state === 'THINKING') {
      // Contemplative head tilt gazing toward smartboard
      targetRotX = -0.04;
      targetRotY = 0.08;
      targetRotZ = 0.14;
    } else if (state === 'WAVE') {
      // Friendly smile tilt while waving to viewers
      targetRotX = -0.10;
      targetRotY = Math.sin(time * 4 + studentSeed) * 0.06;
      targetRotZ = 0.08;
    } else if (state === 'RAISE_HAND') {
      // Eager look-up towards blackboard / teacher
      targetRotX = -0.18;
      targetRotY = 0;
      targetRotZ = -0.05;
    } else if (state === 'DANCE') {
      // Rhythmic side-to-side head bobbing
      targetRotX = -0.12 + Math.abs(Math.sin(time * 8)) * 0.06;
      targetRotY = Math.sin(time * 8 + studentSeed) * 0.10;
      targetRotZ = Math.cos(time * 8 + studentSeed) * 0.08;
    } else if (state === 'SHOCKED') {
      // Head jolts back in shock and trembles
      targetRotX = 0.15;
      targetRotY = Math.sin(time * 30 + studentSeed) * 0.05;
      targetRotZ = Math.cos(time * 35 + studentSeed) * 0.03;
    } else if (isWalking) {
      // Subtle rhythmic stride bobbing while walking
      targetRotX = -0.06 + Math.sin(time * 9 + studentSeed) * 0.03;
      targetRotY = Math.cos(time * 9 + studentSeed) * 0.04;
      targetRotZ = -Math.sin(time * 9 + studentSeed) * 0.02;
    } else {
      // IDLE breathing and alive ambient awareness
      targetRotX = -0.08 + Math.sin(time * 1.8 + studentSeed) * 0.03;
      targetRotY = Math.cos(time * 1.2 + studentSeed) * 0.05;
      targetRotZ = Math.sin(time * 0.9 + studentSeed) * 0.015;
    }

    // Smooth lerp / damp for natural transitions without snapping
    const factor = Math.min(1, delta * 12);
    headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      headGroupRef.current.rotation.x,
      targetRotX,
      factor
    );
    headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      headGroupRef.current.rotation.y,
      targetRotY,
      factor
    );
    headGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      headGroupRef.current.rotation.z,
      targetRotZ,
      factor
    );
  });

  return (
    <group scale={[0.88, 0.88, 0.88]}>
      {/* 1. STANDING & WALKING HUMANOID CHIBI BODY WITH 2-TIER ARTICULATED LIMBS */}
      <ChibiBody
        shirtColor={data.shirtColor}
        pantsColor={data.pantsColor}
        shoesColor={data.shoesColor}
        skinTone={data.skinTone}
        studentSeed={studentSeed}
        state={state}
        isWalking={isWalking}
      />

      {/* 2. CHIBI HEAD, HAIR & ACCESSORIES (PIVOTED AT EXACT NECK ROOT [0, 0.40, 0]) */}
      <group ref={headGroupRef} position={[0, 0.40, 0]}>
        {/* Cute Chibi Head with Obsidian Eyes & Rosy Cheeks */}
        <ChibiHead skinTone={data.skinTone} state={state} />

        {/* Personalized Hair Style & Color */}
        <ChibiHair hairStyle={data.hairStyle} hairColor={data.hairColor} />

        {/* Iconic Student Accessories */}
        {data.accessory && data.accessory !== 'none' && (
          <StudentAccessories accessory={data.accessory} />
        )}
      </group>
    </group>
  );
}
