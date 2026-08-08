/**
 *
 *                  SUV DOOR & SIDE-GLASS LAYOUT
 *
 *       [ FRONT SIDE DOOR ]       │       [ REAR SIDE DOOR ]
 *                                 │
 *        ┌───────────────────┐    │    ┌───────────────────┐
 *       /│      WINDOW       │\   │   /│       WINDOW      │\
 *      / │      GLASS        │ \  │  / │       GLASS       │ \
 *     /__│____________________│__\ │ /__│___________________│__\
 *     |  │                    │  | │ |  │                   │  |
 *     |  │    (  HANDLE  )    │  | │ |  │    (  HANDLE  )   │  |
 *     |  │                    │  | │ |  │                   │  |
 *     |__│____________________│__| │ |__│___________________│__|
 *        ↑                       ↑ │ ↑                       ↑
 *      Gasket                 Door │ Door                  Gasket
 *                                  │
 *                              B-Pillar
 *
 *                       ────────┬────────
 *                               │
 *                            Grab Bars
 *
 *//**
 *
 *                     SUV DOORS & WINDOWS — SIDE PROFILE
 *
 *                     [ WINDSHIELD COWL TO REAR HATCH ]
 *        windshieldZ (0.95)       bPillarZ (0.10)       cPillarZ (-0.55)      dPillarZ (-1.20)
 *               |                       |                     |                     |
 *               v                       v                     v                     v
 *             ┌═════════════════════════┬═════════════════════┬═════════════════════┐
 *             ║   [ FRONT WINDOW ]      │   [ REAR WINDOW ]   │  [ QUARTER GLASS ]  │ <-- windowTopY (1.55)
 *             ║                         │                     │                     │
 *             ╠═════════════════════════╪═════════════════════╪═════════════════════╡ <-- beltLineY (1.15)
 *             ║                         │                     │                     ║
 *             ║                         │                     │                     ║
 *             ║      FRONT DOOR         │      BACK DOOR      │    QUARTER PANEL    ║
 *             ║                         │                     │                     ║
 *             ║   [Handle]              │   [Handle]          │   [Wheel Arch]      ║
 *             └─────────────────────────┴─────────────────────┴─────────────────────┘ <-- tubFloorY (0.48)
 *
 */
/**
 *
 *                     SUV DOORS & WINDOWS — SIDE PROFILE
 *
 *                     [ WINDSHIELD COWL TO REAR HATCH ]
 *        windshieldZ (0.95)       bPillarZ (0.10)       cPillarZ (-0.55)      dPillarZ (-1.20)
 *               |                       |                     |                     |
 *               v                       v                     v                     v
 *             ┌═════════════════════════┬═════════════════════┬═════════════════════┐
 *             ║   [ FRONT WINDOW ]      │   [ REAR WINDOW ]   │  [ QUARTER GLASS ]  │ <-- windowTopY (1.55)
 *             ║                         │                     │                     │
 *             ╠═════════════════════════╪═════════════════════╪═════════════════════╡ <-- beltLineY (1.15)
 *             ║                         │                     │                     ║
 *             ║                         │                     │                     ║
 *             ║      FRONT DOOR         │      BACK DOOR      │    QUARTER PANEL    ║
 *             ║                         │                     │                     ║
 *             ║   [Handle]              │   [Handle]          │   [Wheel Arch]      ║
 *             └─────────────────────────┴─────────────────────┴─────────────────────┘ <-- tubFloorY (0.48)
 *
 * 
 * change door shape
front door:(trapezpoid)
/'''''''''''''''''''|
/                       |
/--------------|
|         ------    |
|______________|
back door:
/''''''''''''''''''''''''/
/                          /
'''''''''''''''''''''''''
|        ----            |
|              /''''''''''
|............/

 */
/**
 *
 *                     SUV DOORS & WINDOWS — CUSTOM SHAPES
 *
 *        FRONT DOOR (TRAPEZOIDAL GREENHOUSE)     BACK DOOR (WHEEL ARCH CUTOUT)
 *
 *                /'''''''''''''''''''|              /''''''''''''''''''''''''/
 *              /                     |            /                          /
 *             /                      |           /                          /
 *            /───────────────────────┤          /──────────────────────────/
 *            │                       │          │                          │
 *            │                       │          │                          │
 *            │      FRONT DOOR       │          │        BACK DOOR         │
 *            │                       │          │                      /'''
 *            │                       │          │                    /
 *            └───────────────────────┘          └──────────────────/
 *
 */


