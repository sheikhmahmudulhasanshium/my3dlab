import Link from "next/link";
import Image from "next/image";
import { Globe, Box, Coffee, Shapes, Car } from "lucide-react";
import ThemeToggle from "../button/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between p-4 bg-background/30 backdrop-blur-md border-b border-b-border/50 pointer-events-auto">
      
      {/* Scaled Logo Container (Height set to a prominent 44px / h-11) */}
      <Link href="/" className="relative h-11 w-36 shrink-0 hover:opacity-80 transition-opacity ">
        <Image 
          src="/logo.png" 
          alt="my3DLibrary Logo" 
          fill
          priority
          className="object-contain object-left sizes-(max-width: 800px) 100vw, 800px"
        />
      </Link>

      {/* Navigation Icons & Controls */}
      <div className="flex items-center gap-3 md:gap-5 max-w-[80%] shrink">
        
        {/* Horizontal Scrolling Nav Container */}
        <div className="flex items-center gap-1 md:gap-3 overflow-x-auto overflow-y-hidden flex-nowrap whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none shrink-0">
          <Link 
            href="/scene/scene-1" 
            title="Scene 1 (Sphere)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all"
          >
            <Globe className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-2" 
            title="Scene 2 (Box)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all"
          >
            <Box className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-3" 
            title="Scene 3 (Mug)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all"
          >
            <Coffee className="w-5 h-5" />
          </Link> 
          
          <Link 
            href="/scene/scene-4" 
            title="Scene 4 (Shapes)"
            className="p-2 rounded-lg text-sky-400 bg-sky-500/10 font-semibold transition-all"
          >
            <Shapes className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-5" 
            title="Scene 5 (Jeep)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all"
          >
            <Car className="w-5 h-5" />
          </Link>
        </div>

        {/* Theme Controller */}
        <div className="shrink-0 border-l border-border/50 pl-3 md:pl-5 h-5 flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;