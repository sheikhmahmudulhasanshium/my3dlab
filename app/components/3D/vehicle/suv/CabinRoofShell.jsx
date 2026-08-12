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
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],    
}) {
  const roofY = SUV_CONFIG.roofY ?? 1.68; 
  const windowTopY = SUV_CONFIG.windowTopY ?? 1.55; 
  const halfWidth = SUV_CONFIG.bodyHalfWidth ?? 0.78; 
  
  // Longitudinal boundaries mapped to structural pillars
  const roofFrontZ = SUV_CONFIG.windshieldZ ?? 0.95; 
  const roofRearZ = SUV_CONFIG.dPillarZ ?? -1.20;     
  const roofLength = roofFrontZ - roofRearZ; 
  const roofCenterZ = (roofFrontZ + roofRearZ) / 2; 

  // Inner opening width between the left and right side rails
  // halfWidth * 2 (1.56m) minus the two 0.10m side rails = 1.36m opening width
  const innerOpeningWidth = halfWidth * 2 - 0.20; 

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ============================================================
          A. MAIN STRUCTURAL ROOF SHELL (SEALED)
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

        {/* Front Header Panel (Z spans from 0.65 to 0.95) */}
        <mesh castShadow receiveShadow position={[0, roofY - 0.01, (roofFrontZ + 0.65) / 2]}>
          <boxGeometry args={[halfWidth * 2 - 0.02, 0.03, roofFrontZ - 0.65]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Rear Roof Panel (Z spans from -1.20 to -0.50) */}
        <mesh castShadow receiveShadow position={[0, roofY - 0.01, (-0.50 + roofRearZ) / 2]}>
          <boxGeometry args={[halfWidth * 2 - 0.02, 0.03, -0.50 - roofRearZ]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Central Crossmember (Perfect center joint at Z = 0.075) */}
        <mesh castShadow position={[0, roofY - 0.02, 0.075]}>
          <boxGeometry args={[innerOpeningWidth, 0.04, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          B. SUNROOF GLASS PANELS (SEALED)
         ============================================================ */}
      <group>
        {/* Front Sliding Glass Panel */}
        {/* Positioned to align flush with front header (0.65) and crossmember (0.075) */}
        <group position={[0, roofY + 0.005, 0.36]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[innerOpeningWidth - 0.01, 0.012, 0.58]} />
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
        {/* Positioned to align flush with crossmember (0.075) and rear roof (-0.50) */}
        <group position={[0, roofY + 0.002, -0.21]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[innerOpeningWidth - 0.01, 0.012, 0.59]} />
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