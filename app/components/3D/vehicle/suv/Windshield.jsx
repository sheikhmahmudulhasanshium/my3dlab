/**
 *
 *                 SUV — WINDSHIELD WIPER SYSTEM
 *
 *                 ←────── WINDSHIELD ──────→
 *
 *             ╭──────────────────────────────╮
 *            /                                \
 *           /                                  \
 *          /                                    \
 *         │       ╲                    ╱         │
 *         │        ╲                  ╱          │
 *         │         ╲                ╱           │
 *         │          ════════════════            │
 *         │           WIPER BLADES               │
 *         │                                      │
 *         ╰──────────────────────────────────────╯
 *                    ↑              ↑
 *                 Wiper Arm      Wiper Arm
 *
 *          ╔════════════════════════════════╗
 *          ║        COWL / WIPER BASE      ║
 *          ╚════════════════════════════════╝
 *
 *       ↑                                      ↑
 *   Gasket Seal                            Gasket Seal
 *
 *          ↙ Wiper Sweep / Cleaning Zone ↘
 *
 */
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function WindshieldWipers({
  // 1. Positioning relative to the cowl base
  cowlCenterY = 1.05,              // Cowl height where glass meets bonnet
  cowlCenterZ = 0.99,              // Cowl longitudinal position
  cowlWidth = 1.52,                // Width of the wiper plastic cowl
  
  // 2. Windshield Slope Dimensions (Used to compute the rake angle)
  roofHeaderY = 1.48,              // Windshield top height
  roofHeaderZ = 0.35,              // Windshield top Z
  
  // 3. Wiper System Scale
  armLength = 0.45,                // Length of metal wiper arm
  bladeLength = 0.48,              // Length of rubber wiper blade
  wiperColor = "#0f172a",          // Dark plastic/matte metal black
  
  // 4. Animation Controls
  isWiping = true,                 // Toggle sweep animation
  wipeSpeed = 3.5,                 // Speed of the wiper sweep
}) {
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  // Calculate the Windshield Rake Angle (tilt around X-axis)
  const rakeAngle = useMemo(() => {
    const deltaZ = cowlCenterZ - roofHeaderZ; // Horizontal run (~0.60m)
    const deltaY = roofHeaderY - cowlCenterY; // Vertical rise (~0.33m)
    return -Math.atan2(deltaZ, deltaY);       // ~ -1.07 radians (61.2 degrees)
  }, [cowlCenterZ, roofHeaderZ, roofHeaderY, cowlCenterY]);

  // Sweep animation loop (Oscillates between resting and vertical positions)
  useFrame((state) => {
    if (!isWiping) {
      if (leftArmRef.current) leftArmRef.current.rotation.z = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.z = 0;
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    // Generate a smooth asymmetric wipe oscillation (0 to 1.35 radians / ~77 degrees)
    const sweepCycle = (Math.sin(elapsed * wipeSpeed) + 1) / 2; // Normalize sin to 0 -> 1
    const currentAngle = sweepCycle * 1.35;

    if (leftArmRef.current) leftArmRef.current.rotation.z = currentAngle;
    if (rightArmRef.current) rightArmRef.current.rotation.z = currentAngle;
  });

  return (
    <group>
      {/* ============================================================
          A. COWL SCREEN & GASKET BASE (Dark Plastic Base Trim)
         ============================================================ */}
      <mesh 
        position={[0, cowlCenterY - 0.015, cowlCenterZ + 0.04]} 
        rotation={[-0.15, 0, 0]} // Slanted slightly with the hood line
        castShadow
        receiveShadow
      >
        <boxGeometry args={[cowlWidth, 0.03, 0.12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* ============================================================
          B. WIPER ARM ASSEMBLIES (Left and Right Pivots)
         ============================================================ */}
      
      {/* 1. LEFT WIPER (Driver/Passenger Side depending on market) */}
      <group 
        position={[-0.38, cowlCenterY, cowlCenterZ]} 
        rotation={[rakeAngle, 0, 0]} // Aligned with the windshield plane
      >
        {/* Pivot Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.012, 0.014, 0.02, 8]} />
          <meshStandardMaterial color={wiperColor} roughness={0.5} />
        </mesh>

        {/* Animated Wiper Arm & Blade */}
        <group ref={leftArmRef}>
          {/* Metal Wiper Arm */}
          <mesh position={[0, armLength / 2, 0.01]} castShadow>
            <boxGeometry args={[0.008, armLength, 0.005]} />
            <meshStandardMaterial color={wiperColor} roughness={0.6} />
          </mesh>

          {/* Wiper Blade (Mounted at the end of the arm, parallel to windshield) */}
          <mesh position={[0, armLength, 0.014]} castShadow>
            <boxGeometry args={[0.005, bladeLength, 0.008]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 2. RIGHT WIPER */}
      <group 
        position={[0.22, cowlCenterY, cowlCenterZ]} 
        rotation={[rakeAngle, 0, 0]} // Aligned with the windshield plane
      >
        {/* Pivot Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.012, 0.014, 0.02, 8]} />
          <meshStandardMaterial color={wiperColor} roughness={0.5} />
        </mesh>

        {/* Animated Wiper Arm & Blade */}
        <group ref={rightArmRef}>
          {/* Metal Wiper Arm */}
          <mesh position={[0, armLength / 2, 0.01]} castShadow>
            <boxGeometry args={[0.008, armLength, 0.005]} />
            <meshStandardMaterial color={wiperColor} roughness={0.6} />
          </mesh>

          {/* Wiper Blade */}
          <mesh position={[0, armLength, 0.014]} castShadow>
            <boxGeometry args={[0.005, bladeLength, 0.008]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}