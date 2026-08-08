/**
 *
 *                 SUV — OPEN BONNET / ENGINE BAY
 *                       TOP / PACKAGING VIEW
 *
 *                              REAR
 *                               ↑
 *
 *             ┌─────────────────────────────────────┐
 *             │              WINDSCREEN              │
 *             │                                     │
 *             │            FIREWALL / BULKHEAD      │
 *             └─────────────────────────────────────┘
 *
 *     ┌─────────────────────────────────────────────────────┐
 *     │                                                     │
 *     │  ┌──────────────┐                  ┌─────────────┐  │
 *     │  │ BRAKE BOOSTER│                  │ CLUTCH      │  │
 *     │  │      +       │                  │ MASTER      │  │
 *     │  │     BMS      │                  │ CYLINDER    │  │
 *     │  └──────┬───────┘                  └──────┬──────┘  │
 *     │         │                                 │         │
 *     │   Brake Fluid                         Clutch Fluid │
 *     │   Reservoir                           Reservoir    │
 *     │                                                     │
 *     │  ┌───────────┐                     ┌─────────────┐ │
 *     │  │ FUSE /    │                     │    ECU /    │ │
 *     │  │ RELAY BOX │                     │   CONTROL   │ │
 *     │  └───────────┘                     └─────────────┘ │
 *     │                                                     │
 *     │        ┌─────────────────────────────────┐          │
 *     │        │                                 │          │
 *     │        │            ENGINE               │          │
 *     │        │                                 │          │
 *     │        │       ┌───────────────┐         │          │
 *     │        │       │ CYLINDER HEAD │         │          │
 *     │        │       └───────────────┘         │          │
 *     │        │                                 │          │
 *     │        │  Oil Filler          Dipstick   │          │
 *     │        │      ○                   │      │          │
 *     │        │                          └───┐  │          │
 *     │        └──────────────────────────────┼──┘          │
 *     │                                       │             │
 *     │  ┌──────────────┐              ┌─────┴────────┐    │
 *     │  │ AIR FILTER   │─────────────►│    INTAKE     │    │
 *     │  │   / AIR BOX  │              │   MANIFOLD    │    │
 *     │  └──────────────┘              └───────────────┘    │
 *     │                                                     │
 *     │  ┌───────────┐                       ┌───────────┐  │
 *     │  │ 12V       │                       │ WASHER    │  │
 *     │  │ BATTERY   │                       │ RESERVOIR │  │
 *     │  └───────────┘                       └───────────┘  │
 *     │                                                     │
 *     │       ╔═══════════════════════════════════╗         │
 *     │       ║       TRANSMISSION / GEARBOX      ║         │
 *     │       ╚════════════════╤══════════════════╝         │
 *     │                        │                            │
 *     │                     ┌──┴───┐                        │
 *     │                     │PINION│                        │
 *     │                     │  ↓   │                        │
 *     │                 ────┴──────┴─────                    │
 *     │                   STEERING RACK                      │
 *     │                                                     │
 *     │  ┌───────────────┐              ┌───────────────┐  │
 *     │  │ LH STRUT      │              │ RH STRUT      │  │
 *     │  │ TOWER         │              │ TOWER         │  │
 *     │  │      ○        │              │       ○       │  │
 *     │  └───────────────┘              └───────────────┘  │
 *     │                                                     │
 *     │  ─────────────────────────────────────────────────  │
 *     │             FRONT SUBFRAME / CROSSMEMBER            │
 *     │  ─────────────────────────────────────────────────  │
 *     │                                                     │
 *     │       ┌───────────────────────────────────┐         │
 *     │       │       COOLING MODULE — CMS        │         │
 *     │       │                                   │         │
 *     │       │  RADIATOR + CONDENSER + FAN       │         │
 *     │       └───────────────────────────────────┘         │
 *     │                                                     │
 *     └─────────────────────────────────────────────────────┘
 *
 *                         FRONT
 *                          ↓↓↓
 *
 *                 ┌─────────────────────┐
 *                /                       \
 *               /      FRONT BUMPER      \
 *              /___________________________\
 *
 *
 *                   OPEN BONNET
 *
 *                         ╱───────────────╲
 *                        ╱                 ╲
 *                       ╱      BONNET       ╲
 *                      ╱                     ╲
 *                     ╱_______________________╲
 *                         ○             ○
 *                       LH HINGE       RH HINGE
 *
 *                  ─── BONNET LATCH ───
 *                          ↓
 *                     [ LATCH / STRIKER ]
 *
 */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide } from "three";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function EngineBonnet() {
  const bonnetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const bonnetWidth = SUV_CONFIG.bodyHalfWidth * 2; // 1.56m
  const bonnetRearZ = 1.15;
  const bonnetFrontZ = 1.85;
  const bonnetLength = bonnetFrontZ - bonnetRearZ; // 0.70m
  const bonnetThickness = 0.012;

  // Corrected Low-Profile Heights
  const bonnetY = 1.02;      // Windshield base cowl height
  const bonnetLatchY = 0.92; // Front nose height

  // Center coordinate math for sloped alignment
  const centerZ = (bonnetFrontZ + bonnetRearZ) / 2; // 1.50m
  const centerY = (bonnetY + bonnetLatchY) / 2; // 0.97m center height
  const slopeAngle = 0.143; // ~8.2 degrees down-slope

  // ============================================================
  // PROCEDURAL HIGH-FIDELITY MATERIALS
  // ============================================================
  const engineMaterials = useMemo(() => {
    return {
      bodyPaint: (
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
      ),
      engineBlock: (
        <meshStandardMaterial color="#334155" roughness={0.65} metalness={0.75} />
      ),
      engineBlockDark: (
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.4} />
      ),
      aluminum: (
        <meshStandardMaterial color="#cbd5e1" roughness={0.25} metalness={0.9} />
      ),
      brightMetal: (
        <meshStandardMaterial color="#f1f5f9" roughness={0.12} metalness={0.95} />
      ),
      valveCover: (
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.5} />
      ),
      plastic: (
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      ),
      rubber: (
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      ),
      yellow: (
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      ),
      orange: (
        <meshStandardMaterial color="#f97316" roughness={0.3} />
      ),
      blue: (
        <meshStandardMaterial color="#2563eb" roughness={0.4} />
      ),
    };
  }, []);

  // ============================================================
  // BONNET COWL-HINGE ANIMATION
  // ============================================================
  useFrame((state, delta) => {
    if (!bonnetRef.current) return;

    const targetAngle = isOpen ? -Math.PI / 4 : slopeAngle;

    bonnetRef.current.rotation.x = THREE.MathUtils.damp(
      bonnetRef.current.rotation.x,
      targetAngle,
      8,
      delta
    );
  });

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const toggleBonnet = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      {/* ========================================================
          A. INNER STRUCTURAL FENDER WALLS, FLOOR & FIREWALL
         ======================================================== */}
      <group>
        {/* Left Fender Inner Drop Wall */}
        <mesh position={[-SUV_CONFIG.bodyHalfWidth + 0.05, 0.65, centerZ]} castShadow>
          <boxGeometry args={[0.02, 0.25, bonnetLength]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* Right Fender Inner Drop Wall */}
        <mesh position={[SUV_CONFIG.bodyHalfWidth - 0.05, 0.65, centerZ]} castShadow>
          <boxGeometry args={[0.02, 0.25, bonnetLength]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* Engine Compartment Floor Plate */}
        <mesh position={[0, 0.54, centerZ]} castShadow receiveShadow>
          <boxGeometry args={[bonnetWidth - 0.12, 0.02, bonnetLength]} />
          {engineMaterials.rubber}
        </mesh>

        {/* Vertical Firewall/Bulkhead Plate (Mounted at Z=1.15m) */}
        <mesh position={[0, 0.72, bonnetRearZ]} castShadow>
          <boxGeometry args={[bonnetWidth - 0.10, 0.35, 0.02]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* 
          HORIZONTAL STRUCTURAL COWL WIPER TRAY
          Bridges the gap between the Windshield cowl (0.95m) and the Bonnet rear (1.15m)
        */}
        <mesh position={[0, 1.015, 1.05]} castShadow receiveShadow>
          <boxGeometry args={[bonnetWidth, 0.015, 0.20]} /> {/* 20cm deep cowl tray */}
          {engineMaterials.engineBlockDark}
        </mesh>
      </group>

      {/* ========================================================
          B. INTERNAL POWERTRAIN
         ======================================================== */}
      <group>
        <group position={[0, 0.68, 1.50]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.22, 0.44]} />
            {engineMaterials.engineBlock}
          </mesh>

          <mesh position={[0, 0.13, 0]} castShadow>
            <boxGeometry args={[0.34, 0.05, 0.40]} />
            {engineMaterials.aluminum}
          </mesh>

          <mesh position={[0, 0.17, 0]} castShadow>
            <boxGeometry args={[0.30, 0.04, 0.36]} />
            {engineMaterials.valveCover}
          </mesh>

          <mesh position={[0, -0.05, 0.225]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 24]} />
            {engineMaterials.brightMetal}
          </mesh>

          <mesh position={[0, -0.05, 0.245]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.085, 0.01, 8, 24]} />
            {engineMaterials.rubber}
          </mesh>

          <mesh position={[0.08, 0.20, 0.1]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* Air Filter Box */}
        <group position={[SUV_CONFIG.airBoxX, 0.68, 1.35]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.12, 0.20]} />
            {engineMaterials.plastic}
          </mesh>
          <mesh position={[0, 0.065, 0]} castShadow>
            <boxGeometry args={[0.19, 0.015, 0.21]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          <mesh position={[-0.15, 0.01, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.16, 12]} />
            {engineMaterials.rubber}
          </mesh>
        </group>

        {/* 12V Battery */}
        <group position={[-SUV_CONFIG.batteryX, 0.68, 1.35]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.12, 0.18]} />
            {engineMaterials.plastic}
          </mesh>
          <mesh position={[0, 0.065, 0]} castShadow>
            <boxGeometry args={[0.17, 0.015, 0.19]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          <mesh position={[-0.045, 0.075, 0.04]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 10]} />
            {engineMaterials.red}
          </mesh>
          <mesh position={[0.045, 0.075, 0.04]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 10]} />
            {engineMaterials.aluminum}
          </mesh>
        </group>

        {/* Fuse Box & ECU */}
        <mesh castShadow position={[-SUV_CONFIG.fuseBoxX, 0.68, 1.25]}>
          <boxGeometry args={[0.13, 0.10, 0.15]} />
          {engineMaterials.plastic}
        </mesh>

        <mesh castShadow position={[SUV_CONFIG.ecuX, 0.68, 1.22]} rotation={[0, -0.15, 0.05]}>
          <boxGeometry args={[0.04, 0.11, 0.14]} />
          {engineMaterials.aluminum}
        </mesh>

        {/* CMS Radiator */}
        <group position={[0, 0.68, 1.78]}>
          <mesh castShadow>
            <boxGeometry args={[0.82, 0.24, 0.04]} />
            {engineMaterials.aluminum}
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.76, 0.20, 0.01]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          <mesh position={[0.32, 0.135, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.015, 12]} />
            {engineMaterials.yellow}
          </mesh>

          {[-0.2, 0.2].map((x, i) => (
            <group key={`fan-${i}`} position={[x, 0, -0.025]}>
              <mesh castShadow>
                <torusGeometry args={[0.09, 0.008, 8, 24]} />
                {engineMaterials.plastic}
              </mesh>
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
                {engineMaterials.engineBlockDark}
              </mesh>
            </group>
          ))}
        </group>

        {/* Coolant Expansion Reservoir */}
        <group position={[SUV_CONFIG.coolantReservoirX, 0.72, 1.62]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.10, 12]} />
            {engineMaterials.blue}
          </mesh>
          <mesh position={[0, 0.055, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* Brake Vacuum Booster */}
        <group position={[-SUV_CONFIG.brakeBoosterX, 0.76, 1.20]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.05, 20]} />
            {engineMaterials.plastic}
          </mesh>
          <mesh position={[0, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.06, 12]} />
            {engineMaterials.aluminum}
          </mesh>
          <mesh position={[0, 0.04, 0.055]} castShadow>
            <boxGeometry args={[0.03, 0.04, 0.06]} />
            {engineMaterials.aluminum}
          </mesh>
        </group>
      </group>

      {/* ========================================================
          C. ANIMATED CENTRAL BONNET (Pivots at Z=1.15m, Y=1.02m)
          ======================================================== */}
      <group
        ref={bonnetRef}
        position={[0, bonnetY, bonnetRearZ]} // Pivot mounted at Z=1.15m, Y=1.02m
        onClick={toggleBonnet}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <group position={[0, -0.04, bonnetLength / 2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[bonnetWidth, 0.03, bonnetLength]} />
            {engineMaterials.bodyPaint}
          </mesh>

          <mesh position={[0, -0.02, 0]} castShadow>
            <boxGeometry args={[bonnetWidth - 0.12, 0.015, bonnetLength - 0.12]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          <mesh position={[-bonnetWidth / 2 + 0.1, -0.04, -bonnetLength / 2 + 0.08]} castShadow>
            <boxGeometry args={[0.025, 0.035, 0.12]} />
            {engineMaterials.aluminum}
          </mesh>

          <mesh position={[bonnetWidth / 2 - 0.1, -0.04, -bonnetLength / 2 + 0.08]} castShadow>
            <boxGeometry args={[0.025, 0.035, 0.12]} />
            {engineMaterials.aluminum}
          </mesh>

          <mesh position={[0, -0.03, bonnetLength / 2 - 0.04]} castShadow>
            <boxGeometry args={[0.08, 0.02, 0.02]} />
            {engineMaterials.brightMetal}
          </mesh>
        </group>
      </group>
    </group>
  );
}