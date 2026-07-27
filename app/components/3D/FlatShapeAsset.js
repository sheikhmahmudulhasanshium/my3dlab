"use client";

import * as THREE from "three";

export default function FlatShapeAsset({ type, color }) {
  // 2D planes/geometries in Three.js only render on their front face by default.
  // We use 'side={THREE.DoubleSide}' so that the geometries remain visible when rotated around to their backside.

  switch (type) {
    case "triangle":
      return (
        <mesh>
          {/* 
            circleGeometry args: [radius, segments]
            - radius (1.5)
            - segments (3): A circle with only 3 segments mathematically builds an equilateral triangle.
          */}
          <circleGeometry args={[1.5, 3]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      );
    case "quadragon":
      return (
        <mesh>
          {/* 
            planeGeometry args: [width, height]
            - width (2.2)
            - height (2.2)
            This constructs a basic flat four-sided plane (rectangle/square).
          */}
          <planeGeometry args={[2.2, 2.2]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      );
    case "polygon":
      return (
        <mesh>
          {/* 
            circleGeometry args: [radius, segments]
            - segments (5): A circle with exactly 5 segments constructs a flat pentagon.
          */}
          <circleGeometry args={[1.5, 5]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      );
    case "circle":
      return (
        <mesh>
          {/* 
            circleGeometry args: [radius, segments]
            - segments (64): A high segment count makes the edges appear completely round and smooth.
          */}
          <circleGeometry args={[1.5, 64]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      );
    default:
      return null;
  }
}