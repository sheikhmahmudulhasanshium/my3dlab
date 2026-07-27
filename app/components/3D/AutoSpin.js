"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function AutoSpin({ children }) {
  // Create a React reference to bind to the group container element
  const groupRef = useRef(null);

  // useFrame runs on every frame of the render loop (typically 60-120fps)
  // 'delta' represents the elapsed time in seconds since the previous frame.
  // Using delta ensures that animations rotate at the exact same speed regardless of the device's framerate.
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate around the Y axis (horizontal spin)
      groupRef.current.rotation.y += delta * 0.4;
      // Rotate around the X axis (slight vertical tumble)
      groupRef.current.rotation.x += delta * 0.15;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}