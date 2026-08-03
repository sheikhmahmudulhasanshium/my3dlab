"use client";

export default function CapsuleAsset({ color }) {
  return (
    <mesh>
      {/* 
        capsuleGeometry args: [radius, length, capSegments, radialSegments]
        - radius (0.6): Radius of both the capsule body cylinder and the end domes.
        - length (1.4): Length of the cylindrical middle section (excluding the half-spheres).
        - capSegments (8): Number of ring sections composing the top and bottom spherical domes.
        - radialSegments (24): Number of segmented faces wrapping around the body.
      */}
      <capsuleGeometry args={[0.6, 1.4, 8, 24]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
    </mesh>
  );
}