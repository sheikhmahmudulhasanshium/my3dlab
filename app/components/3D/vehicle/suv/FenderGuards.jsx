/**
 *
 *                 SUV — WHEEL ARCH / FENDER TRIM
 *
 *        [ FRONT ARCH TRIM ]                 [ REAR ARCH TRIM ]
 *
 *             .-----------------.              .-----------------.
 *           .'                   '.           .'                   '.
 *          /      TRIM FLARE       \         /      TRIM FLARE       \
 *         /    _______________      \       /    _______________      \
 *        |   /                 \     |     |   /                 \     |
 *        |  /                   \    |     |  /                   \    |
 *        | |                     |   |     | |                     |   |
 *        | |                     |   |     | |                     |   |
 *         \|_____________________|__/       \|_____________________|__/
 *          \                   /             \                   /
 *           '-----------------'               '-----------------'
 *
 *                    ↑                                   ↑
 *               Wheel Opening                       Wheel Opening
 *
 *             ← Fender Flare →                    ← Fender Flare →
 *
 */

"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function FenderGuards() {
  const halfWidth = SUV_CONFIG.bodyHalfWidth || 0.78;
  const axleY = SUV_CONFIG.axleY || 0.31;
  const frontZ = SUV_CONFIG.frontAxleZ || 1.35;
  const rearZ = SUV_CONFIG.rearAxleZ || -1.35;

  // Sits flush against the outer side panels (with a tiny 2mm overlap for seamless merging)
  const guardXOffset = halfWidth + 0.002; 

  // ============================================================
  // PREMIUM LUXURY MATERIALS
  // ============================================================
  const materials = useMemo(() => {
    return {
      bodyColorMolded: new THREE.MeshStandardMaterial({
        color: "#475569", // Matches the sleek body paint color
        roughness: 0.3,   // Matches body panel luster
        metalness: 0.7,
      }),
      innerFenderLiner: new THREE.MeshStandardMaterial({
        color: "#0f172a", // Deep slate/black inner wheel-well protective liner
        roughness: 0.9,
        metalness: 0.05,
      }),
    };
  }, []);

  // ============================================================
  // FLARE UNIT RENDERER (Molded Outer Lip + Inner Shadow Liner)
  // ============================================================
  const renderGuard = (side, keyPrefix, position) => {
    const isLeft = side === -1;
    // Align the crescent lip flat against the side fenders of the vehicle
    const rotationY = isLeft ? -Math.PI / 2 : Math.PI / 2;

    return (
      <group key={keyPrefix} position={position} rotation={[0, rotationY, 0]}>
        
        {/* 
          1. Molded Body-Colored Outer Flare Lip
          - Radius matches the wheel-well cutouts (0.395m)
          - Flattened on its local Z-axis (protrusion) by 0.5 to form a elegant, low-profile crescent
        */}
        <mesh 
          castShadow 
          receiveShadow 
          scale={[1, 1, 0.5]} 
          material={materials.bodyColorMolded}
        >
          <torusGeometry args={[0.395, 0.016, 16, 64, Math.PI]} />
        </mesh>

        {/* 
          2. Recessed Inner Protective Fender Liner (Shadow Layer)
          - Mounted slightly further inside (Z = -0.005)
          - Scaled slightly smaller to sit right inside the wheel-well lip
        */}
        <mesh 
          position={[0, 0, -0.005]} 
          scale={[0.99, 0.99, 0.3]} 
          material={materials.innerFenderLiner}
        >
          <torusGeometry args={[0.388, 0.014, 8, 48, Math.PI]} />
        </mesh>

      </group>
    );
  };

  return (
    <group>
      {/* 1. FRONT INTEGRATED FENDER FLARES */}
      {renderGuard(-1, "front-left-fender", [-guardXOffset, axleY, frontZ])}
      {renderGuard(1, "front-right-fender", [guardXOffset, axleY, frontZ])}

      {/* 2. REAR INTEGRATED FENDER FLARES */}
      {renderGuard(-1, "rear-left-fender", [-guardXOffset, axleY, rearZ])}
      {renderGuard(1, "rear-right-fender", [guardXOffset, axleY, rearZ])}
    </group>
  );
}