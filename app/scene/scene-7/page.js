"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CloudSystem from "../../components/3D/CloudAsset"; // Modular Import for the Cloud System

export default function Scene7() {
  const [activePreset, setActivePreset] = useState("day"); // day, sunrise, storm, moonNight
  const [windSpeed, setWindSpeed] = useState(0.12);
  const [billowScale, setBillowScale] = useState(0.65);
  const [baseOpacity, setBaseOpacity] = useState(1.0);

  // High-fidelity skies and gradients configurations
  const getSkyConfigs = () => {
    switch (activePreset) {
      case "sunrise": // The Sunrise Preset
        return {
          bgGradient: "from-orange-400 via-rose-500 to-indigo-950",
          gridColor: "#f43f5e",
          
          ambientColor: "#f43f5e",
          ambientIntensity: 0.55,
          
          sunColor: "#ea580c",
          sunIntensity: 2.5,
          sunPosition: [-12, 1, -15],
          
          backlightColor: "#fef08a",
          backlightIntensity: 4.0,
          backlightPosition: [0, 2, -18],
          cloudPreset: "sunrise",
        };
      case "storm": // The Heavy Overcast Storm Preset
        return {
          bgGradient: "from-[#151a24] via-[#202631] to-[#303a48]",
          gridColor: "#414b59",
          
          ambientColor: "#202631",
          ambientIntensity: 0.75,
          
          sunColor: "#dce8f2",
          sunIntensity: 1.5,
          sunPosition: [5, 12, 5],
          
          backlightColor: "#596575",
          backlightIntensity: 3.5,
          backlightPosition: [0, 6, -15],
          cloudPreset: "storm",
        };
      case "moonNight": // The Moonlit Night Preset
        return {
          bgGradient: "from-[#050914] via-[#0b1224] to-[#111b33]",
          gridColor: "#1c2945",
          
          ambientColor: "#0b1224",
          ambientIntensity: 0.6,
          
          sunColor: "#e8edf5",
          sunIntensity: 1.8,
          sunPosition: [10, 8, -12],
          
          backlightColor: "#aeb8c8",
          backlightIntensity: 4.0,
          backlightPosition: [-5, 4, -15],
          cloudPreset: "moonNight",
        };
      case "day": // The Day Preset
      default:
        return {
          bgGradient: "from-[#bfe7f5] via-[#5db7e8] to-[#287fbe]",
          gridColor: "#b8c7d1",
          
          ambientColor: "#e5edf1",
          ambientIntensity: 0.95,
          
          sunColor: "#ffffff",
          sunIntensity: 1.6,
          sunPosition: [12, 16, 5],
          
          backlightColor: "#f5f8fa",
          backlightIntensity: 0.8,
          backlightPosition: [-6, 8, -10],
          cloudPreset: "day",
        };
    }
  };

  const currentConf = getSkyConfigs();

  return (
    <main className={`relative min-h-screen w-screen overflow-hidden pt-16 transition-all duration-1000 bg-linear-to-t ${currentConf.bgGradient}`}>
      
      {/* 3D Sky Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 3.2, 11], fov: 45 }}>
          <ambientLight intensity={currentConf.ambientIntensity} color={currentConf.ambientColor} />
          
          {/* Main Key Sunlight/Moonlight */}
          <directionalLight 
            position={currentConf.sunPosition} 
            intensity={currentConf.sunIntensity} 
            color={currentConf.sunColor}
          />

          {/* Indirect Backlight highlighting outlines */}
          <directionalLight
            position={currentConf.backlightPosition}
            intensity={currentConf.backlightIntensity}
            color={currentConf.backlightColor}
          />

          {/* High-Fidelity Layered Cloud System */}
          <CloudSystem 
            activePreset={currentConf.cloudPreset}
            windSpeed={windSpeed}
            billowScale={billowScale}
            baseOpacity={baseOpacity}
            staticClouds={8}
            dynamicClouds={6}
            wispyClouds={4}
            skyWidth={40}
            skyDepth={26}
          />

          {/* Perspective Ground Grid */}
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
        
        {/* Uses bg-inherit so the panel background inherits your layout's theme styles seamlessly */}
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
              </div>
            </div>

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