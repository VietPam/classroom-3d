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
  const motionRootRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);

  const numericId = parseInt(data.id.replace(/\D/g, ''), 10);
  const studentSeed = (Number.isNaN(numericId) ? 1 : numericId) * 1.37;

  // Procedural Head Gestures & Whole-Avatar Vertical Locomotion
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    if (!headGroupRef.current) return;

    let targetRotX = -0.08; // Base tilt: gently looking up towards camera (+4.5 deg)
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetBounceY = 0;

    if (isWalking) {
      // 1. Walking stride cycle & head bob
      const walkCycle = time * 8.5 + studentSeed;
      targetBounceY = Math.abs(Math.sin(walkCycle)) * 0.032;
      targetRotX = -0.06 + Math.sin(walkCycle) * 0.03;
      targetRotY = Math.cos(walkCycle) * 0.04;
      targetRotZ = -Math.sin(walkCycle) * 0.02;
    } else if (state === 'CELEBRATING') {
      // 2. High-energy celebratory jump arc with realistic airborne hang-time
      const jumpCycle = (time * 3.6 + studentSeed * 0.7) % 1;
      if (jumpCycle < 0.2) {
        // Anticipation crouch (-2.5cm)
        const norm = jumpCycle / 0.2;
        targetBounceY = -Math.sin(norm * Math.PI) * 0.025;
        targetRotX = 0.02;
      } else if (jumpCycle < 0.75) {
        // Airborne parabolic flight with buoyant apex (+16cm)
        const airTime = (jumpCycle - 0.2) / 0.55;
        const flightCurve = Math.sin(airTime * Math.PI);
        targetBounceY = flightCurve * 0.16;
        targetRotX = -0.22 - flightCurve * 0.10; // Head gazes triumphantly up
        targetRotY = Math.sin(time * 5 + studentSeed) * 0.05;
        targetRotZ = Math.sin(time * 4 + studentSeed) * 0.03;
      } else {
        // Landing squash (-2cm)
        const landTime = (jumpCycle - 0.75) / 0.25;
        targetBounceY = -Math.sin(landTime * Math.PI) * 0.02;
        targetRotX = -0.06;
      }
    } else if (state === 'SAD') {
      // Disappointed gentle drop (anchored at neck, never dislocating)
      targetBounceY = -0.01;
      targetRotX = 0.06;
      targetRotY = Math.sin(time * 2.5 + studentSeed) * 0.12;
      targetRotZ = 0;
    } else if (state === 'THINKING') {
      // Contemplative head tilt gazing toward smartboard
      targetBounceY = Math.sin(time * 2 + studentSeed) * 0.005;
      targetRotX = -0.04;
      targetRotY = 0.08;
      targetRotZ = 0.14;
    } else if (state === 'WAVE') {
      // Friendly smile tilt while waving to viewers
      targetBounceY = Math.sin(time * 4.5 + studentSeed) * 0.008;
      targetRotX = -0.10;
      targetRotY = Math.sin(time * 4 + studentSeed) * 0.06;
      targetRotZ = 0.08;
    } else if (state === 'RAISE_HAND') {
      // Eager look-up towards blackboard / teacher
      targetBounceY = 0.015 + Math.sin(time * 3 + studentSeed) * 0.004;
      targetRotX = -0.18;
      targetRotY = 0;
      targetRotZ = -0.05;
    } else if (state === 'DANCE') {
      // Rhythmic side-to-side head bobbing & energetic bounce
      const danceBeat = time * 7.5 + studentSeed;
      targetBounceY = Math.abs(Math.sin(danceBeat)) * 0.045;
      targetRotX = -0.12 + Math.abs(Math.sin(time * 8)) * 0.06;
      targetRotY = Math.sin(time * 8 + studentSeed) * 0.10;
      targetRotZ = Math.cos(time * 8 + studentSeed) * 0.08;
    } else if (state === 'SHOCKED') {
      // Head jolts back in shock and trembles
      const tremor = Math.sin(time * 35 + studentSeed) * 0.012;
      targetBounceY = -0.01 + tremor;
      targetRotX = 0.15;
      targetRotY = Math.sin(time * 30 + studentSeed) * 0.05;
      targetRotZ = Math.cos(time * 35 + studentSeed) * 0.03;
    } else {
      // IDLE breathing and alive ambient awareness
      targetBounceY = Math.sin(time * 1.8 + studentSeed) * 0.006;
      targetRotX = -0.08 + Math.sin(time * 1.8 + studentSeed) * 0.03;
      targetRotY = Math.cos(time * 1.2 + studentSeed) * 0.05;
      targetRotZ = Math.sin(time * 0.9 + studentSeed) * 0.015;
    }

    // Apply smooth damping for transitions without popping
    const factor = Math.min(1, delta * 14);

    if (motionRootRef.current) {
      motionRootRef.current.position.y = THREE.MathUtils.lerp(
        motionRootRef.current.position.y,
        targetBounceY,
        factor
      );
    }

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
      {/* 
        UNIFIED AVATAR MOTION ROOT:
        Both ChibiBody and ChibiHead live inside motionRootRef.
        When jumping, walking, or dancing, the entire avatar (body, limbs, neck, head, hair, accessories)
        moves in 100% rigid lockstep with ZERO neck penetration or head detachment.
      */}
      <group ref={motionRootRef}>
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
    </group>
  );
}
