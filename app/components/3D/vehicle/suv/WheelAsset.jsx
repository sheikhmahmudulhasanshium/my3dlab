/**
 *
 *                    SUV — WHEEL ASSEMBLY
 *
 *       FRONT / BRAKE VIEW                    SIDE / WHEEL VIEW
 *
 *          ╭─────────────╮                   ╭───────────────╮
 *       ╭──┤ ║ ║ ║ ║ ║ ║ ├──╮              /  ╲╱╲╱╲╱╲╱╲╱╲╱  \
 *      ╱   │ ║ ║ ║ ║ ║ ║ │   ╲            /   RADIAL TREAD   \
 *     │    │ ║ ║ TREAD ║ │    │           │                   │
 *     │    │ ║ ║ BLOCKS║ │    │           │     ╭───────╮     │
 *     │    │ ║ ║ ║ ║ ║ ║ │    │           │    ╱   ●     ╲    │
 *     │    │     ╭───╮   │    │           │   │  ╱│╲      │   │
 *     │    │    ( DISC )  │    │           │   │ ╱ │ ╲     │   │
 *     │    │     ╰─┬─╯   │    │           │    ╲─┴─┴─╱     │   │
 *      ╲   │    [CALIPER]│   ╱            │     ALLOY       │
 *       ╰──┤             ├──╯              │     SPOKES      │
 *          ╰─────────────╯                  │                 │
 *                                           ╰─────────────────╯
 *
 *       ←─ DISC + CALIPER ─→                 ← DEEP TIRE DEPTH →
 *                                               ↑
 *                                         HUB CAP / CENTER
 *
 */
"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide } from "three";
import { SUV_CONFIG } from "./suv_config";

