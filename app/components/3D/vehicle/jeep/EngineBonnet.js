"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EngineBonnet({ cfg, materials }) {
  const bonnetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // ============================================================
  // ENGINE MATERIALS (Declared as valid React elements)
  // ============================================================
  const engineMaterials = useMemo(() => {
    return {
      engineBlock: (
        <meshStandardMaterial
          color="#687078"
          metalness={0.75}
          roughness={0.38}
        />
      ),

      engineBlockDark: (
        <meshStandardMaterial
          color="#3f474d"
          metalness={0.70}
          roughness={0.42}
        />
      ),

      aluminum: (
        <meshStandardMaterial
          color="#b8bec2"
          metalness={0.90}
          roughness={0.25}
        />
      ),

      brightMetal: (
        <meshStandardMaterial
          color="#d7dde0"
          metalness={0.95}
          roughness={0.18}
        />
      ),

      valveCover: (
        <meshStandardMaterial
          color="#424a50"
          metalness={0.65}
          roughness={0.3}
        />
      ),

      plastic: (
        <meshStandardMaterial
          color="#252b2f"
          metalness={0.15}
          roughness={0.45}
        />
      ),

      rubber: (
        <meshStandardMaterial
          color="#15181a"
          metalness={0.05}
          roughness={0.75}
        />
      ),

      yellow: (
        <meshStandardMaterial
          color="#e2a900"
          metalness={0.25}
          roughness={0.4}
        />
      ),

      orange: (
        <meshStandardMaterial
          color="#d86b1f"
          metalness={0.35}
          roughness={0.38}
        />
      ),

      red: (
        <meshStandardMaterial
          color="#b91c1c"
          metalness={0.25}
          roughness={0.38}
        />
      ),

      blue: (
        <meshStandardMaterial
          color="#2563a8"
          metalness={0.3}
          roughness={0.35}
        />
      ),
    };
  }, []);

  // ============================================================
  // BONNET ANIMATION
  // ============================================================
  useFrame((_, delta) => {
    if (!bonnetRef.current) return;

    const targetAngle = isOpen ? -Math.PI / 3 : 0;

    bonnetRef.current.rotation.x = THREE.MathUtils.damp(
      bonnetRef.current.rotation.x,
      targetAngle,
      7,
      delta
    );
  });

  // ============================================================
  // CURSOR CLEANUP
  // ============================================================
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  // ============================================================
  // BONNET INTERACTION
  // ============================================================
  const toggleBonnet = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      {/* ========================================================
          STATIONARY LEFT L-SHAPE FENDER ASSEMBLY
          ======================================================== */}
      <group>
        {/* Left Horizontal Top Fender Plate */}
        <mesh position={[-0.59, 0.91, 1.285]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.02, 1.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Left Vertical Side Fender Drop Wall */}
        <mesh position={[-0.67, 0.75, 1.285]} castShadow receiveShadow>
          <boxGeometry args={[0.02, 0.32, 1.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Left Inner Lip (Structural Shelf) */}
        <mesh position={[-0.485, 0.845, 1.285]} castShadow>
          <boxGeometry args={[0.025, 0.045, 0.99]} />
          {engineMaterials.aluminum}
        </mesh>
      </group>

      {/* ========================================================
          STATIONARY RIGHT L-SHAPE FENDER ASSEMBLY
          ======================================================== */}
      <group>
        {/* Right Horizontal Top Fender Plate */}
        <mesh position={[0.59, 0.91, 1.285]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.02, 1.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Right Vertical Side Fender Drop Wall */}
        <mesh position={[0.67, 0.75, 1.285]} castShadow receiveShadow>
          <boxGeometry args={[0.02, 0.32, 1.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Right Inner Lip (Structural Shelf) */}
        <mesh position={[0.485, 0.845, 1.285]} castShadow>
          <boxGeometry args={[0.025, 0.045, 0.99]} />
          {engineMaterials.aluminum}
        </mesh>
      </group>

      {/* ========================================================
          ENGINE BAY
          ======================================================== */}
      <group>
        {/* Engine bay floor */}
        <mesh position={[0, 0.6, 1.3]} castShadow receiveShadow>
          <boxGeometry args={[1.22, 0.16, 0.88]} />
          {materials.innerWheelWell}
        </mesh>

        {/* ======================================================
            RADIATOR
            ====================================================== */}
        <group position={[0, 0.8, 1.69]}>
          {/* Radiator core */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.92, 0.28, 0.055]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* Dark radiator face */}
          <mesh position={[0, 0, -0.032]}>
            <boxGeometry args={[0.84, 0.23, 0.008]} />
            {engineMaterials.rubber}
          </mesh>

          {/* Radiator fins */}
          {[
            -0.38, -0.3, -0.22, -0.14, -0.06, 0.02, 0.1, 0.18, 0.26, 0.34,
          ].map((x) => (
            <mesh key={x} position={[x, 0, -0.039]}>
              <boxGeometry args={[0.012, 0.22, 0.008]} />
              {engineMaterials.brightMetal}
            </mesh>
          ))}

          {/* Upper radiator tank */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.96, 0.035, 0.075]} />
            {engineMaterials.plastic}
          </mesh>

          {/* Radiator cap */}
          <mesh
            position={[0.36, 0.19, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* ======================================================
            BATTERY / BC
            ====================================================== */}
        <group position={[0.42, 0.79, 1.17]}>
          {/* Battery body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.23, 0.22, 0.22]} />
            {engineMaterials.plastic}
          </mesh>

          {/* Battery top */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.24, 0.025, 0.23]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* Battery positive terminal */}
          <mesh position={[-0.065, 0.145, 0.045]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.025, 10]} />
            {engineMaterials.red}
          </mesh>

          {/* Battery negative terminal */}
          <mesh position={[0.065, 0.145, 0.045]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.025, 10]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* Battery hold-down */}
          <mesh position={[0, 0.15, -0.11]} castShadow>
            <boxGeometry args={[0.29, 0.022, 0.025]} />
            {engineMaterials.aluminum}
          </mesh>
        </group>

        {/* ======================================================
            AIR FILTER
            ====================================================== */}
        <group position={[-0.43, 0.79, 1.18]}>
          {/* Filter housing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.19, 0.23]} />
            {engineMaterials.plastic}
          </mesh>

          {/* Filter housing lid */}
          <mesh position={[0, 0.105, 0]} castShadow>
            <boxGeometry args={[0.29, 0.025, 0.24]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* Air filter ribs */}
          {[-0.08, -0.04, 0, 0.04, 0.08].map((x) => (
            <mesh key={x} position={[x, 0.12, 0]}>
              <boxGeometry args={[0.012, 0.008, 0.2]} />
              {engineMaterials.aluminum}
            </mesh>
          ))}

          {/* Intake hose */}
          <mesh
            position={[0.20, 0.05, 0.03]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.035, 0.04, 0.3, 12]} />
            {engineMaterials.rubber}
          </mesh>
        </group>

        {/* ======================================================
            MAIN ENGINE
            ====================================================== */}
        <group position={[0, 0.76, 1.32]}>
          {/* ENGINE BLOCK */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.3, 0.52]} />
            {engineMaterials.engineBlock}
          </mesh>

          {/* Lower dark engine section */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[0.46, 0.07, 0.49]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* CYLINDER HEAD */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.46, 0.1, 0.48]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* HEAD GASKET */}
          <mesh position={[0, 0.125, 0]} castShadow>
            <boxGeometry args={[0.51, 0.018, 0.53]} />
            {engineMaterials.brightMetal}
          </mesh>

          {/* VALVE COVER */}
          <mesh position={[0, 0.245, 0]} castShadow>
            <boxGeometry args={[0.4, 0.075, 0.44]} />
            {engineMaterials.valveCover}
          </mesh>

          {/* Valve cover raised center */}
          <mesh position={[0, 0.29, 0]} castShadow>
            <boxGeometry args={[0.2, 0.025, 0.34]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* Valve cover ribs */}
          {[-0.13, -0.065, 0, 0.065, 0.13].map((x) => (
            <mesh key={x} position={[x, 0.292, 0]} castShadow>
              <boxGeometry args={[0.018, 0.018, 0.36]} />
              {engineMaterials.aluminum}
            </mesh>
          ))}

          {/* ENGINE FRONT PULLEY */}
          <mesh
            position={[0, 0.015, 0.285]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.105, 0.105, 0.05, 24]} />
            {engineMaterials.brightMetal}
          </mesh>

          {/* Pulley center */}
          <mesh position={[0, 0.015, 0.315]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.055, 16]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* BELT */}
          <mesh
            position={[0, 0.015, 0.33]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <torusGeometry args={[0.12, 0.012, 8, 24]} />
            {engineMaterials.rubber}
          </mesh>

          {/* OIL FILLER CAP */}
          <mesh position={[0.14, 0.305, 0.04]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.025, 12]} />
            {engineMaterials.yellow}
          </mesh>

          {/* Oil cap center */}
          <mesh position={[0.14, 0.32, 0.04]}>
            <cylinderGeometry args={[0.018, 0.018, 0.008, 10]} />
            {engineMaterials.orange}
          </mesh>
        </group>

        {/* ======================================================
            CMS / CONTROL MODULE
            ====================================================== */}
        <group position={[-0.47, 0.84, 0.98]}>
          {/* CMS body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.13, 0.13, 0.085]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* CMS black face */}
          <mesh position={[0.066, 0, 0]}>
            <boxGeometry args={[0.008, 0.085, 0.055]} />
            {engineMaterials.plastic}
          </mesh>

          {/* CMS connector */}
          <mesh position={[0.08, -0.015, 0]} castShadow>
            <boxGeometry args={[0.05, 0.035, 0.04]} />
            {engineMaterials.rubber}
          </mesh>
        </group>

        {/* ======================================================
            COOLANT EXPANSION TANK
            ====================================================== */}
        <group position={[-0.44, 0.72, 1.46]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.11, 18, 12]} />
            {engineMaterials.blue}
          </mesh>

          {/* Tank cap */}
          <mesh position={[0, 0.105, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* ======================================================
            ENGINE HOSES
            ====================================================== */}
        {/* Upper coolant hose */}
        <mesh
          position={[-0.25, 0.93, 1.54]}
          rotation={[0.15, 0, -0.45]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.025, 0.38, 12]} />
          {engineMaterials.rubber}
        </mesh>

        {/* Intake hose */}
        <mesh
          position={[-0.12, 0.92, 1.18]}
          rotation={[0, 0.3, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.035, 0.04, 0.3, 12]} />
          {engineMaterials.rubber}
        </mesh>
      </group>

      {/* ========================================================
          ANIMATED CENTER BONNET (Lifts upward)
          ======================================================== */}
      <group
        ref={bonnetRef}
        position={[0, 1.0, 0.92]}
        onClick={toggleBonnet}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Main Bonnet Outer Skin */}
        <mesh position={[0, 0.02, 0.445]} castShadow receiveShadow>
          <boxGeometry args={[0.96, 0.075, 0.89]} />
          {materials.bodyPaint}
        </mesh>

        {/* Bonnet Inner Panel */}
        <mesh position={[0, -0.035, 0.445]} castShadow receiveShadow>
          <boxGeometry args={[0.86, 0.035, 0.75]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* Center Raised Bonnet Section */}
        <mesh position={[0, 0.075, 0.445]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.04, 0.83]} />
          {materials.bodyPaint}
        </mesh>

        {/* Bonnet Inner Reinforcement Ribs */}
        {[-0.38, 0.38].map((x) => (
          <mesh key={x} position={[x, -0.065, 0.445]} castShadow>
            <boxGeometry args={[0.025, 0.05, 0.7]} />
            {engineMaterials.aluminum}
          </mesh>
        ))}

        {/* Center reinforcement */}
        <mesh position={[0, -0.065, 0.445]} castShadow>
          <boxGeometry args={[0.025, 0.05, 0.7]} />
          {engineMaterials.aluminum}
        </mesh>

        {/* Bonnet Front Latch */}
        <mesh position={[0, 0.01, 0.03]} castShadow>
          <boxGeometry args={[0.1, 0.025, 0.035]} />
          {engineMaterials.plastic}
        </mesh>

        {/* Left Bonnet Hinge */}
        <mesh
          position={[-0.38, 0, 0.82]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} />
          {engineMaterials.brightMetal}
        </mesh>

        {/* Right Bonnet Hinge */}
        <mesh
          position={[0.38, 0, 0.82]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} />
          {engineMaterials.brightMetal}
        </mesh>
      </group>
    </group>
  );
}