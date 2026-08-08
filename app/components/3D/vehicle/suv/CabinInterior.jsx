
/**
 *
 *                    SUV INTERIOR — SIDE PROFILE
 *
 *   [ DASH & WHEEL ]      [ ROW 1 BUCKETS ]       [ ROW 2 BENCH ]
 *
 *          _                     _   _                  _________
 *         (_)                   | | | |                |         |
 *         / \_                  |_| |_|                |_________|
 *        |=[___]                |_____|                |         |
 *        |                     /       \                 /     \
 *        |                    /         \_______________/       \
 *   _____|___________________________________________________________
 *                                                                    <- Floor
 *
 *                            ↑         ↑
 *                         Row 1      Row 2
 *                        Headrests   Headrest
 *
 */"use client";

import React from "react";
import { SUV_CONFIG } from "./suv_config";

export default function CabinInterior() {
  const cabinWidth = SUV_CONFIG.bodyHalfWidth * 2 - 0.08; // 1.48m

  const seatHeightY = SUV_CONFIG.seatHeightY;
  const frontSeatZ = 0.1;

  const driverSideX = -SUV_CONFIG.seatX;

  const dashboardZ = 0.82;
  const steeringWheelZ = 0.58;
  const shifterZ = 0.48;

  // ============================================================
  // STEERING COLUMN
  // The rod is calculated directly between its lower mounting
  // point and the steering wheel center so the two connect.
  // ============================================================

  const colBottomY = 0.52;
  const colBottomZ = 1.15;

  const colTopY = 0.96;
  const colTopZ = steeringWheelZ;

  const colDeltaY = colTopY - colBottomY;
  const colDeltaZ = colTopZ - colBottomZ;

  const colLength = Math.sqrt(
    colDeltaY * colDeltaY +
    colDeltaZ * colDeltaZ
  );

  const colY = (colBottomY + colTopY) / 2;
  const colZ = (colBottomZ + colTopZ) / 2;

  const colAngle = -Math.atan2(
    colBottomZ - colTopZ,
    colTopY - colBottomY
  );

  return (
    <group>
      {/* ============================================================
          A. TIERED CABIN FLOOR PAN
         ============================================================ */}
      <group>
        {/* Front Passenger Footwell Floor Pan */}
        <mesh
          castShadow
          receiveShadow
          position={[0, SUV_CONFIG.tubFloorY, 0.45]}
        >
          <boxGeometry args={[cabinWidth, 0.02, 0.74]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.9}
          />
        </mesh>

        {/* Center Transmission Tunnel Hump */}
        <mesh
          castShadow
          position={[0, SUV_CONFIG.tubFloorY + 0.08, 0.45]}
        >
          <boxGeometry args={[0.22, 0.14, 0.74]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.8}
          />
        </mesh>

        {/* Rear Passenger Floor Pan */}
        <mesh
          castShadow
          receiveShadow
          position={[0, SUV_CONFIG.rearFloorY, -0.22]}
        >
          <boxGeometry args={[cabinWidth, 0.02, 0.60]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.9}
          />
        </mesh>

        {/* Rear Cargo Loading Deck Floor */}
        <mesh
          castShadow
          receiveShadow
          position={[0, SUV_CONFIG.cargoFloorY, -1.10]}
        >
          <boxGeometry args={[cabinWidth, 0.02, 1.16]} />
          <meshStandardMaterial
            color="#09090b"
            roughness={0.95}
          />
        </mesh>
      </group>

      {/* ============================================================
          B. REAR INNER CARGO WHEELHOUSES
         ============================================================ */}
      <group>
        {/* Left Cargo Wheelhouse */}
        <mesh
          castShadow
          position={[
            -cabinWidth / 2 + 0.08,
            SUV_CONFIG.cargoFloorY + 0.19,
            SUV_CONFIG.rearAxleZ
          ]}
        >
          <boxGeometry args={[0.18, 0.38, 0.78]} />
          <meshStandardMaterial
            color="#111115"
            roughness={0.9}
          />
        </mesh>

        {/* Right Cargo Wheelhouse */}
        <mesh
          castShadow
          position={[
            cabinWidth / 2 - 0.08,
            SUV_CONFIG.cargoFloorY + 0.19,
            SUV_CONFIG.rearAxleZ
          ]}
        >
          <boxGeometry args={[0.18, 0.38, 0.78]} />
          <meshStandardMaterial
            color="#111115"
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* ============================================================
          C. LEATHER BUCKET SEATS & REAR BENCH
         ============================================================ */}

      {/* Row 1 Buckets */}
      {[-SUV_CONFIG.seatX, SUV_CONFIG.seatX].map((x, i) => (
        <group
          key={`front-seat-${i}`}
          position={[x, seatHeightY, frontSeatZ]}
        >
          <mesh castShadow position={[0, -0.28, 0]}>
            <boxGeometry args={[0.34, 0.06, 0.38]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.5}
              metalness={0.7}
            />
          </mesh>

          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.42, 0.12, 0.44]} />
            <meshStandardMaterial
              color="#18181b"
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>

          <mesh castShadow position={[0, -0.095, 0.01]}>
            <boxGeometry args={[0.24, 0.02, 0.40]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.55}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.12, -0.18]}
            rotation={[-0.15, 0, 0]}
          >
            <boxGeometry args={[0.40, 0.50, 0.10]} />
            <meshStandardMaterial
              color="#18181b"
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.12, -0.125]}
            rotation={[-0.15, 0, 0]}
          >
            <boxGeometry args={[0.22, 0.44, 0.02]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.55}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.42, -0.21]}
            rotation={[-0.15, 0, 0]}
          >
            <boxGeometry args={[0.18, 0.12, 0.08]} />
            <meshStandardMaterial
              color="#18181b"
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Row 2 Bench Seat */}
      <group
        position={[
          0,
          seatHeightY + 0.02,
          SUV_CONFIG.rearSeatZ
        ]}
      >
        <mesh castShadow position={[0, -0.16, 0]}>
          <boxGeometry args={[cabinWidth - 0.06, 0.12, 0.44]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.35}
              metalness={0.15}
          />
        </mesh>

        {[-0.38, 0.38].map((xOffset) => (
          <mesh
            key={xOffset}
            castShadow
            position={[xOffset, -0.095, 0.01]}
          >
            <boxGeometry args={[0.34, 0.02, 0.40]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.55}
            />
          </mesh>
        ))}

        <mesh
          castShadow
          position={[0, 0.12, -0.18]}
          rotation={[-0.12, 0, 0]}
        >
          <boxGeometry
            args={[cabinWidth - 0.08, 0.48, 0.10]}
          />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>

        {[-0.38, 0.38].map((xOffset) => (
          <mesh
            key={`back-${xOffset}`}
            castShadow
            position={[xOffset, 0.12, -0.125]}
            rotation={[-0.12, 0, 0]}
          >
            <boxGeometry args={[0.32, 0.42, 0.02]} />
            <meshStandardMaterial
              color="#3f3f46"
              roughness={0.55}
            />
          </mesh>
        ))}

        {[-0.42, 0, 0.42].map((xOffset, i) => (
          <mesh
            key={`headrest-${i}`}
            castShadow
            position={[xOffset, 0.40, -0.20]}
            rotation={[-0.12, 0, 0]}
          >
            <boxGeometry args={[0.18, 0.12, 0.08]} />
            <meshStandardMaterial
              color="#18181b"
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>
        ))}
      </group>

      {/* ============================================================
          D. DASHBOARD, ACTIVE GAUGE METERS & MONITOR
         ============================================================ */}
      <group position={[0, 0.96, dashboardZ]}>
        <mesh castShadow>
          <boxGeometry args={[cabinWidth, 0.18, 0.24]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.85}
          />
        </mesh>

        <mesh
          castShadow
          position={[driverSideX, 0.10, 0.02]}
        >
          <boxGeometry args={[0.32, 0.08, 0.16]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
          />
        </mesh>

        {/* Gauge meters */}
        <group
          position={[driverSideX, 0.09, -0.065]}
          rotation={[-0.12, 0, 0]}
        >
          <group position={[-0.07, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry
                args={[0.038, 0.038, 0.005, 16]}
              />
              <meshStandardMaterial
                color="#0891b2"
                emissive="#06b6d4"
                emissiveIntensity={1.5}
              />
            </mesh>

            <mesh
              position={[0, 0.015, -0.003]}
              rotation={[0, 0, -0.8]}
            >
              <boxGeometry args={[0.004, 0.03, 0.002]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>

          <group position={[0.07, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry
                args={[0.038, 0.038, 0.005, 16]}
              />
              <meshStandardMaterial
                color="#0891b2"
                emissive="#06b6d4"
                emissiveIntensity={1.5}
              />
            </mesh>

            <mesh
              position={[0, 0.015, -0.003]}
              rotation={[0, 0, 0.6]}
            >
              <boxGeometry args={[0.004, 0.03, 0.002]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        </group>

        <mesh
          castShadow
          position={[0, -0.18, 0.02]}
        >
          <boxGeometry args={[0.22, 0.24, 0.14]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.6}
          />
        </mesh>

        <mesh
          position={[0, -0.12, -0.052]}
          rotation={[-0.12, 0, 0]}
        >
          <boxGeometry args={[0.18, 0.10, 0.004]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ============================================================
          E. STEERING COLUMN & HIGH-DETAIL WHEEL
         ============================================================ */}
      <group>
        {/* ========================================================
            STEERING COLUMN
           ======================================================== */}
        <mesh
          castShadow
          position={[
            driverSideX,
            colY,
            colZ
          ]}
          rotation={[
            colAngle,
            0,
            0
          ]}
        >
          <cylinderGeometry
            args={[0.018, 0.018, colLength, 12]}
          />

          <meshStandardMaterial
            color="#334155"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Steering column housing */}
        <mesh
          castShadow
          position={[
            driverSideX,
            0.94,
            dashboardZ - 0.04
          ]}
        >
          <boxGeometry args={[0.14, 0.11, 0.22]} />

          <meshStandardMaterial
            color="#18181b"
            roughness={0.85}
          />
        </mesh>

        {/* Steering column lower mounting point */}
        <mesh
          position={[
            driverSideX,
            0.53,
            1.14
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[0.035, 0.035, 0.04, 12]}
          />

          <meshStandardMaterial
            color="#1e293b"
            roughness={0.6}
            metalness={0.8}
          />
        </mesh>

        {/* ========================================================
            STEERING WHEEL
           ======================================================== */}
        <group
          position={[
            driverSideX,
            0.96,
            steeringWheelZ
          ]}
          rotation={[0.38, 0, 0]}
        >
          {/* Wheel rim */}
          <mesh castShadow>
            <torusGeometry
              args={[0.13, 0.014, 8, 32]}
            />

            <meshStandardMaterial
              color="#09090b"
              roughness={0.95}
            />
          </mesh>

          {/* Left spoke */}
          <mesh
            position={[-0.115, 0.05, 0]}
          >
            <cylinderGeometry
              args={[0.018, 0.018, 0.05, 12]}
            />

            <meshStandardMaterial
              color="#18181b"
              roughness={0.9}
            />
          </mesh>

          {/* Right spoke */}
          <mesh
            position={[0.115, 0.05, 0]}
          >
            <cylinderGeometry
              args={[0.018, 0.018, 0.05, 12]}
            />

            <meshStandardMaterial
              color="#18181b"
              roughness={0.9}
            />
          </mesh>

          {/* Steering wheel hub */}
          <mesh castShadow>
            <cylinderGeometry
              args={[0.034, 0.034, 0.025, 12]}
            />

            <meshStandardMaterial
              color="#ffff00"
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>

          {/* Hub center */}
          <mesh
            position={[0, 0.014, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry
              args={[0.015, 0.015, 0.004, 12]}
            />

            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>

          {/* Steering wheel spokes */}
          {[0, Math.PI * 0.72, -Math.PI * 0.72].map(
            (angle, i) => (
              <group
                key={`spoke-${i}`}
                rotation={[0, 0, angle]}
              >
                <mesh
                  castShadow
                  position={[0, -0.065, 0]}
                >
                  <boxGeometry
                    args={[0.018, 0.11, 0.008]}
                  />

                  <meshStandardMaterial
                    color="#ffff00"
                    metalness={0.9}
                    roughness={0.15}
                  />
                </mesh>
              </group>
            )
          )}
        </group>
      </group>

      {/* ============================================================
          F. GEAR SHIFTERS
         ============================================================ */}
      <group
        position={[
          0,
          SUV_CONFIG.tubFloorY + 0.16,
          shifterZ
        ]}
      >
        {/* Main shifter */}
        <group position={[0, 0.04, 0.06]}>
          <mesh castShadow>
            <cylinderGeometry
              args={[0.022, 0.055, 0.08, 4, 1, false]}
              rotation={[0, Math.PI / 4, 0]}
            />

            <meshStandardMaterial
              color="#0f0f12"
              roughness={0.85}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.08, 0]}
            rotation={[0.15, 0, 0]}
          >
            <cylinderGeometry
              args={[0.007, 0.007, 0.14, 12]}
            />

            <meshStandardMaterial
              color="#ffffff"
              metalness={1.0}
              roughness={0.05}
            />
          </mesh>

          <group
            position={[0, 0.15, -0.02]}
            rotation={[0.15, 0, 0]}
          >
            <mesh castShadow>
              <sphereGeometry
                args={[0.024, 12, 12]}
              />

              <meshStandardMaterial
                color="#18181b"
                roughness={0.4}
              />
            </mesh>

            <mesh
              castShadow
              position={[0, 0.016, 0]}
            >
              <cylinderGeometry
                args={[0.015, 0.015, 0.01, 12]}
              />

              <meshStandardMaterial
                color="#f1f5f9"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>

        {/* Secondary shifter */}
        <group position={[0, 0.03, -0.08]}>
          <mesh castShadow>
            <cylinderGeometry
              args={[0.018, 0.045, 0.06, 4, 1, false]}
              rotation={[0, Math.PI / 4, 0]}
            />

            <meshStandardMaterial
              color="#0f0f12"
              roughness={0.85}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.06, 0]}
            rotation={[0.3, 0, 0]}
          >
            <cylinderGeometry
              args={[0.005, 0.005, 0.11, 12]}
            />

            <meshStandardMaterial
              color="#ffffff"
              metalness={1.0}
              roughness={0.05}
            />
          </mesh>

          <mesh
            castShadow
            position={[0, 0.11, -0.001]}
            rotation={[0.3, 0, 0]}
          >
            <sphereGeometry
              args={[0.018, 12, 12]}
            />

            <meshStandardMaterial
              color="#dc2626"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          G. FULL-WIDTH MATTE LEATHER KNEE BOLSTER & FIREWALL SHROUD
         ============================================================ */}
      <group>
        {/* 
            This main cover spans the car's own interior width (cabinWidth).
            It completely seals the open space below the dashboard and steering column
            so the mechanical front elements/void are not visible.
        */}
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.70, 0.96]}
          rotation={[0.45, 0, 0]}
        >
          <boxGeometry args={[cabinWidth, 0.58, 0.02]} />
          <meshStandardMaterial
            color="#cca362"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* 
            Driver-side foot pedal assemblies integrated into the shroud
        */}
        <group position={[driverSideX, SUV_CONFIG.tubFloorY, 0.90]}>
          {/* Brake Pedal Assembly (Middle-Left) */}
          <group position={[-0.045, 0.13, -0.02]}>
            {/* Pedal arm extending down from the shroud */}
            <mesh
              castShadow
              position={[0, 0.07, 0.035]}
              rotation={[0.38, 0, 0]}
            >
              <boxGeometry args={[0.014, 0.16, 0.014]} />
              <meshStandardMaterial
                color="#475569"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Brake Pedal Pad with Matte/Rubber Surface */}
            <group position={[0, 0.0, -0.005]} rotation={[0.15, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.07, 0.045, 0.012]} />
                <meshStandardMaterial
                  color="#09090b"
                  roughness={0.6}
                />
              </mesh>

              {/* Metallic Grip Strips */}
              {[-0.014, 0, 0.014].map((zOffset, idx) => (
                <mesh
                  key={`brake-grip-${idx}`}
                  position={[0, zOffset, 0.007]}
                >
                  <boxGeometry args={[0.058, 0.004, 0.003]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    metalness={0.9}
                    roughness={0.15}
                  />
                </mesh>
              ))}
            </group>
          </group>

          {/* Accelerator Pedal Assembly (Right) */}
          <group position={[0.055, 0.11, -0.03]}>
            {/* Pedal arm extending down from the shroud */}
            <mesh
              castShadow
              position={[0, 0.065, 0.03]}
              rotation={[0.35, 0, 0]}
            >
              <boxGeometry args={[0.011, 0.15, 0.011]} />
              <meshStandardMaterial
                color="#475569"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Tall, Narrow Accelerator Pedal Pad */}
            <group position={[0, -0.01, -0.005]} rotation={[0.15, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.036, 0.08, 0.012]} />
                <meshStandardMaterial
                  color="#09090b"
                  roughness={0.6}
                />
              </mesh>

              {/* Metallic Grip Strips */}
              {[-0.024, -0.008, 0.008, 0.024].map((zOffset, idx) => (
                <mesh
                  key={`accel-grip-${idx}`}
                  position={[0, zOffset, 0.007]}
                >
                  <boxGeometry args={[0.026, 0.004, 0.003]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    metalness={0.9}
                    roughness={0.15}
                  />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}