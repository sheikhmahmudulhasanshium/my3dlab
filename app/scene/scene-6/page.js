"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Modular Imports pointing to our 3D directory assets
import CoconutTree from "../../components/3D/CoconutTree";
import PalmTree from "../../components/3D/PalmTree";
import ChristmasTree from "../../components/3D/ChristmasTree";
import MangoTree from "../../components/3D/MangoTree";
import OakTree from "../../components/3D/OakTree";
import SakuraTree from "../../components/3D/SakuraTree";

export default function SceneSixPage() {
  const [activeTree, setActiveTree] = useState("coconut");
  const [leafColor, setLeafColor] = useState(""); 
  const [windSpeed, setWindSpeed] = useState(1.0); 

  const getFoliageColorLabel = () => {
    if (leafColor) return leafColor.toUpperCase();
    switch (activeTree) {
      case "coconut": return "#166534 (COCONUT)";
      case "palm": return "#15803D (PALM GREEN)";
      case "xmas": return "#14532D (PINE)";
      case "mango": return "#064E3B (DARK EMERALD)";
      case "oak": return "#1B4332 (OAK)";
      case "sakura": return "#FDA4AF (SAKURA PINK)";
      default: return "DEFAULT";
    }
  };

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16 bg-background transition-colors duration-200">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.2, 4], fov: 50 }} shadows>
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <pointLight position={[-10, -5, -10]} intensity={0.3} />

          {/* Render Active Tree */}
          {activeTree === "xmas" && <ChristmasTree color={leafColor} windSpeed={windSpeed} />}
          {activeTree === "palm" && <PalmTree color={leafColor} windSpeed={windSpeed} />}
          {activeTree === "coconut" && <CoconutTree color={leafColor} windSpeed={windSpeed} />}
          {activeTree === "mango" && <MangoTree color={leafColor} windSpeed={windSpeed} />}
          {activeTree === "oak" && <OakTree color={leafColor} windSpeed={windSpeed} />}
          {activeTree === "sakura" && <SakuraTree color={leafColor} windSpeed={windSpeed} />}

          {/* Ground Platform Grid */}
          <Grid position={[0, -0.6, 0]} args={[12, 12]} cellColor="#6b7280" sectionColor="#9ca3af" fadeDistance={30} />
          
          <OrbitControls enableZoom={true} makeDefault maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>

      {/* Floating Control Card HUD */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
        <Card className="pointer-events-auto w-full max-w-sm border-border bg-card/45 backdrop-blur-md text-card-foreground shadow-lg">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Arboretum Showcase</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Procedural low-poly familiar trees with dynamic wind simulation.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 pb-5 space-y-4">
            {/* Tree Selectors */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                Select Tree Type
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <Button 
                  variant={activeTree === "coconut" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("coconut"); setLeafColor(""); }}
                >
                  🥥 Coconut
                </Button>
                <Button 
                  variant={activeTree === "palm" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("palm"); setLeafColor(""); }}
                >
                  🌴 Palm
                </Button>
                <Button 
                  variant={activeTree === "xmas" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("xmas"); setLeafColor(""); }}
                >
                  🌲 Xmas
                </Button>
                <Button 
                  variant={activeTree === "mango" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("mango"); setLeafColor(""); }}
                >
                  🥭 Mango
                </Button>
                <Button 
                  variant={activeTree === "oak" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("oak"); setLeafColor(""); }}
                >
                  🌳 Oak
                </Button>
                <Button 
                  variant={activeTree === "sakura" ? "default" : "outline"} 
                  className="text-[10px] h-8 px-1" 
                  onClick={() => { setActiveTree("sakura"); setLeafColor(""); }}
                >
                  🌸 Sakura
                </Button>
              </div>
            </div>

            {/* Custom Foliage Paint */}
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                Foliage Paint Presets
              </label>
              <div className="flex gap-2">
                <Button variant="outline" className="w-6 h-6 rounded-full bg-emerald-600 p-0 hover:bg-emerald-500" onClick={() => setLeafColor("#059669")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-orange-500 p-0 hover:bg-orange-400" onClick={() => setLeafColor("#f97316")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-rose-400 p-0 hover:bg-rose-300" onClick={() => setLeafColor("#f43f5e")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-purple-500 p-0 hover:bg-purple-400" onClick={() => setLeafColor("#a855f7")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-sky-500 p-0 hover:bg-sky-400" onClick={() => setLeafColor("#0ea5e9")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-slate-400 p-0 hover:bg-slate-300 text-[9px] font-bold text-slate-800" onClick={() => setLeafColor("")}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Wind Intensity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Wind Sway Intensity
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">{windSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2.5" 
                step="0.1" 
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-sky-500 bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border px-5 py-3 text-[9px] text-muted-foreground flex justify-between items-center">
            <span>Model: <span className="font-semibold text-primary capitalize">{activeTree}</span></span>
            <span>HEX: {getFoliageColorLabel()}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}