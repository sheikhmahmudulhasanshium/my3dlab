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
  trimColor = "#1e293b",           // Window frame trim & handle color

  // 3. Front Door Coordinates [Z, Y]
  f_p1_bottomFront = [0.81, 0.52],   // Front edge, bottom
  f_p2_bottomRear = [-0.16, 0.52],   // Rear edge (B-Pillar side), bottom
  f_p3_topRear = [-0.16, 1.45],      // Rear edge (B-Pillar side), top
  f_p4_topFront = [0.35, 1.47],      // Front edge (A-Pillar), top
  f_p5_beltlineFront = [0.81, 0.97], // Front edge, beltline
  frontDoorThickness = 0.04,

  // 4. Rear Passenger Door Coordinates [Z, Y]
  r_p1_bottomFront = [-0.22, 0.52],  // Bottom-Front (B-Pillar side base)
  r_p2_bottomRear = [-0.78, 0.52],   // Bottom-Rear (Begins dog-leg)
  r_p3_archCurve = [-1.05, 0.78],    // Curved wheel-arch notch
  r_p4_topRear = [-1.05, 1.40],      // Top-Rear (C-Pillar roof joint)
  r_p5_topFront = [-0.22, 1.45],     // Top-Front (B-Pillar side roof joint)
  rearDoorThickness = 0.04,

  // 5. Tailgate Coordinates [Z, Y]
  tailgateWidth = 1.48,
  tailgateLowerSillY = 0.56,
  tailgateBeltlineY = 0.97,
  tailgateRoofY = 1.38,
  tailgateRearmostZ = -1.71,
  tailgateRoofZ = -1.38,
  tailgateThickness = 0.04,

  // 6. Official Rear Quarter Window Polygon Coordinates [Z, Y]
  q_p1_bottomFront = [-0.36, -0.185], // Lower Front corner
  q_p2_bottomRear = [0.25, -0.185],  // Lower Rear corner
  q_p3_topRear = [0.2, 0.185],       // Upper Rear corner
  q_p4_topFront = [-0.1, 0.185],     // Upper Front corner
  quarterGlassThickness = 0.012,

  // 7. Official Rear Quarter Window Positional Offsets
  quarterGlassOffsetY = 1.18,        // Slides window up to greenhouse height
  quarterGlassOffsetZ = -1.30,       // Slides window back to the C-D pillar gap

  // 8. Lateral Flush Alignment & Animation Angles (in Radians)
  flushXOffset = 0.012,              // Slides doors inward to sit flush with body panels
  frontOpenAngle = 0,                // Front door swing angle (0 = closed)
  backOpenAngle = 0,                 // Back door swing angle (0 = closed)
  tailgateOpenAngle = 0,             // Tailgate lift angle (0 = closed)
}) {
  const halfWidth = (SUV_CONFIG.bodyHalfWidth || 0.78) - flushXOffset;

  // Hinge Z-Pivots
  const frontHingeZ = f_p5_beltlineFront[0]; 
  const backHingeZ = r_p1_bottomFront[0];
  const tailgateHingeY = tailgateRoofY; 
  const tailgateHingeZ = tailgateRoofZ; 

  // ============================================================
  // FRONT DOOR GEOMETRIES
  // ============================================================
  const frontDoorGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(f_p1_bottomFront[0], f_p1_bottomFront[1]);
    shape.lineTo(f_p2_bottomRear[0], f_p2_bottomRear[1]);
    shape.lineTo(f_p3_topRear[0], f_p3_topRear[1]);
    shape.lineTo(f_p4_topFront[0], f_p4_topFront[1]);
    shape.lineTo(f_p5_beltlineFront[0], f_p5_beltlineFront[1]);
    shape.closePath();

    const windowHole = new THREE.Path();
    windowHole.moveTo(0.70, 1.01);   
    windowHole.lineTo(0.31, 1.43);   
    windowHole.lineTo(-0.12, 1.41); 
    windowHole.lineTo(-0.12, 1.01); 
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

  const frontWindowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.71, 1.00);   
    shape.lineTo(0.32, 1.44);   
    shape.lineTo(-0.13, 1.42);  
    shape.lineTo(-0.13, 1.00);  
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelEnabled: false,
    });
  }, []);

  // ============================================================
  // REAR PASSENGER DOOR GEOMETRIES
  // ============================================================
  const rearDoorGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(r_p1_bottomFront[0], r_p1_bottomFront[1]);
    shape.lineTo(r_p2_bottomRear[0], r_p2_bottomRear[1]);
    shape.lineTo(r_p3_archCurve[0], r_p3_archCurve[1]);
    shape.lineTo(r_p4_topRear[0], r_p4_topRear[1]);
    shape.lineTo(r_p5_topFront[0], r_p5_topFront[1]);
    shape.closePath();

    const windowHole = new THREE.Path();
    windowHole.moveTo(-0.26, 1.01);   
    windowHole.lineTo(-0.26, 1.41);   
    windowHole.lineTo(-1.01, 1.36);  
    windowHole.lineTo(-1.01, 1.01);  
    windowHole.closePath();

    shape.holes.push(windowHole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: rearDoorThickness,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.005,
      bevelSegments: 2,
    });
  }, [r_p1_bottomFront, r_p2_bottomRear, r_p3_archCurve, r_p4_topRear, r_p5_topFront, rearDoorThickness]);

  const rearWindowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.25, 1.00);   
    shape.lineTo(-0.25, 1.42);   
    shape.lineTo(-1.02, 1.37);   
    shape.lineTo(-1.02, 1.00);   
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelEnabled: false,
    });
  }, []);

  // ============================================================
  // REAR QUARTER WINDOW GEOMETRY
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
      <group position={[-halfWidth, 0, frontHingeZ]} rotation={[0, frontOpenAngle, 0]}>
        <group position={[0, 0, -frontHingeZ]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Corrected Outer Handle Position (Placed on exterior sheet metal face) */}
          <mesh position={[-0.10, 1.01, frontDoorThickness + 0.005]} castShadow>
            <boxGeometry args={[0.08, 0.024, 0.015]} />
            <meshStandardMaterial color={trimColor} roughness={0.8} />
          </mesh>
          
          {/* Hinges */}
          <mesh position={[0.81, 0.60, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.81, 0.90, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          FRONT RIGHT DOOR & WINDOW
         ============================================================ */}
      <group position={[halfWidth, 0, frontHingeZ]} rotation={[0, -frontOpenAngle, 0]}>
        <group position={[0, 0, -frontHingeZ]} rotation={[0, -Math.PI / 2, 0]} scale={[1, 1, -1]}>
          <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Corrected Outer Handle Position */}
          <mesh position={[-0.10, 1.01, frontDoorThickness + 0.005]} castShadow>
            <boxGeometry args={[0.08, 0.024, 0.015]} />
            <meshStandardMaterial color={trimColor} roughness={0.8} />
          </mesh>
          
          {/* Hinges */}
          <mesh position={[0.81, 0.60, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.81, 0.90, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          REAR passenger LEFT DOOR & WINDOW
         ============================================================ */}
      <group position={[-halfWidth, 0, backHingeZ]} rotation={[0, backOpenAngle, 0]}>
        <group position={[0, 0, -backHingeZ]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow geometry={rearDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, rearDoorThickness / 2]} geometry={rearWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Corrected Outer Handle Position */}
          <mesh position={[-0.98, 1.01, rearDoorThickness + 0.005]} castShadow>
            <boxGeometry args={[0.08, 0.024, 0.015]} />
            <meshStandardMaterial color={trimColor} roughness={0.8} />
          </mesh>
          
          {/* Hinges */}
          <mesh position={[-0.22, 0.60, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.22, 0.90, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          REAR passenger RIGHT DOOR & WINDOW
         ============================================================ */}
      <group position={[halfWidth, 0, backHingeZ]} rotation={[0, -backOpenAngle, 0]}>
        <group position={[0, 0, -backHingeZ]} rotation={[0, -Math.PI / 2, 0]} scale={[1, 1, -1]}>
          <mesh castShadow receiveShadow geometry={rearDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, rearDoorThickness / 2]} geometry={rearWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Corrected Outer Handle Position */}
          <mesh position={[-0.98, 1.01, rearDoorThickness + 0.005]} castShadow>
            <boxGeometry args={[0.08, 0.024, 0.015]} />
            <meshStandardMaterial color={trimColor} roughness={0.8} />
          </mesh>
          
          {/* Hinges */}
          <mesh position={[-0.22, 0.60, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.22, 0.90, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          REAR SIDE TRAPEZOIDAL WINDOWS (C-Pillar to D-Pillar)
         ============================================================ */}
      <mesh 
        position={[-halfWidth + 0.015, quarterGlassOffsetY, quarterGlassOffsetZ]} 
        rotation={[0, -Math.PI / 2, 0]} 
        geometry={quarterGlassGeometry}
        castShadow
      >
        <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
      </mesh>

      <mesh 
        position={[halfWidth - 0.015, quarterGlassOffsetY, quarterGlassOffsetZ]} 
        rotation={[0, -Math.PI / 2, 0]} 
        scale={[1, 1, -1]} 
        geometry={quarterGlassGeometry}
        castShadow
      >
        <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
      </mesh>

      {/* ============================================================
          5TH DOOR: TAILGATE ASSEMBLY
         ============================================================ */}
      <group 
        position={[0, tailgateHingeY, tailgateHingeZ]} 
        rotation={[-tailgateOpenAngle, 0, 0]} 
      >
        <group position={[0, -tailgateHingeY, -tailgateHingeZ]}>
          
          <mesh castShadow receiveShadow position={[0, tailgateLowerMidY, tailgateRearmostZ]}>
            <boxGeometry args={[tailgateWidth, tailgateLowerHeight, tailgateThickness]} />
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} />
          </mesh>

          <mesh position={[0, tailgateLowerMidY + 0.05, tailgateRearmostZ + tailgateThickness / 2 + 0.001]}>
            <boxGeometry args={[0.42, 0.16, 0.005]} />
            <meshStandardMaterial color={trimColor} roughness={0.7} />
          </mesh>

          {/* Corrected Tailgate Grab Handle Position (Moved out of the cabin to the exterior panel) */}
          <mesh position={[0, -0.455, -0.30]} castShadow>
            <boxGeometry args={[0.26, 0.02, 0.015]} />
            <meshStandardMaterial color={trimColor} roughness={0.8} />
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
              <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
            </mesh>
          </group>

          {/* Tailgate Hinges */}
          <mesh position={[-0.45, tailgateRoofY, tailgateRoofZ]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.45, tailgateRoofY, tailgateRoofZ]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>

        </group>
      </group>

    </group>
  );
}