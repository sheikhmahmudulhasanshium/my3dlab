"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProceduralCloud from "../../components/3D/CloudAsset";
import SunMoon from "../../components/3D/SkyAsset";

export default function Scene8() {
  const [activePreset, setActivePreset] = useState("day"); // day, sunrise, storm, moonNight, eclipse
  const [windSpeed, setWindSpeed] = useState(0.12);
  const [billowScale, setBillowScale] = useState(0.65);
  const [baseOpacity, setBaseOpacity] = useState(1.0);
  const [stormCelestial, setStormCelestial] = useState("sun");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Error enabling fullscreen:", err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getSkyConfigs = () => {
    switch (activePreset) {
      case "eclipse":
        return {
          bgGradient: "from-[#080812] via-[#0f1126] to-[#1a1d3a]", // Deep royal twilight indigo
          gridColor: "#2d3748",
          ambientColor: "#0b0c14",
          ambientIntensity: 0.35,
          sunColor: "#ffeebb", // Golden-white sun core
          sunIntensity: 1.4,
          sunPosition: [0.75, 1.65, -12.5], // Offset slightly back and left to build a crescent sliver
          backlightColor: "#f59e0b",
          backlightIntensity: 2.0,
          backlightPosition: [0, 1.5, -14],
          cloudColor: "#141624",
          cloudPreset: "eclipse",
        };
      case "sunrise":
        return {
          bgGradient: "from-orange-400 via-rose-500 to-indigo-950",
          gridColor: "#f43f5e",
          ambientColor: "#f43f5e",
          ambientIntensity: 0.55,
          sunColor: "#FFD28A", // Original Sunrise Color
          sunIntensity: 2.2,
          sunPosition: [-6, 1.2, -12],
          backlightColor: "#fef08a",
          backlightIntensity: 4.0,
          backlightPosition: [0, 1.2, -14],
          cloudColor: "#ffd1a9",
          cloudPreset: "sunrise",
        };
      case "storm":
        return {
          bgGradient: "from-[#151a24] via-[#202631] to-[#303a48]",
          gridColor: "#414b59",
          ambientColor: "#202631",
          ambientIntensity: 0.75,
          sunColor: "#9BA8B8",
          sunIntensity: 0.35,
          sunPosition: [3, 2.0, -12],
          backlightColor: "#596575",
          backlightIntensity: 3.5,
          backlightPosition: [0, 2.0, -14],
          cloudColor: "#272e3f",
          cloudPreset: "storm",
        };
      case "moonNight":
        return {
          bgGradient: "from-[#050914] via-[#0b1224] to-[#111b33]",
          gridColor: "#1c2945",
          ambientColor: "#0b1224",
          ambientIntensity: 0.6,
          sunColor: "#B8C7E0",
          sunIntensity: 0.65,
          sunPosition: [4, 1.8, -12],
          backlightColor: "#0284c7",
          backlightIntensity: 5.5,
          backlightPosition: [0, 1.8, -14],
          cloudColor: "#1e293b",
          cloudPreset: "moonNight",
        };
      case "day":
      default:
        return {
          bgGradient: "from-[#bfe7f5] via-[#5db7e8] to-[#287fbe]",
          gridColor: "#b8c7d1",
          ambientColor: "#e5edf1",
          ambientIntensity: 0.95,
          sunColor: "#FFF3C4", // Original Day Color
          sunIntensity: 1.6,
          sunPosition: [5, 2.2, -12],
          backlightColor: "#f5f8fa",
          backlightIntensity: 0.8,
          backlightPosition: [-3, 2.2, -14],
          cloudColor: "#ffffff",
          cloudPreset: "day",
        };
    }
  };

  const currentConf = getSkyConfigs();

  return (
    <main className={`relative min-h-screen w-screen overflow-hidden pt-16 transition-all duration-1000 bg-linear-to-t ${currentConf.bgGradient}`}>
      
      {/* 3D Sky Canvas */}
      <div className="absolute inset-0 z-0 bg-inherit">
        <Canvas 
          camera={{ position: [0, 3.2, 11], fov: 45, near: 0.1, far: 200 }} 
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#000000"), 0);
          }}
        >
          <ambientLight intensity={currentConf.ambientIntensity} color={currentConf.ambientColor} />
          
          <directionalLight 
            position={currentConf.sunPosition} 
            intensity={currentConf.sunIntensity} 
            color={currentConf.sunColor}
          />

          <directionalLight
            position={currentConf.backlightPosition}
            intensity={currentConf.backlightIntensity}
            color={currentConf.backlightColor}
          />

          {/* A. Render Sun Mesh */}
          {(activePreset !== "moonNight") && (
            <SunMoon
              type="sun"
              position={
                activePreset === "eclipse" 
                  ? [0.75, 1.65, -12.5] // Offset slightly to reveal a crescent sun core
                  : activePreset === "sunrise"
                    ? [-3.5, 0.8, -12.0]
                    : activePreset === "storm" && stormCelestial === "moon"
                      ? [99, 99, 99]
                      : activePreset === "storm"
                        ? [-1.8, 1.5, -12.0]
                        : [3.5, 2.5, -12.0]
              }
              size={activePreset === "eclipse" ? 2.3 : 2.0}
              intensity={activePreset === "storm" ? 0.35 : (activePreset === "eclipse" ? 1.8 : 1.0)}
              color={currentConf.sunColor}
              animate={activePreset !== "eclipse"}
            />
          )}

          {/* B. Render Moon Mesh */}
          {(activePreset === "moonNight" || activePreset === "eclipse" || (activePreset === "storm" && stormCelestial === "moon")) && (
            <SunMoon
              type="moon"
              position={
                activePreset === "eclipse" 
                  ? [1.0, 1.8, -12.0] // Centered foreground layer
                  : activePreset === "moonNight"
                    ? [3.5, 2.5, -12.0]
                    : [-1.8, 1.5, -12.0]
              }
              size={2.4}
              intensity={activePreset === "storm" ? 0.35 : 0.85}
              color={activePreset === "eclipse" ? "#000000" : "#E8EDF5"}
              animate={activePreset !== "eclipse"}
            />
          )}

          {/* High-Fidelity Layered Cloud System */}
          <ProceduralCloud 
            activePreset={activePreset}
            position={[-2.2, 1.0, -1.5]} 
            scale={[1.1, 1.0, 1.1]}
            puffCount={28}
            driftSpeed={windSpeed}
            billowScale={billowScale}
            opacity={baseOpacity}
            driftRangeX={11}
          />

          <ProceduralCloud 
            activePreset={activePreset}
            position={[2.0, 1.7, -3.0]} 
            scale={[1.3, 1.15, 1.3]}
            puffCount={32}
            driftSpeed={windSpeed * 0.75}
            billowScale={billowScale * 0.85}
            opacity={baseOpacity}
            driftRangeX={11}
          />

          <ProceduralCloud 
            activePreset={activePreset}
            position={[-0.2, 0.2, 1.2]} 
            scale={[0.7, 0.6, 0.7]}
            puffCount={20}
            driftSpeed={windSpeed * 1.25}
            billowScale={billowScale * 1.1}
            opacity={baseOpacity * 0.8}
            driftRangeX={11}
          />

          {/* Ground Grid */}
          <Grid 
            position={[0, -1.8, 0]} 
            args={[22, 22]} 
            cellColor={currentConf.gridColor} 
            sectionColor={currentConf.gridColor} 
            fadeDistance={35} 
            cellThickness={0.5}
          />
          
          <OrbitControls 
            enableZoom={true} 
            makeDefault 
            maxPolarAngle={Math.PI / 1.95} 
            minDistance={4}
            maxDistance={15}
          />
        </Canvas>
      </div>

      {/* Control HUD Panel */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
        <Card className="pointer-events-auto w-full max-w-sm border border-border bg-inherit backdrop-blur-md text-card-foreground shadow-lg transition-all duration-500">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Sky Environment</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Procedural cloud structures running on discrete depth, weight, and highlight tiers.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 pb-5 space-y-4">
            
            {/* Environment Selector */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                Sky Preset Selector
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <Button 
                  variant={activePreset === "day" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => setActivePreset("day")}
                >
                  ☀️ Day
                </Button>
                <Button 
                  variant={activePreset === "sunrise" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => setActivePreset("sunrise")}
                >
                  🌅 Sunrise
                </Button>
                <Button 
                  variant={activePreset === "storm" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => setActivePreset("storm")}
                >
                  ⛈️ Storm
                </Button>
                <Button 
                  variant={activePreset === "moonNight" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => setActivePreset("moonNight")}
                >
                  🌙 Moonlit
                </Button>
                <Button 
                  variant={activePreset === "eclipse" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1 col-span-2" 
                  onClick={() => setActivePreset("eclipse")}
                >
                  🌑 Solar Eclipse
                </Button>
              </div>
            </div>

            {/* Storm Celestial Toggle Widget */}
            {activePreset === "storm" && (
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Storm Celestial Body
                </span>
                <Button 
                  variant="outline" 
                  className="text-[10px] h-7 px-3 bg-secondary/15 border-border"
                  onClick={() => setStormCelestial(stormCelestial === "sun" ? "moon" : "sun")}
                >
                  {stormCelestial === "sun" ? "☀️ Storm Sun" : "🌙 Storm Moon"}
                </Button>
              </div>
            )}

            {/* Billow scale adjustment slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Swelling/Billow Depth
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">{billowScale.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.5" 
                step="0.05" 
                value={billowScale}
                onChange={(e) => setBillowScale(parseFloat(e.target.value))}
                className="w-full accent-primary bg-secondary/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Wind Speed Control */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Drift Speed
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">{windSpeed.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="0.5" 
                step="0.02" 
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary bg-secondary/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Master Opacity slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Atmospheric Density
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">{(baseOpacity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="1.5" 
                step="0.05" 
                value={baseOpacity}
                onChange={(e) => setBaseOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary bg-secondary/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Fullscreen Toggle Widget */}
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Screen Mode
              </span>
              <Button 
                variant="outline" 
                className="text-[10px] h-7 px-3 bg-secondary/15 border-border"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "🗖 Windowed" : "🗖 Fullscreen"}
              </Button>
            </div>

          </CardContent>

          <CardFooter className="border-t border-border px-5 py-3 text-[9px] text-muted-foreground flex justify-between items-center">
            <span>Preset: <span className="font-semibold text-primary capitalize">{activePreset}</span></span>
            <span className="uppercase font-semibold text-primary">High-Fidelity Sky</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}