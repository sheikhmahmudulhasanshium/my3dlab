"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function SpokeTireAsset({ color }) {
  // useMemo ensures we only compute the 2D path geometry once rather than recalculating it on every single frame.
  const wheelShape = useMemo(() => {
    // 1. Create a base 2D canvas path layout (Shape)
    const shape = new THREE.Shape();
    
    // absarc: draw the primary solid outer rim circle.
    // absarc parameters: (centerX, centerY, radius, startAngle, endAngle, clockwise)
    shape.absarc(0, 0, 1.8, 0, Math.PI * 2, false);

    // 2. Define a "Hole" path for the center hub.
    // In Three.js, adding any secondary path to the 'shape.holes' array subtracts/carves it out of the main shape.
    const hub = new THREE.Path();
    hub.absarc(0, 0, 0.4, 0, Math.PI * 2, true); // True value draws the circle path in reverse to carve it out properly
    shape.holes.push(hub);

    // 3. Define multiple "negative circular paths" to form the spoke holes.
    const totalCutouts = 6;
    const cutoutRadius = 0.35;
    const distanceToCenter = 1.05; // Distance from the absolute center (0,0) where the cutouts are situated

    for (let i = 0; i < totalCutouts; i++) {
      // Calculate the circular division angle for each cutout (in radians)
      // 360 degrees = 2 * PI. Dividing this by the number of cutouts spreads them evenly.
      const angle = (i / totalCutouts) * Math.PI * 2;
      
      // Convert polar coordinates (angle & distance) to 2D Cartesian plane coordinates (x & y)
      const x = Math.cos(angle) * distanceToCenter;
      const y = Math.sin(angle) * distanceToCenter;

      // Draw a circle path at those offset coordinates and push it to holes to punch out the spoke gap
      const spokeCutout = new THREE.Path();
      spokeCutout.absarc(x, y, cutoutRadius, 0, Math.PI * 2, true);
      shape.holes.push(spokeCutout);
    }

    return shape;
  }, []);

  // Configure settings for converting the flat 2D shape with holes into a 3D volumetric extrusion
  const extrudeSettings = useMemo(() => ({
    depth: 0.35,            // How thick/deep the extrusion is along the Z axis
    bevelEnabled: true,     // Smoothes and rounds off sharp outer and inner edges
    bevelSegments: 4,       // How many divisions make up the bevel rounding curve
    steps: 1,               // Number of geometry segments along the depth
    bevelSize: 0.04,        // How far back into the shape the bevel extends
    bevelThickness: 0.04,   // How thick the rounded edge bevel is
  }), []);

  return (
    // We adjust position Z by -0.175 (half of depth) to center the asset's rotation axis directly in the viewport
    <group position={[0, 0, -0.175]}>
      <mesh>
        <extrudeGeometry args={[wheelShape, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.8} />
      </mesh>
    </group>
  );
}