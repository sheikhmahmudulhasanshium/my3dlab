"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function BodyPanels() {
  const bodyPaintColor = "#475569"; 
  const trimColor = "#1e293b";      
  const bodyWidth = SUV_CONFIG.bodyHalfWidth * 2; // ~1.56m
  const halfWidth = SUV_CONFIG.bodyHalfWidth !== undefined ? SUV_CONFIG.bodyHalfWidth : 0.78;
  const fenderShoulderWidth = 0.14; 
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
  const bPillarHeight = 0.49;
  const bPillarY = beltlineY + bPillarHeight / 2; // 1.215m

  const cPillarHeight = 0.45;
  const cPillarY = beltlineY + cPillarHeight / 2; // 1.195m

  // ============================================================
  // CUSTOM SHAPED PANEL GEOMETRIES (Z-Y Plane Profiles)
  // ============================================================
  const frontFenderShape = useMemo(() => {
    const shape = new THREE.Shape();
    const frontZ = SUV_CONFIG.frontAxleZ !== undefined ? SUV_CONFIG.frontAxleZ : 1.25;
    const axleY = SUV_CONFIG.axleY !== undefined ? SUV_CONFIG.axleY : 0.44;
    const archRadius = SUV_CONFIG.wheelArchRadius !== undefined ? SUV_CONFIG.wheelArchRadius : 0.42;

    const frontEdgeZ = 1.85;
    const rearEdgeZ = 0.78;

    // Aligned heights matching the 4.3-degree slope of the shoulder trim
    const rearY = 1.00;   
    const frontY = 0.92;  

    // Start at sloped front tip (directly over headlight)
    shape.moveTo(frontEdgeZ, frontY);
    // Slopes up to the door split running parallel to the bonnet
    shape.lineTo(rearEdgeZ, rearY);
    // Drops straight down at the door joint
    shape.lineTo(rearEdgeZ, 0.44);
    // Runs flat to the wheel arch start
    shape.lineTo(frontZ - archRadius, 0.44);
    // Semicircular cutout
    shape.absarc(frontZ, axleY, archRadius, Math.PI, 0, true);
    // Runs flat to front bottom corner
    shape.lineTo(frontEdgeZ, 0.44);
    // Goes straight up to close at sloped starting tip
    shape.lineTo(frontEdgeZ, frontY);

    return shape;
  }, []);

  const rearQuarterShape = useMemo(() => {
    const shape = new THREE.Shape();
    const rearZ = SUV_CONFIG.rearAxleZ !== undefined ? SUV_CONFIG.rearAxleZ : -0.95;
    const axleY = SUV_CONFIG.axleY !== undefined ? SUV_CONFIG.axleY : 0.44;
    const archRadius = SUV_CONFIG.wheelArchRadius !== undefined ? SUV_CONFIG.wheelArchRadius : 0.42;

    const frontEdgeZ = -1.05;
    const rearEdgeZ = -1.72;

    // Modified to be triangular over the rear seats:
    // - Start low at the front door split (0.44m beltline height)
    shape.moveTo(frontEdgeZ, 0.44);
    // - Slopes diagonally up to the C-pillar base (1.03m) at Z = -1.05m
    shape.lineTo(-1.05, 1.03);
    // - Runs flat along the rear cargo quarter
    shape.lineTo(rearEdgeZ, 1.03);
    // - Goes straight down to rear bottom corner
    shape.lineTo(rearEdgeZ, 0.44);
    // - Runs flat to the rear edge of the wheel arch
    shape.lineTo(rearZ - archRadius, 0.44);
    // - Semicircular wheel arch cutout
    shape.absarc(rearZ, axleY, archRadius, Math.PI, 0, true);
    // - Runs flat back to front bottom corner to complete the loop
    shape.lineTo(frontEdgeZ, 0.44);

    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.02,
    bevelEnabled: false,
  }), []);

  // Sleek 4.3-degree slope angle (0.075 rad) to run perfectly parallel to the bonnet
  const shoulderRotationX = 0.075; 
  // Positioned so the front edge lands at exactly 0.92m, sealing the headlight gap
  const shoulderTrimY = 0.955; 

  return (
    <group>
      {/* ============================================================
          A. LOWER BODY & AERODYNAMIC ROCKER SILL GUARDS
         ============================================================ */}
      <group>
        {/* Left Tucked Rocker Guard */}
        <mesh castShadow receiveShadow position={[-halfWidth - 0.005, SUV_CONFIG.rockerTrimY || 0.42, 0.125]}>
          <boxGeometry args={[0.025, 0.08, totalDoorSpanLength - 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
        {/* Right Tucked Rocker Guard */}
        <mesh castShadow receiveShadow position={[halfWidth + 0.005, SUV_CONFIG.rockerTrimY || 0.42, 0.125]}>
          <boxGeometry args={[0.025, 0.08, totalDoorSpanLength - 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          B. FRONT FENDERS (With Integrated Wheel Air Deflectors)
         ============================================================ */}
      {/* LEFT FRONT FENDER */}
      <group position={[-halfWidth, 0, 0]}>
        {/* Fender Shoulder Trim (Seamless alignment parallel to bonnet) */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[fenderShoulderWidth / 2, shoulderTrimY, 1.35]}
          rotation={[shoulderRotationX, 0, 0]}
        >
          <boxGeometry args={[fenderShoulderWidth, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Custom Semicircular Front Fender Side Sheet */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0, 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <extrudeGeometry args={[frontFenderShape, extrudeSettings]} />
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
        {/* Fender Shoulder Trim (Seamless alignment parallel to bonnet) */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[-fenderShoulderWidth / 2, shoulderTrimY, 1.35]}
          rotation={[shoulderRotationX, 0, 0]}
        >
          <boxGeometry args={[fenderShoulderWidth, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Custom Semicircular Front Fender Side Sheet (Offset -0.02 to extrude inward) */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[-0.02, 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <extrudeGeometry args={[frontFenderShape, extrudeSettings]} />
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
          D. REAR SIDE QUARTER PANELS (With Swept Triangular Profile)
         ============================================================ */}
      {/* LEFT REAR QUARTER ASSEMBLY */}
      <group position={[-halfWidth, 0, 0]}>
        <mesh castShadow receiveShadow position={[0.01, 0.78, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, 0.38, 0.04]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        
        {/* Custom Swept Rear Quarter Side Sheet */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0, 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <extrudeGeometry args={[rearQuarterShape, extrudeSettings]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Rear Wheel Arch Air Deflector */}
        <mesh position={[0.01, 0.45, -0.50]}>
          <boxGeometry args={[0.015, 0.15, 0.05]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
      </group>

      {/* RIGHT REAR QUARTER ASSEMBLY */}
      <group position={[halfWidth-0.012, 0, 0]}>
        <mesh castShadow receiveShadow position={[-0.01, 0.78, rearQuarterFrontZ]}>
          <boxGeometry args={[0.02, 0.38, 0.04]} />
          <meshStandardMaterial color={trimColor} roughness={0.8} />
        </mesh>
        
        {/* Custom Swept Rear Quarter Side Sheet (Offset -0.02 to extrude inward) */}
        <mesh 
          castShadow 
          receiveShadow 
          position={[0.02, 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <extrudeGeometry args={[rearQuarterShape, extrudeSettings]} />
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

      {/* 3. B-PILLARS */}
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

      {/* 4. C-PILLARS */}
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