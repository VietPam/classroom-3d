import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VRMUtils, type VRM } from '@pixiv/three-vrm';
import { createVRMAnimationClip } from '@pixiv/three-vrm-animation';
import type { StudentData, CharacterState } from '../../../types/classroom';
import { CHARACTER_CONFIG } from '../../../config/characterConfig';
import { vrmLoaderService } from '../../../services/vrmLoaderService';
import { ProceduralChibiAvatar } from './ProceduralChibiAvatar';

export interface VRMAvatarProps {
  data: StudentData;
  isWalking: boolean;
  state?: CharacterState;
}

export function VRMAvatar({
  data,
  isWalking,
  state = 'IDLE',
}: VRMAvatarProps) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  // 1. Tải Model VRM và khởi tạo Animation Mixer
  useEffect(() => {
    let isMounted = true;
    let currentVrm: VRM | null = null;
    const modelUrl =
      CHARACTER_CONFIG.vrmModelMap[data.id] ||
      `/avatars/vrm/${data.id}.vrm`;

    vrmLoaderService.loadVRM(modelUrl).then(async (loadedVrm) => {
      if (!isMounted) {
        if (loadedVrm) VRMUtils.deepDispose(loadedVrm.scene);
        return;
      }

      if (!loadedVrm) {
        // Tự động kích hoạt Graceful Fallback nếu chưa có file .vrm
        setLoadFailed(true);
        return;
      }

      currentVrm = loadedVrm;
      setVrm(loadedVrm);
      setLoadFailed(false);

      const mixer = new THREE.AnimationMixer(loadedVrm.scene);
      mixerRef.current = mixer;
      const actionsMap = new Map<string, THREE.AnimationAction>();

      // Tải và gán 5 hoạt ảnh VRMA dùng chung
      const animEntries = Object.entries(CHARACTER_CONFIG.vrmaAnimationMap);
      for (const [key, animUrl] of animEntries) {
        const vrma = await vrmLoaderService.loadVRMA(animUrl);
        if (vrma && isMounted) {
          const clip = createVRMAnimationClip(vrma, loadedVrm);
          const action = mixer.clipAction(clip);
          actionsMap.set(key, action);
        }
      }

      if (isMounted) {
        actionsRef.current = actionsMap;
        const initialAction = actionsMap.get('IDLE');
        if (initialAction) {
          initialAction.play();
          activeActionRef.current = initialAction;
        }
      }
    });

    return () => {
      isMounted = false;
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      if (currentVrm) {
        VRMUtils.deepDispose(currentVrm.scene);
      }
    };
  }, [data.id]);

  // 2. Chuyển đổi hoạt ảnh mượt mà (Cross-fade) theo trạng thái di chuyển
  useEffect(() => {
    if (!mixerRef.current) return;

    let targetKey = 'IDLE';
    if (isWalking) {
      targetKey = 'WALKING';
    } else if (state === 'CELEBRATING') {
      targetKey = 'CELEBRATING';
    } else if (state === 'SAD') {
      targetKey = 'SAD';
    } else if (state === 'THINKING') {
      targetKey = 'THINKING';
    }

    const nextAction = actionsRef.current.get(targetKey);
    const prevAction = activeActionRef.current;

    if (nextAction && nextAction !== prevAction) {
      nextAction.reset().fadeIn(0.25).play();
      if (prevAction) {
        prevAction.fadeOut(0.25);
      }
      activeActionRef.current = nextAction;
    }
  }, [isWalking, state]);

  // 3. Cập nhật vật lý (Spring Bones), Animation Mixer và Biểu cảm mặt (Blendshapes)
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (vrm) {
      // Cập nhật biểu cảm mặt qua ExpressionManager
      if (vrm.expressionManager) {
        if (state === 'CELEBRATING') {
          vrm.expressionManager.setValue('happy', 1.0);
          vrm.expressionManager.setValue('sad', 0.0);
        } else if (state === 'SAD') {
          vrm.expressionManager.setValue('sad', 1.0);
          vrm.expressionManager.setValue('happy', 0.0);
        } else {
          vrm.expressionManager.setValue('happy', 0.0);
          vrm.expressionManager.setValue('sad', 0.0);
        }

        // Chớp mắt tự nhiên theo chu kỳ sinh học
        const blinkCycle = Math.sin(time * 2.8);
        const blinkAmount = blinkCycle > 0.96 ? (blinkCycle - 0.96) / 0.04 : 0.0;
        vrm.expressionManager.setValue('blink', blinkAmount);
      }

      // Cập nhật lò xo vật lý tóc và quần áo
      vrm.update(delta);
    }
  });

  // ================= GRACEFUL FALLBACK =================
  // Nếu chưa có file .vrm thực tế hoặc đang tải lỗi, tự động render Chibi hiện tại
  if (loadFailed || !vrm) {
    return (
      <ProceduralChibiAvatar
        data={data}
        isWalking={isWalking}
        state={state}
      />
    );
  }

  // Model VRM chính thức
  return (
    <primitive
      object={vrm.scene}
      scale={[0.85, 0.85, 0.85]}
      position={[0, 0, 0]}
    />
  );
}
