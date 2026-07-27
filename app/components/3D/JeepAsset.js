// app/components/3D/JeepAsset.js
"use client";

import WheelAsset from "./WheelAsset";
import * as THREE from "three";

export default function JeepAsset({ engineOn, steeringAngleRef, wheelRotationRef, color }) {
  return (
    <group>
      {/* --- 1. Chassis Base & Hollow Floor Layout --- */}
      {/* Heavy-duty steel chassis frame */}
      <mesh position={[0, 0.35, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.12, 3.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.8} />
      </mesh>

      {/* Hollow Tub Base Floor Panel */}
      <mesh position={[0, 0.43, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.04, 2.5]} />
        <meshStandardMaterial color="#111317" roughness={0.95} />
      </mesh>

      {/* Interior Floor Mat (sits inside the hollow space) */}
      <mesh position={[0, 0.455, 0.1]} receiveShadow>
        <boxGeometry args={[1.36, 0.01, 1.9]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.98} />
      </mesh>

      {/* Center Console Tunnel (separating driver and passenger footwells) */}
      <mesh position={[0, 0.52, 0.15]} castShadow>
        <boxGeometry args={[0.24, 0.14, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


      {/* --- 2. Hollow Cabin Tub Panels (Creating Negative Space) --- */}
      {/* Left Outer Side Panel */}
      <mesh position={[-0.725, 0.72, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.6, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Right Outer Side Panel */}
      <mesh position={[0.725, 0.72, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.6, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Rear Tailgate Closing Panel */}
      <mesh position={[0, 0.72, -1.275]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Front Engine Firewall Partition */}
      <mesh position={[0, 0.72, 1.175]} castShadow>
        <boxGeometry args={[1.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


      {/* --- 3. Engine Hood & Front Grille --- */}
      {/* Muscular Hood Cover */}
      <mesh position={[0, 0.78, 1.35]} castShadow>
        <boxGeometry args={[1.4, 0.48, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Front Grille detail panel */}
      <mesh position={[0, 0.78, 1.83]}>
        <boxGeometry args={[1.3, 0.38, 0.02]} />
        <meshStandardMaterial color="#111317" roughness={0.8} />
      </mesh>

      {/* Heavy Front Bumper */}
      <mesh position={[0, 0.42, 1.8]} castShadow>
        <boxGeometry args={[1.65, 0.16, 0.16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


      {/* --- 4. Tire Guards (Fenders) --- */}
      <mesh position={[-0.8, 0.86, 1.1]} castShadow>
        <boxGeometry args={[0.26, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 0.86, 1.1]} castShadow>
        <boxGeometry args={[0.26, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>
      <mesh position={[-0.8, 0.86, -0.75]} castShadow>
        <boxGeometry args={[0.26, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 0.86, -0.75]} castShadow>
        <boxGeometry args={[0.26, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>


      {/* --- 5. Vertical Off-Road Exhaust Stack --- */}
      <group position={[0.68, 1.12, -1.2]}>
        {/* Main Vertical Pipe (Anchored to rear chassis up next to roll cage) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.038, 0.038, 1.4, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Curved Top Rain Elbow (Angles backward/outward at Y=1.82) */}
        <mesh position={[0, 0.72, -0.06]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.038, 0.2, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>


      {/* --- 6. Dashboard, Shifter & Anchored Steering --- */}
      {/* Dash structure connecting the sidewalls */}
      <mesh position={[0, 0.98, 0.9]} castShadow>
        <boxGeometry args={[1.39, 0.18, 0.25]} />
        <meshStandardMaterial color="#0f1115" roughness={0.8} />
      </mesh>

      {/* Anchored Steering Assembly */}
      <group position={[-0.35, 1.0, 0.8]}>
        {/* Steering Shaft Column (Deeply rooted into Dashboard mesh) */}
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#111317" roughness={0.7} />
        </mesh>
        
        {/* Steering Wheel Ring & Spoke Axes */}
        <group position={[0, 0.12, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.16, 0.024, 8, 24]} />
            <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
          </mesh>
          {/* Axis Spoke 1 (Vertical Down) */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {/* Axis Spoke 2 (Top Left) */}
          <mesh position={[-0.07, 0.04, 0]} rotation={[0, 0, Math.PI / 3]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {/* Axis Spoke 3 (Top Right) */}
          <mesh position={[0.07, 0.04, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Shifter Assembly on Central Tunnel */}
      <group position={[0, 0.58, 0.45]}>
        <mesh position={[0, 0.1, 0]} rotation={[-0.12, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.19, -0.01]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>


      {/* --- 7. 4-Passenger Leather Seats (Positioned inside hollow space) --- */}
      {/* Driver Seat - Left Front (Cushion lowered into negative space) */}
      <group position={[-0.34, 0.53, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.14, 0.44]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.46, 0.52, 0.12]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
      </group>

      {/* Passenger Seat - Right Front (Cushion lowered into negative space) */}
      <group position={[0.34, 0.53, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.14, 0.44]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.46, 0.52, 0.12]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
      </group>

      {/* Rear Seats 3 & 4 - Bench (Cushion lowered into negative space) */}
      <group position={[0, 0.53, -0.55]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.14, 0.44]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.52, 0.12]} />
          <meshStandardMaterial color="#5a2e17" roughness={0.7} />
        </mesh>
      </group>


      {/* --- 8. Windshield & Connected Side Mirrors --- */}
      {/* Windshield */}
      <mesh position={[0, 1.25, 0.88]} rotation={[-Math.PI / 10, 0, 0]}>
        <boxGeometry args={[1.36, 0.48, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Rugged Roll Cage Pillars */}
      <mesh position={[-0.68, 1.34, -0.55]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.25]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0.68, 1.34, -0.55]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.25]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.95, -0.55]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Side Mirror - Left (Connected to Windshield Frame via Mounting Connector) */}
      <group position={[-0.8, 1.25, 0.88]}>
        {/* Horizontal Connector Pin / Bracket Arm */}
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Mirror Body Case */}
        <mesh castShadow>
          <boxGeometry args={[0.02, 0.18, 0.12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Reflective Glass Panel */}
        <mesh position={[0.012, 0, 0]}>
          <boxGeometry args={[0.005, 0.16, 0.1]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Side Mirror - Right (Connected to Windshield Frame via Mounting Connector) */}
      <group position={[0.8, 1.25, 0.88]}>
        {/* Horizontal Connector Pin / Bracket Arm */}
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Mirror Body Case */}
        <mesh castShadow>
          <boxGeometry args={[0.02, 0.18, 0.12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Reflective Glass Panel */}
        <mesh position={[-0.012, 0, 0]}>
          <boxGeometry args={[0.005, 0.16, 0.1]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>


      {/* --- 9. Headlights & Brake Lights --- */}
      {/* Front Headlights */}
      <group position={[0, 0.78, 1.84]}>
        <mesh position={[-0.48, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
          <meshStandardMaterial 
            color="#fef08a" 
            emissive="#eab308" 
            emissiveIntensity={engineOn ? 2.5 : 0.0} 
          />
        </mesh>
        <mesh position={[0.48, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
          <meshStandardMaterial 
            color="#fef08a" 
            emissive="#eab308" 
            emissiveIntensity={engineOn ? 2.5 : 0.0} 
          />
        </mesh>
      </group>

      {/* Rear Taillights */}
      <group position={[0, 0.72, -1.31]}>
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.15, 0.09, 0.02]} />
          <meshStandardMaterial 
            color="#ff0120" 
            emissive="#ff0000" 
            emissiveIntensity={engineOn ? 2.0 : 0.0} 
          />
        </mesh>
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.15, 0.09, 0.02]} />
          <meshStandardMaterial 
            color="#fca5a5" 
            emissive="#dc2626" 
            emissiveIntensity={engineOn ? 2.0 : 0.0} 
          />
        </mesh>
      </group>


      {/* --- 10. Spare Tire & Driving Wheels Assembly --- */}
      {/* Spare Tire on Rear Tailgate Gate */}
      <group position={[0, 0.8, -1.39]} rotation={[0, Math.PI, 0]}>
        <WheelAsset isFront={false} isStatic={true} />
      </group>

      {/* Front-Left Wheel */}
      <group position={[-0.82, 0.38, 1.1]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset isFront={true} steeringAngleRef={steeringAngleRef} rotationRef={wheelRotationRef} />
      </group>
      {/* Front-Right Wheel */}
      <group position={[0.82, 0.38, 1.1]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset isFront={true} steeringAngleRef={steeringAngleRef} rotationRef={wheelRotationRef} />
      </group>
      {/* Rear-Left Wheel */}
      <group position={[-0.82, 0.38, -0.75]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset isFront={false} rotationRef={wheelRotationRef} />
      </group>
      {/* Rear-Right Wheel */}
      <group position={[0.82, 0.38, -0.75]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset isFront={false} rotationRef={wheelRotationRef} />
      </group>
    </group>
  );
}