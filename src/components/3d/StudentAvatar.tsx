import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData, StudentState } from '../../types/classroom';
import { soundEngine } from '../../audio/SoundEngine';

interface StudentAvatarProps {
  data: StudentData;
  state: StudentState;
  isActive: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onStateAdvance: (newState: StudentState) => void;
}

export function StudentAvatar({
  data,
  state,
  isActive,
  isHovered,
  onSelect,
  onStateAdvance,
}: StudentAvatarProps) {
  // Master root group
  const rootGroupRef = useRef<THREE.Group>(null);

  // Limb pivot groups
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  // Kinematic state trackers
  const progressRef = useRef(0);
  const lastFootstepRef = useRef(0);

  // Desk coordinates
  const [dx, , dz] = data.deskPosition;
  const seatPos: [number, number, number] = [dx, 0, dz - 0.38];
  const aislePos: [number, number, number] = [0, 0, dz - 0.38];
  const teacherDeskPos: [number, number, number] = [0, 0, 3.15];

  // Capybara Color Palette
  const furColor = data.capybaraTone || data.skinTone || '#9d633b';
  const snoutColor = '#6d3c19';
  const nosePadColor = '#1f130b';
  const bellyColor = '#caa078';
  const innerEarColor = '#be8261';

  useFrame(({ clock }, delta) => {
    if (!rootGroupRef.current) return;
    const time = clock.getElapsedTime();

    // Subtle random seed per student so idle movements aren't synchronized
    const studentSeed = parseInt(data.id.replace('student-', ''), 10) * 1.37;

    // Helper to trigger footstep sound at gait peaks
    const checkFootstep = (gaitPhase: number) => {
      const step = Math.floor((gaitPhase / Math.PI) * 2);
      if (step !== lastFootstepRef.current) {
        lastFootstepRef.current = step;
        soundEngine.playFootstep();
      }
    };

    // ================= STATE 1: SEATED WRITING =================
    if (state === 'SEATED_WRITING') {
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2]);
      rootGroupRef.current.rotation.set(0, 0, 0); // facing forward (+Z toward front/teacher)

      // Seated hips & thighs bent 90 deg forward
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.x = -Math.PI / 2;
      }
      // Knees bent 90 deg down
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.PI / 2;
        rightKneeRef.current.rotation.x = Math.PI / 2;
      }

      // Torso breathing & leaning slightly forward over desk
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44;
        torsoRef.current.rotation.x = 0.12 + Math.sin(time * 1.5 + studentSeed) * 0.02;
        torsoRef.current.rotation.y = 0;
        torsoRef.current.rotation.z = 0;
      }

      // Head thinking, looking down at paper and nodding peacefully
      if (headRef.current) {
        headRef.current.rotation.x = 0.28 + Math.cos(time * 1.1 + studentSeed) * 0.04;
        headRef.current.rotation.y = Math.sin(time * 0.6 + studentSeed) * 0.12;
      }

      // Left paw resting comfortably holding paper flat on desk
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.62, 0, -0.25);
      }

      // Right paw actively scribbling pencil on test paper
      if (rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.set(
          -0.65 + Math.sin(time * 4 + studentSeed) * 0.04,
          0,
          0.2
        );
        rightForearmRef.current.rotation.set(
          -0.5 + Math.sin(time * 8 + studentSeed) * 0.05,
          0,
          0
        );
      }
    }

    // ================= STATE 2: STANDING UP =================
    else if (state === 'STANDING') {
      progressRef.current += delta * 1.2; // ~0.8s
      const t = Math.min(1, progressRef.current);

      // Thighs straighten from -PI/2 to 0
      const legAngle = (-Math.PI / 2) * (1 - t);
      const kneeAngle = (Math.PI / 2) * (1 - t);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legAngle;
        rightLegRef.current.rotation.x = legAngle;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = kneeAngle;
        rightKneeRef.current.rotation.x = kneeAngle;
      }

      // Torso shifts forward then rises up to standing height (0.84)
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44 + t * 0.4;
        torsoRef.current.rotation.x = Math.sin(t * Math.PI) * 0.25;
      }

      // Student steps back slightly as they stand
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2] - t * 0.15);

      // Right paw lifts paper from desk
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.4 * t, 0, 0.2);
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('STEPPING_TO_AISLE');
      }
    }

    // ================= STATE 3: STEPPING TO AISLE =================
    else if (state === 'STEPPING_TO_AISLE') {
      progressRef.current += delta * 0.9;
      const t = Math.min(1, progressRef.current);

      // Interpolate from seat to aisle
      const curX = THREE.MathUtils.lerp(seatPos[0], aislePos[0], t);
      const curZ = seatPos[2] - 0.15;
      rootGroupRef.current.position.set(curX, 0, curZ);

      // Turn facing towards aisle center
      const targetAngle = seatPos[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(0, targetAngle, Math.min(1, t * 2));

      // Side-step waddle walk cycle
      const gait = time * 7;
      checkFootstep(gait);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.45;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.84 + Math.abs(Math.sin(gait)) * 0.04;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('WALKING_TO_TEACHER');
      }
    }

    // ================= STATE 4: WALKING TO TEACHER DESK =================
    else if (state === 'WALKING_TO_TEACHER') {
      progressRef.current += delta * 0.55; // walk speed
      const t = Math.min(1, progressRef.current);

      // Walk along aisle (X = 0) from aislePos[2] to teacherDeskPos[2]
      const curZ = THREE.MathUtils.lerp(aislePos[2], teacherDeskPos[2], t);
      rootGroupRef.current.position.set(0, 0, curZ);

      // Face teacher desk (+Z direction = 0 radians)
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        0,
        delta * 8
      );

      // Cute Capybara Waddle Gait (leg swing + arm counter-swing + pelvis sway)
      const gait = time * 8;
      checkFootstep(gait);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.6;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.6;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.max(0, -Math.sin(gait) * 0.7);
        rightKneeRef.current.rotation.x = Math.max(0, Math.sin(gait) * 0.7);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(gait) * 0.5;
      }
      // Right arm holds test paper in front of chest
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.45 + Math.sin(gait) * 0.1, 0, 0.2);
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.84 + Math.abs(Math.sin(gait)) * 0.04;
        torsoRef.current.rotation.y = -Math.sin(gait) * 0.08;
        torsoRef.current.rotation.z = Math.sin(gait) * 0.05;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('HANDING_PAPER');
      }
    }

    // ================= STATE 5: HANDING PAPER AT TEACHER DESK =================
    else if (state === 'HANDING_PAPER') {
      rootGroupRef.current.position.set(0, 0, teacherDeskPos[2]);
      rootGroupRef.current.rotation.y = 0;

      // Legs standing still
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.set(0, 0, 0);
        rightKneeRef.current.rotation.set(0, 0, 0);
      }

      // Torso & paw extend forward to place paper onto teacher desk
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.84;
        torsoRef.current.rotation.set(0.1, 0, 0);
      }
      if (rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.set(-1.1, 0, 0.1);
        rightForearmRef.current.rotation.set(-0.2, 0, 0);
      }
      if (headRef.current) {
        // Polite respectful Capybara nod to teacher
        headRef.current.rotation.set(0.2, 0, 0);
      }
    }

    // ================= STATE 6: TURNING AROUND =================
    else if (state === 'TURNING_AROUND') {
      progressRef.current += delta * 2.2;
      const t = Math.min(1, progressRef.current);

      // Rotate 180 degrees from 0 to Math.PI
      rootGroupRef.current.position.set(0, 0, teacherDeskPos[2]);
      rootGroupRef.current.rotation.y = t * Math.PI;

      // Paws reset to side
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(0, 0, 0.1);
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.set(0, 0, 0);
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('WALKING_TO_SEAT');
      }
    }

    // ================= STATE 7: WALKING BACK TO SEAT AISLE =================
    else if (state === 'WALKING_TO_SEAT') {
      progressRef.current += delta * 0.55;
      const t = Math.min(1, progressRef.current);

      // Walk along aisle back to student's row
      const curZ = THREE.MathUtils.lerp(teacherDeskPos[2], aislePos[2], t);
      rootGroupRef.current.position.set(0, 0, curZ);
      rootGroupRef.current.rotation.y = Math.PI; // facing -Z (back of classroom)

      const gait = time * 8;
      checkFootstep(gait);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.6;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.6;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.max(0, -Math.sin(gait) * 0.7);
        rightKneeRef.current.rotation.x = Math.max(0, Math.sin(gait) * 0.7);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(gait) * 0.5;
        rightArmRef.current.rotation.x = Math.sin(gait) * 0.5;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.84 + Math.abs(Math.sin(gait)) * 0.04;
        torsoRef.current.rotation.z = Math.sin(gait) * 0.05;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('SITTING_DOWN');
      }
    }

    // ================= STATE 8: SITTING DOWN =================
    else if (state === 'SITTING_DOWN') {
      progressRef.current += delta * 1.0;
      const t = Math.min(1, progressRef.current);

      // Step back from aisle to chair seat
      const curX = THREE.MathUtils.lerp(aislePos[0], seatPos[0], t);
      const curZ = seatPos[2] - 0.15 * (1 - t);
      rootGroupRef.current.position.set(curX, 0, curZ);

      // Rotate to face forward again
      const startAngle = seatPos[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(startAngle, 0, t);

      // Legs bend back to sitting -PI/2
      const legAngle = (-Math.PI / 2) * t;
      const kneeAngle = (Math.PI / 2) * t;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legAngle;
        rightLegRef.current.rotation.x = legAngle;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = kneeAngle;
        rightKneeRef.current.rotation.x = kneeAngle;
      }

      // Torso lowers from 0.84 to 0.44
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.84 - t * 0.4;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('COMPLETED');
      }
    }

    // ================= STATE 9: COMPLETED (DONE EXAM) =================
    else if (state === 'COMPLETED') {
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2]);
      rootGroupRef.current.rotation.set(0, 0, 0);

      // Relaxed, happy, zen seated posture
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.x = -Math.PI / 2;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.PI / 2;
        rightKneeRef.current.rotation.x = Math.PI / 2;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44;
        torsoRef.current.rotation.set(0, 0, 0);
      }
      if (headRef.current) {
        headRef.current.rotation.set(
          Math.sin(time * 0.7 + studentSeed) * 0.05,
          Math.cos(time * 0.5 + studentSeed) * 0.1,
          0
        );
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(-0.5, 0, 0.2);
        rightArmRef.current.rotation.set(-0.5, 0, -0.2);
      }
    }
  });

  const isCarryingPaper =
    state === 'STANDING' ||
    state === 'STEPPING_TO_AISLE' ||
    state === 'WALKING_TO_TEACHER' ||
    state === 'HANDING_PAPER';

  return (
    <group
      ref={rootGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Selection / Hover Glow ring on ground */}
      {(isHovered || isActive) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.44, 24]} />
          <meshBasicMaterial
            color={isActive ? '#38bdf8' : '#facc15'}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Floating Name Badge when hovered or active */}
      {(isHovered || isActive) && (
        <group position={[0, 1.85, 0]}>
          <mesh>
            <boxGeometry args={[0.76, 0.20, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.72, 0.16]} />
            <meshBasicMaterial color={isActive ? '#0284c7' : '#1e293b'} />
          </mesh>
        </group>
      )}

      {/* ================= TORSO & CAPYBARA BODY ================= */}
      <group ref={torsoRef} position={[0, 0.44, 0]}>
        {/* Chubby Pear-shaped Pelvis / Lower Body */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.22, 0.36]} />
          <meshStandardMaterial color={furColor} roughness={0.85} />
        </mesh>

        {/* Cute stubby Capybara tail at back */}
        <mesh position={[0, -0.04, -0.19]} castShadow>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={snoutColor} roughness={0.9} />
        </mesh>

        {/* Chest with Colorful Student Sweater / Robe */}
        <group position={[0, 0.24, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.40, 0.34, 0.36]} />
            <meshStandardMaterial
              color={isHovered ? '#fbbf24' : data.shirtColor}
              roughness={0.7}
            />
          </mesh>

          {/* Student Collar detail */}
          <mesh position={[0, 0.16, 0.185]}>
            <boxGeometry args={[0.18, 0.05, 0.03]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>

          {/* Accessory: Red Ribbon Bow */}
          {data.accessory === 'red_bow' && (
            <group position={[0, 0.14, 0.20]}>
              <mesh rotation={[0, 0, 0.25]}>
                <boxGeometry args={[0.07, 0.04, 0.02]} />
                <meshStandardMaterial color="#e11d48" />
              </mesh>
              <mesh rotation={[0, 0, -0.25]}>
                <boxGeometry args={[0.07, 0.04, 0.02]} />
                <meshStandardMaterial color="#e11d48" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshStandardMaterial color="#be123c" />
              </mesh>
            </group>
          )}

          {/* ================= ICONIC CAPYBARA HEAD ================= */}
          <group ref={headRef} position={[0, 0.34, 0.04]}>
            {/* Neck */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.10, 0.12, 0.10]} />
              <meshStandardMaterial color={furColor} roughness={0.85} />
            </mesh>

            {/* Main Capybara Head (Blocky, sturdy, loaf-shaped) */}
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.26, 0.38]} />
              <meshStandardMaterial color={furColor} roughness={0.85} />
            </mesh>

            {/* Lower Chin / Belly tone */}
            <mesh position={[0, -0.09, 0.10]} castShadow>
              <boxGeometry args={[0.24, 0.08, 0.22]} />
              <meshStandardMaterial color={bellyColor} roughness={0.85} />
            </mesh>

            {/* Flat Muzzle / Snout in front */}
            <mesh position={[0, -0.02, 0.21]} castShadow>
              <boxGeometry args={[0.23, 0.18, 0.12]} />
              <meshStandardMaterial color={snoutColor} roughness={0.85} />
            </mesh>

            {/* Black Nose Pad */}
            <mesh position={[0, 0.045, 0.272]}>
              <boxGeometry args={[0.10, 0.045, 0.02]} />
              <meshStandardMaterial color={nosePadColor} roughness={0.5} />
            </mesh>

            {/* Nostrils */}
            <mesh position={[-0.025, 0.042, 0.283]}>
              <boxGeometry args={[0.015, 0.012, 0.005]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[0.025, 0.042, 0.283]}>
              <boxGeometry args={[0.015, 0.012, 0.005]} />
              <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Signature Chill Half-Closed Eyes */}
            <mesh position={[-0.142, 0.048, 0.10]} rotation={[0, -Math.PI / 2, 0]}>
              <boxGeometry args={[0.045, 0.015, 0.008]} />
              <meshBasicMaterial color="#1a110a" />
            </mesh>
            <mesh position={[0.142, 0.048, 0.10]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.045, 0.015, 0.008]} />
              <meshBasicMaterial color="#1a110a" />
            </mesh>

            {/* Cute Rosy Cheek Blushes */}
            <mesh position={[-0.142, -0.02, 0.10]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[0.04, 0.025]} />
              <meshBasicMaterial color="#f472b6" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.142, -0.02, 0.10]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.04, 0.025]} />
              <meshBasicMaterial color="#f472b6" transparent opacity={0.7} />
            </mesh>

            {/* Small Rounded Ears */}
            <group position={[-0.13, 0.135, -0.05]} rotation={[0.2, -0.2, -0.35]}>
              <mesh castShadow>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshStandardMaterial color={snoutColor} roughness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color={innerEarColor} roughness={0.8} />
              </mesh>
            </group>
            <group position={[0.13, 0.135, -0.05]} rotation={[0.2, 0.2, 0.35]}>
              <mesh castShadow>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshStandardMaterial color={snoutColor} roughness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color={innerEarColor} roughness={0.8} />
              </mesh>
            </group>

            {/* ================= MEME ACCESSORIES ================= */}
            {/* 1. Iconic Yuzu Orange on Head */}
            {data.accessory === 'orange' && (
              <group position={[0, 0.19, 0.04]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.075, 12, 12]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.5} />
                </mesh>
                {/* Stem */}
                <mesh position={[0, 0.075, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.03]} />
                  <meshStandardMaterial color="#15803d" />
                </mesh>
                {/* Leaf */}
                <mesh position={[0.025, 0.08, 0]} rotation={[0.3, 0, 0.6]}>
                  <boxGeometry args={[0.04, 0.01, 0.06]} />
                  <meshStandardMaterial color="#22c55e" />
                </mesh>
              </group>
            )}

            {/* 2. Pink Lotus Flower on Head */}
            {data.accessory === 'lotus' && (
              <group position={[0, 0.16, 0.04]}>
                {/* Golden center */}
                <mesh>
                  <sphereGeometry args={[0.035, 10, 10]} />
                  <meshStandardMaterial color="#facc15" roughness={0.3} />
                </mesh>
                {/* Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <mesh
                    key={deg}
                    rotation={[0.35, (deg * Math.PI) / 180, 0]}
                    position={[0, 0.015, 0]}
                  >
                    <boxGeometry args={[0.035, 0.012, 0.08]} />
                    <meshStandardMaterial color="#f472b6" roughness={0.5} />
                  </mesh>
                ))}
              </group>
            )}

            {/* 3. Round Scholar Wire Glasses */}
            {data.accessory === 'glasses' && (
              <group position={[0, 0.048, 0.20]}>
                {/* Left Lens ring */}
                <mesh position={[-0.09, 0, 0]}>
                  <torusGeometry args={[0.045, 0.008, 8, 16]} />
                  <meshStandardMaterial color="#1e1b4b" metalness={0.6} />
                </mesh>
                {/* Right Lens ring */}
                <mesh position={[0.09, 0, 0]}>
                  <torusGeometry args={[0.045, 0.008, 8, 16]} />
                  <meshStandardMaterial color="#1e1b4b" metalness={0.6} />
                </mesh>
                {/* Glasses Bridge */}
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[0.09, 0.01, 0.01]} />
                  <meshStandardMaterial color="#1e1b4b" metalness={0.6} />
                </mesh>
              </group>
            )}

            {/* 4. Scholar / Graduation Mortarboard Hat */}
            {data.accessory === 'scholar_hat' && (
              <group position={[0, 0.17, 0.02]} rotation={[0.06, 0.12, -0.04]}>
                {/* Cap base */}
                <mesh position={[0, -0.02, 0]}>
                  <cylinderGeometry args={[0.10, 0.11, 0.05, 12]} />
                  <meshStandardMaterial color="#1e1b4b" />
                </mesh>
                {/* Flat square board */}
                <mesh position={[0, 0.02, 0]} castShadow>
                  <boxGeometry args={[0.26, 0.015, 0.26]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.6} />
                </mesh>
                {/* Golden button & tassel */}
                <mesh position={[0, 0.035, 0]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <meshStandardMaterial color="#facc15" />
                </mesh>
                <mesh position={[0.09, -0.02, 0.09]} rotation={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.006, 0.01, 0.1, 6]} />
                  <meshStandardMaterial color="#facc15" />
                </mesh>
              </group>
            )}
          </group>

          {/* ================= LEFT PAW / ARM ================= */}
          <group ref={leftArmRef} position={[-0.23, 0.14, 0]}>
            {/* Shoulder */}
            <mesh castShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={data.shirtColor} />
            </mesh>
            {/* Upper arm sleeve */}
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.2]} />
              <meshStandardMaterial color={data.shirtColor} />
            </mesh>
            {/* Forearm & Furry Paw */}
            <group position={[0, -0.22, 0]}>
              <mesh position={[0, -0.08, 0]} castShadow>
                <cylinderGeometry args={[0.042, 0.04, 0.16]} />
                <meshStandardMaterial color={furColor} />
              </mesh>
              {/* Claws / Paw Pad */}
              <mesh position={[0, -0.16, 0.02]} castShadow>
                <boxGeometry args={[0.07, 0.03, 0.06]} />
                <meshStandardMaterial color={snoutColor} />
              </mesh>
            </group>
          </group>

          {/* ================= RIGHT PAW / ARM ================= */}
          <group ref={rightArmRef} position={[0.23, 0.14, 0]}>
            {/* Shoulder */}
            <mesh castShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={data.shirtColor} />
            </mesh>
            {/* Upper arm sleeve */}
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.2]} />
              <meshStandardMaterial color={data.shirtColor} />
            </mesh>
            {/* Forearm & Furry Paw */}
            <group ref={rightForearmRef} position={[0, -0.22, 0]}>
              <mesh position={[0, -0.08, 0]} castShadow>
                <cylinderGeometry args={[0.042, 0.04, 0.16]} />
                <meshStandardMaterial color={furColor} />
              </mesh>
              {/* Claws / Paw Pad */}
              <mesh position={[0, -0.16, 0.02]} castShadow>
                <boxGeometry args={[0.07, 0.03, 0.06]} />
                <meshStandardMaterial color={snoutColor} />
              </mesh>

              {/* Exam Paper held in right paw while walking or handing in */}
              {isCarryingPaper && (
                <group position={[0.02, -0.15, 0.12]} rotation={[0.4, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.22, 0.005, 0.28]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.6} />
                  </mesh>
                  {/* Red Exam Seal on paper */}
                  <mesh position={[0.06, 0.004, 0.08]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
                    <meshBasicMaterial color="#e11d48" />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        </group>
      </group>

      {/* ================= HIND LEGS & FEET ================= */}
      {/* Left Hind Leg */}
      <group position={[-0.12, 0.44, 0]}>
        <group ref={leftLegRef}>
          {/* Thigh */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.3]} />
            <meshStandardMaterial color={furColor} roughness={0.8} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={leftKneeRef} position={[0, -0.3, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.3]} />
              <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>
            {/* Hind Paw */}
            <mesh position={[0, -0.32, 0.05]} castShadow>
              <boxGeometry args={[0.10, 0.06, 0.18]} />
              <meshStandardMaterial color={snoutColor} roughness={0.7} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Hind Leg */}
      <group position={[0.12, 0.44, 0]}>
        <group ref={rightLegRef}>
          {/* Thigh */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.3]} />
            <meshStandardMaterial color={furColor} roughness={0.8} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={rightKneeRef} position={[0, -0.3, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.3]} />
              <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>
            {/* Hind Paw */}
            <mesh position={[0, -0.32, 0.05]} castShadow>
              <boxGeometry args={[0.10, 0.06, 0.18]} />
              <meshStandardMaterial color={snoutColor} roughness={0.7} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
