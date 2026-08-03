"use client";

export default function CylinderAsset({ color }) {
  return (
    <mesh>
      {/* 
        cylinderGeometry args: [radiusTop, radiusBottom, height, radialSegments]
        - radiusTop (0.8): The radius of the top circular cap.
        - radiusBottom (0.8): The radius of the bottom circular cap.
        - height (2.4): The vertical length of the cylinder.
        - radialSegments (32): Number of segmented faces wrapping the cylinder. Higher is smoother; lower makes it faceted.
      */}
      <cylinderGeometry args={[0.8, 0.8, 2.4, 32]} />
      
      {/* 
        meshStandardMaterial parameters:
        - roughness: Controls surface light scattering (0.0 is mirror-like shiny, 1.0 is chalky/matte).
        - metalness: Controls how much the surface acts like a metallic alloy (0.0 is plastic/wood, 1.0 is pure metal).
      */}
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
    </mesh>
  );
}