"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Modular imports pointing to our commented 3D directory assets
import AutoSpin from "../../components/3D/AutoSpin";
import CylinderAsset from "../../components/3D/CylinderAsset";
import CapsuleAsset from "../../components/3D/CapsuleAsset";
import FlatShapeAsset from "../../components/3D/FlatShapeAsset";
import SpokeTireAsset from "../../components/3D/SpokeTireAsset";
import TrafficConeAsset from "../../components/3D/TrafficConeAsset"; // Added modular import

export default function SceneFourPage() {
  // React states to track which model is selected and what color to pass into the R3F materials
  const [activeModel, setActiveModel] = useState("spokeTire");
  const [color, setColor] = useState("#38bdf8");

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16 bg-background transition-colors duration-200">
      
      {/* 3D Render Canvas Container */}
      <div className="absolute inset-0 z-0">
        {/* fov: Field of View (Camera zoom factor). position: [X, Y, Z] position of camera */}
        <Canvas camera={{ position: [0, 2.5, 5], fov: 60 }}>
          {/* General non-directional global ambient lighting so dark shadows are not completely black */}
          <ambientLight intensity={0.5} />
          {/* Simulates direct sunlight cast from a specific angle, bringing out depth and reflections */}
          <directionalLight position={[10, 12, 8]} intensity={1.5} />
          {/* Subtle auxiliary light from below/opposite direction to brighten up underlying contours */}
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Wrap assets inside our AutoSpin animation loop controller */}
          <AutoSpin>
            {activeModel === "cylinder" && <CylinderAsset color={color} />}
            {activeModel === "capsule" && <CapsuleAsset color={color} />}
            {activeModel === "spokeTire" && <SpokeTireAsset color={color} />}
            {activeModel === "trafficCone" && <TrafficConeAsset color={color} />} {/* Added rendering block */}
            
            {/* Flat Shapes (Triangle, Quadragon, Pentagon, Circle) are grouped under FlatShapeAsset */}
            {["triangle", "quadragon", "polygon", "circle"].includes(activeModel) && (
              <FlatShapeAsset type={activeModel} color={color} />
            )}
          </AutoSpin>

          {/* Grid Helper positioned below the model center [X, Y, Z] to anchor the scene visually */}
          <Grid position={[0, -2, 0]} args={[10.5, 10.5]} cellColor="#6b7280" sectionColor="#9ca3af" fadeDistance={30} />
          
          {/* Allows user interaction: Left-click and drag to rotate, right-click to pan, scroll to zoom */}
          <OrbitControls enableZoom={true} makeDefault />
        </Canvas>
      </div>

      {/* Floating Control Card HUD */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
        <Card className="pointer-events-auto w-full max-w-md border-border bg-card/45 backdrop-blur-md text-card-foreground">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Geometry Playground</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              A collection of custom and primitive modular three-dimensional meshes.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 pb-5 space-y-4">
            {/* Shape Selectors */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                Select Geometry
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                <Button 
                  variant={activeModel === "cylinder" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("cylinder")}
                >
                  Cylinder
                </Button>
                <Button 
                  variant={activeModel === "capsule" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("capsule")}
                >
                  Capsule
                </Button>
                <Button 
                  variant={activeModel === "triangle" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("triangle")}
                >
                  Triangle
                </Button>
                <Button 
                  variant={activeModel === "quadragon" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("quadragon")}
                >
                  Quad
                </Button>
                <Button 
                  variant={activeModel === "polygon" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("polygon")}
                >
                  Polygon
                </Button>
                <Button 
                  variant={activeModel === "circle" ? "default" : "outline"} 
                  className="text-[11px] h-8 px-2" 
                  onClick={() => setActiveModel("circle")}
                >
                  Circle
                </Button>
                <Button 
                  variant={activeModel === "trafficCone" ? "default" : "outline"} 
                  className="text-[11px] col-span-2 h-8 px-2 border-dashed border-sky-400 dark:border-sky-500"    
                  onClick={() => setActiveModel("trafficCone")}
                >
                   Traffic Cone
                </Button>
                <Button 
                  variant={activeModel === "spokeTire" ? "default" : "outline"} 
                  className="text-[11px] col-span-2 h-8 px-2 border-dashed border-sky-400 dark:border-sky-500" 
                  onClick={() => setActiveModel("spokeTire")}
                >
                  ⚙️ Tire with Spokes
                </Button>
              </div>
            </div>

            {/* Color Presets */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
                Color Preset
              </label>
              <div className="flex gap-2">
                <Button variant="outline" className="w-6 h-6 rounded-full bg-sky-400 p-0 hover:bg-sky-500" onClick={() => setColor("#38bdf8")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-emerald-400 p-0 hover:bg-emerald-500" onClick={() => setColor("#34d399")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-orange-400 p-0 hover:bg-orange-500" onClick={() => setColor("#fb923c")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-purple-400 p-0 hover:bg-purple-500" onClick={() => setColor("#c084fc")} />
                <Button variant="outline" className="w-6 h-6 rounded-full bg-rose-400 p-0 hover:bg-rose-500" onClick={() => setColor("#f43f5e")} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border px-5 py-3 text-[10px] text-muted-foreground flex justify-between items-center">
            <span>Model: <span className="font-semibold text-primary">{activeModel}</span></span>
            <span>HEX: {color.toUpperCase()}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}