"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function Doors({
  // 1. Root Group Transform Overrides (Locked at defaults)
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],

  // 2. Global Aesthetics
  doorColor = "#ffff00",           // Default paint color (yellow)
  windowColor = "#0f172a",         // Tinted glass color
  trimColor = "#1e293b",           // Window frame trim

  // 3. Front Door Coordinates [Z, Y]
  f_p1_bottomFront = [0.81, 0.52],   // Front edge, bottom
  f_p2_bottomRear = [-0.19, 0.52],   // Rear edge (B-Pillar), bottom
  f_p3_topRear = [-0.19, 1.45],      // Rear edge (B-Pillar), top
  f_p4_topFront = [0.35, 1.47],      // Front edge (A-Pillar), top
  f_p5_beltlineFront = [0.81, 0.97], // Front edge, beltline
  frontDoorThickness = 0.04,

  // 4. Tailgate Coordinates [Z, Y]
  tailgateWidth = 1.48,
  tailgateLowerSillY = 0.56,
  tailgateBeltlineY = 0.97,
  tailgateRoofY = 1.38,
  tailgateRearmostZ = -1.71,
  tailgateRoofZ = -1.38,
  tailgateThickness = 0.04,

  // 5. Official Rear Window Polygon Coordinates [Z, Y]
  q_p1_bottomFront = [-0.36, -0.185], // Lower Front corner
  q_p2_bottomRear = [0.25, -0.185],  // Lower Rear corner
  q_p3_topRear = [0.2, 0.185],       // Upper Rear corner
  q_p4_topFront = [-0.1, 0.185],     // Upper Front corner
  quarterGlassThickness = 0.012,

  // 6. Official Rear Window Positional Offsets
  quarterGlassOffsetY = 1.18,        // Slides window up to greenhouse height
  quarterGlassOffsetZ = -1.30,       // Slides window back to the C-D pillar gap
}) {
  const halfWidth = SUV_CONFIG.bodyHalfWidth || 0.78;

  // ============================================================
  // FRONT DOOR SHEET METAL GEOMETRY (With Rearward-Shifted Front-Bottom Corner)
  // ============================================================
  const frontDoorGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // A. Outer boundary path of the entire door (Clockwise loop)
    shape.moveTo(f_p1_bottomFront[0], f_p1_bottomFront[1]);
    shape.lineTo(f_p2_bottomRear[0], f_p2_bottomRear[1]);
    shape.lineTo(f_p3_topRear[0], f_p3_topRear[1]);
    shape.lineTo(f_p4_topFront[0], f_p4_topFront[1]);
    shape.lineTo(f_p5_beltlineFront[0], f_p5_beltlineFront[1]);
    shape.closePath();

    // B. Inner Window Opening Cutout Path (Counter-Clockwise loop)
    const windowHole = new THREE.Path();
    windowHole.moveTo(0.70, 1.01);   // Bottom-Front (Shifted rearward from 0.77 to widen the opening)
    windowHole.lineTo(0.31, 1.43);   // Top-Front
    windowHole.lineTo(-0.15, 1.41);  // Top-Rear
    windowHole.lineTo(-0.15, 1.01);  // Bottom-Rear
    windowHole.closePath();

    shape.holes.push(windowHole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: frontDoorThickness,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.005,
      bevelSegments: 2,
    });
  }, [f_p1_bottomFront, f_p2_bottomRear, f_p3_topRear, f_p4_topFront, f_p5_beltlineFront, frontDoorThickness]);

  // ============================================================
  // FRONT DOOR GLASS GEOMETRY (Aligned with the adjusted hole)
  // ============================================================
  const frontWindowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Aligned to overlap the new 0.70 hole position, using 0.71 for safety margin
    shape.moveTo(0.71, 1.00);   // Bottom-Front glass corner (Shifted rearward to match frame)
    shape.lineTo(0.32, 1.44);   // Top-Front glass corner
    shape.lineTo(-0.16, 1.42);  // Top-Rear glass corner
    shape.lineTo(-0.16, 1.00);  // Bottom-Rear glass corner
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelEnabled: false,
    });
  }, []);

  // ============================================================
  // REAR WINDOW POLYGON GEOMETRY
  // ============================================================
  const quarterGlassGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(q_p1_bottomFront[0], q_p1_bottomFront[1]);
    shape.lineTo(q_p2_bottomRear[0], q_p2_bottomRear[1]);
    shape.lineTo(q_p3_topRear[0], q_p3_topRear[1]);
    shape.lineTo(q_p4_topFront[0], q_p4_topFront[1]);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: quarterGlassThickness,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    });
  }, [q_p1_bottomFront, q_p2_bottomRear, q_p3_topRear, q_p4_topFront, quarterGlassThickness]);

  // ============================================================
  // TAILGATE SLOPE CALCULATIONS
  // ============================================================
  const tailgateSlope = useMemo(() => {
    const deltaZ = tailgateRoofZ - tailgateRearmostZ;
    const deltaY = tailgateRoofY - tailgateBeltlineY;
    const length = Math.sqrt(deltaZ * deltaZ + deltaY * deltaY);
    const angle = Math.atan2(deltaZ, deltaY);

    return {
      length,
      angle,
      midY: (tailgateRoofY + tailgateBeltlineY) / 2,
      midZ: (tailgateRoofZ + tailgateRearmostZ) / 2,
    };
  }, [tailgateRearmostZ, tailgateRoofZ, tailgateBeltlineY, tailgateRoofY]);

  const tailgateLowerHeight = tailgateBeltlineY - tailgateLowerSillY;
  const tailgateLowerMidY = (tailgateBeltlineY + tailgateLowerSillY) / 2;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      
      {/* ============================================================
          FRONT LEFT DOOR & WINDOW
         ============================================================ */}
      <group position={[-halfWidth, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[1, 1, 1]}>
        <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
          <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
          <meshStandardMaterial 
            color={windowColor} 
            roughness={0.1} 
            metalness={0.9} 
            transparent 
            opacity={0.8} 
            depthWrite={false} 
          />
        </mesh>
      </group>

      {/* ============================================================
          FRONT RIGHT DOOR & WINDOW
         ============================================================ */}
      <group position={[halfWidth, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[1, 1, -1]}>
        <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
          <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
          <meshStandardMaterial 
            color={windowColor} 
            roughness={0.1} 
            metalness={0.9} 
            transparent 
            opacity={0.8} 
            depthWrite={false} 
          />
        </mesh>
      </group>

      {/* ============================================================
          REAR SIDE TRAPEZOIDAL WINDOWS
         ============================================================ */}
      {/* Left side quarter glass */}
      <mesh 
        position={[-halfWidth + 0.015, quarterGlassOffsetY, quarterGlassOffsetZ]} 
        rotation={[0, -Math.PI / 2, 0]} 
        scale={[1, 1, 1]}
        geometry={quarterGlassGeometry}
        castShadow
      >
        <meshStandardMaterial 
          color={windowColor} 
          roughness={0.1} 
          metalness={0.9} 
          transparent 
          opacity={0.8} 
          depthWrite={false} 
        />
      </mesh>

      {/* Right side quarter glass */}
      <mesh 
        position={[halfWidth - 0.015, quarterGlassOffsetY, quarterGlassOffsetZ]} 
        rotation={[0, -Math.PI / 2, 0]} 
        scale={[1, 1, -1]} 
        geometry={quarterGlassGeometry}
        castShadow
      >
        <meshStandardMaterial 
          color={windowColor} 
          roughness={0.1} 
          metalness={0.9} 
          transparent 
          opacity={0.8} 
          depthWrite={false} 
        />
      </mesh>

      {/* ============================================================
          TAILGATE ASSEMBLY
         ============================================================ */}
      <mesh castShadow receiveShadow position={[0, tailgateLowerMidY, tailgateRearmostZ]}>
        <boxGeometry args={[tailgateWidth, tailgateLowerHeight, tailgateThickness]} />
        <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} />
      </mesh>

      <mesh position={[0, tailgateLowerMidY + 0.05, tailgateRearmostZ + tailgateThickness / 2 + 0.001]}>
        <boxGeometry args={[0.42, 0.16, 0.005]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} />
      </mesh>

      <group position={[0, tailgateSlope.midY, tailgateSlope.midZ]} rotation={[tailgateSlope.angle, 0, 0]}>
        <mesh position={[-tailgateWidth / 2 + 0.04, 0, 0]} castShadow>
          <boxGeometry args={[0.08, tailgateSlope.length, tailgateThickness]} />
          <meshStandardMaterial color={doorColor} roughness={0.4} />
        </mesh>
        <mesh position={[tailgateWidth / 2 - 0.04, 0, 0]} castShadow>
          <boxGeometry args={[0.08, tailgateSlope.length, tailgateThickness]} />
          <meshStandardMaterial color={doorColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, tailgateSlope.length / 2 - 0.02, 0]} castShadow>
          <boxGeometry args={[tailgateWidth, 0.04, tailgateThickness]} />
          <meshStandardMaterial color={doorColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, -tailgateSlope.length / 2 + 0.02, 0]} castShadow>
          <boxGeometry args={[tailgateWidth, 0.04, tailgateThickness]} />
          <meshStandardMaterial color={doorColor} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[tailgateWidth - 0.08, tailgateSlope.length - 0.04, 0.01]} />
          <meshStandardMaterial 
            color={windowColor} 
            roughness={0.1} 
            metalness={0.9} 
            transparent 
            opacity={0.8} 
            depthWrite={false} 
          />
        </mesh>
      </group>

    </group>
  );
}