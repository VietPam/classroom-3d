import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { QuizStatus } from '../../types/classroom';
import { QUIZ_ZONES } from '../../data/floorZones';

interface FloorZonesProps {
  quizStatus: QuizStatus;
  correctOption?: 'A' | 'B' | 'C' | 'D';
}

export function FloorZones({
  quizStatus,
  correctOption = 'A',
}: FloorZonesProps) {
  const zonesRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Generate crisp 512x512 letter textures for A, B, C, D using Montserrat / Be Vietnam Pro
  const letterTextures = useMemo(() => {
    const map = new Map<string, THREE.CanvasTexture>();
    const zoneThemeMap: Record<string, { bg: string; ring: string; text: string }> = {
      A: { bg: '#FFFFFF', ring: '#F08806', text: '#D97706' },
      B: { bg: '#FFFFFF', ring: '#1F3EB7', text: '#1E40AF' },
      C: { bg: '#FFFFFF', ring: '#059669', text: '#059669' },
      D: { bg: '#FFFFFF', ring: '#DC2626', text: '#DC2626' },
    };

    ['A', 'B', 'C', 'D'].forEach((letter) => {
      const theme = zoneThemeMap[letter] || { bg: '#FFFFFF', ring: '#334155', text: '#0F172A' };
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High-contrast pure white rounded badge background
        ctx.fillStyle = theme.bg;
        ctx.beginPath();
        ctx.roundRect(24, 24, 464, 464, 90);
        ctx.fill();

        // Thick vibrant color border ring
        ctx.strokeStyle = theme.ring;
        ctx.lineWidth = 42;
        ctx.stroke();

        // Extra large bold letter centered with brand typography
        ctx.font = '900 330px "Montserrat", "Be Vietnam Pro", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme.text;
        ctx.fillText(letter, 256, 275);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      map.set(letter, texture);
    });
    return map;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate Quiz Zones glowing state
    QUIZ_ZONES.forEach((zone) => {
      const mat = zonesRef.current.get(zone.id);
      if (!mat) return;

      if (quizStatus === 'REVEAL') {
        if (zone.id === correctOption) {
          mat.emissiveIntensity = 1.4 + Math.sin(time * 6) * 0.6;
        } else {
          mat.emissiveIntensity = 0.2;
        }
      } else if (quizStatus === 'RUNNING' || quizStatus === 'THINKING') {
        mat.emissiveIntensity = 0.8 + Math.sin(time * 4 + zone.position[0]) * 0.4;
      } else {
        mat.emissiveIntensity = 0.4 + Math.sin(time * 2 + zone.position[0]) * 0.2;
      }
    });
  });

  return (
    <group>
      {/* ================= 4 BRAND QUIZ ZONES (PHÓNG TO 1.4M X 1.8M, LIGHT PASTEL THEME) ================= */}
      {QUIZ_ZONES.map((zone) => {
        const isCorrect = quizStatus === 'REVEAL' && zone.id === correctOption;
        const isWrong = quizStatus === 'REVEAL' && zone.id !== correctOption;

        // Bảng màu Pastel cho từng ô sàn đấu (loại bỏ hoàn toàn màu đen cũ)
        const zoneFloorTheme: Record<
          string,
          { base: string; inset: string; border: string; glow: string }
        > = {
          A: {
            base: '#FEF3C7', // Amber pastel
            inset: '#FFFBEB',
            border: '#F59E0B',
            glow: '#FBBF24',
          },
          B: {
            base: '#DBEAFE', // Blue pastel
            inset: '#EFF6FF',
            border: '#3B82F6',
            glow: '#60A5FA',
          },
          C: {
            base: '#D1FAE5', // Green pastel
            inset: '#ECFDF5',
            border: '#10B981',
            glow: '#34D399',
          },
          D: {
            base: '#FEE2E2', // Red/Coral pastel
            inset: '#FEF2F2',
            border: '#EF4444',
            glow: '#F87171',
          },
        };

        const theme = zoneFloorTheme[zone.id] || zoneFloorTheme.A;
        const baseColor = isCorrect ? '#A7F3D0' : isWrong ? '#F1F5F9' : theme.base;
        const insetColor = isCorrect ? '#D1FAE5' : isWrong ? '#F8FAFC' : theme.inset;
        const borderColor = isCorrect ? '#059669' : isWrong ? '#CBD5E1' : theme.border;
        const glowColor = isCorrect ? '#34D399' : isWrong ? '#E2E8F0' : theme.glow;

        return (
          <group key={zone.id} position={zone.position}>
            {/* Base Tile (Slightly beveled pastel platform - Phóng to 1.4m x 1.8m) */}
            <mesh position={[0, 0.007, 0]} receiveShadow>
              <boxGeometry args={[1.40, 0.014, 1.80]} />
              <meshStandardMaterial
                color={baseColor}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>

            {/* Glowing Neon Border Ring */}
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[1.44, 0.018, 1.84]} />
              <meshStandardMaterial
                ref={(el) => {
                  if (el) zonesRef.current.set(zone.id, el);
                }}
                color={borderColor}
                emissive={glowColor}
                emissiveIntensity={isCorrect ? 1.5 : 0.6}
                roughness={0.2}
                wireframe={false}
              />
            </mesh>

            {/* Inner Clean Pastel Inset (Trắng kem / pastel sạch sẽ, không còn màu đen) */}
            <mesh position={[0, 0.016, 0]}>
              <boxGeometry args={[1.28, 0.02, 1.68]} />
              <meshStandardMaterial
                color={insetColor}
                roughness={0.6}
                metalness={0.05}
              />
            </mesh>

            {/* Flat Floor Letter Decal - Bố trí tại nửa trước ô ([0, 0.028, -0.32]), để nhiều người đứng ở giữa/sau không che chữ */}
            <group position={[0, 0.028, -0.32]} rotation={[-Math.PI / 2, 0, Math.PI]}>
              {/* Outer Glowing Border Ring on Floor */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.84, 1.30]} />
                <meshStandardMaterial
                  color={borderColor}
                  emissive={glowColor}
                  emissiveIntensity={isCorrect ? 2.0 : 0.6}
                  roughness={0.2}
                />
              </mesh>

              {/* Inner High-Contrast Flat Letter Decal lying completely flat on floor */}
              <mesh position={[0, 0, 0.003]}>
                <planeGeometry args={[0.78, 1.24]} />
                <meshBasicMaterial map={letterTextures.get(zone.id)} toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
