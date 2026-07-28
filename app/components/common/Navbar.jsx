import Link from "next/link";
import Image from "next/image";
import { Globe, Box, Coffee, Shapes, Car, Trees } from "lucide-react"; // Imported Trees
import ThemeToggle from "../button/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-background/30 backdrop-blur-md border-b border-b-border/50 pointer-events-auto px-4 overflow-hidden">
      
      {/* 1/4 (25%) - Logo Column */}
      <div className="w-1/4 shrink-0 flex items-center justify-start">
        <Link href="/" className="relative h-8 w-24 sm:h-11 sm:w-36 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="my3DLibrary Logo" 
            fill
            priority
            sizes="144px"
            className="object-contain object-left"
          />
        </Link>
      </div>

      {/* 2/4 (50%) - Scrollable Nav Buttons Column */}
      <div className="w-1/2 shrink-0 flex items-center justify-start sm:justify-center overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 flex-nowrap px-1">
          <Link 
            href="/scene/scene-1" 
            title="Scene 1 (Sphere)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all shrink-0"
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-2" 
            title="Scene 2 (Box)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all shrink-0"
          >
            <Box className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-3" 
            title="Scene 3 (Mug)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all shrink-0"
          >
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link> 
          
          <Link 
            href="/scene/scene-4" 
            title="Scene 4 (Shapes)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all shrink-0"
          >
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          
          <Link 
            href="/scene/scene-5" 
            title="Scene 5 (Jeep)"
            className="p-2 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10 transition-all shrink-0"
          >
            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* New Scene 6 Link (Trees Icon) */}
          <Link 
            href="/scene/scene-6" 
            title="Scene 6 (Trees)"
            className="p-2 rounded-lg text-sky-400 bg-sky-500/10 font-semibold transition-all shrink-0"
          >
            <Trees className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>

      {/* 1/4 (25%) - Toggle Column */}
      <div className="w-1/4 shrink-0 flex items-center justify-end">
        <ThemeToggle />
      </div>

    </nav>
  );
};

export default Navbar;