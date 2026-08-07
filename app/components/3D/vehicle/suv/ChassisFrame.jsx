/**
 *
 *                  SUV LADDER FRAME — TOP VIEW
 *
 *                ┌───────────────────────────┐
 *                │    FRONT CROSSMEMBER      │
 *                └────────────┬──────────────┘
 *                             │
 *        (Axle)               │                (Axle)
 *          ()====[o]==========│==========[o]====()
 *          ||    | |          │          | |    ||
 *          ||    | |==========│==========| |    ||
 *          ||====| |==========│==========| |====||
 *          ||    | |          │          | |    ||
 *          ||    |_|          │          |_|    ||
 *          ()====[o]==========│==========[o]====()
 *                             │
 *                ┌────────────┴──────────────┐
 *                │       MID-CROSSMEMBER      │
 *                └───────────────────────────┘
 *
 *                  ↑                         ↑
 *            Helical Springs             Dampers
 *
 *        ═══════════════════════════════════════════
 *                    Parallel Rails
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

function SuspensionCoil({ position, height = 0.16, diameter = 0.08, turns = 7 }) {
  const rings = Array.from({ length: turns }, (_, i) => i);
  const pitch = height / turns;

  return (
    <group position={position}>
      {rings.map((ring) => (
        <mesh 
          key={ring} 
          position={[0, (ring * pitch) - (height / 2) + (pitch / 2), 0]} 
          rotation={[0.08, 0, 0.04]}
        >
          <torusGeometry args={[diameter / 2, 0.008, 8, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function ChassisFrame({ steeringAngle = 0 }) {
  const railLength = SUV_CONFIG.bodyLength * 0.95;
  const railHeight = 0.06;
  const railWidth = 0.05;

  return (
    <group>
      {/* ============================================================
          A. LADDER FRAME (Twin rails at chassisFloorY = 0.38m)
         ============================================================ */}
      <group position={[0, SUV_CONFIG.chassisFloorY, SUV_CONFIG.vehicleCenterZ]}>
        <mesh castShadow receiveShadow position={[-SUV_CONFIG.railX, 0, 0]}>
          <boxGeometry args={[railWidth, railHeight, railLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        <mesh castShadow receiveShadow position={[SUV_CONFIG.railX, 0, 0]}>
          <boxGeometry args={[railWidth, railHeight, railLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Crossmembers */}
        <mesh castShadow position={[0, 0, railLength / 2 - 0.1]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        <mesh castShadow position={[0, 0, -railLength / 2 + 0.1]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          B. SUSPENSION STRUTS (Spanning from damperY down to axleY)
         ============================================================ */}
      {/* Front Struts (Damper upper: 0.64m, axleY: 0.44m) */}
      <group>
        {[-SUV_CONFIG.springX, SUV_CONFIG.springX].map((x, i) => {
          const strutY = (SUV_CONFIG.frontDamperY + SUV_CONFIG.axleY) / 2; // 0.54m
          const strutHeight = SUV_CONFIG.frontDamperY - SUV_CONFIG.axleY;  // 0.20m
          return (
            <group key={`front-strut-${i}`} position={[x, strutY, SUV_CONFIG.frontAxleZ]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.012, 0.012, strutHeight, 12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh castShadow position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.024, 0.024, strutHeight * 0.6, 12]} />
                <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.4} />
              </mesh>
              <SuspensionCoil position={[0, 0.02, 0]} height={strutHeight * 0.75} diameter={0.07} turns={6} />
            </group>
          );
        })}
      </group>

      {/* Rear Struts (Damper upper: 0.61m, axleY: 0.44m) */}
      <group>
        {[-SUV_CONFIG.springX, SUV_CONFIG.springX].map((x, i) => {
          const strutY = (SUV_CONFIG.rearDamperY + SUV_CONFIG.axleY) / 2; // 0.525m
          const strutHeight = SUV_CONFIG.rearDamperY - SUV_CONFIG.axleY;  // 0.17m
          return (
            <group key={`rear-strut-${i}`} position={[x, strutY, SUV_CONFIG.rearAxleZ]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.012, 0.012, strutHeight, 12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh castShadow position={[0, -0.03, 0]}>
                <cylinderGeometry args={[0.024, 0.024, strutHeight * 0.6, 12]} />
                <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.4} />
              </mesh>
              <SuspensionCoil position={[0, 0.02, 0]} height={strutHeight * 0.75} diameter={0.07} turns={6} />
            </group>
          );
        })}
      </group>

      {/* ============================================================
          C. STEERING LINKAGE / HORIZONTAL TIE ROD (Corrected Y-alignment)
         ============================================================ */}
      <group>
        {/* Main steering rack cylinder (Corrected: rotation moved to mesh) */}
        <mesh castShadow position={[0, SUV_CONFIG.steeringRackY, SUV_CONFIG.steeringRackZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, SUV_CONFIG.railX * 2, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* 
          Horizontal Steering Tie Rod 
          Spans parallel to axle at axleY (0.44m) connecting front wheel hubs
        */}
        <mesh castShadow position={[0, SUV_CONFIG.axleY, SUV_CONFIG.frontAxleZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, SUV_CONFIG.wheelX * 2, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}