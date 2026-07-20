"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
// Fix: Changed Button import to a named import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ThreeScene = dynamic(() => import("../../components/ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
      Loading Scene One...
    </div>
  ),
});

export default function SceneOnePage() {
  const [color, setColor] = useState("#00d2ff");

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <ThreeScene color={color} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start">
        <Card className="pointer-events-auto w-full max-w-sm border-white/10 bg-black/40 backdrop-blur-md text-primary">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold">Sphere Controller</CardTitle>
            <CardDescription className="text-xs text-slate-400">Scene-1 Viewport</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-2 text-primary">
              <Button variant="outline" className="text-xs bg-white" onClick={() => setColor("#00d2ff")}>Blue</Button>
              <Button variant="outline" className="text-xs bg-white" onClick={() => setColor("#10b981")}>Green</Button>
              <Button variant="outline" className="text-xs bg-white" onClick={() => setColor("#ef4444")}>Red</Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/10 px-5 py-3 text-[10px] text-slate-400 flex justify-between">
            <span>Status: Active</span>
            <span>HEX: {color.toUpperCase()}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}