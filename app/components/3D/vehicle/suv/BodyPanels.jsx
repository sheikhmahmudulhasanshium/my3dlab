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
  const bodyWidth = SUV_CONFIG.bodyHalfWidth * 2; // 1.56m

  // Beltline matches lowered bonnet (Y = 0.97m)
  const fenderBeltY = 0.97;

  return (
    <group>
      {/* ============================================================
          A. ROCKER SILL GUARDS (X = ±0.78m, Y = 0.43m)
         ============================================================ */}
      <group>
        <mesh castShadow receiveShadow position={[-SUV_CONFIG.bodyHalfWidth - 0.01, SUV_CONFIG.rockerTrimY, 0.125]}>
          <boxGeometry args={[0.03, 0.08, 1.30]} /> {/* Fits between Z=-0.53m and Z=0.78m */}
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>

        <mesh castShadow receiveShadow position={[SUV_CONFIG.bodyHalfWidth + 0.01, SUV_CONFIG.rockerTrimY, 0.125]}>
          <boxGeometry args={[0.03, 0.08, 1.30]} />
          <meshStandardMaterial color={trimColor} roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          B. L-SHAPED FRONT FENDERS (With Horizontal top shoulders to seal gap)
          Arches opened to Z=0.78m to Z=1.72m for steering clearance
         ============================================================ */}
      {/* LEFT SIDE L-SHAPE FRONT FENDER */}
      <group position={[-SUV_CONFIG.bodyHalfWidth, 0, 0]}>
        {/* L-Shape Horizontal Top Shoulder Plate (Spans from -0.78m inward to -0.62m) */}
        <mesh castShadow receiveShadow position={[0.08, fenderBeltY, 1.35]}>
          <boxGeometry args={[0.16, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Left Vertical Side Fender Drop Wall (Nose side, forward of arch) */}
        <mesh castShadow receiveShadow position={[0, 0.68, 1.785]}>
          <boxGeometry args={[0.02, 0.48, 0.13]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Left Vertical Side Fender Drop Wall (Engine side, behind arch) */}
        <mesh castShadow receiveShadow position={[0, 0.68, 0.965]}>
          <boxGeometry args={[0.02, 0.48, 0.37]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Symmetrical Arch Top Closing Plate (Y = 0.86m, height = 0.18m) */}
        <mesh castShadow position={[0, 0.86, 1.25]}>
          <boxGeometry args={[0.02, 0.18, 0.94]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* RIGHT SIDE L-SHAPE FRONT FENDER */}
      <group position={[SUV_CONFIG.bodyHalfWidth, 0, 0]}>
        {/* L-Shape Horizontal Top Shoulder Plate (Spans from 0.78m inward to 0.62m) */}
        <mesh castShadow receiveShadow position={[-0.08, fenderBeltY, 1.35]}>
          <boxGeometry args={[0.16, 0.02, 1.0]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Right Vertical Side Fender Drop Wall (Nose side) */}
        <mesh castShadow receiveShadow position={[0, 0.68, 1.785]}>
          <boxGeometry args={[0.02, 0.48, 0.13]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Right Vertical Side Fender Drop Wall (Engine side) */}
        <mesh castShadow receiveShadow position={[0, 0.68, 0.965]}>
          <boxGeometry args={[0.02, 0.48, 0.37]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Symmetrical Arch Top Closing Plate (Y = 0.86m, height = 0.18m) */}
        <mesh castShadow position={[0, 0.86, 1.25]}>
          <boxGeometry args={[0.02, 0.18, 0.94]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          C. LEFT & RIGHT REAR PASSENGER / CARGO PANEL SIDE WALLS
          Symmetrical rear wheel arch top plate (Y=0.86m, height=0.18m)
         ============================================================ */}
      {/* LEFT SIDE REAR PANELS */}
      <group position={[-SUV_CONFIG.bodyHalfWidth, 0, 0]}>
        {/* Rear Tail Corner Panel */}
        <mesh castShadow receiveShadow position={[0, 0.76, -1.545]}>
          <boxGeometry args={[0.02, 0.54, 0.35]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Forward Cab Panel */}
        <mesh castShadow receiveShadow position={[0, 0.76, -0.24]}>
          <boxGeometry args={[0.02, 0.54, 0.58]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Symmetrical Rear Arch Top Closing Plate (Aligned with front arch height) */}
        <mesh castShadow position={[0, 0.86, -0.95]}>
          <boxGeometry args={[0.02, 0.18, 0.84]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* RIGHT SIDE REAR PANELS */}
      <group position={[SUV_CONFIG.bodyHalfWidth, 0, 0]}>
        {/* Rear Tail Corner Panel */}
        <mesh castShadow receiveShadow position={[0, 0.76, -1.545]}>
          <boxGeometry args={[0.02, 0.54, 0.35]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Forward Cab Panel */}
        <mesh castShadow receiveShadow position={[0, 0.76, -0.24]}>
          <boxGeometry args={[0.02, 0.54, 0.58]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Symmetrical Rear Arch Top Closing Plate (Aligned with front arch height) */}
        <mesh castShadow position={[0, 0.86, -0.95]}>
          <boxGeometry args={[0.02, 0.18, 0.84]} />
          <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          D. REAR CARGO TAILGATE PANEL (Z = -1.72m)
         ============================================================ */}
      <mesh castShadow receiveShadow position={[0, 0.76, -1.72]}>
        <boxGeometry args={[bodyWidth - 0.04, 0.48, 0.03]} />
        <meshStandardMaterial color={bodyPaintColor} roughness={0.3} metalness={0.7} />
      </mesh>

      <mesh castShadow position={[0, 0.76, -1.736]}>
        <boxGeometry args={[0.34, 0.16, 0.004]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
    </group>
  );
}