"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";

// Dynamic import passing our color prop safely
const ThreeScene = dynamic(() => import("../components/ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
      Loading 3D Experience...
    </div>
  ),
});

export default function Home() {
  // 1. Establish state for the ball color (defaulting to Neon Blue)
  const [ballColor, setBallColor] = useState("#00d2ff");

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* 2. Pass the color state as a prop to our 3D canvas */}
      <div className="absolute inset-0 z-0">
        <ThreeScene color={ballColor} />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        
        {/* Header */}
        <header className="w-full max-w-lg pointer-events-auto">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Project Sphere
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Interactive WebGL workspace using React Three Fiber.
            </p>
          </div>
        </header>

        {/* Bottom Control Panel */}
        <div className="w-full max-w-md pointer-events-auto self-start md:self-end">
          <Card className="border-white/10 bg-black/40 backdrop-blur-md text-slate-100 shadow-2xl">
            <CardHeader className="space-y-1 p-5">
              <CardTitle className="text-lg font-semibold">Control Panel</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Interact with the 3D mesh properties using standard UI elements.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 px-5 pb-5">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-slate-300">Preset Materials</span>
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* 3. Attach onClick listeners to update color state */}
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs border-white/15 bg-white/5 hover:bg-white/10 text-white hover:text-white ${ballColor === "#00d2ff" ? "ring-2 ring-sky-400" : ""}`}
                    onClick={() => setBallColor("#00d2ff")}
                  >
                    Neon Blue
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs border-white/15 bg-white/5 hover:bg-white/10 text-white hover:text-white ${ballColor === "#10b981" ? "ring-2 ring-emerald-400" : ""}`}
                    onClick={() => setBallColor("#10b981")}
                  >
                    Emerald
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={`h-8 text-xs border-white/15 bg-white/5 hover:bg-white/10 text-white hover:text-white ${ballColor === "#ef4444" ? "ring-2 ring-red-400" : ""}`}
                    onClick={() => setBallColor("#ef4444")}
                  >
                    Sunset Red
                  </Button>

                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-white/10 px-5 py-3 text-xs text-slate-400">
              <span>Status: Active</span>
              <span>Selected Hex: {ballColor.toUpperCase()}</span>
            </CardFooter>
          </Card>
        </div>

      </div>
    </main>
  );
}