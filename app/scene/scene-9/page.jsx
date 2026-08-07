"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Procedural SUV constructed from basic 3D primitives
function ProceduralSUV({ color, wheelColor, showRoof, headlightsOn, rotationSpeed }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current && rotationSpeed > 0) {
      groupRef.current.rotation.y += delta * 0.3 * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Lower Chassis/Base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.7, 0.5, 3.4]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cabin Roof Shell */}
      {showRoof && (
        <mesh castShadow receiveShadow position={[0, 0.95, -0.2]}>
          <boxGeometry args={[1.5, 0.6, 2.0]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
        </mesh>
      )}

      {/* Windshield */}
      {showRoof && (
        <mesh position={[0, 0.9, 0.85]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.4, 0.5, 0.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Front Grill */}
      <mesh position={[0, 0.4, 1.71]}>
        <boxGeometry args={[1.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Headlights */}
      <group position={[0, 0.45, 1.72]}>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.05]} />
          <meshStandardMaterial 
            color={headlightsOn ? "#fef08a" : "#64748b"} 
            emissive={headlightsOn ? "#fef08a" : "#000000"} 
            emissiveIntensity={headlightsOn ? 1.5 : 0} 
          />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.05]} />
          <meshStandardMaterial 
            color={headlightsOn ? "#fef08a" : "#64748b"} 
            emissive={headlightsOn ? "#fef08a" : "#000000"} 
            emissiveIntensity={headlightsOn ? 1.5 : 0} 
          />
        </mesh>
      </group>

      {/* Wheels */}
      <group>
        <Wheel position={[0.9, 0.15, 1.0]} color={wheelColor} />
        <Wheel position={[-0.9, 0.15, 1.0]} color={wheelColor} />
        <Wheel position={[0.9, 0.15, -1.0]} color={wheelColor} />
        <Wheel position={[-0.9, 0.15, -1.0]} color={wheelColor} />
      </group>
    </group>
  );
}

function Wheel({ position, color }) {
  return (
    <mesh castShadow position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

const COLOR_PRESETS = [
  { name: "Slate Matte", hex: "#475569" },
  { name: "Sunset Orange", hex: "#ea580c" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Midnight Blue", hex: "#1e3a8a" },
  { name: "Stealth Black", hex: "#1e293b" },
  { name: "Silver Metal", hex: "#94a3b8" },
];

export default function SceneNinePage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  const [color, setColor] = useState("#475569");
  const [wheelColor, setWheelColor] = useState("#1e293b");
  const [showRoof, setShowRoof] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  // Defer mounting updates to resolve the cascading render warning
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

  // Determine grid colors based on resolved theme
  const gridCenterColor = resolvedTheme === "light" ? "#0284c7" : "#38bdf8"; 
  const gridLineColor = resolvedTheme === "light" ? "#cbd5e1" : "#334155";

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16 bg-background transition-colors duration-200">
      {/* 3D Viewport Area */}
      <div className="absolute inset-0 z-0 bg-transparent">
        <Canvas shadows camera={{ position: [5, 4, 5], fov: 40 }}>
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

          <ProceduralSUV 
            color={color} 
            wheelColor={wheelColor}
            showRoof={showRoof}
            headlightsOn={headlightsOn}
            rotationSpeed={rotationSpeed}
          />

          {/* Dynamic Theme Grid */}
          <gridHelper args={[30, 30, gridCenterColor, gridLineColor]} position={[0, -0.2, 0]} />

          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minDistance={3}
            maxDistance={12}
          />
        </Canvas>
      </div>

      {/* Floating Panel Left - Product Specifications */}
      <div className="absolute left-6 top-24 z-10 hidden max-w-xs pointer-events-none md:flex flex-col gap-3">
        <div className="rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md text-card-foreground pointer-events-auto">
          <h1 className="text-base font-bold tracking-tight">Chassis Prototype</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Modular geometry assembly previewing the structural elements of the vehicle setup.
          </p>
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Rendering Mode</span>
              <span className="font-mono text-sky-500 dark:text-sky-400">WebGL Standard</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Active Theme</span>
              <span className="font-mono text-sky-500 dark:text-sky-400 capitalize">{resolvedTheme} Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Panel Right */}
      <div className="absolute inset-x-0 bottom-0 md:inset-x-auto md:right-6 md:top-24 z-10 flex p-4 md:p-0 pointer-events-none justify-end">
        <Card className="pointer-events-auto w-full md:w-80 border-border bg-card/60 backdrop-blur-md text-card-foreground">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-semibold">Scene Properties</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Adjust the temporary 3D elements</CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Color Palette Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body Color</label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    className={`h-6 w-6 rounded-full border transition-transform ${
                      color === preset.hex ? "ring-2 ring-sky-400 border-transparent scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    onClick={() => setColor(preset.hex)}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Wheel Trim Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Wheel Trim</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className={`h-7 text-xs bg-background/50 border-border hover:bg-accent text-card-foreground ${wheelColor === "#1e293b" ? "border-sky-400 dark:border-sky-400" : ""}`}
                  onClick={() => setWheelColor("#1e293b")}
                >
                  Matte Steel
                </Button>
                <Button 
                  variant="outline" 
                  className={`h-7 text-xs bg-background/50 border-border hover:bg-accent text-card-foreground ${wheelColor === "#0f172a" ? "border-sky-400 dark:border-sky-400" : ""}`}
                  onClick={() => setWheelColor("#0f172a")}
                >
                  Deep Alloy
                </Button>
              </div>
            </div>

            {/* Geometry Toggles */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Toggle Components</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className={`h-7 text-xs bg-background/50 border-border hover:bg-accent text-card-foreground ${showRoof ? "text-sky-500 dark:text-sky-300" : "text-muted-foreground"}`}
                  onClick={() => setShowRoof(!showRoof)}
                >
                  {showRoof ? "Hide Roof" : "Show Roof"}
                </Button>
                <Button
                  variant="outline"
                  className={`h-7 text-xs bg-background/50 border-border hover:bg-accent text-card-foreground ${headlightsOn ? "text-yellow-600 dark:text-yellow-300" : "text-muted-foreground"}`}
                  onClick={() => setHeadlightsOn(!headlightsOn)}
                >
                  {headlightsOn ? "Lights On" : "Lights Off"}
                </Button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                <span>Rotation Rate</span>
                <span>{rotationSpeed}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.2"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border px-4 py-3 text-[10px] text-muted-foreground flex justify-between">
            <span>Theme Grid: Active</span>
            <span className="font-mono text-sky-500 dark:text-sky-400">{color.toUpperCase()}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}