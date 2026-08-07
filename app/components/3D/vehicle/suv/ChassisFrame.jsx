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
  // Re-engineered: Spans fully from rear bumper (-1.87m) to front bumper (2.03m)
  const railLength = SUV_CONFIG.frontBumperZ - SUV_CONFIG.rearBumperZ; // 3.90m length
  const railCenterZ = (SUV_CONFIG.frontBumperZ + SUV_CONFIG.rearBumperZ) / 2; // 0.08m center
  const railHeight = 0.06;
  const railWidth = 0.05;
  const strutX = 0.66; 

  const axlePositions = [
    { z: SUV_CONFIG.frontAxleZ, ySpring: SUV_CONFIG.frontSpringY },
    { z: SUV_CONFIG.rearAxleZ, ySpring: SUV_CONFIG.rearSpringY }
  ];

  // Driveshafts & Steering calculations
  const rearShaftLength = 0.05 - SUV_CONFIG.rearAxleZ; 
  const rearPitchAngle = Math.atan2(0.48 - SUV_CONFIG.axleY, rearShaftLength); 

  const frontShaftLength = SUV_CONFIG.frontAxleZ - 0.05; 
  const frontPitchAngle = Math.atan2(0.48 - SUV_CONFIG.axleY, frontShaftLength);

  const steerLinkLength = SUV_CONFIG.frontAxleZ - SUV_CONFIG.steeringRackZ; 
  const steerLinkPitch = Math.atan2(SUV_CONFIG.steeringRackY - SUV_CONFIG.axleY, steerLinkLength);

  return (
    <group>
      {/* ============================================================
          A. FULL-LENGTH LADDER FRAME (Sits at chassisFloorY = 0.38m)
         ============================================================ */}
      <group position={[0, SUV_CONFIG.chassisFloorY, railCenterZ]}>
        {/* Left Full-Length Rail */}
        <mesh castShadow receiveShadow position={[-SUV_CONFIG.railX, 0, 0]}>
          <boxGeometry args={[railWidth, railHeight, railLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Right Full-Length Rail */}
        <mesh castShadow receiveShadow position={[SUV_CONFIG.railX, 0, 0]}>
          <boxGeometry args={[railWidth, railHeight, railLength]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Front-most Crossmember (Supporting front bumper) */}
        <mesh castShadow position={[0, 0, railLength / 2 - 0.05]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Front Axle Crossmember */}
        <mesh castShadow position={[0, 0, SUV_CONFIG.frontAxleZ - railCenterZ]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Mid-chassis Transfer Case Crossmember */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Rear Axle Crossmember */}
        <mesh castShadow position={[0, 0, SUV_CONFIG.rearAxleZ - railCenterZ]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>

        {/* Rear-most Crossmember (Supporting rear bumper) */}
        <mesh castShadow position={[0, 0, -railLength / 2 + 0.05]}>
          <boxGeometry args={[SUV_CONFIG.railX * 2, railHeight - 0.015, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          B. UPPER SUSPENSION OUTRIGGER MOUNT BRACKETS (X=±0.66m)
         ============================================================ */}
      <group position={[0, SUV_CONFIG.frontDamperY, SUV_CONFIG.frontAxleZ]}>
        <mesh castShadow position={[-(SUV_CONFIG.railX + strutX) / 2, -0.02, 0]}>
          <boxGeometry args={[strutX - SUV_CONFIG.railX + 0.03, 0.04, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[(SUV_CONFIG.railX + strutX) / 2, -0.02, 0]}>
          <boxGeometry args={[strutX - SUV_CONFIG.railX + 0.03, 0.04, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>

      <group position={[0, SUV_CONFIG.rearDamperY, SUV_CONFIG.rearAxleZ]}>
        <mesh castShadow position={[-(SUV_CONFIG.railX + strutX) / 2, -0.02, 0]}>
          <boxGeometry args={[strutX - SUV_CONFIG.railX + 0.03, 0.04, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[(SUV_CONFIG.railX + strutX) / 2, -0.02, 0]}>
          <boxGeometry args={[strutX - SUV_CONFIG.railX + 0.03, 0.04, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          C. SUSPENSION STRUTS (X=±0.66m)
         ============================================================ */}
      <group>
        {[-strutX, strutX].map((x, i) => {
          const strutY = (SUV_CONFIG.frontDamperY + SUV_CONFIG.axleY) / 2;
          const strutHeight = SUV_CONFIG.frontDamperY - SUV_CONFIG.axleY;
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

      <group>
        {[-strutX, strutX].map((x, i) => {
          const strutY = (SUV_CONFIG.rearDamperY + SUV_CONFIG.axleY) / 2;
          const strutHeight = SUV_CONFIG.rearDamperY - SUV_CONFIG.axleY;
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
          D. FRONT & REAR AXLE TUBES & PROPELLER SHAFTS
         ============================================================ */}
      <group>
        <mesh castShadow position={[0, SUV_CONFIG.axleY, SUV_CONFIG.rearAxleZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, SUV_CONFIG.wheelX * 2, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.8} />
        </mesh>

        <group position={[-0.08, SUV_CONFIG.axleY, SUV_CONFIG.rearAxleZ]}>
          <mesh castShadow scale={[1.2, 1.0, 1.25]}>
            <sphereGeometry args={[0.11, 16, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.095]} scale={[1.1, 0.9, 0.4]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>

        <mesh castShadow position={[0, SUV_CONFIG.axleY, SUV_CONFIG.frontAxleZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, SUV_CONFIG.wheelX * 2 - 0.05, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.8} />
        </mesh>

        <group position={[-0.15, SUV_CONFIG.axleY, SUV_CONFIG.frontAxleZ]}>
          <mesh castShadow scale={[1.15, 0.95, 1.15]}>
            <sphereGeometry args={[0.095, 16, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} />
          </mesh>
        </group>

        {/* Driveshafts (Laid flat along Z-axis) */}
        <mesh 
          castShadow 
          position={[-0.04, (0.48 + SUV_CONFIG.axleY) / 2, (0.05 + SUV_CONFIG.rearAxleZ) / 2]}
          rotation={[Math.PI / 2 - rearPitchAngle, 0, 0]}
        >
          <cylinderGeometry args={[0.016, 0.016, rearShaftLength, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh 
          castShadow 
          position={[-0.075, (0.48 + SUV_CONFIG.axleY) / 2, (0.05 + SUV_CONFIG.frontAxleZ) / 2]}
          rotation={[-Math.PI / 2 + frontPitchAngle, -0.08, 0]}
        >
          <cylinderGeometry args={[0.014, 0.014, frontShaftLength, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================
          E. STEERING LINKAGE
         ============================================================ */}
      <group>
        <mesh castShadow position={[0, SUV_CONFIG.steeringRackY, SUV_CONFIG.steeringRackZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, SUV_CONFIG.railX * 2, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>

        <mesh castShadow position={[0, SUV_CONFIG.axleY, SUV_CONFIG.frontAxleZ]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, SUV_CONFIG.wheelX * 2, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Diagonal Steering Linkages */}
        {[-1, 1].map((side) => (
          <mesh 
            key={`steering-link-${side}`}
            castShadow
            position={[
              (SUV_CONFIG.railX + SUV_CONFIG.wheelX) / 2 * side,
              (SUV_CONFIG.steeringRackY + SUV_CONFIG.axleY) / 2,
              (SUV_CONFIG.steeringRackZ + SUV_CONFIG.frontAxleZ) / 2
            ]}
            rotation={[Math.PI / 2 - steerLinkPitch, side * 0.15, 0]}
          >
            <cylinderGeometry args={[0.01, 0.01, steerLinkLength, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}