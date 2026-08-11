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
 * Shape Geometry Specifications:
 * Front Door (Trapezoid):
 *  /'''''''''''''''''''|
 *  /                   |
 *  /--------------|    |
 *  |         ------    |
 *  |_______________|
 * 
 * Rear Door:
 *  /''''''''''''''''''''''''/
 *  /                        /
 *  '''''''''''''''''''''''''
 *  |        ----            |
 *  |              /''''''''''
 *  |............/
 *
 */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

// ============================================================
// EXTERIOR GRAB HANDLE ASSEMBLY (EXACT GEOMETRY)
// ============================================================
function SideDoorHandle({ x, y, z, trimColor, isRight = false }) {
  // Dynamically flip the pull bar offset to cancel out the parent's scale={[1, 1, -1]} mirroring
  const zOffset = isRight ? -0.02 : 0.02;

  return (
    <group position={[x, y, z]}>
      {/* Left Mounting Bracket */}
      <mesh position={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.015, 0.02, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Right Mounting Bracket */}
      <mesh position={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.015, 0.02, 0.015]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Pull Bar */}
      <mesh position={[0, 0, zOffset]} castShadow>
        <boxGeometry args={[0.11, 0.016, 0.012]} />
        <meshStandardMaterial color={trimColor} roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}

export default function Doors({
  // 1. Root Group Transform Overrides
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],

  // 2. Global Aesthetics (Defaulted to match body panels and trim)
  doorColor = "#475569",           
  windowColor = "#0f172a",         
  trimColor = "#1e293b",           

  // 3. Front Door Coordinates [Z, Y]
  f_p1_bottomFront = [0.81, 0.52],   
  f_p2_bottomRear = [-0.16, 0.52],   
  f_p3_topRear = [-0.16, 1.45],      
  f_p4_topFront = [0.35, 1.47],      
  f_p5_beltlineFront = [0.81, 0.97], 
  frontDoorThickness = 0.04,

  // 4. Rear Passenger Door Coordinates [Z, Y]
  r_p1_bottomFront = [-0.22, 0.52],  
  r_p2_bottomRear = [-0.78, 0.52],   
  r_p3_archCurve = [-1.05, 0.84],    // Raised 20% higher (from 0.78 to 0.84)
  r_p4_topRear = [-1.05, 1.40],      
  r_p5_topFront = [-0.22, 1.45],     
  rearDoorThickness = 0.04,

  // 5. Tailgate Coordinates [Z, Y]
  tailgateWidth = 1.48,
  tailgateLowerSillY = 0.56,
  tailgateBeltlineY = 0.97,
  tailgateRoofY = 1.38,
  tailgateRearmostZ = -1.71,
  tailgateRoofZ = -1.38,
  tailgateThickness = 0.04,

  // 6. Rear Quarter Window Polygon Coordinates [Z, Y]
  q_p1_bottomFront = [-0.36, -0.185], 
  q_p2_bottomRear = [0.25, -0.185],  
  q_p3_topRear = [0.2, 0.185],       
  q_p4_topFront = [-0.1, 0.185],     
  quarterGlassThickness = 0.012,

  // 7. Rear Quarter Window Positional Offsets
  quarterGlassOffsetY = 1.18,        
  quarterGlassOffsetZ = -1.30,       

  // 8. Lateral Flush Alignment
  flushXOffset = 0.012,              
}) {
  const halfWidth = (SUV_CONFIG.bodyHalfWidth || 0.78) - flushXOffset;

  // Hinge Pivots
  const frontHingeZ = f_p5_beltlineFront[0]; 
  const backHingeZ = r_p1_bottomFront[0];
  const tailgateHingeY = tailgateRoofY; 
  const tailgateHingeZ = tailgateRoofZ; 

  // ============================================================
  // INTERACTIVE STATES (Defaults to Closed)
  // ============================================================
  const [isFLOpen, setIsFLOpen] = useState(false);
  const [isFROpen, setIsFROpen] = useState(false);
  const [isRLOpen, setIsRLOpen] = useState(false);
  const [isRROpen, setIsRROpen] = useState(false);
  const [isTailgateOpen, setIsTailgateOpen] = useState(false);

  // References for rotational updates
  const flRef = useRef(null);
  const frRef = useRef(null);
  const rlRef = useRef(null);
  const rrRef = useRef(null);
  const tailgateRef = useRef(null);

  // ============================================================
  // ANIMATION LOOPS (WIDER DOOR OPEN ANGLES)
  // ============================================================
  useFrame((state, delta) => {
    const targetFL = isFLOpen ? 1.45 : 0;
    const targetFR = isFROpen ? -1.45 : 0;
    const targetRL = isRLOpen ? 1.40 : 0;
    const targetRR = isRROpen ? -1.40 : 0;
    const targetTailgate = isTailgateOpen ? 1.50 : 0; 

    // Smooth physics-based dampening
    if (flRef.current) {
      flRef.current.rotation.y = THREE.MathUtils.damp(flRef.current.rotation.y, targetFL, 8, delta);
    }
    if (frRef.current) {
      frRef.current.rotation.y = THREE.MathUtils.damp(frRef.current.rotation.y, targetFR, 8, delta);
    }
    if (rlRef.current) {
      rlRef.current.rotation.y = THREE.MathUtils.damp(rlRef.current.rotation.y, targetRL, 8, delta);
    }
    if (rrRef.current) {
      rrRef.current.rotation.y = THREE.MathUtils.damp(rrRef.current.rotation.y, targetRR, 8, delta);
    }
    if (tailgateRef.current) {
      tailgateRef.current.rotation.x = THREE.MathUtils.damp(tailgateRef.current.rotation.x, targetTailgate, 6, delta);
    }
  });

  // Handle Cursor Hover State Cleanup
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  // ============================================================
  // CUSTOM SHAPES FOR INNER LEATHER DOOR CARDS
  // ============================================================
  const frontDoorCardGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.78, 0.54);
    shape.lineTo(-0.13, 0.54);
    shape.lineTo(-0.13, 0.95);
    shape.lineTo(0.78, 0.95);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.003,
      bevelSegments: 2,
    });
  }, []);

  const rearDoorCardGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Dog-leg pattern stepping up to clear the wheel arch
    shape.moveTo(-0.25, 0.54);
    shape.lineTo(-0.75, 0.54);
    shape.lineTo(-0.75, 0.86); // Rises vertically inside the arch notch
    shape.lineTo(-1.02, 0.86); // Steppes horizontally to the rear edge
    shape.lineTo(-1.02, 0.95); // Up to the beltline bottom
    shape.lineTo(-0.25, 0.95); // Across to B-pillar edge
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.003,
      bevelSegments: 2,
    });
  }, []);

  // ============================================================
  // DOOR PANEL GEOMETRIES (REVERTED ORIGINAL CODES)
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
          FRONT LEFT DOOR
         ============================================================ */}
      <group ref={flRef} position={[-halfWidth, 0, frontHingeZ]}>
        <group 
          position={[0, 0, -frontHingeZ]} 
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(e) => { e.stopPropagation(); setIsFLOpen(!isFLOpen); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {/* Main Door Shell */}
          <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Custom Extruded Leather Inner Trim Card */}
          <mesh position={[0, 0, -0.02]} castShadow receiveShadow geometry={frontDoorCardGeometry}>
            <meshStandardMaterial color="#3d2314" roughness={0.8} metalness={0.15} />
          </mesh>

          {/* Front Door Armrest & Inner Release Handle */}
          <group position={[0.25, 0.76, -0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.55, 0.06, 0.04]} />
              <meshStandardMaterial color="#4a2e1b" roughness={0.75} />
            </mesh>
            <mesh position={[0.20, 0.08, -0.002]} castShadow>
              <boxGeometry args={[0.04, 0.018, 0.008]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
            </mesh>
          </group>

          {/* Exact Geometric Grab Handle */}
          <SideDoorHandle x={0.10} y={0.91} z={frontDoorThickness + 0.025} trimColor={trimColor} isRight={false} />
          
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
          FRONT RIGHT DOOR
         ============================================================ */}
      <group ref={frRef} position={[halfWidth, 0, frontHingeZ]}>
        <group 
          position={[0, 0, -frontHingeZ]} 
          rotation={[0, -Math.PI / 2, 0]} 
          scale={[1, 1, -1]}
          onClick={(e) => { e.stopPropagation(); setIsFROpen(!isFROpen); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh castShadow receiveShadow geometry={frontDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, frontDoorThickness / 2]} geometry={frontWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Custom Extruded Leather Inner Trim Card */}
          <mesh position={[0, 0, -0.02]} castShadow receiveShadow geometry={frontDoorCardGeometry}>
            <meshStandardMaterial color="#3d2314" roughness={0.8} metalness={0.15} />
          </mesh>

          {/* Front Door Armrest & Inner Release Handle */}
          <group position={[0.25, 0.76, -0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.55, 0.06, 0.04]} />
              <meshStandardMaterial color="#4a2e1b" roughness={0.75} />
            </mesh>
            <mesh position={[0.20, 0.08, -0.002]} castShadow>
              <boxGeometry args={[0.04, 0.018, 0.008]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
            </mesh>
          </group>

          {/* Exact Geometric Grab Handle */}
          <SideDoorHandle x={0.10} y={0.91} z={frontDoorThickness + 0.025} trimColor={trimColor} isRight={true} />
          
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
          REAR PASSENGER LEFT DOOR
         ============================================================ */}
      <group ref={rlRef} position={[-halfWidth, 0, backHingeZ]}>
        <group 
          position={[0, 0, -backHingeZ]} 
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(e) => { e.stopPropagation(); setIsRLOpen(!isRLOpen); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh castShadow receiveShadow geometry={rearDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, rearDoorThickness / 2]} geometry={rearWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Custom Extruded Leather Inner Trim Card (Notched around Rear Wheel Arch) */}
          <mesh position={[0, 0, -0.02]} castShadow receiveShadow geometry={rearDoorCardGeometry}>
            <meshStandardMaterial color="#3d2314" roughness={0.8} metalness={0.15} />
          </mesh>

          {/* Rear Passenger Armrest & Inner Release Handle */}
          <group position={[-0.60, 0.76, -0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.06, 0.04]} />
              <meshStandardMaterial color="#4a2e1b" roughness={0.75} />
            </mesh>
            <mesh position={[0.15, 0.08, -0.002]} castShadow>
              <boxGeometry args={[0.04, 0.018, 0.008]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
            </mesh>
          </group>

          {/* Exact Geometric Grab Handle */}
          <SideDoorHandle x={-0.78} y={0.91} z={rearDoorThickness + 0.025} trimColor={trimColor} isRight={false} />
          
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
          REAR PASSENGER RIGHT DOOR
         ============================================================ */}
      <group ref={rrRef} position={[halfWidth, 0, backHingeZ]}>
        <group 
          position={[0, 0, -backHingeZ]} 
          rotation={[0, -Math.PI / 2, 0]} 
          scale={[1, 1, -1]}
          onClick={(e) => { e.stopPropagation(); setIsRROpen(!isRROpen); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh castShadow receiveShadow geometry={rearDoorGeometry}>
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, rearDoorThickness / 2]} geometry={rearWindowGeometry}>
            <meshStandardMaterial color={windowColor} roughness={0.1} metalness={0.9} transparent opacity={0.8} depthWrite={false} />
          </mesh>
          
          {/* Custom Extruded Leather Inner Trim Card (Notched around Rear Wheel Arch) */}
          <mesh position={[0, 0, -0.02]} castShadow receiveShadow geometry={rearDoorCardGeometry}>
            <meshStandardMaterial color="#3d2314" roughness={0.8} metalness={0.15} />
          </mesh>

          {/* Rear Passenger Armrest & Inner Release Handle */}
          <group position={[-0.60, 0.76, -0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.06, 0.04]} />
              <meshStandardMaterial color="#4a2e1b" roughness={0.75} />
            </mesh>
            <mesh position={[0.15, 0.08, -0.002]} castShadow>
              <boxGeometry args={[0.04, 0.018, 0.008]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
            </mesh>
          </group>

          {/* Exact Geometric Grab Handle */}
          <SideDoorHandle x={-0.78} y={0.91} z={rearDoorThickness + 0.025} trimColor={trimColor} isRight={true} />
          
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
          REAR SIDE TRAPEZOIDAL WINDOWS
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
        ref={tailgateRef}
        position={[0, tailgateHingeY, tailgateHingeZ]} 
      >
        <group 
          position={[0, -tailgateHingeY, -tailgateHingeZ]}
          onClick={(e) => { e.stopPropagation(); setIsTailgateOpen(!isTailgateOpen); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          
          <mesh castShadow receiveShadow position={[0, tailgateLowerMidY, tailgateRearmostZ]}>
            <boxGeometry args={[tailgateWidth, tailgateLowerHeight, tailgateThickness]} />
            <meshStandardMaterial color={doorColor} roughness={0.4} metalness={0.5} />
          </mesh>

          <mesh position={[0, tailgateLowerMidY + 0.05, tailgateRearmostZ + tailgateThickness / 2 + 0.001]}>
            <boxGeometry args={[0.42, 0.16, 0.005]} />
            <meshStandardMaterial color={trimColor} roughness={0.7} />
          </mesh>

          {/* Corrected Tailgate Grab Handle on Tailgate Exterior Panel */}
          <mesh position={[0, 0.85, tailgateRearmostZ - tailgateThickness / 2 - 0.01]} castShadow>
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