import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { QuizStatus } from '../../types/classroom';
import { QUIZ_ZONES } from '../../data/floorZones';

interface FloorZonesProps {
  quizStatus: QuizStatus;
  correctOption?: 'A' | 'B' | 'C' | 'D';
  votePercentages?: Record<'A' | 'B' | 'C' | 'D', number>;
  voteCounts?: Record<'A' | 'B' | 'C' | 'D', number>;
  totalVotes?: number;
}

export function FloorZones({
  quizStatus,
  correctOption = 'A',
  votePercentages,
  voteCounts,
  totalVotes = 0,
}: FloorZonesProps) {
  const zonesRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Setup dynamic 512x800 canvas textures for A, B, C, D displaying letter and live vote stats
  const zoneTextures = useMemo(() => {
    const map = new Map<string, { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }>();
    (['A', 'B', 'C', 'D'] as const).forEach((letter) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 800;
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      map.set(letter, { canvas, texture });
    });
    return map;
  }, []);

  // Update canvas textures whenever votes or status changes
  useEffect(() => {
    const zoneThemeMap: Record<string, { bg: string; ring: string; text: string; pillBg: string }> = {
      A: { bg: '#FFFFFF', ring: '#F59E0B', text: '#D97706', pillBg: '#FEF3C7' },
      B: { bg: '#FFFFFF', ring: '#3B82F6', text: '#1E40AF', pillBg: '#DBEAFE' },
      C: { bg: '#FFFFFF', ring: '#10B981', text: '#059669', pillBg: '#D1FAE5' },
      D: { bg: '#FFFFFF', ring: '#EF4444', text: '#DC2626', pillBg: '#FEE2E2' },
    };

    (['A', 'B', 'C', 'D'] as const).forEach((letter) => {
      const item = zoneTextures.get(letter);
      if (!item) return;
      const { canvas, texture } = item;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const theme = zoneThemeMap[letter];
      const count = voteCounts?.[letter] ?? 0;
      const pct = votePercentages?.[letter] ?? 0;

      // Clear
      ctx.clearRect(0, 0, 512, 800);

      // 1. High-contrast pure white rounded badge background
      ctx.fillStyle = theme.bg;
      ctx.beginPath();
      ctx.roundRect(16, 16, 480, 768, 64);
      ctx.fill();

      // Thick vibrant color border ring
      ctx.strokeStyle = theme.ring;
      ctx.lineWidth = 28;
      ctx.stroke();

      // 2. Extra large bold letter in upper half (center at Y=280)
      ctx.font = '900 280px "Montserrat", "Be Vietnam Pro", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.text;
      ctx.fillText(letter, 256, 270);

      // Subtle divider line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(48, 480);
      ctx.lineTo(464, 480);
      ctx.stroke();

      // 3. Vote Stat Pill in lower half (closest to front camera edge)
      const pillW = 416;
      const pillH = 220;
      const pillX = 256 - pillW / 2;
      const pillY = 510;

      ctx.fillStyle = theme.pillBg;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 32);
      ctx.fill();

      ctx.strokeStyle = theme.ring;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Vote percentage (Big bold 92px)
      ctx.font = '900 92px "Montserrat", "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = theme.text;
      ctx.fillText(`${pct}%`, 256, pillY + 90);

      // Vote count badge (40px)
      ctx.font = '700 40px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#475569';
      const labelText = totalVotes > 0 ? `${count} phiếu` : '0 phiếu';
      ctx.fillText(labelText, 256, pillY + 168);

      texture.needsUpdate = true;
    });
  }, [zoneTextures, votePercentages, voteCounts, totalVotes]);

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
                <meshBasicMaterial map={zoneTextures.get(zone.id)?.texture} toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
