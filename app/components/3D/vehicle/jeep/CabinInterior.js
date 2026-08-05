"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function CabinInterior({ cfg, materials, engineOn, steeringAngleRef }) {
  const steeringWheelRef = useRef(null);

  // Glow settings tied directly to engine status
  const instrumentGlow = engineOn ? 1.2 : 0.0;
  const screenGlow = engineOn ? 1.0 : 0.0;

  // Rotate the steering wheel based on tire steering angle input
  useFrame(() => {
    if (steeringWheelRef.current && steeringAngleRef) {
      // Real steering wheels turn more than the tires (approx 5x gear ratio multiplier)
      // Rotates on local Z-axis (angled on the column)
      steeringWheelRef.current.rotation.z = -steeringAngleRef.current * 5.0;
    }
  });

  return (
    <group>
      {/* --- 1. Dashboard & Compact Instruments --- */}
      <mesh position={[0, 0.98, 0.90]} castShadow><boxGeometry args={[1.38, 0.18, 0.24]} />{materials.darkPlastic}</mesh>

      {/* Compact Instrument Cluster Backplate */}
      <mesh position={[-0.35, 1.01, 0.78]} castShadow>
        <boxGeometry args={[0.24, 0.09, 0.01]} />
        {materials.darkPlastic}
      </mesh>

      {/* Left Dial */}
      <group position={[-0.39, 1.01, 0.772]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          {materials.silverMetallic}
        </mesh>
        <mesh position={[0, 0, -0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.002, 12]} />
          <meshStandardMaterial color="#0f172a" emissive="#10b981" emissiveIntensity={instrumentGlow} />
        </mesh>
      </group>

      {/* Right Dial */}
      <group position={[-0.31, 1.01, 0.772]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          {materials.silverMetallic}
        </mesh>
        <mesh position={[0, 0, -0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.002, 12]} />
          <meshStandardMaterial color="#0f172a" emissive="#10b981" emissiveIntensity={instrumentGlow} />
        </mesh>
      </group>

      {/* Center Console Screen */}
      <group position={[0, 0.98, 0.772]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.11, 0.015]} />
          {materials.darkPlastic}
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.16, 0.09, 0.002]} />
          <meshStandardMaterial color="#0f172a" emissive="#0ea5e9" emissiveIntensity={screenGlow} />
        </mesh>
      </group>


      {/* --- 2. Steering Column & Animated Steering Wheel --- */}
      <group position={[-0.35, 1.0, 0.80]}>
        {/* Static Steering Column Mount */}
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.35, 8]} />
          {materials.darkPlastic}
        </mesh>
        
        {/* Animated Steering Wheel Group (Rotates dynamically around column angle) */}
        <group ref={steeringWheelRef} position={[0, 0.12, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
          {/* Main wheel rim */}
          <mesh castShadow><torusGeometry args={[0.15, 0.02, 6, 20]} />{materials.darkPlastic}</mesh>
          {/* Wheel spokes */}
          <mesh position={[0, -0.07, 0]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
          <mesh position={[-0.06, 0.04, 0]} rotation={[0, 0, Math.PI / 3]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
          <mesh position={[0.06, 0.04, 0]} rotation={[0, 0, -Math.PI / 3]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
        </group>
      </group>


      {/* --- 3. Center Console & Transmission Shifters --- */}
      <mesh position={[0, 0.46, 0.38]} castShadow>
        <boxGeometry args={[0.18, 0.07, 0.52]} />
        {materials.darkPlastic}
      </mesh>

      {/* Main Gear Shifter */}
      <group position={[0, 0.49, 0.48]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.05, 0.04, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.11, -0.01]} rotation={[-0.12, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.18, 6]} />
          {materials.silverMetallic}
        </mesh>
        <mesh position={[0, 0.20, -0.02]} castShadow>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      {/* 4WD Transfer Case Shifter */}
      <group position={[0.05, 0.49, 0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.04, 0.03, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[0.1, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.10, 6]} />
          {materials.silverMetallic}
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.020, 8, 8]} />
          {materials.darkPlastic}
        </mesh>
      </group>


      {/* --- 4. Symmetrical Front Bucket Seats --- */}
      {[-1, 1].map((xSign) => (
        <group key={xSign} position={[xSign * cfg.seatX, 0.53, 0.05]}>
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[0.3, 0.08, 0.3]} />
            {materials.darkPlastic}
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.14, 0.44]} />
            {materials.leatherSeats}
          </mesh>
          <mesh position={[0, 0.28, -0.18]} rotation={[-0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.44, 0.54, 0.10]} />
            {materials.leatherSeats}
          </mesh>
          <mesh position={[0, 0.58, -0.21]} rotation={[-0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.14, 0.08]} />
            {materials.leatherSeats}
          </mesh>
        </group>
      ))}


      {/* --- 5. Rear Passenger Seat Bench --- */}
      <group position={[0, 0.53, -0.55]}>
        <mesh castShadow><boxGeometry args={[1.0, 0.14, 0.44]} />{materials.leatherSeats}</mesh>
        <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow><boxGeometry args={[1.0, 0.52, 0.10]} />{materials.leatherSeats}</mesh>
      </group>
    </group>
  );
}