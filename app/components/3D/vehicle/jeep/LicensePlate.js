"use client";

export default function LicensePlate({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Plate Base (Black) */}
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.12, 0.015]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* White Plate Border Outline */}
      <mesh position={[0, 0, 0.002]}>
        <boxGeometry args={[0.33, 0.11, 0.012]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Inner Plate Face (Black) */}
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[0.31, 0.09, 0.011]} />
        <meshStandardMaterial color="#0c0e12" roughness={0.7} />
      </mesh>
      {/* 3D letters "5h!um" */}
      <group position={[-0.10, 0.002, 0.01]}>
        {/* Character '5' */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.022, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.009, 0.011, 0]}><boxGeometry args={[0.006, 0.016, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.001, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, -0.01, 0]}><boxGeometry args={[0.006, 0.016, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.02, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'h' */}
        <group position={[0.045, -0.005, 0]}>
          <mesh position={[-0.009, 0.012, 0]}><boxGeometry args={[0.006, 0.038, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.014, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, -0.004, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character '!' */}
        <group position={[0.082, 0, 0]}>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.006, 0.024, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.016, 0]}><boxGeometry args={[0.006, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'u' */}
        <group position={[0.12, -0.01, 0]}>
          <mesh position={[-0.009, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.008, 0]}><boxGeometry args={[0.018, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'm' */}
        <group position={[0.165, -0.01, 0]}>
          <mesh position={[-0.015, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.007, 0.018, 0]}><boxGeometry args={[0.012, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.007, 0.018, 0]}><boxGeometry args={[0.012, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.015, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
      </group>
    </group>
  );
}