export default function WheelAsset({ 
  isLeft = true, 
  isFront = true, 
  rotationSpeed = 0.5, 
  steeringAngle = 0 
}) {
  const spinningGroupRef = useRef();

  const outerSign = isLeft ? 1 : -1;
  const rimRadius = SUV_CONFIG.rimDiameter / 2;

  // 18 off-road tread lugs
  const treadCount = 18;
  const treadAngles = Array.from({ length: treadCount }, (_, i) => (i * 2 * Math.PI) / treadCount);

  // 6 heavy utility spokes
  const spokeCount = 6;
  const spokeAngles = Array.from({ length: spokeCount }, (_, i) => (i * 2 * Math.PI) / spokeCount);

  // 12 outer beadlock ring bolts
  const boltCount = 12;
  const boltAngles = Array.from({ length: boltCount }, (_, i) => (i * 2 * Math.PI) / boltCount);

  // 5 central lug nuts
  const lugCount = 5;
  const lugAngles = Array.from({ length: lugCount }, (_, i) => (i * 2 * Math.PI) / lugCount);

  useFrame((state, delta) => {
    // Roll around local X-axis to roll forward/backward cleanly
    if (spinningGroupRef.current && rotationSpeed > 0) {
      spinningGroupRef.current.rotation.x += delta * 10 * rotationSpeed;
    }
  });

  return (
    <group 
      // Handle steering around world Y-axis for front wheels
      rotation={[0, isFront ? steeringAngle : 0, 0]}
    >
      {/* 
        1. STATIC BRAKE ASSEMBLY (Aligned with world coordinate space)
      */}
      <group>
        {/* Brake Disc (Oriented along X-axis) */}
        <mesh castShadow position={[-0.03 * outerSign, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.025, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Brake Caliper */}
        <mesh castShadow position={[-0.05 * outerSign, 0.10, -0.07]}>
          <boxGeometry args={[0.05, 0.10, 0.06]} />
          <meshStandardMaterial color="#dc2626" roughness={0.25} metalness={0.5} />
        </mesh>
      </group>

      {/* 
        2. SPINNING ASSEMBLY (Rolls strictly around local X axle)
      */}
      <group ref={spinningGroupRef}>
        
        {/* Aligns cylinder elements to point sideways (Y-axis cylinder lies along world X-axis) */}
        <group rotation={[0, 0, Math.PI / 2]}>
          
          {/* 
            Main Rubber Tire Tread Band (Hollow Tube)
          */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[
              SUV_CONFIG.wheelRadius, 
              SUV_CONFIG.wheelRadius, 
              SUV_CONFIG.wheelWidth, 
              32, 
              1, 
              true 
            ]} />
            <meshStandardMaterial color="#2d2d30" roughness={0.85} metalness={0.05} side={DoubleSide} />
          </mesh>

          {/* Tire Sidewall Rings (Left & Right) */}
          <mesh castShadow position={[0, SUV_CONFIG.wheelWidth / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[rimRadius, SUV_CONFIG.wheelRadius, 32]} />
            <meshStandardMaterial color="#2d2d30" roughness={0.85} side={DoubleSide} />
          </mesh>

          <mesh castShadow position={[0, -SUV_CONFIG.wheelWidth / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[rimRadius, SUV_CONFIG.wheelRadius, 32]} />
            <meshStandardMaterial color="#2d2d30" roughness={0.85} side={DoubleSide} />
          </mesh>

          {/* Procedural Mud-Terrain Tread Lugs */}
          <group>
            {treadAngles.map((angle, index) => (
              <group key={`tread-${index}`} rotation={[0, angle, 0]}>
                <mesh castShadow position={[SUV_CONFIG.wheelRadius - 0.005, 0.06, 0]}>
                  <boxGeometry args={[0.015, 0.05, 0.06]} />
                  <meshStandardMaterial color="#0f0f12" roughness={0.95} />
                </mesh>
                <mesh castShadow position={[SUV_CONFIG.wheelRadius - 0.005, -0.06, 0]} rotation={[0.12, 0, 0]}>
                  <boxGeometry args={[0.015, 0.05, 0.06]} />
                  <meshStandardMaterial color="#0f0f12" roughness={0.95} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Hollow Rim Barrel (Chrome Silver Finish) */}
          <mesh castShadow>
            <cylinderGeometry args={[rimRadius, rimRadius, SUV_CONFIG.wheelWidth + 0.002, 32, 1, true]} />
            <meshStandardMaterial 
              color="#cbd5e1" 
              roughness={0.15} 
              metalness={0.95} 
              side={DoubleSide} 
            />
          </mesh>

          {/* 
            RIM FACE OUTWARD ACCENT TRIM
            Offset along local Y-axle to create the deep-dish profile.
          */}
          <group position={[0, (SUV_CONFIG.wheelWidth / 2 - 0.045) * outerSign, 0]}>
            
            {/* Polished Chrome Torus Outer Lip */}
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[rimRadius - 0.01, 0.012, 16, 48]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.05} metalness={1.0} />
            </mesh>

            {/* 
              Beadlock Hex Bolt Heads (Arranged radially on the Lip)
              Sitting slightly forward along Y-axle on the rim face lip
            */}
            <group>
              {boltAngles.map((angle, index) => (
                <mesh 
                  key={`bolt-${index}`}
                  castShadow
                  position={[
                    Math.sin(angle) * (rimRadius - 0.015), 
                    0.006 * outerSign, 
                    Math.cos(angle) * (rimRadius - 0.015)
                  ]}
                >
                  <cylinderGeometry args={[0.006, 0.006, 0.01, 6]} /> {/* 6-sided hex head */}
                  <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.95} />
                </mesh>
              ))}
            </group>

            {/* Dark Gunmetal Central Hub Cap */}
            <mesh castShadow>
              <cylinderGeometry args={[SUV_CONFIG.wheelHubRadius, SUV_CONFIG.wheelHubRadius, 0.02, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.85} />
            </mesh>

            {/* 
              Exposed Chrome Lug Nuts (Arranged radially around center cap)
            */}
            <group>
              {lugAngles.map((angle, index) => (
                <mesh 
                  key={`lug-${index}`}
                  castShadow
                  position={[
                    Math.sin(angle) * (SUV_CONFIG.wheelHubRadius + 0.022), 
                    0.012 * outerSign, 
                    Math.cos(angle) * (SUV_CONFIG.wheelHubRadius + 0.022)
                  ]}
                >
                  <cylinderGeometry args={[0.007, 0.007, 0.015, 6]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.05} metalness={1.0} />
                </mesh>
              ))}
            </group>

            {/* 
              Heavy Duty Blocky spokes
              Rotated around local Y-axle.
              Beefy structural box geometry sloped aggressively inward.
            */}
            {spokeAngles.map((angle, index) => (
              <group key={`spoke-${index}`} rotation={[0, angle, 0]}>
                <mesh 
                  castShadow 
                  position={[rimRadius / 2 + 0.01, 0, 0]}
                  rotation={[0, 0, 0.22 * outerSign]} // Aggressive deep-dish slope
                >
                  <boxGeometry args={[rimRadius - 0.02, 0.026, 0.062]} /> {/* Chunky dimensions */}
                  <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />
                </mesh>
              </group>
            ))}

          </group>

        </group>
      </group>
    </group>
  );
}