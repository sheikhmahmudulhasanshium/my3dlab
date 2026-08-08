/**
 *
 *                         SUV SIDE PROFILE
 *
 *              _________________________________
 *             /                                 \____
 *      ______/                                       \
 *     /                                               |
 *    /                                                |  <- Rear Cargo Box
 *   |                                                 |
 *   |_________________________________________________|  <- High Beltline
 *   |                                                 |
 *   |                                                 |  <- Lower Sill Wall
 *    \                                               /
 *     \___       ( Front Arch )     ( Rear Arch ) __/
 *         \_____/             \_____/              \
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

export default function BodyPanels() {
  const bodyPaintColor = "#475569"; 
  const trimColor = "#1e293b";      
  const bodyWidth = SUV_CONFIG.bodyHalfWidth * 2; // ~1.56m
  const halfWidth = SUV_CONFIG.bodyHalfWidth !== undefined ? SUV_CONFIG.bodyHalfWidth : 0.78;
  const fenderShoulderWidth = 0.14; 
  const fenderBeltY = 0.97;
  const beltlineY = 0.97; 

  // Longitudinal (Z-axis) limits for the door cavities
  const frontFenderRearZ = 0.82;   
  const rearQuarterFrontZ = -1.05;  
  const bPillarCenterZ = -0.20;     
  
  const totalDoorSpanLength = frontFenderRearZ - rearQuarterFrontZ; 

  // Aerodynamic Height Profile
  const roofFrontY = 1.48;       // Maximum height at windshield/A-pillar intersection
  const roofRearY = 1.38;        // Tapered height at D-pillar/spoiler intersection (10cm aerodynamic drop)
  const greenhouseHeight = roofFrontY - beltlineY; 
  const greenhouseCenterY = beltlineY + greenhouseHeight / 2; 

  // Precise Roof Rail Trigonometric Alignment
  const roofFrontZ = 0.35;       // Front edge of the roof
  const roofRearZ = -1.35;       // Rear edge of the roof
  const roofLengthZ = roofFrontZ - roofRearZ; // 1.70m span
  const roofSlopeY = roofFrontY - roofRearY;  // 0.10m drop
  
  // Negative pitch angle to slope DOWN toward the rear
  const roofAngleX = -Math.atan2(roofSlopeY, roofLengthZ); 
  const roofCenterZ = (roofFrontZ + roofRearZ) / 2; // -0.50m
  const roofCenterY = (roofFrontY + roofRearY) / 2; // 1.43m
  const roofRailLength = Math.sqrt(roofLengthZ * roofLengthZ + roofSlopeY * roofSlopeY) + 0.05; // 1.75m (with 5cm secure joint overlap)

  // Greenhouse Side Inset (Tumblehome) to prevent Z-fighting and visual clipping
  const sideInsetX = halfWidth - 0.015;

  // Localized Pillar Heights (accounting for the aerodynamic roof slope)
  // B-Pillar is at Z = 0.10 (Roof height ~1.465m) -> Exact space Y: 0.495m
  const bPillarHeight = 0.49;
  const bPillarY = beltlineY + bPillarHeight / 2; // 1.215m

  // C-Pillar is at Z = -0.55 (Roof height ~1.427m) -> Exact space Y: 0.457m
  const cPillarHeight = 0.45;
  const cPillarY = beltlineY + cPillarHeight / 2; // 1.195m

  return (
    <group>
      {/* ============================================================
          A. LOWER BODY & AERODYNAMIC ROCKER SILL GUARDS
         ============================================================ */}
      <group>
        {/* Left Tucked Rocker Guard (Contoured slightly inward for underbody airflow) */}
        <mesh castShadow receiveShadow position={[-halfWidth - 0.005, SUV_CONFIG.rockerTrimY, 0.125]}>
          <boxGeometry args={[0.025, 0.08, totalDoorSpanLength - 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
        {/* Right Tucked Rocker Guard */}
        <mesh castShadow receiveShadow position={[halfWidth + 0.005, SUV_CONFIG.rockerTrimY, 0.125]}>
          <boxGeometry args={[0.025, 0.08, totalDoorSpanLength - 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          B. FRONT FENDERS (With Integrated Wheel Air Deflectors)
         ============================================================ */}
      {/* LEFT FRONT FENDER */}
      <group position={[-halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[fenderShoulderWidth / 2, fenderBeltY, 1.35]}>
          <boxGeometry args={[fenderShoulderWidth, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.68, 1.785]}>
          <boxGeometry args={[0.02, 0.48, 0.13]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.68, 0.965]}>
          <boxGeometry args={[0.02, 0.48, 0.37]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.86, 1.25]}>
          <boxGeometry args={[0.02, 0.18, 0.94]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Front Aero Spats / Air Deflector (In front of front tire) */}
        <mesh position={[0.01, 0.45, 1.30]}>
          <boxGeometry args={[0.015, 0.15, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* RIGHT FRONT FENDER */}
      <group position={[halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[-fenderShoulderWidth / 2, fenderBeltY, 1.35]}>
          <boxGeometry args={[fenderShoulderWidth, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.68, 1.785]}>
          <boxGeometry args={[0.02, 0.48, 0.13]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.68, 0.965]}>
          <boxGeometry args={[0.02, 0.48, 0.37]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.86, 1.25]}>
          <boxGeometry args={[0.02, 0.18, 0.94]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Front Aero Spats / Air Deflector */}
        <mesh position={[-0.01, 0.45, 1.30]}>
          <boxGeometry args={[0.015, 0.15, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          C. STRUCTURAL DOOR THRESHOLDS & JAMBS
         ============================================================ */}
      {/* LEFT SIDE CAVITY FRAME */}
      <group position={[-halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[0.01, 0.56, 0.135]}>
          <boxGeometry args={[0.02, 0.12, totalDoorSpanLength]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.61, 0.135]} receiveShadow>
          <boxGeometry args={[0.04, 0.02, totalDoorSpanLength]} />
          <meshStandardMaterial color={trimColor} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.01, 0.78, bPillarCenterZ]}>
          <boxGeometry args={[0.02, 0.38, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* RIGHT SIDE CAVITY FRAME */}
      <group position={[halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[-0.01, 0.56, 0.135]}>
          <boxGeometry args={[0.02, 0.12, totalDoorSpanLength]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-0.02, 0.61, 0.135]} receiveShadow>
          <boxGeometry args={[0.04, 0.02, totalDoorSpanLength]} />
          <meshStandardMaterial color={trimColor} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-0.01, 0.78, bPillarCenterZ]}>
          <boxGeometry args={[0.02, 0.38, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          D. REAR SIDE QUARTER PANELS (With Integrated Aero Spats)
         ============================================================ */}
      {/* LEFT REAR QUARTER ASSEMBLY */}
      <group position={[-halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[0.01, 0.78, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, 0.38, 0.04]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.76, -1.545]}>
          <boxGeometry args={[0.02, 0.54, 0.35]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        <mesh castShadow position={[0, 0.94, -0.95]}>
          <boxGeometry args={[0.02, 0.18, 0.84]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Rear Wheel Arch Air Deflector */}
        <mesh position={[0.01, 0.45, -0.50]}>
          <boxGeometry args={[0.015, 0.15, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* RIGHT REAR QUARTER ASSEMBLY */}
      <group position={[halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[-0.01, 0.78, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, 0.38, 0.04]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.76, -1.545]}>
          <boxGeometry args={[0.02, 0.54, 0.35]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.94, -0.95]}>
          <boxGeometry args={[0.02, 0.18, 0.84]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Rear Wheel Arch Air Deflector */}
        <mesh position={[-0.01, 0.45, -0.50]}>
          <boxGeometry args={[0.015, 0.15, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          E. REAR TAILGATE APERTURE FRAME
         ============================================================ */}
      <group position={[0, 0, -1.72]}>
        <mesh castShadow receiveShadow position={[0, 0.56, 0]}>
          <boxGeometry args={[bodyWidth - 0.04, 0.12, 0.03]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.61, 0.015]} receiveShadow>
          <boxGeometry args={[bodyWidth - 0.08, 0.02, 0.02]} />
          <meshStandardMaterial color={trimColor} roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-halfWidth + 0.02, 0.76, 0.01]}>
          <boxGeometry args={[0.04, 0.48, 0.02]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[halfWidth - 0.02, 0.76, 0.01]}>
          <boxGeometry args={[0.04, 0.48, 0.02]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================
          F. AERODYNAMIC GREENHOUSE PILLARS & UPPER FRAME
         ============================================================ */}
      
      {/* 1. TAPERED ROOF SIDE RAILS */}
      <group>
        {/* Left Sloped Roof Rail */}
        <mesh 
          castShadow 
          position={[-sideInsetX, roofCenterY, roofCenterZ]}
          rotation={[roofAngleX, 0, 0]}
        >
          <boxGeometry args={[0.02, 0.032, roofRailLength]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Right Sloped Roof Rail */}
        <mesh 
          castShadow 
          position={[sideInsetX, roofCenterY, roofCenterZ]}
          rotation={[roofAngleX, 0, 0]}
        >
          <boxGeometry args={[0.02, 0.032, roofRailLength]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 2. RAKED A-PILLARS & HEADER */}
      <group>
        {/* Left A-Pillar */}
        <mesh 
          castShadow 
          position={[-sideInsetX, greenhouseCenterY, 0.585]} 
          rotation={[-Math.atan2(0.47, greenhouseHeight), 0, 0]}
        >
          <boxGeometry args={[0.03, 0.73, 0.03]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Right A-Pillar */}
        <mesh 
          castShadow 
          position={[sideInsetX, greenhouseCenterY, 0.585]} 
          rotation={[-Math.atan2(0.47, greenhouseHeight), 0, 0]}
        >
          <boxGeometry args={[0.03, 0.73, 0.03]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Windshield Upper Crossbar */}
        <mesh position={[0, roofFrontY - 0.005, roofFrontZ]} castShadow>
          <boxGeometry args={[bodyWidth - 0.04, 0.03, 0.06]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 3. B-PILLARS (Vertical pillar separating front and back side doors) */}
      <group>
        {/* Left Flush B-Pillar */}
        <mesh castShadow position={[-sideInsetX, bPillarY, bPillarCenterZ]}>
          <boxGeometry args={[0.015, bPillarHeight, 0.06]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        {/* Right Flush B-Pillar */}
        <mesh castShadow position={[sideInsetX, bPillarY, bPillarCenterZ]}>
          <boxGeometry args={[0.015, bPillarHeight, 0.06]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* 4. C-PILLARS (Shortened to sit perfectly below the sloped roof profile) */}
      <group>
        {/* Left C-Pillar */}
        <mesh castShadow position={[-sideInsetX, cPillarY, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, cPillarHeight, 0.06]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Right C-Pillar */}
        <mesh castShadow position={[sideInsetX, cPillarY, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, cPillarHeight, 0.06]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 5. FASTBACK D-PILLARS & ROOF SPOILER */}
      <group>
        {/* Left D-Pillar */}
        <mesh 
          castShadow 
          position={[-sideInsetX, (beltlineY + roofRearY) / 2 - 0.01, -1.525]} 
          rotation={[Math.atan2(0.35, roofRearY - beltlineY), 0, 0]}
        >
          <boxGeometry args={[0.03, 0.58, 0.08]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Right D-Pillar */}
        <mesh 
          castShadow 
          position={[sideInsetX, (beltlineY + roofRearY) / 2 - 0.01, -1.525]} 
          rotation={[Math.atan2(0.35, roofRearY - beltlineY), 0, 0]}
        >
          <boxGeometry args={[0.03, 0.58, 0.08]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Integrated Rear Spoiler */}
        <mesh position={[0, roofRearY + 0.005, roofRearZ - 0.075]} castShadow>
          <boxGeometry args={[bodyWidth - 0.05, 0.03, 0.16]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}