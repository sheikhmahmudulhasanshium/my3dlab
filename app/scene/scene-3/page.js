"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import Mug from "../../components/3D/objects/mug";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SceneThreePage = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-20 bg-background text-foreground transition-colors duration-200 flex flex-col items-center justify-center">
      
      {/* Wood/Rustic-style subtle background overlay */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-black/5 pointer-events-none" />

      {/* Retro 4:3 Canvas Framing Box */}
      <div className="relative z-10 w-full max-w-160 aspect-4/3 border-4 border-[#8A3D04] bg-[#f8efd4]/10 shadow-2xl overflow-hidden rounded-lg">
        
        {/* WebGL Canvas */}
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Stage environment="city" intensity={0.5}>
            <Mug />
          </Stage>

          <OrbitControls 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.1} // Prevents camera from slipping beneath the pedestal line
            minDistance={1.8}
            maxDistance={5.5}
          />
        </Canvas>

      </div>

      {/* Bottom informational card */}
      <div className="w-full max-w-160 mt-6 px-4 z-10">
        <Card className="border-[#8A3D04] bg-card/40 backdrop-blur-md text-card-foreground shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#8A3D04]"> Mug Asset</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Scene-3 Workspace</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed">
            This viewport renders your custom hollow mug mascot. Designed procedurally with raw baked wheat textures, pressed organic cellulose fibers, and lined internally with a protective dark chocolate seal, it provides a tactile, edible aesthetic that responds dynamically to custom studio lighting.
          </CardContent>
        </Card>
      </div>

    </main>
  );
};

export default SceneThreePage;