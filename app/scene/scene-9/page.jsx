"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";

// Components
import SUVAsset from "../../components/3D/vehicle/suv/SUVAsset";
import Grid from "../../components/3D/vehicle/suv/Grid";
import Controller from "../../components/3D/vehicle/suv/Controller";

export default function SceneNinePage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Pure mechanical states
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [steeringAngle, setSteeringAngle] = useState(0);

  // Defer mounting updates to resolve ESLint cascading render warning
  useEffect(() => {
    let isCurrent = true;
    const timeoutId = setTimeout(() => {
      if (isCurrent) {
        setMounted(true);
      }
    }, 0);

    return () => {
      isCurrent = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground">
        <span className="text-sm font-medium">Initializing Viewport...</span>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-background transition-colors duration-200">
      {/* 3D Scene Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [4, 3, 4], fov: 40 }}>
          <ambientLight intensity={resolvedTheme === "light" ? 0.6 : 0.3} />
          
          <directionalLight
            position={[5, 8, 3]}
            intensity={resolvedTheme === "light" ? 1.6 : 1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          
          <directionalLight
            position={[-5, 4, -3]}
            intensity={resolvedTheme === "light" ? 0.6 : 0.3}
          />

          {/* SUV Assembly Component (Wheels Only) */}
          <SUVAsset
            rotationSpeed={rotationSpeed}
            steeringAngle={steeringAngle}
          />

          {/* Reference Ground Grid */}
          <Grid />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </div>

      {/* Extracted Controller Panel */}
      <Controller
        steeringAngle={steeringAngle}
        setSteeringAngle={setSteeringAngle}
        rotationSpeed={rotationSpeed}
        setRotationSpeed={setRotationSpeed}
      />
    </main>
  );
}