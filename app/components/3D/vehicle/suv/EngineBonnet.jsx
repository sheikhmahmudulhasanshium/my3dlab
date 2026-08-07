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
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function EngineBonnet() {
  const bonnetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const bonnetWidth = SUV_CONFIG.bodyHalfWidth * 2; // 1.56m
  const bonnetLength = SUV_CONFIG.bonnetStartZ - SUV_CONFIG.bonnetEndZ; // 0.90m
  const bonnetThickness = 0.012;

  // Base sloped angle when closed
  const closedAngle = 0.155; 

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

    // Angle target: opens upward around X-axis
    const targetAngle = isOpen ? -Math.PI / 4 : closedAngle;

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
          A. INNER STRUCTURAL FENDER WALLS & ENGINE FLOOR
         ======================================================== */}
      <group>
        {/* Left Fender Inner Drop Wall */}
        <mesh position={[-SUV_CONFIG.bodyHalfWidth + 0.05, 0.75, 1.08]} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.72]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* Right Fender Inner Drop Wall */}
        <mesh position={[SUV_CONFIG.bodyHalfWidth - 0.05, 0.75, 1.08]} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.72]} />
          {engineMaterials.engineBlockDark}
        </mesh>

        {/* Engine Compartment Floor Plate (Prevents see-through) */}
        <mesh position={[0, 0.54, 1.085]} castShadow receiveShadow>
          <boxGeometry args={[bonnetWidth - 0.12, 0.03, 0.74]} />
          {engineMaterials.rubber}
        </mesh>
      </group>

      {/* ========================================================
          B. INTERNAL POWERTRAIN & COMPARTMENT PACKAGING
         ======================================================== */}
      <group>
        
        {/* Main Engine block assembly (Z-aligned within bay bounds) */}
        <group position={[0, 0.72, 1.10]}>
          {/* Cast Iron Block */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.28, 0.44]} />
            {engineMaterials.engineBlock}
          </mesh>

          {/* Cylinder Head */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.34, 0.08, 0.40]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* Red Anodized Valve Cover */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.30, 0.05, 0.36]} />
            {engineMaterials.valveCover}
          </mesh>

          {/* Accessory drive pulley */}
          <mesh position={[0, -0.05, 0.225]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 24]} />
            {engineMaterials.brightMetal}
          </mesh>

          {/* Belt */}
          <mesh position={[0, -0.05, 0.245]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.085, 0.01, 8, 24]} />
            {engineMaterials.rubber}
          </mesh>

          {/* Oil Cap */}
          <mesh position={[0.08, 0.25, 0.1]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* Air Filter Box & Intake Manifold Tube */}
        <group position={[SUV_CONFIG.airBoxX, 0.78, SUV_CONFIG.airBoxZ]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.14, 0.20]} />
            {engineMaterials.plastic}
          </mesh>
          {/* Air Filter Lid */}
          <mesh position={[0, 0.075, 0]} castShadow>
            <boxGeometry args={[0.19, 0.02, 0.21]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          {/* Intake Tube connected to Engine */}
          <mesh position={[-0.15, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.16, 12]} />
            {engineMaterials.rubber}
          </mesh>
        </group>

        {/* 12V Lead-Acid Battery */}
        <group position={[-SUV_CONFIG.batteryX, 0.74, SUV_CONFIG.batteryZ]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.14, 0.18]} />
            {engineMaterials.plastic}
          </mesh>
          <mesh position={[0, 0.075, 0]} castShadow>
            <boxGeometry args={[0.17, 0.02, 0.19]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          {/* Pos terminal */}
          <mesh position={[-0.045, 0.09, 0.04]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 10]} />
            {engineMaterials.red}
          </mesh>
          {/* Neg terminal */}
          <mesh position={[0.045, 0.09, 0.04]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 10]} />
            {engineMaterials.aluminum}
          </mesh>
        </group>

        {/* Fuse Box & ECU */}
        <mesh castShadow position={[-SUV_CONFIG.fuseBoxX, 0.76, SUV_CONFIG.fuseBoxZ]}>
          <boxGeometry args={[0.13, 0.12, 0.15]} />
          {engineMaterials.plastic}
        </mesh>

        <mesh castShadow position={[SUV_CONFIG.ecuX, 0.76, SUV_CONFIG.ecuZ]} rotation={[0, -0.15, 0.05]}>
          <boxGeometry args={[0.04, 0.13, 0.14]} />
          {engineMaterials.aluminum}
        </mesh>

        {/* CMS Radiator & Dual Fan Module */}
        <group position={[0, SUV_CONFIG.cmsY, SUV_CONFIG.cmsZ]}>
          {/* Radiator Core */}
          <mesh castShadow>
            <boxGeometry args={[0.82, 0.32, 0.04]} />
            {engineMaterials.aluminum}
          </mesh>
          {/* Core fins */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.76, 0.28, 0.01]} />
            {engineMaterials.engineBlockDark}
          </mesh>
          {/* Radiator Cap */}
          <mesh position={[0.32, 0.175, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.015, 12]} />
            {engineMaterials.yellow}
          </mesh>

          {/* Dual Fans */}
          {[-0.2, 0.2].map((x, i) => (
            <group key={`fan-${i}`} position={[x, 0, -0.025]}>
              <mesh castShadow>
                <torusGeometry args={[0.11, 0.008, 8, 24]} />
                {engineMaterials.plastic}
              </mesh>
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.025, 12]} />
                {engineMaterials.engineBlockDark}
              </mesh>
            </group>
          ))}
        </group>

        {/* Coolant Expansion Reservoir */}
        <group position={[SUV_CONFIG.coolantReservoirX, 0.72, SUV_CONFIG.coolantReservoirZ]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.11, 12]} />
            {engineMaterials.blue}
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
            {engineMaterials.yellow}
          </mesh>
        </group>

        {/* Brake Vacuum Booster & Reservoir */}
        <group position={[-SUV_CONFIG.brakeBoosterX, 0.82, SUV_CONFIG.brakeBoosterZ]} rotation={[0, Math.PI / 2, 0]}>
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
          C. ANIMATED CENTRAL BONNET (Lifts/Pivots from wind cowl)
          Pivots cleanly at SUV_CONFIG.bonnetEndZ (0.72m)
          ======================================================== */}
      <group
        ref={bonnetRef}
        position={[0, SUV_CONFIG.bonnetY, SUV_CONFIG.bonnetEndZ]} // Pivot mounted at rear hinge line
        onClick={toggleBonnet}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* 
          Outer Sheet-Metal Panel 
          Offset forward by half of the bonnet's length (0.45m)
        */}
        <group position={[0, -0.06, bonnetLength / 2]}>
          {/* Main outer hood skin */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[bonnetWidth, 0.04, bonnetLength]} />
            {engineMaterials.bodyPaint}
          </mesh>

          {/* Underhood reinforcement insulation */}
          <mesh position={[0, -0.025, 0]} castShadow>
            <boxGeometry args={[bonnetWidth - 0.12, 0.015, bonnetLength - 0.12]} />
            {engineMaterials.engineBlockDark}
          </mesh>

          {/* Left Inner Hinge Brackets */}
          <mesh position={[-bonnetWidth / 2 + 0.1, -0.055, -bonnetLength / 2 + 0.08]} castShadow>
            <boxGeometry args={[0.025, 0.05, 0.12]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* Right Inner Hinge Brackets */}
          <mesh position={[bonnetWidth / 2 - 0.1, -0.055, -bonnetLength / 2 + 0.08]} castShadow>
            <boxGeometry args={[0.025, 0.05, 0.12]} />
            {engineMaterials.aluminum}
          </mesh>

          {/* Front Bonnet Latch Loop */}
          <mesh position={[0, -0.04, bonnetLength / 2 - 0.04]} castShadow>
            <boxGeometry args={[0.08, 0.03, 0.02]} />
            {engineMaterials.brightMetal}
          </mesh>
        </group>
      </group>
    </group>
  );
}