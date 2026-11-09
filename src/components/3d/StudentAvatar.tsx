import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import type { StudentData } from '../../types/classroom';
import type { ProtagonistGLTFResult } from './ProtagonistGLTF';
import { CapybaraAccessories } from './CapybaraAccessories';

interface StudentAvatarProps {
  data: StudentData;
}

// Map each student to a distinct protagonist skin
const SKIN_MAP: Record<string, string> = {
  s1: '/models/skins/skaterMaleA.png',
  s2: '/models/skins/skaterFemaleA.png',
  s3: '/models/skins/cyborgFemaleA.png',
  s4: '/models/skins/criminalMaleA.png',
  s5: '/models/skins/skaterFemaleA.png',
  s6: '/models/skins/skaterMaleA.png',
  s7: '/models/skins/cyborgFemaleA.png',
  s8: '/models/skins/criminalMaleA.png',
  s9: '/models/skins/skaterFemaleA.png',
};

export function StudentAvatar({ data }: StudentAvatarProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headBoneRef = useRef<THREE.Bone | null>(null);

  const [dx, , dz] = data.deskPosition;
  const seatPos: [number, number, number] = [dx, 0.42, dz - 0.26];

  // Load the rigged Humanoid GLTF
  const { scene } = useGLTF('/models/protagonist.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as ProtagonistGLTFResult;

  // Load texture skin
  const skinPath = SKIN_MAP[data.id] || '/models/skins/skaterMaleA.png';
  const skinTexture = useTexture(skinPath);
  skinTexture.flipY = false;

  const customMaterial = useMemo(() => {
    const mat = materials.skin.clone();
    mat.map = skinTexture;
    mat.roughness = 0.6;
    mat.needsUpdate = true;
    return mat;
  }, [materials.skin, skinTexture]);

  // Pose bones for seated studying posture:
  // Hips seated, thighs bent 90 deg forward, knees bent 90 deg down, hands resting on desk
  useMemo(() => {
    clone.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        if (bone.name.toLowerCase().includes('head')) {
          headBoneRef.current = bone;
        }
        // Left Thigh
        if (bone.name === 'LeftUpLeg' || bone.name === 'thigh.L') {
          bone.rotation.x = -Math.PI / 2.2;
        }
        // Right Thigh
        if (bone.name === 'RightUpLeg' || bone.name === 'thigh.R') {
          bone.rotation.x = -Math.PI / 2.2;
        }
        // Left Knee
        if (bone.name === 'LeftLeg' || bone.name === 'shin.L') {
          bone.rotation.x = Math.PI / 2.2;
        }
        // Right Knee
        if (bone.name === 'RightLeg' || bone.name === 'shin.R') {
          bone.rotation.x = Math.PI / 2.2;
        }
        // Arms resting on desk
        if (bone.name === 'LeftArm' || bone.name === 'upper_arm.L') {
          bone.rotation.x = -Math.PI / 5;
        }
        if (bone.name === 'RightArm' || bone.name === 'upper_arm.R') {
          bone.rotation.x = -Math.PI / 4.5;
        }
      }
    });
  }, [clone]);

  useFrame(({ clock }) => {
    if (!rootGroupRef.current) return;
    const time = clock.getElapsedTime();
    const studentSeed = parseInt(data.id.replace('student-', '').replace('s', ''), 10) * 1.37;

    // Peaceful idle breathing & subtle head nodding
    if (headBoneRef.current) {
      headBoneRef.current.rotation.x = 0.05 + Math.sin(time * 1.5 + studentSeed) * 0.04;
      headBoneRef.current.rotation.y = Math.cos(time * 1.1 + studentSeed) * 0.05;
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
      scale={[0.42, 0.42, 0.42]}
    >
      {/* Humanoid Rigged Mesh */}
      <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <primitive object={nodes.RightFootCtrl} />
        <primitive object={nodes.HipsCtrl} />
        <primitive object={nodes.LeftFootCtrl} />
      </group>

      <skinnedMesh
        geometry={nodes.characterMedium.geometry}
        material={customMaterial}
        skeleton={nodes.characterMedium.skeleton}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
        castShadow
        receiveShadow
      />

      {/* Student Accessories on head */}
      <group position={[0, 1.25, 0]}>
        <CapybaraAccessories accessory={data.accessory} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/protagonist.glb');
