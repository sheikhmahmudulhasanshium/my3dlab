/**
 *
 *                 SUV LIGHTING SYSTEM — FRONT / REAR
 *
 *   [ FRONT PROJECTOR LENS ]              [ REAR LED CLUSTER ]
 *
 *        ╭──────────────────╮              ╭────────────────────╮
 *       /                    \            /                      \
 *      │   ╭──────────────╮   │          │  ╔══╗ ╔══╗            │
 *      │  (   PROJECTOR    )  │          │  ║R ║ ║R ║  ← Brake   │
 *      │   ╰──────────────╯   │          │  ╚══╝ ╚══╝            │
 *      │                      │          │  ╔══╗ ╔══╗            │
 *      │      ◯────────◯      │          │  ║Y ║ ║W ║  ← Signal  │
 *      │       DRL HALO       │          │  ╚══╝ ╚══╝    /Reverse │
 *      │                      │          │                      │
 *      │  ───── LED GUIDE ─── │          │  ══════════════════  │
 *       ╰────────────────────╯            ╰──────────────────────╯
 *
 *       ↑             ↑                    ↑            ↑
 *   Projector       DRL /                 Brake       Signal /
 *      Lens       Position                 Tail       Reverse
 *
 *       FRONT                                      REAR
 *
 */
"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function Headlights() {
  const frontLightY = 0.78; 
  const frontLightZ = 1.84; 
  const halfWidth = SUV_CONFIG.bodyHalfWidth || 0.78;
  const frontLightX = halfWidth - 0.17; // ~0.61m

  const materials = useMemo(() => {
    return {
      housingChrome: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.1,
        metalness: 0.9,
      }),
      housingMatteBlack: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.8,
        metalness: 0.1,
      }),
      projectorGlass: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        emissive: "#bae6fd",
        emissiveIntensity: 2.5,
        roughness: 0.05,
        metalness: 0.9,
      }),
      drlGlow: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 3.0,
      }),
      lensCoverClear: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.2,
        roughness: 0.02,
      }),
    };
  }, []);

  return (
    <group>
      {/* ============================================================
          FRONT LIGHTING ASSEMBLIES ONLY (Rear lights are on Tailgate)
         ============================================================ */}
      {[-1, 1].map((side) => (
        <group 
          key={`front-headlight-${side}`} 
          position={[side * frontLightX, frontLightY, frontLightZ]}
          rotation={[0, side * 0.05, 0]}
        >
          {/* A. Outer Housing */}
          <mesh castShadow material={materials.housingMatteBlack}>
            <boxGeometry args={[0.20, 0.11, 0.07]} />
          </mesh>

          {/* Chrome Reflector */}
          <mesh position={[0, 0, 0.002]} material={materials.housingChrome}>
            <boxGeometry args={[0.18, 0.09, 0.05]} />
          </mesh>

          {/* B. Center Projector */}
          <mesh position={[-side * 0.02, 0.01, 0.022]} material={materials.projectorGlass}>
            <sphereGeometry args={[0.028, 16, 16]} />
          </mesh>

          {/* C. DRL Halo */}
          <mesh position={[-side * 0.02, 0.01, 0.02]} material={materials.drlGlow}>
            <torusGeometry args={[0.034, 0.004, 8, 20]} />
          </mesh>

          {/* D. Bottom Guide Strip */}
          <mesh position={[side * 0.01, -0.032, 0.032]} material={materials.drlGlow}>
            <boxGeometry args={[0.13, 0.006, 0.01]} />
          </mesh>

          {/* E. Clear Outer Lens */}
          <mesh position={[0, 0, 0.036]} material={materials.lensCoverClear}>
            <boxGeometry args={[0.202, 0.112, 0.004]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}