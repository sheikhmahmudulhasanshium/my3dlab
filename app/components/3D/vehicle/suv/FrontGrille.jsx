/**
 *
 *                    SUV FRONT GRILLE / FASCIA
 *
 *        ╭───────────────────────────────────────────────────╮
 *        │                                                   │
 *        │ ═════════════════════════════════════════════════ │
 *        │ ────────────────┐             ┌───────────────── │
 *        │ ────────────────┤     ( S )   ├───────────────── │  <- "S" Emblem
 *        │ ────────────────┘             └───────────────── │
 *        │ ═════════════════════════════════════════════════ │
 *        │ ───────────────────────────────────────────────── │
 *        │ ═════════════════════════════════════════════════ │
 *        │                                                   │
 *        ╰───────────────────────────────────────────────────╯
 *          ↑                                               ↑
 *       Grille Frame                                  Grille Frame
 *
 *              ←────── Grille Opening / Mesh ──────→
 *
 */
"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function FrontGrille() {
  // Dimension Variables matching SUV Fascia boundaries
  const grilleWidth = 1.16;
  const grilleHeight = 0.30;
  const grilleDepth = 0.02;

  // Position coordinates: Front nose of the vehicle
  const grilleY = 0.78; 
  const grilleZ = 1.83; 

  // ============================================================
  // PROCEDURAL HIGH-FIDELITY MATERIALS
  // ============================================================
  const materials = useMemo(() => {
    return {
      chrome: new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.08,
        metalness: 0.95,
      }),
      matteBlack: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.8,
        metalness: 0.2,
      }),
      darkRadiator: new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.6,
        metalness: 0.8,
      }),
      emblemGold: new THREE.MeshStandardMaterial({
        color: "#fbbf24", // Brighter golden tone
        roughness: 0.1,
        metalness: 0.9,
      }),
    };
  }, []);

  // ============================================================
  // ROUNDED OUTER GRILLE FRAME (2D Shape with Cutout Hole)
  // ============================================================
  const frameGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = grilleWidth;
    const h = grilleHeight;
    const r = 0.04; 

    // Outer boundary path
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    // Inner cutout path
    const hole = new THREE.Path();
    const hw = w - 0.04; 
    const hh = h - 0.04;
    const hr = 0.02;

    hole.moveTo(-hw / 2 + hr, -hh / 2);
    hole.lineTo(hw / 2 - hr, -hh / 2);
    hole.quadraticCurveTo(hw / 2, -hh / 2, hw / 2, -hh / 2 + hr);
    hole.lineTo(hw / 2, hh / 2 - hr);
    hole.quadraticCurveTo(hw / 2, hh / 2, hw / 2 - hr, hh / 2);
    hole.lineTo(-hw / 2 + hr, hh / 2);
    hole.quadraticCurveTo(-hw / 2, hh / 2, -hw / 2, hh / 2 - hr);
    hole.lineTo(-hw / 2, -hh / 2 + hr);
    hole.quadraticCurveTo(-hw / 2, -hh / 2, -hw / 2 + hr, -hh / 2);

    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: grilleDepth,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.004,
      bevelSegments: 3,
    });
  }, [grilleWidth, grilleHeight, grilleDepth]);

  // ============================================================
  // STYLIZED CHROME/GOLD "S" TYPOGRAPHIC LOGO GEOMETRY
  // ============================================================
  const sLogoGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.016, 0.022);
    shape.quadraticCurveTo(0.016, 0.034, 0, 0.034);
    shape.quadraticCurveTo(-0.018, 0.034, -0.018, 0.018);
    shape.quadraticCurveTo(-0.018, 0.006, -0.005, 0.002);
    shape.lineTo(0.010, -0.004);
    shape.quadraticCurveTo(0.018, -0.008, 0.018, -0.018);
    shape.quadraticCurveTo(0.018, -0.034, 0, -0.034);
    shape.quadraticCurveTo(-0.016, -0.034, -0.016, -0.022);
    shape.lineTo(-0.008, -0.022);
    shape.quadraticCurveTo(-0.008, -0.024, 0, -0.024);
    shape.quadraticCurveTo(0.008, -0.024, 0.008, -0.018);
    shape.quadraticCurveTo(0.008, -0.012, 0, -0.008);
    shape.lineTo(-0.014, -0.002);
    shape.quadraticCurveTo(-0.018, 0.002, -0.018, 0.018);
    shape.quadraticCurveTo(-0.018, 0.024, 0, 0.024);
    shape.quadraticCurveTo(0.008, 0.024, 0.008, 0.022);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelThickness: 0.0025,
      bevelSize: 0.0015,
      bevelSegments: 2,
    });
  }, []);

  const numVerticalMeshWires = 16;
  const numHorizontalMeshWires = 6;
  const horizontalSlatWidth = 0.44; 

  return (
    <group position={[0, grilleY, grilleZ]}>
      
      {/* 1. Outer Molded Chrome Bezel/Frame */}
      <mesh castShadow receiveShadow geometry={frameGeometry} material={materials.chrome} />

      {/* 2. Matte Black Backing Screen */}
      <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
        <boxGeometry args={[grilleWidth - 0.04, grilleHeight - 0.04, 0.005]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>

      {/* 3. Structural Inner Wire Grid (Protective Mesh) */}
      <group position={[0, 0, -0.008]}>
        {/* Vertical Wire Array */}
        {Array.from({ length: numVerticalMeshWires }).map((_, i) => {
          const step = (grilleWidth - 0.06) / (numVerticalMeshWires - 1);
          const posX = - (grilleWidth - 0.06) / 2 + i * step;
          return (
            <mesh key={`v-wire-${i}`} position={[posX, 0, 0]} castShadow material={materials.matteBlack}>
              <boxGeometry args={[0.004, grilleHeight - 0.04, 0.004]} />
            </mesh>
          );
        })}

        {/* Horizontal Wire Array */}
        {Array.from({ length: numHorizontalMeshWires }).map((_, i) => {
          const step = (grilleHeight - 0.06) / (numHorizontalMeshWires - 1);
          const posY = - (grilleHeight - 0.06) / 2 + i * step;
          return (
            <mesh key={`h-wire-${i}`} position={[0, posY, 0]} castShadow material={materials.matteBlack}>
              <boxGeometry args={[grilleWidth - 0.04, 0.004, 0.004]} />
            </mesh>
          );
        })}
      </group>

      {/* ============================================================
          4. CHROMED HORIZONTAL GRILLE SLATS
         ============================================================ */}
      <group position={[0, 0, 0.005]}>
        
        {/* UPPER SLAT ROW */}
        <mesh position={[-horizontalSlatWidth / 2 - 0.08, 0.08, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.012, 0.015]} />
        </mesh>
        <mesh position={[horizontalSlatWidth / 2 + 0.08, 0.08, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.012, 0.015]} />
        </mesh>

        {/* MIDDLE SLAT ROW */}
        <mesh position={[-horizontalSlatWidth / 2 - 0.08, 0, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.016, 0.015]} />
        </mesh>
        <mesh position={[horizontalSlatWidth / 2 + 0.08, 0, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.016, 0.015]} />
        </mesh>

        {/* LOWER SLAT ROW */}
        <mesh position={[-horizontalSlatWidth / 2 - 0.08, -0.08, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.012, 0.015]} />
        </mesh>
        <mesh position={[horizontalSlatWidth / 2 + 0.08, -0.08, 0.005]} castShadow material={materials.chrome}>
          <boxGeometry args={[horizontalSlatWidth, 0.012, 0.015]} />
        </mesh>

      </group>

      {/* ============================================================
          5. STYLIZED CENTRAL "S" EMBLEM ASSEMBLY (PUSHED FORWARD & SCALED)
         ============================================================ */}
      <group position={[0, 0, 0.032]}>
        {/* Outer Chrome Boundary Ring (Enlarged for presence) */}
        <mesh castShadow material={materials.chrome}>
          <torusGeometry args={[0.072, 0.007, 16, 32]} />
        </mesh>
        
        {/* Matte Black Inner Shield Backing Plate */}
        <mesh position={[0, 0, -0.003]} rotation={[Math.PI / 2, 0, 0]} castShadow material={materials.matteBlack}>
          <cylinderGeometry args={[0.065, 0.065, 0.004, 32]} />
        </mesh>

        {/* 3D Extruded Gold "S" Logo (Scaled up 1.8x for high legibility) */}
        <group scale={[1.8, 1.8, 1.8]} position={[0, 0, 0.002]}>
          <mesh geometry={sLogoGeometry} material={materials.emblemGold} castShadow />
        </group>
      </group>

      {/* ============================================================
          6. BEHIND-THE-GRILLE RADIATOR CORE
         ============================================================ */}
      <group position={[0, 0, -0.04]}>
        {/* Radiator Core Backplate */}
        <mesh castShadow receiveShadow material={materials.darkRadiator}>
          <boxGeometry args={[grilleWidth - 0.06, grilleHeight - 0.06, 0.015]} />
        </mesh>

        {/* Vertical Condenser Cooling Fins */}
        {Array.from({ length: 18 }).map((_, i) => {
          const step = (grilleWidth - 0.12) / 17;
          const posX = - (grilleWidth - 0.12) / 2 + i * step;
          return (
            <mesh key={`rad-fin-${i}`} position={[posX, 0, 0.008]} castShadow>
              <boxGeometry args={[0.005, grilleHeight - 0.08, 0.003]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          );
        })}
      </group>

    </group>
  );
}