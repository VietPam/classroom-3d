import { useRef } from 'react';
import type * as THREE from 'three';
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

  // Procedural Head Gestures in useFrame
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
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
    <group scale={[0.88, 0.88, 0.88]}>
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
          <StudentAccessories accessory={data.accessory} />
        )}
      </group>
    </group>
  );
}
