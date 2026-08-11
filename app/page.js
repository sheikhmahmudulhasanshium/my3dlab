import Link from "next/link";
import Image from "next/image";

export const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-background pt-20 transition-colors duration-200">
      
      <div className="w-full max-w-200 flex flex-col justify-between grow space-y-10">
        
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <div className="relative w-full max-w-200 aspect-square mx-auto">
            <Image 
              src="/logo.png" 
              alt="my3DLibrary Logo" 
              fill
              priority
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-contain sizes-auto"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              my3DLibrary
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A personalized showcase of interactive 3D WebGL assets and component scenes.
            </p>
          </div>
        </div>

        {/* Scene Navigation Stack */}
        <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
          <Link 
            href="/scene/scene-1" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 1</span>
              <span className="text-[11px] text-muted-foreground">Rotating Sphere Asset</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>
          
          <Link 
            href="/scene/scene-2" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 2</span>
              <span className="text-[11px] text-muted-foreground">Rotating Box Asset</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>

          <Link 
            href="/scene/scene-3" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 3</span>
              <span className="text-[11px] text-muted-foreground">360 Mug Asset</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>

          <Link 
            href="/scene/scene-4" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 4</span>
              <span className="text-[11px] text-muted-foreground">Interactive Playground</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>

          <Link 
            href="/scene/scene-5" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 5</span>
              <span className="text-[11px] text-muted-foreground">Custom 3D Model Car</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>

          {/* New Scene 6 Link */}
          <Link 
            href="/scene/scene-6" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 6</span>
              <span className="text-[11px] text-muted-foreground">Arboretum Showcase (Trees)</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>
          {/* New Scene 7 Link */}
          <Link 
            href="/scene/scene-7" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 7</span>
              <span className="text-[11px] text-muted-foreground">Dynamic Cloudscape</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>
          <Link 
            href="/scene/scene-8" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 8</span>
              <span className="text-[11px] text-muted-foreground">Sky Elements Showcase</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link>

          {/* New Scene 9 Link */}
          <Link 
            href="/scene/scene-9" 
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/40 hover:border-sky-500/30 transition-all text-left group"
          >
            <div>
              <span className="block text-sm font-bold text-foreground group-hover:text-sky-400 transition-colors">Scene 9</span>
              <span className="text-[11px] text-muted-foreground">SUV Model Car</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-sky-400 transition-colors">→</span>
          </Link> 
        </div>

        {/* Structured Column Footer */}
        <footer className="w-full pt-6 pb-2 border-t border-border/50 text-center space-y-2 max-w-lg mx-auto">
          <div className="relative w-10 h-10 mx-auto opacity-40 hover:opacity-75 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Logo Footer" 
              fill 
              className="object-contain grayscale sizes-auto"
            />
          </div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
            &copy; 2024 my3DLibrary. All rights reserved.
          </p>
        </footer>

      </div>
    </main>
  );
};

export default HomePage;