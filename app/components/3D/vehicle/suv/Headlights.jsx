/**
 *
 *                 SUV LIGHTING SYSTEM — FRONT / REAR
 *
 *   [ FRONT PROJECTOR LENS ]              [ REAR LED CLUSTER ]
 *
 *        ╭──────────────────╮              ╭────────────────────╮
 *       /                    \            /                      \
 *      │   ╭──────────────╮   │          │  ╔══╗ ╔══╗            │
 *      │  (   PROJECTOR    )  │          │  ║R ║ ║R ║  ← Brake   │
 *      │   ╰──────────────╯   │          │  ╚══╝ ╚══╝            │
 *      │                      │          │  ╔══╗ ╔══╗            │
 *      │      ◯────────◯      │          │  ║Y ║ ║W ║  ← Signal  │
 *      │       DRL HALO       │          │  ╚══╝ ╚══╝    /Reverse │
 *      │                      │          │                      │
 *      │  ───── LED GUIDE ─── │          │  ══════════════════  │
 *       ╰────────────────────╯            ╰──────────────────────╯
 *
 *       ↑             ↑                    ↑            ↑
 *   Projector       DRL /                 Brake       Signal /
 *      Lens       Position                 Tail       Reverse
 *
 *       FRONT                                      REAR
 *
 */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function Headlights() {
  const [isLit, setIsLit] = useState(false);

  // Raised the headlight vertical center to 0.81m
  const frontLightY = 0.81; 
  const frontLightZ = 1.83; 
  const halfWidth = SUV_CONFIG.bodyHalfWidth || 0.78;
  const frontLightX = halfWidth - 0.11; 

  const materials = useMemo(() => {
    return {
      housingChrome: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.1,
        metalness: 0.9,
      }),
      housingMatteBlack: new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.8,
        metalness: 0.1,
      }),
      // Projector glass glows bright blue-white when lit
      projectorGlass: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        emissive: isLit ? "#bae6fd" : "#000000",
        emissiveIntensity: isLit ? 4.0 : 0.0,
        roughness: 0.05,
        metalness: 0.9,
      }),
      // DRL elements glow bright white when active
      drlGlow: new THREE.MeshStandardMaterial({
        color: isLit ? "#ffffff" : "#94a3b8",
        emissive: isLit ? "#ffffff" : "#000000",
        emissiveIntensity: isLit ? 5.0 : 0.0,
      }),
      lensCoverClear: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.2,
        roughness: 0.02,
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

  const toggleLights = (e) => {
    e.stopPropagation();
    setIsLit((prev) => !prev);
  };

  return (
    <group 
      onClick={toggleLights}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* ============================================================
          SEAMLESSLY ALIGNED FRONT LIGHTING UNITS
         ============================================================ */}
      {[-1, 1].map((side) => (
        <group 
          key={`front-headlight-${side}`} 
          position={[side * frontLightX, frontLightY, frontLightZ]}
          rotation={[0, side * 0.03, 0]}
        >
          {/* Inner Backing Tub */}
          <mesh position={[0, 0, -0.06]} castShadow material={materials.housingMatteBlack}>
            <boxGeometry args={[0.22, 0.22, 0.14]} />
          </mesh>

          {/* Main Outer Front Bezel */}
          <mesh castShadow material={materials.housingMatteBlack}>
            <boxGeometry args={[0.21, 0.22, 0.05]} />
          </mesh>

          {/* Internal Reflector */}
          <mesh position={[0, 0, 0.005]} material={materials.housingChrome}>
            <boxGeometry args={[0.19, 0.20, 0.04]} />
          </mesh>

          {/* Center Focus Projector */}
          <mesh position={[-side * 0.02, 0.01, 0.022]} material={materials.projectorGlass}>
            <sphereGeometry args={[0.032, 16, 16]} />
          </mesh>

          {/* DRL Halo Ring */}
          <mesh position={[-side * 0.02, 0.01, 0.02]} material={materials.drlGlow}>
            <torusGeometry args={[0.038, 0.004, 8, 20]} />
          </mesh>

          {/* Lower Accent LED Strip */}
          <mesh position={[side * 0.01, -0.06, 0.024]} material={materials.drlGlow}>
            <boxGeometry args={[0.13, 0.008, 0.01]} />
          </mesh>

          {/* Clear Outer Lens Cover */}
          <mesh position={[0, 0, 0.026]} material={materials.lensCoverClear}>
            <boxGeometry args={[0.212, 0.222, 0.004]} />
          </mesh>

          {/* 
            Active Light Projection 
            - Simulates local illumination projecting forward when headlights are active
          */}
          {isLit && (
            <pointLight 
              position={[-side * 0.02, 0.01, 0.12]} 
              intensity={6.0} 
              distance={10} 
              decay={1.8} 
              castShadow 
              color="#e0f2fe"
            />
          )}
        </group>
      ))}
    </group>
  );
}