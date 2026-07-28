// app/components/3D/JeepAsset.js
"use client";

import WheelAsset from "./WheelAsset";
import * as THREE from "three";

export default function JeepAsset({ engineOn, steeringAngleRef, wheelRotationRef, color }) {
  return (
    <group>
      {/* --- 1. Chassis Base & Floor Mat --- */}
      <mesh position={[0, 0.35, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.12, 3.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.43, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.04, 2.5]} />
        <meshStandardMaterial color="#111317" roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.455, 0.1]} receiveShadow>
        <boxGeometry args={[1.36, 0.01, 1.9]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.98} />
      </mesh>

      <mesh position={[0, 0.52, 0.15]} castShadow>
        <boxGeometry args={[0.24, 0.14, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


      {/* --- 2. Hollow Cabin Tub Panels (Creating Negative Space) --- */}
      <mesh position={[-0.725, 0.72, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.6, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      <mesh position={[0.725, 0.72, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.6, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Rear Tailgate Panel */}
      <mesh position={[0, 0.595, -1.275]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.72, 1.175]} castShadow>
        <boxGeometry args={[1.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>


      {/* --- 3. Engine Hood & Front Grille --- */}
      <mesh position={[0, 0.78, 1.35]} castShadow>
        <boxGeometry args={[1.4, 0.48, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.78, 1.83]}>
        <boxGeometry args={[1.3, 0.38, 0.02]} />
        <meshStandardMaterial color="#111317" roughness={0.8} />
      </mesh>

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


      {/* --- 5. Vertical Exhaust Stack --- */}
      <group position={[0.68, 0.77, -1.2]}>
        {/* Main Pipe body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Angled exhaust exit elbow */}
        <mesh position={[0, 0.37, -0.04]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.14, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>


      {/* --- 6. Dashboard & Anchored Steering --- */}
      <mesh position={[0, 0.98, 0.9]} castShadow>
        <boxGeometry args={[1.39, 0.18, 0.25]} />
        <meshStandardMaterial color="#0f1115" roughness={0.8} />
      </mesh>

      <group position={[-0.35, 1.0, 0.8]}>
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#111317" roughness={0.7} />
        </mesh>
        
        <group position={[0, 0.12, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.16, 0.024, 8, 24]} />
            <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[-0.07, 0.04, 0]} rotation={[0, 0, Math.PI / 3]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0.07, 0.04, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <boxGeometry args={[0.02, 0.16, 0.015]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>
      </group>

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


      {/* --- 7. 4-Passenger Leather Seats --- */}
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
      <mesh position={[0, 1.25, 0.88]} rotation={[-Math.PI / 10, 0, 0]}>
        <boxGeometry args={[1.36, 0.48, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} roughness={0.1} />
      </mesh>

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

      <group position={[-0.8, 1.25, 0.88]}>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.02, 0.18, 0.12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0.012, 0, 0]}>
          <boxGeometry args={[0.005, 0.16, 0.1]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      <group position={[0.8, 1.25, 0.88]}>
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.02, 0.18, 0.12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.012, 0, 0]}>
          <boxGeometry args={[0.005, 0.16, 0.1]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>


      {/* --- 9. Headlights & Brake Lights --- */}
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

      {/* Back Lights */}
      <group position={[0, 0.72, -1.31]}>
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.15, 0.09, 0.02]} />
          <meshStandardMaterial 
            color="#e11d48" 
            emissive="#ff0000" 
            emissiveIntensity={engineOn ? 2.5 : 0.0} 
          />
        </mesh>
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.15, 0.09, 0.02]} />
          <meshStandardMaterial 
            color="#e11d48" 
            emissive="#ff0000" 
            emissiveIntensity={engineOn ? 2.5 : 0.0} 
          />
        </mesh>
      </group>


      {/* --- 10. Spare Tire & Active Driving Wheels Assembly --- */}
      {/* Static Spare Tire mounted on the tailgate */}
      <group position={[0, 0.8, -1.39]} rotation={[0, Math.PI, 0]}>
        <WheelAsset isFront={false} isStatic={true} />
      </group>

      {/* Front Left Wheel */}
      <group position={[-0.82, 0.38, 1.1]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={true} 
          steeringAngleRef={steeringAngleRef} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Front Right Wheel */}
      <group position={[0.82, 0.38, 1.1]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={true} 
          steeringAngleRef={steeringAngleRef} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Rear Left Wheel */}
      <group position={[-0.82, 0.38, -0.75]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={false} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Rear Right Wheel */}
      <group position={[0.82, 0.38, -0.75]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={false} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
    </group>
  );
}