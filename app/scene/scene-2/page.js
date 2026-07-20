"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import BoxAsset from "../../components/3D/BoxAsset";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const SceneTwoPage = () => {
  const [color, setColor] = useState("#fbbf24");

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16 bg-background transition-colors duration-200">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[-10, 10, 5]} intensity={1.5} />
          <pointLight position={[10, -10, -10]} intensity={0.5} />
          <BoxAsset color={color} />
        </Canvas>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
        <Card className="pointer-events-auto w-full max-w-sm border-border bg-card/40 backdrop-blur-md text-card-foreground">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Box Controller</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Scene-2 Viewport</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="text-xs" onClick={() => setColor("#fbbf24")}>Amber</Button>
              <Button variant="outline" className="text-xs" onClick={() => setColor("#a855f7")}>Purple</Button>
              <Button variant="outline" className="text-xs" onClick={() => setColor("#ec4899")}>Pink</Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-5 py-3 text-[10px] text-muted-foreground flex justify-between">
            <span>Status: Active</span>
            <span>HEX: {color.toUpperCase()}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default SceneTwoPage;