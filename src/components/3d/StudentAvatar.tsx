import { useRef } from 'react';
import type * as THREE from 'three';
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

  const [dx, , dz] = data.deskPosition;
  // Natural seat position behind the desk aligned with Y = 0.27m chair seat
  const seatPos: [number, number, number] = [dx, 0.05, dz - 0.28];
  const studentSeed = parseInt(data.id.replace('student-', '').replace('s', ''), 10) * 1.37;

  // Gentle breathing and peaceful head thinking motion
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (headGroupRef.current) {
      headGroupRef.current.rotation.x = 0.06 + Math.sin(time * 1.5 + studentSeed) * 0.03;
      headGroupRef.current.rotation.y = Math.cos(time * 1.1 + studentSeed) * 0.04;
    }
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = seatPos[1] + Math.sin(time * 2 + studentSeed) * 0.003;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={seatPos}
      rotation={[0, 0, 0]}
      scale={[0.88, 0.88, 0.88]}
    >
      {/* 1. SEATED BODY, SWEATER, WRITING ARMS & LEGS */}
      <ChibiBody
        shirtColor={data.shirtColor}
        pantsColor={data.pantsColor}
        shoesColor={data.shoesColor}
        skinTone={data.skinTone}
        studentSeed={studentSeed}
      />

      {/* 2. CHIBI HEAD, HAIR & ACCESSORIES (Animated Bobbing) */}
      <group ref={headGroupRef}>
        {/* Cute Chibi Head with Obsidian Eyes & Rosy Cheeks */}
        <ChibiHead skinTone={data.skinTone} />

        {/* Personalized Hair Style & Color */}
        <ChibiHair hairStyle={data.hairStyle} hairColor={data.hairColor} />

        {/* Iconic Student Accessories on top of head */}
        <group position={[0, 0.58, 0]}>
          <CapybaraAccessories accessory={data.accessory} />
        </group>
      </group>
    </group>
  );
}
