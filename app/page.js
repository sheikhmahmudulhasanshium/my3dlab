import Link from "next/link";

export const HomePage = () => {
  return (
    // bg-background automatically adapts to light/dark themes
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background pt-24 transition-colors duration-200">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            my3DLibrary
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            A personalized showcase of interactive 3D WebGL assets and component scenes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
          <Link 
            href="/scene/scene-1" 
            className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 transition-all text-center space-y-2"
          >
            <span className="text-lg font-bold text-foreground">Scene 1</span>
            <span className="text-xs text-muted-foreground">Rotating Sphere Asset</span>
          </Link>
          
          <Link 
            href="/scene/scene-2" 
            className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 transition-all text-center space-y-2"
          >
            <span className="text-lg font-bold text-foreground">Scene 2</span>
            <span className="text-xs text-muted-foreground">Rotating Box Asset</span>
          </Link>
          <Link 
            href="/scene/scene-2" 
            className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 transition-all text-center space-y-2"
          >
            <span className="text-lg font-bold text-foreground">Scene 3</span>
            <span className="text-xs text-muted-foreground">360 Mug Asset</span>
          </Link>
           <Link href="/scene/scene-4" 
                  className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 transition-all text-center space-y-2">
          <span className="text-lg font-bold text-foreground">Scene 4</span>
          <span className="text-xs text-muted-foreground">Interactive Playground</span>
        </Link>
        <Link 
          href="/scene/scene-5" 
          className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 transition-all text-center space-y-2"
        >
          <span className="text-lg font-bold text-foreground">Scene 5</span>
          <span className="text-xs text-muted-foreground">Custom 3D Model Car</span>
        </Link>
        </div>
      </div>
      <div className="absolute bottom-4 text-xs text-muted-foreground">
        &copy; 2024 my3DLibrary. All rights reserved.
      </div>
    </main>
  );
}

export default HomePage;