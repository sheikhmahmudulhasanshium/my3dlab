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
// 5x3 VOXEL ART ALPHANUMERIC FONT DEFINITIONS
// ============================================================
const FONT_5X3 = {
  "A": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "B": [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0]
  ],
  "C": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  "D": [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0]
  ],
  "E": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ],
  "F": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
  ],
  "G": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  "H": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "I": [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
  ],
  "J": [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
  ],
  "K": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "L": [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  "M": [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "N": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "O": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  "P": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
  ],
  "Q": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1]
  ],
  "R": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "S": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  "T": [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  "U": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  "V": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0]
  ],
  "W": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1]
  ],
  "X": [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 1]
  ],
  "Y": [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  "Z": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  "6": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  "9": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]
};

// ============================================================
// SINGLE CHAR RENDERING COMPONENT
// ============================================================
function VoxelChar({ char, position, scaleFactor = 1.0 }) {
  const grid = FONT_5X3[char] || FONT_5X3[" "];
  
  // High-contrast deep black for text legibility
  const charColor = "#05050a"; 
  const charRoughness = 0.5;

  const vW = 0.007 * scaleFactor;
  const vH = 0.010 * scaleFactor;
  const vD = 0.005; // Added physical depth for 3D extrusion

  const overlapW = vW * 1.1;
  const overlapH = vH * 1.1;

  const meshes = [];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c] === 1) {
        const x = (c - 1) * vW;
        const y = (2 - r) * vH;

        meshes.push(
          <mesh key={`${r}-${c}`} position={[x, y, vD / 2]} castShadow>
            <boxGeometry args={[overlapW, overlapH, vD]} />
            <meshStandardMaterial color={charColor} roughness={charRoughness} metalness={0.1} />
          </mesh>
        );
      }
    }
  }

  return <group position={position}>{meshes}</group>;
}

// ============================================================
// EMBOSSED ALPHANUMERIC GENERATOR FOR CUSTOM TEXTS
// ============================================================
function EmbossedText({ text }) {
  const uppercaseText = text.toUpperCase();
  const chars = uppercaseText.split("");

  const maxPrintableWidth = 0.22;
  const baseSpacing = 0.032;

  const requestedWidth = (chars.length - 1) * baseSpacing;
  const scaleFactor = requestedWidth > maxPrintableWidth ? maxPrintableWidth / requestedWidth : 1.0;
  const charSpacing = baseSpacing * scaleFactor;

  // Positioned at z=0.0062 to rest cleanly on top of the plate surface (z=0.006)
  return (
    <group position={[0, 0, 0.0062]}>
      {chars.map((char, index) => {
        const posX = (index - (chars.length - 1) / 2) * charSpacing;
        return (
          <VoxelChar
            key={`${char}-${index}`}
            char={char}
            position={[posX, 0, 0]}
            scaleFactor={scaleFactor}
          />
        );
      })}
    </group>
  );
}

// ============================================================
// SINGLE LICENSE PLATE UNIT (Base Frame, Plate, Decals & Text)
// ============================================================
function PlateUnit({ text }) {
  const plateWidth = 0.34;
  const plateHeight = 0.14;
  const borderThickness = 0.012;

  return (
    <group>
      {/* A. Matte Black Outer Bracket/Frame Holder */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[plateWidth + borderThickness, plateHeight + borderThickness, 0.01]} />
        <meshStandardMaterial color="#11151c" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* B. Reflective Matte-White License Plate Sheet */}
      {/* Placed at z=0.003 with depth 0.006, front face is at z=0.006 */}
      <mesh position={[0, 0, 0.003]} castShadow receiveShadow>
        <boxGeometry args={[plateWidth, plateHeight, 0.006]} />
        <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.0} />
      </mesh>

      {/* C. Left-Side Blue European Registration Strip */}
      {/* Placed slightly forward at z=0.0061 to prevent rendering conflicts */}
      <group position={[-0.14, 0, 0.0061]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.04, plateHeight - 0.004, 0.001]} />
          <meshStandardMaterial color="#0b3c9b" roughness={0.4} />
        </mesh>
        {/* Yellow Indicator Dot representing EU stars */}
        <mesh position={[0, -0.02, 0.0006]}>
          <boxGeometry args={[0.012, 0.012, 0.001]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.3} />
        </mesh>
      </group>

      {/* D. Center Registration / Validation Decal stickers */}
      <group position={[-0.1, 0.02, 0.0061]}>
        {/* Upper Decal (Green Validation Sticker) */}
        <mesh castShadow position={[0, 0, 0.0005]}>
          <boxGeometry args={[0.018, 0.018, 0.001]} />
          <meshStandardMaterial color="#15803d" roughness={0.5} />
        </mesh>
        {/* Lower Decal (Orange Region Seal Sticker) */}
        <mesh position={[0, -0.04, 0.0005]} castShadow>
          <boxGeometry args={[0.016, 0.016, 0.001]} />
          <meshStandardMaterial color="#c2410c" roughness={0.5} />
        </mesh>
      </group>

      {/* E. Dynamic Embossed Characters */}
      <EmbossedText text={text} />
    </group>
  );
}

// ============================================================
// MAIN COMPONENT (Renders configurable Front/Rear mounts)
// ============================================================
export default function LicensePlate({ text = "SHIUM" }) {
  const frontBumperY = SUV_CONFIG.frontBumperY ?? 0.48;
  const frontBumperZ = SUV_CONFIG.frontBumperZ ?? 2.01;

  const rearBumperY = SUV_CONFIG.rearBumperY ?? 0.46;
  const rearBumperZ = SUV_CONFIG.rearBumperZ ?? -1.85;

  const frontPlateY = frontBumperY + 0.02;
  const frontPlateZ = frontBumperZ + 0.06 + 0.006;

  const rearPlateY = rearBumperY + 0.03;
  const rearPlateZ = rearBumperZ - 0.07 - 0.006;

  return (
    <group>
      {/* 1. FRONT BUMPER LICENSE PLATE (Facing forward) */}
      <group position={[0, frontPlateY, frontPlateZ]}>
        <PlateUnit text={text} />
      </group>

      {/* 2. REAR BUMPER LICENSE PLATE (Facing backward, rotated 180° around Y) */}
      <group position={[0, rearPlateY, rearPlateZ]} rotation={[0, Math.PI, 0]}>
        <PlateUnit text={text} />
      </group>
    </group>
  );
}