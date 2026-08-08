/**
 *
 *                    SUV INTERIOR — SIDE PROFILE
 *
 *   [ DASH & WHEEL ]      [ ROW 1 BUCKETS ]       [ ROW 2 BENCH ]
 *
 *          _                     _   _                  _________
 *         (_)                   | | | |                |         |
 *         / \_                  |_| |_|                |         |
 *        |=[___]                |_____|                |_________|
 *        |                     /       \                 /     \
 *        |                    /         \_______________/       \
 *   _____|___________________________________________________________
 *                                                                    <- Floor
 *
 *                            ↑         ↑
 *                         Row 1      Row 2
 *                        Headrests   Headrest
 *
 */
"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

export default function CabinInterior() {
  const cabinWidth = SUV_CONFIG.bodyHalfWidth * 2 - 0.08; // 1.48m
  
  const seatHeightY = SUV_CONFIG.seatHeightY; // 0.82m
  const frontSeatZ = 0.40;  
  const driverSideX = -SUV_CONFIG.seatX; // LH Driver (-0.38m)
  const dashboardZ = 0.82;  
  const steeringWheelZ = 0.58; 
  const shifterZ = 0.48;    

  // Extended Steering column dimensions
  const colLength = 0.72; 
  const colY = (0.96 + 0.52) / 2; 
  const colZ = (0.58 + 1.15) / 2; 
  const colAngle = -Math.atan2(0.96 - 0.52, 1.15 - 0.58); 

  return (
    <group>
      {/* ============================================================
          A. TIERED CABIN FLOOR PAN
         ============================================================ */}
      <group>
        {/* Front Passenger Footwell Floor Pan (Y = 0.48m) */}
        <mesh castShadow receiveShadow position={[0, SUV_CONFIG.tubFloorY, 0.45]}>
          <boxGeometry args={[cabinWidth, 0.02, 0.74]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>

        {/* Center Transmission Tunnel Hump */}
        <mesh castShadow position={[0, SUV_CONFIG.tubFloorY + 0.08, 0.45]}>
          <boxGeometry args={[0.22, 0.14, 0.74]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Rear Passenger Floor Pan (Y = 0.50m) */}
        <mesh castShadow receiveShadow position={[0, SUV_CONFIG.rearFloorY, -0.22]}>
          <boxGeometry args={[cabinWidth, 0.02, 0.60]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>

        {/* Rear Cargo Loading Deck Floor (Y = 0.52m) */}
        <mesh castShadow receiveShadow position={[0, SUV_CONFIG.cargoFloorY, -1.10]}>
          <boxGeometry args={[cabinWidth, 0.02, 1.16]} />
          <meshStandardMaterial color="#09090b" roughness={0.95} />
        </mesh>
      </group>

      {/* ============================================================
          B. REAR INNER CARGO WHEELHOUSES (Protective Well Covers)
          Sits over rear axle Z = -0.95m, covering tire intrusion
         ============================================================ */}
      <group>
        {/* Left Cargo Wheelhouse */}
        <mesh castShadow position={[-cabinWidth / 2 + 0.08, SUV_CONFIG.cargoFloorY + 0.19, SUV_CONFIG.rearAxleZ]}>
          <boxGeometry args={[0.18, 0.38, 0.78]} /> {/* Covers the tire span in trunk */}
          <meshStandardMaterial color="#111115" roughness={0.9} />
        </mesh>

        {/* Right Cargo Wheelhouse */}
        <mesh castShadow position={[cabinWidth / 2 - 0.08, SUV_CONFIG.cargoFloorY + 0.19, SUV_CONFIG.rearAxleZ]}>
          <boxGeometry args={[0.18, 0.38, 0.78]} />
          <meshStandardMaterial color="#111115" roughness={0.9} />
        </mesh>
      </group>

      {/* ============================================================
          C. LEATHER BUCKET SEATS & REAR BENCH
         ============================================================ */}
      {/* Row 1 Buckets */}
      {[-SUV_CONFIG.seatX, SUV_CONFIG.seatX].map((x, i) => (
        <group key={`front-seat-${i}`} position={[x, seatHeightY, frontSeatZ]}>
          <mesh castShadow position={[0, -0.28, 0]}>
            <boxGeometry args={[0.34, 0.06, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
          </mesh>
          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.42, 0.12, 0.44]} />
            <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
          </mesh>
          <mesh castShadow position={[0, -0.095, 0.01]}>
            <boxGeometry args={[0.24, 0.02, 0.40]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.55} />
          </mesh>
          <mesh castShadow position={[0, 0.12, -0.18]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.40, 0.50, 0.10]} />
            <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
          </mesh>
          <mesh castShadow position={[0, 0.12, -0.125]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.22, 0.44, 0.02]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.55} />
          </mesh>
          <mesh castShadow position={[0, 0.42, -0.21]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.08]} />
            <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Row 2 Bench Seat */}
      <group position={[0, seatHeightY + 0.02, SUV_CONFIG.rearSeatZ]}>
        <mesh castShadow position={[0, -0.16, 0]}>
          <boxGeometry args={[cabinWidth - 0.06, 0.12, 0.44]} />
          <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
        </mesh>
        {[-0.38, 0.38].map((xOffset) => (
          <mesh key={xOffset} castShadow position={[xOffset, -0.095, 0.01]}>
            <boxGeometry args={[0.34, 0.02, 0.40]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.55} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.12, -0.18]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[cabinWidth - 0.08, 0.48, 0.10]} />
          <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
        </mesh>
        {[-0.38, 0.38].map((xOffset) => (
          <mesh key={`back-${xOffset}`} castShadow position={[xOffset, 0.12, -0.125]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.32, 0.42, 0.02]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.55} />
          </mesh>
        ))}
        {[-0.42, 0, 0.42].map((xOffset, i) => (
          <mesh key={`headrest-${i}`} castShadow position={[xOffset, 0.40, -0.20]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.08]} />
            <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.15} />
          </mesh>
        ))}
      </group>

      {/* ============================================================
          D. DASHBOARD, ACTIVE GAUGE METERS & MONITOR
         ============================================================ */}
      <group position={[0, 0.96, dashboardZ]}>
        <mesh castShadow>
          <boxGeometry args={[cabinWidth, 0.18, 0.24]} />
          <meshStandardMaterial color="#18181b" roughness={0.85} />
        </mesh>

        <mesh castShadow position={[driverSideX, 0.10, 0.02]}>
          <boxGeometry args={[0.32, 0.08, 0.16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* Gauge meters */}
        <group position={[driverSideX, 0.09, -0.065]} rotation={[-0.12, 0, 0]}>
          <group position={[-0.07, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.005, 16]} />
              <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0, 0.015, -0.003]} rotation={[0, 0, -0.8]}>
              <boxGeometry args={[0.004, 0.03, 0.002]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>

          <group position={[0.07, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.005, 16]} />
              <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0, 0.015, -0.003]} rotation={[0, 0, 0.6]}>
              <boxGeometry args={[0.004, 0.03, 0.002]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        </group>

        <mesh castShadow position={[0, -0.18, 0.02]}>
          <boxGeometry args={[0.22, 0.24, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        <mesh position={[0, -0.12, -0.052]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[0.18, 0.10, 0.004]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      </group>

      {/* ============================================================
          E. STEERING COLUMN & HIGH-DETAIL WHEEL
         ============================================================ */}
      <group>
        <mesh castShadow position={[driverSideX, colY, colZ]} rotation={[colAngle, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, colLength, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>

        <mesh castShadow position={[driverSideX, 0.94, dashboardZ - 0.04]}>
          <boxGeometry args={[0.14, 0.11, 0.22]} />
          <meshStandardMaterial color="#18181b" roughness={0.85} />
        </mesh>

        <mesh position={[driverSideX, 0.53, 1.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.8} />
        </mesh>

        <group position={[driverSideX, 0.96, steeringWheelZ]} rotation={[0.38, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.13, 0.014, 8, 32]} />
            <meshStandardMaterial color="#09090b" roughness={0.95} />
          </mesh>

          <mesh position={[-0.115, 0.05, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[0.115, 0.05, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>

          <mesh castShadow>
            <cylinderGeometry args={[0.034, 0.034, 0.025, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.35} />
          </mesh>

          <mesh position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.004, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
          </mesh>

          {[0, Math.PI * 0.72, -Math.PI * 0.72].map((angle, i) => (
            <mesh key={`spoke-${i}`} castShadow rotation={[0, 0, angle]} position={[0, -0.065, 0]}>
              <boxGeometry args={[0.018, 0.11, 0.008]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ============================================================
          F. GEAR SHIFTERS
         ============================================================ */}
      <group position={[0, SUV_CONFIG.tubFloorY + 0.16, shifterZ]}>
        <group position={[0, 0.04, 0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.055, 0.08, 4, 1, false]} rotation={[0, Math.PI / 4, 0]} />
            <meshStandardMaterial color="#0f0f12" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, 0.08, 0]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.14, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.05} />
          </mesh>
          <group position={[0, 0.15, -0.02]} rotation={[0.15, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshStandardMaterial color="#18181b" roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0.016, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </group>

        <group position={[0, 0.03, -0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.045, 0.06, 4, 1, false]} rotation={[0, Math.PI / 4, 0]} />
            <meshStandardMaterial color="#0f0f12" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, 0.06, 0]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.11, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.05} />
          </mesh>
          <mesh castShadow position={[0, 0.11, -0.035]} rotation={[0.3, 0, 0]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}