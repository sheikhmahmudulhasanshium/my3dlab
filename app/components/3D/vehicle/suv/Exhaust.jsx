/**
 *
 *                    SUV EXHAUST — DUAL OUTLET SYSTEM
 *
 *   ENGINE
 *     │
 *     ▼
 *   (Engine Manifold)
 *        ╲
 *         ╲
 *          ╲______[ CATALYTIC CONVERTER ]______[ RESONATOR ]______
 *                                                               │
 *                                                               ▼
 *                                                        [  MUFFLER  ]
 *                                                               │
 *                                                        [  SPLITTER ]
 *                                                           ╱       ╲
 *                                                          ╱         ╲
 *                                                         ▼           ▼
 *                                                   [ Tailpipe ] [ Tailpipe ]
 *                                                        │           │
 *                                                   [Chrome]     [Chrome]
 *                                                     Tip          Tip
 *                                                        │           │
 *                                                        ▼           ▼
 *                                                     ,, ,        ,, ,
 *                                                    '  ,        '  ,
 *                                                  (Vapor)      (Vapor)
 *
 *   ═══════════════════════════════════════════════════════════════════════►
 *                           EXHAUST FLOW
 *
 *   Components:
 *   ──────────
 *   Engine Manifold → Catalytic Converter → Resonator → Muffler
 *                   → Splitter → Tailpipes → Chrome Tips
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

export default function Exhaust() {
  const pipeRadius = 0.016;
  const exhaustFloorY = SUV_CONFIG.chassisFloorY - 0.04; // Nested tucked under frame rails (0.34m)

  return (
    <group>
      {/* Downpipe */}
      <mesh castShadow position={[0.1, exhaustFloorY + 0.1, SUV_CONFIG.exhaustManifoldZ]}>
        <cylinderGeometry args={[pipeRadius, pipeRadius, 0.2, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* Catalytic Converter */}
      <mesh castShadow position={[0, exhaustFloorY, SUV_CONFIG.catalyticZ]}>
        <boxGeometry args={[0.15, 0.05, 0.25]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Connecting Pipe (Corrected: rotation moved to mesh) */}
      <mesh castShadow position={[0, exhaustFloorY, (SUV_CONFIG.catalyticZ + SUV_CONFIG.resonatorZ) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.catalyticZ - SUV_CONFIG.resonatorZ, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Resonator (Corrected: rotation moved to mesh) */}
      <mesh castShadow position={[0, exhaustFloorY, SUV_CONFIG.resonatorZ]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.25, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Pipe to Muffler (Corrected: rotation moved to mesh) */}
      <mesh castShadow position={[0, exhaustFloorY, (SUV_CONFIG.resonatorZ + SUV_CONFIG.mufflerZ) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.resonatorZ - SUV_CONFIG.mufflerZ, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Oval Muffler Box */}
      <mesh castShadow position={[0, exhaustFloorY, SUV_CONFIG.mufflerZ]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.45, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Left split tailpipe branch (Corrected: rotation moved to mesh) */}
      <group>
        <mesh castShadow position={[-SUV_CONFIG.exhaustTipX / 2, exhaustFloorY, SUV_CONFIG.splitterZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.exhaustTipX, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[-SUV_CONFIG.exhaustTipX, exhaustFloorY, (SUV_CONFIG.splitterZ + SUV_CONFIG.exhaustTipZ) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.splitterZ - SUV_CONFIG.exhaustTipZ, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Right split tailpipe branch (Corrected: rotation moved to mesh) */}
      <group>
        <mesh castShadow position={[SUV_CONFIG.exhaustTipX / 2, exhaustFloorY, SUV_CONFIG.splitterZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.exhaustTipX, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[SUV_CONFIG.exhaustTipX, exhaustFloorY, (SUV_CONFIG.splitterZ + SUV_CONFIG.exhaustTipZ) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[pipeRadius, pipeRadius, SUV_CONFIG.splitterZ - SUV_CONFIG.exhaustTipZ, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Chrome Outlet Tips */}
      <mesh castShadow position={[-SUV_CONFIG.exhaustTipX, exhaustFloorY, SUV_CONFIG.exhaustTipZ]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.12, 16, 1, true]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.05} />
      </mesh>

      <mesh castShadow position={[SUV_CONFIG.exhaustTipX, exhaustFloorY, SUV_CONFIG.exhaustTipZ]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.12, 16, 1, true]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.05} />
      </mesh>
    </group>
  );
}