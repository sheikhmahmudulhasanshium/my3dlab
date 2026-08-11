/**
 *
 *                 SUV — BUMPER / FASCIA PACKAGE
 *
 *   FRONT — AERODYNAMIC AIR DAM
 *
 *       ╭───────────────────────────────────────────────╮
 *      /                                                 \
 *     │    ╭─────╮                             ╭─────╮    │
 *     │   (  DRL  )                           (  DRL  )   │
 *     │    ╰─────╯                             ╰─────╯    │
 *     │      ↑                                     ↑      │
 *     │   Fog / DRL                             Fog / DRL │
 *     │                                                   │
 *     │        ╔═══════════════════════════════════╗      │
 *     │       ╱     LOWER MESH / AIR INTAKE        ╲     │
 *     │      ╱═════════════════════════════════════╲    │
 *     │                                                   │
 *     │   ┌────────┐                           ┌────────┐ │
 *     │   │ AIR DAM│                           │ AIR DAM│ │
 *     │   └────────┘                           └────────┘ │
 *      \                                                 /
 *       ╰───────────────────────────────────────────────╯
 *
 *       ←────────── FRONT BUMPER COVER ──────────→
 *
 *
 *   REAR — TOW PLATE / VALANCE SKIRT
 *
 *       ╭───────────────────────────────────────────────╮
 *      /                                                 \
 *     │   ════                                     ════  │
 *     │                                                   │
 *     │    ●         ●                     ●         ●   │
 *     │    ↑         ↑                     ↑         ↑   │
 *     │          PARK ASSIST / ULTRASONIC SENSORS       │
 *     │                                                   │
 *     │       ╔════════════════════════════════╗         │
 *     │       ║       CHROME LOAD SILL STEP    ║         │
 *     │       ╚════════════════════════════════╝         │
 *     │                                                   │
 *     │       ┌─────────────────────────────────┐         │
 *     │       │       TOW PLATE / TOW HITCH     │         │
 *     │       └─────────────────────────────────┘         │
 *     │                                                   │
 *     │    ╭────────╮                         ╭────────╮  │
 *     │    │EXHAUST │                         │EXHAUST │  │
 *     │    │ CUTOUT │                         │ CUTOUT │  │
 *     │    ╰────────╯                         ╰────────╯  │
 *      \                                                 /
 *       ╰───────────────────────────────────────────────╯
 *
 *       ←────────── REAR VALANCE SKIRT ──────────→
 *
 */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function BumperPackage() {
  const [isLit, setIsLit] = useState(false);

  // Base coordinates matching vehicle boundaries
  const frontBumperY = SUV_CONFIG.frontBumperY || 0.48;
  const frontBumperZ = SUV_CONFIG.frontBumperZ || 2.01;

  const rearBumperY = SUV_CONFIG.rearBumperY || 0.46;
  const rearBumperZ = SUV_CONFIG.rearBumperZ || -1.85;

  const bumperWidth = (SUV_CONFIG.bodyHalfWidth || 0.78) * 2; // ~1.56m

  // ============================================================
  // PROCEDURAL MATERIALS
  // ============================================================
  const materials = useMemo(() => {
    return {
      bodyPaint: new THREE.MeshStandardMaterial({
        color: "#475569", // Slate body color
        roughness: 0.3,
        metalness: 0.7,
      }),
      texturedPlastic: new THREE.MeshStandardMaterial({
        color: "#0f172a", // Deep dark matte plastic
        roughness: 0.85,
        metalness: 0.15,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.1,
        metalness: 0.95,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: "#64748b",
        roughness: 0.4,
        metalness: 0.8,
      }),
      // Synchronized glowing behavior on click
      drlGlow: new THREE.MeshStandardMaterial({
        color: isLit ? "#f8fafc" : "#94a3b8",
        emissive: isLit ? "#f1f5f9" : "#000000",
        emissiveIntensity: isLit ? 4.5 : 0.0,
        roughness: 0.1,
      }),
      lensCover: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
      }),
      sensorDark: new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.5,
      }),
    };
  }, [isLit]);

  // Clean up pointer cursor on unmount
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

  const toggleDRLs = (e) => {
    e.stopPropagation();
    setIsLit((prev) => !prev);
  };

  return (
    <group>
      {/* ============================================================
          1. FRONT BUMPER — AERODYNAMIC AIR DAM
         ============================================================ */}
      <group position={[0, frontBumperY, frontBumperZ]}>
        
        {/* A. Main Bumper Cover */}
        <mesh castShadow receiveShadow material={materials.bodyPaint}>
          <boxGeometry args={[bumperWidth, 0.22, 0.12]} />
        </mesh>

        {/* Lower Textured Plastic Trim Skirt */}
        <mesh position={[0, -0.12, -0.01]} castShadow receiveShadow material={materials.texturedPlastic}>
          <boxGeometry args={[bumperWidth + 0.02, 0.08, 0.14]} />
        </mesh>

        {/* B. Center Lower Mesh Air Intake */}
        <group position={[0, -0.04, 0.055]}>
          {/* Recessed backing plate */}
          <mesh castShadow material={materials.texturedPlastic}>
            <boxGeometry args={[0.82, 0.09, 0.01]} />
          </mesh>
          {/* Stylized mesh bars */}
          {[-0.02, 0.02].map((y, idx) => (
            <mesh key={`intake-bar-${idx}`} position={[0, y, 0.006]} material={materials.chrome}>
              <boxGeometry args={[0.80, 0.012, 0.01]} />
            </mesh>
          ))}
        </group>

        {/* C. Aerodynamic Side Air Dams (Splitters) */}
        {[-1, 1].map((side) => (
          <group key={`air-dam-${side}`} position={[side * (bumperWidth / 2 - 0.14), -0.14, 0.02]}>
            <mesh castShadow material={materials.texturedPlastic}>
              <boxGeometry args={[0.18, 0.05, 0.14]} />
            </mesh>
            {/* Deflector Winglet */}
            <mesh 
              position={[side * 0.08, 0.02, 0.02]} 
              rotation={[0, 0, side * 0.2]} 
              material={materials.texturedPlastic}
            >
              <boxGeometry args={[0.02, 0.08, 0.10]} />
            </mesh>
          </group>
        ))}

        {/* D. Integrated Fog Lights / DRL Assemblies */}
        {[-1, 1].map((side) => (
          <group 
            key={`front-drl-${side}`} 
            position={[side * (bumperWidth / 2 - 0.22), 0.02, 0.04]}
            onClick={toggleDRLs}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {/* Bezel */}
            <mesh castShadow material={materials.texturedPlastic}>
              <boxGeometry args={[0.16, 0.06, 0.04]} />
            </mesh>
            {/* Glowing DRL Ribbon */}
            <mesh position={[0, 0, 0.015]} material={materials.drlGlow}>
              <boxGeometry args={[0.12, 0.018, 0.015]} />
            </mesh>
            {/* Outer Protective Transparent Lens */}
            <mesh position={[0, 0, 0.021]} material={materials.lensCover}>
              <boxGeometry args={[0.14, 0.04, 0.01]} />
            </mesh>

            {/* Subtle glow projection on floor/surround when on */}
            {isLit && (
              <pointLight 
                position={[0, 0, 0.08]} 
                intensity={2.5} 
                distance={3} 
                decay={2} 
                color="#f8fafc"
              />
            )}
          </group>
        ))}
      </group>

      {/* ============================================================
          2. REAR BUMPER — TOW PLATE & VALANCE SKIRT
         ============================================================ */}
      <group position={[0, rearBumperY, rearBumperZ]} rotation={[0, Math.PI, 0]}>
        
        {/* A. Main Rear Bumper Facia */}
        <mesh castShadow receiveShadow material={materials.bodyPaint}>
          <boxGeometry args={[bumperWidth, 0.24, 0.14]} />
        </mesh>

        {/* Lower Matte Black Valance Skirt */}
        <mesh position={[0, -0.12, -0.01]} castShadow receiveShadow material={materials.texturedPlastic}>
          <boxGeometry args={[bumperWidth + 0.01, 0.10, 0.16]} />
        </mesh>

        {/* B. Chrome Load Sill Step */}
        <mesh position={[0, 0.11, -0.025]} castShadow receiveShadow material={materials.chrome}>
          <boxGeometry args={[1.05, 0.02, 0.12]} />
        </mesh>

        {/* C. Ultrasonic Park Assist Sensors */}
        {[-0.55, -0.20, 0.20, 0.55].map((posX, idx) => (
          <group key={`park-sensor-${idx}`} position={[posX, 0.02, 0.066]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Sensor Core Ring */}
            <mesh castShadow material={materials.texturedPlastic}>
              <cylinderGeometry args={[0.012, 0.012, 0.008, 12]} />
            </mesh>
            {/* Sensor Transducer Inner Cap */}
            <mesh position={[0, 0.002, 0]} material={materials.sensorDark}>
              <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
            </mesh>
          </group>
        ))}

        {/* D. Heavy Duty Tow Plate and Hitch Receiver */}
        <group position={[0, -0.14, 0.03]}>
          {/* Steel mounting bracket faceplate */}
          <mesh castShadow material={materials.steel}>
            <boxGeometry args={[0.18, 0.08, 0.015]} />
          </mesh>
          {/* Square Receiver Tube Profile */}
          <mesh position={[0, -0.01, 0.035]} castShadow material={materials.steel}>
            <boxGeometry args={[0.06, 0.06, 0.08]} />
          </mesh>
          {/* Receiver Tube Inner Dark Cavity */}
          <mesh position={[0, -0.01, 0.076]} material={materials.texturedPlastic}>
            <boxGeometry args={[0.048, 0.048, 0.004]} />
          </mesh>
          {/* Tow Ball Mount */}
          <group position={[0, -0.03, 0.09]}>
            {/* L-bracket drop tongue */}
            <mesh castShadow material={materials.steel}>
              <boxGeometry args={[0.05, 0.02, 0.10]} />
            </mesh>
            {/* Chrome Hitch Ball */}
            <mesh position={[0, 0.03, 0.035]} castShadow material={materials.chrome}>
              <sphereGeometry args={[0.026, 16, 16]} />
            </mesh>
          </group>
        </group>

        {/* E. Dual Exhaust Pipe Cutouts */}
        {[-1, 1].map((side) => (
          <group key={`exhaust-cutout-${side}`} position={[side * (bumperWidth / 2 - 0.28), -0.14, -0.02]}>
            {/* Semi-circular plastic shroud/casing */}
            <mesh castShadow material={materials.texturedPlastic}>
              <boxGeometry args={[0.18, 0.06, 0.16]} />
            </mesh>
            {/* Recessed void inside */}
            <mesh position={[0, -0.01, 0.01]} material={materials.sensorDark}>
              <boxGeometry args={[0.14, 0.044, 0.155]} />
            </mesh>
          </group>
        ))}

      </group>
    </group>
  );
}