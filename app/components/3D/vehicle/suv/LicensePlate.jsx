/**
 *
 *                  SUV — LICENSE PLATE MOUNTING
 *
 *             FRONT                              REAR
 *
 *        ╭────────────────╮                ╭────────────────╮
 *        │                │                │                │
 *        │  ┌──────────┐  │                │  ┌──────────┐  │
 *        │  │ LICENSE  │  │                │  │ LICENSE  │  │
 *        │  │  PLATE   │  │                │  │  PLATE   │  │
 *        │  └──────────┘  │                │  └──────────┘  │
 *        │                │                │                │
 *        ╰────────────────╯                ╰────────────────╯
 *             ↑                                  ↑
 *        Front Fascia                        Rear Fascia
 *          / Bumper                            / Bumper
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

// ============================================================
// EMBOSSED 3D ALPHANUMERIC CHARACTERS ("S U V")
// ============================================================
function EmbossedText() {
  const charColor = "#0f172a"; // Semi-gloss black
  const charRoughness = 0.4;

  return (
    <group position={[0, 0, 0.0035]}>
      
      {/* ────────────────── LETTER "S" (Centered at X = -0.06) ────────────────── */}
      <group position={[-0.06, 0, 0]}>
        {/* Top horizontal bar */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.024, 0.005, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Upper Left vertical hook */}
        <mesh position={[-0.009, 0.011, 0]} castShadow>
          <boxGeometry args={[0.006, 0.013, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Middle horizontal bar */}
        <mesh position={[0, 0.002, 0]} castShadow>
          <boxGeometry args={[0.024, 0.005, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Lower Right vertical hook */}
        <mesh position={[0.009, -0.007, 0]} castShadow>
          <boxGeometry args={[0.006, 0.013, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Bottom horizontal bar */}
        <mesh position={[0, -0.016, 0]} castShadow>
          <boxGeometry args={[0.024, 0.005, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
      </group>

      {/* ────────────────── LETTER "U" (Centered at X = 0.00) ────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Left upright */}
        <mesh position={[-0.009, 0.002, 0]} castShadow>
          <boxGeometry args={[0.006, 0.041, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Right upright */}
        <mesh position={[0.009, 0.002, 0]} castShadow>
          <boxGeometry args={[0.006, 0.041, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Bottom curve bar */}
        <mesh position={[0, -0.016, 0]} castShadow>
          <boxGeometry args={[0.024, 0.005, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
      </group>

      {/* ────────────────── LETTER "V" (Centered at X = 0.06) ────────────────── */}
      <group position={[0.06, 0, 0]}>
        {/* Left slanted leg */}
        <mesh position={[-0.006, 0.002, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.006, 0.041, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
        {/* Right slanted leg */}
        <mesh position={[0.006, 0.002, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.006, 0.041, 0.004]} />
          <meshStandardMaterial color={charColor} roughness={charRoughness} />
        </mesh>
      </group>

    </group>
  );
}

// ============================================================
// SINGLE LICENSE PLATE UNIT (Base Frame, Plate, Decals & Text)
// ============================================================
function PlateUnit({ borderScale = 1.0 }) {
  const plateWidth = 0.34;
  const plateHeight = 0.14;
  const borderThickness = 0.012;

  return (
    <group>
      {/* A. Matte Black Outer Bracket/Frame Holder */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[plateWidth + borderThickness, plateHeight + borderThickness, 0.01]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* B. Reflective Gloss-White License Plate Sheet */}
      <mesh position={[0, 0, 0.003]} castShadow receiveShadow>
        <boxGeometry args={[plateWidth, plateHeight, 0.006]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* C. Left-Side Blue European Registration Strip */}
      <group position={[-0.14, 0, 0.0065]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.04, plateHeight - 0.004, 0.001]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
        </mesh>
        {/* Tiny Yellow Star cluster indicator (Represented by a small gold dot) */}
        <mesh position={[0, -0.02, 0.001]}>
          <boxGeometry args={[0.012, 0.012, 0.001]} />
          <meshStandardMaterial color="#eab308" metalness={0.5} />
        </mesh>
      </group>

      {/* D. Center Registration / Validation Decal stickers */}
      <group position={[-0.02, 0.02, 0.0065]}>
        {/* Upper Decal (Green Validation Sticker) */}
        <mesh castShadow>
          <boxGeometry args={[0.018, 0.018, 0.001]} />
          <meshStandardMaterial color="#16a34a" roughness={0.5} />
        </mesh>
        {/* Lower Decal (Orange Region Seal Sticker) */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <boxGeometry args={[0.016, 0.016, 0.001]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>
      </group>

      {/* E. 3D Embossed Alphanumeric Characters */}
      <EmbossedText />

    </group>
  );
}

// ============================================================
// MAIN COMPONENT (Renders both Front and Rear Mountings)
// ============================================================
export default function LicensePlate() {
  // Front coordinates derived from configuration
  const frontPlateY = SUV_CONFIG.frontBumperY || 0.55;
  const frontPlateZ = (SUV_CONFIG.frontBumperZ || 2.03) + 0.01; // Offset forward to prevent Z-fighting

  // Rear coordinates derived from configuration
  const rearPlateY = (SUV_CONFIG.rearBumperY || 0.52) + 0.02; // Mounted slightly above bottom valance
  const rearPlateZ = (SUV_CONFIG.rearBumperZ || -1.87) - 0.01; // Offset rearward to prevent Z-fighting

  return (
    <group>
      {/* 1. FRONT BUMPER LICENSE PLATE (Facing directly forward) */}
      <group position={[0, frontPlateY, frontPlateZ]}>
        <PlateUnit />
      </group>

      {/* 2. REAR BUMPER LICENSE PLATE (Facing directly backward, rotated 180° around Y) */}
      <group position={[0, rearPlateY, rearPlateZ]} rotation={[0, Math.PI, 0]}>
        <PlateUnit />
      </group>
    </group>
  );
}