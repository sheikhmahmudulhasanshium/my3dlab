import { useMemo } from "react";
import * as THREE from "three";

export default function TrafficConeAsset({ color }) {
  // Create a custom 2D shape for the base (Square outer, Circular inner)
  const baseShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    // 1. Draw the outer square boundary
    shape.moveTo(-1.2, -1.2);
    shape.lineTo(1.2, -1.2);
    shape.lineTo(1.2, 1.2);
    shape.lineTo(-1.2, 1.2);
    shape.closePath();

    // 2. Cut a circular hole in the center (radius: 0.85, segments: smooth)
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.85, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    return shape;
  }, []);

  // Settings to give the flat base a realistic 3D thickness
  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: false,
  };

  return (
    <group position={[0, -0.5, 0]}>
      {/* 3D Square Base with a circular cutout */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[baseShape, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Main Hollow Cone (Open ended) */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.9, 2.4, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Upper White Stripe */}
      <mesh position={[0, 0.3, 0]} scale={[1.01, 1, 1.01]}>
        <cylinderGeometry args={[0.31, 0.46, 0.4, 32, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Lower White Stripe */}
      <mesh position={[0, -0.4, 0]} scale={[1.01, 1, 1.01]}>
        <cylinderGeometry args={[0.55, 0.7, 0.4, 32, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}