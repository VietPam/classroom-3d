import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { QuizStatus } from '../../types/classroom';
import { QUIZ_ZONES, PODIUM_POSITION } from '../../data/floorZones';
import { BRAND_COLORS } from '../../theme/brandTokens';

interface FloorZonesProps {
  quizStatus: QuizStatus;
  correctOption?: 'A' | 'B' | 'C' | 'D';
  activePodium?: boolean;
}

export function FloorZones({
  quizStatus,
  correctOption = 'A',
  activePodium = false,
}: FloorZonesProps) {
  const podiumGlowRef = useRef<THREE.MeshStandardMaterial>(null);
  const zonesRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Generate crisp 256x256 letter textures for A, B, C, D using Montserrat / Be Vietnam Pro
  const letterTextures = useMemo(() => {
    const map = new Map<string, THREE.CanvasTexture>();
    ['A', 'B', 'C', 'D'].forEach((letter) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep contrast dark navy badge
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 256, 256);

        // Circular border ring
        ctx.beginPath();
        ctx.arc(128, 128, 116, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 12;
        ctx.stroke();

        // Bold letter centered with brand typography
        ctx.font = '900 160px "Montserrat", "Be Vietnam Pro", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = BRAND_COLORS.textInverse;
        ctx.fillText(letter, 128, 138);
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

    // Animate Podium glow
    if (podiumGlowRef.current) {
      if (activePodium) {
        podiumGlowRef.current.emissiveIntensity = 1.3 + Math.sin(time * 4) * 0.4;
      } else {
        podiumGlowRef.current.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.15;
      }
    }
  });

  return (
    <group>
      {/* ================= 4 BRAND QUIZ ZONES (A, B, C, D) ================= */}
      {QUIZ_ZONES.map((zone) => {
        const isCorrect = quizStatus === 'REVEAL' && zone.id === correctOption;

        return (
          <group key={zone.id} position={zone.position}>
            {/* Base Tile (Slightly beveled dark slate pad) */}
            <mesh position={[0, 0.007, 0]} receiveShadow>
              <boxGeometry args={[1.2, 0.014, 1.2]} />
              <meshStandardMaterial
                color={isCorrect ? '#064e3b' : '#0f172a'}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>

            {/* Glowing Neon Border Ring */}
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[1.24, 0.018, 1.24]} />
              <meshStandardMaterial
                ref={(el) => {
                  if (el) zonesRef.current.set(zone.id, el);
                }}
                color={zone.color}
                emissive={zone.glowColor}
                emissiveIntensity={0.6}
                roughness={0.2}
                wireframe={false}
              />
            </mesh>

            {/* Inner Dark Inset with Tile Margin */}
            <mesh position={[0, 0.016, 0]}>
              <boxGeometry args={[1.10, 0.02, 1.10]} />
              <meshStandardMaterial
                color={isCorrect ? '#022c22' : '#1e293b'}
                roughness={0.8}
              />
            </mesh>

            {/* Glowing Center Runway Disc */}
            <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.34, 32]} />
              <meshStandardMaterial
                color={zone.color}
                emissive={zone.glowColor}
                emissiveIntensity={isCorrect ? 1.4 : 0.4}
                roughness={0.3}
              />
            </mesh>

            {/* Angled Holographic Letter Plaque Facing Camera directly */}
            <group position={[0, 0.22, -0.45]} rotation={[0.25, Math.PI, 0]}>
              {/* Outer Glowing Rim */}
              <mesh position={[0, 0, 0]}>
                <circleGeometry args={[0.22, 32]} />
                <meshStandardMaterial
                  color={zone.color}
                  emissive={zone.glowColor}
                  emissiveIntensity={isCorrect ? 1.6 : 0.8}
                  roughness={0.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Inner High-Contrast Letter Face */}
              <mesh position={[0, 0, 0.006]}>
                <circleGeometry args={[0.185, 32]} />
                <meshBasicMaterial map={letterTextures.get(zone.id)} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ================= PRESENTATION PODIUM STAGE (Primary Brand) ================= */}
      <group position={PODIUM_POSITION}>
        {/* Raised Circular Stage Platform (Royal Blue Base) */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <cylinderGeometry args={[0.85, 0.90, 0.05, 32]} />
          <meshStandardMaterial color={BRAND_COLORS.primaryDark} roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Outer Glowing Stage Ring (Amber Accent Glow) */}
        <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.018, 8, 32]} />
          <meshStandardMaterial
            ref={podiumGlowRef}
            color={BRAND_COLORS.accentAmber}
            emissive={BRAND_COLORS.glowAmber}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Top Step Inset */}
        <mesh position={[0, 0.054, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.78, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Center Spotlight Disc */}
        <mesh position={[0, 0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 16]} />
          <meshStandardMaterial
            color={BRAND_COLORS.primaryLight}
            emissive={BRAND_COLORS.glowBlue}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}
