/**
 *
 *                    SUV ROOF / GREENHOUSE
 *
 *                 =========== SUNROOF ===========
 *
 *             ___/_______________________________\___
 *            /    |             |             |     \
 *           /  A  |      B      |      C      |  D  \
 *          /      |             |             |      \
 *     ____/_______|_____________|_____________|_______\____
 *          ↑            ↑             ↑             ↑
 *        A-Pillar     B-Pillar      C-Pillar      D-Pillar
 *
 */
/**
 *
 *                     SUV CABIN ROOF & SUNROOF — TOP VIEW
 *
 *                 [ FRONT COWL / WINDSHIELD INTERFACE ]
 *             ┌─────────────────────────────────────────┐
 *             │   [LEFT RAIL]    [SUNROOF]    [RIGHT]   │
 *             │     ═══════  ╭─────────────╮  ═══════   │
 *             │     ║     ║  │   SLIDING   │  ║     ║   │
 *             │     ║     ║  │    GLASS    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║  ╭─────────────╮  ║     ║   │
 *             │     ║     ║  │    FIXED    │  ║     ║   │
 *             │     ║     ║  │    PANEL    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║                   ║     ║   │
 *             │     ═══════                   ═══════   │
 *             │               [REAR DECK]               │
 *             └─────────────────────────────────────────┘
 *
 *                             ↑           ↑
 *                          Front Pane   Rear Pane
 *                          (Sliding)    (Fixed)
 *
 */
/**
 *
 *                     SUV CABIN ROOF & SUNROOF — TOP VIEW
 *
 *                 [ FRONT COWL / WINDSHIELD INTERFACE ]
 *             ┌─────────────────────────────────────────┐
 *             │   [LEFT RAIL]    [SUNROOF]    [RIGHT]   │
 *             │     ═══════  ╭─────────────╮  ═══════   │
 *             │     ║     ║  │   SLIDING   │  ║     ║   │
 *             │     ║     ║  │    GLASS    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║  ╭─────────────╮  ║     ║   │
 *             │     ║     ║  │    FIXED    │  ║     ║   │
 *             │     ║     ║  │    PANEL    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║                   ║     ║   │
 *             │     ═══════                   ═══════   │
 *             │               [REAR DECK]               │
 *             └─────────────────────────────────────────┘
 *
 */
/**
 *
 *                     SUV CABIN ROOF & SUNROOF — TOP VIEW
 *
 *                 [ FRONT COWL / WINDSHIELD INTERFACE ]
 *             ┌─────────────────────────────────────────┐
 *             │   [LEFT RAIL]    [SUNROOF]    [RIGHT]   │
 *             │     ═══════  ╭─────────────╮  ═══════   │
 *             │     ║     ║  │   SLIDING   │  ║     ║   │
 *             │     ║     ║  │    GLASS    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║  ╭─────────────╮  ║     ║   │
 *             │     ║     ║  │    FIXED    │  ║     ║   │
 *             │     ║     ║  │    PANEL    │  ║     ║   │
 *             │     ║     ║  ╰─────────────╯  ║     ║   │
 *             │     ║     ║                   ║     ║   │
 *             │     ═══════                   ═══════   │
 *             │               [REAR DECK]               │
 *             └─────────────────────────────────────────┘
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

export default function CabinRoofShell({
  // Use these props to adjust scale, coordinate offsets, and angles manually
  position = [0, 0, 0], // [X offset, Y offset, Z offset]
  rotation = [0, 0, 0], // [Pitch (X), Yaw (Y), Roll (Z)] in radians
  scale = [1, 1, 1],    // [X scale, Y scale, Z scale]
}) {
  const roofY = SUV_CONFIG.roofY; // 1.68m
  const windowTopY = SUV_CONFIG.windowTopY; // 1.55m
  const halfWidth = SUV_CONFIG.bodyHalfWidth; // 0.78m
  
  // Longitudinal boundaries mapped to structural pillars
  const roofFrontZ = SUV_CONFIG.windshieldZ; // 0.95m
  const roofRearZ = SUV_CONFIG.dPillarZ;     // -1.20m
  const roofLength = roofFrontZ - roofRearZ; 
  const roofCenterZ = (roofFrontZ + roofRearZ) / 2; 

  const sunroofOpenWidth = 1.16;

  return (
    // The master group applies the manual offset coordinates, rotation angles, and scales
    <group position={position} rotation={rotation} scale={scale}>
      {/* ============================================================
          A. MAIN STRUCTURAL ROOF SHELL
         ============================================================ */}
      <group>
        {/* Left Roof Side Rail / Frame */}
        <mesh castShadow receiveShadow position={[-halfWidth + 0.05, (roofY + windowTopY) / 2, roofCenterZ]}>
          <boxGeometry args={[0.10, roofY - windowTopY, roofLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Right Roof Side Rail / Frame */}
        <mesh castShadow receiveShadow position={[halfWidth - 0.05, (roofY + windowTopY) / 2, roofCenterZ]}>
          <boxGeometry args={[0.10, roofY - windowTopY, roofLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Front Header Panel */}
        <mesh castShadow receiveShadow position={[0, roofY - 0.01, (roofFrontZ + 0.65) / 2]}>
          <boxGeometry args={[halfWidth * 2 - 0.02, 0.03, roofFrontZ - 0.65]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Rear Roof Panel */}
        <mesh castShadow receiveShadow position={[0, roofY - 0.01, (-0.50 + roofRearZ) / 2]}>
          <boxGeometry args={[halfWidth * 2 - 0.02, 0.03, -0.50 - roofRearZ]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Central Crossmember */}
        <mesh castShadow position={[0, roofY - 0.02, 0.08]}>
          <boxGeometry args={[sunroofOpenWidth, 0.04, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          B. SUNROOF GLASS PANELS
         ============================================================ */}
      <group>
        {/* Front Sliding Glass Panel */}
        <group position={[0, roofY + 0.005, 0.22]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[sunroofOpenWidth - 0.02, 0.012, 0.56]} />
            <meshPhysicalMaterial
              color="#0f172a"
              transparent
              opacity={0.65}
              roughness={0.1}
              metalness={0.1}
              transmission={0.6}
              ior={1.5}
            />
          </mesh>
        </group>

        {/* Rear Fixed Glass Panel */}
        <group position={[0, roofY + 0.002, -0.21]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[sunroofOpenWidth - 0.02, 0.012, 0.54]} />
            <meshPhysicalMaterial
              color="#0f172a"
              transparent
              opacity={0.7}
              roughness={0.1}
              metalness={0.1}
              transmission={0.5}
              ior={1.5}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}