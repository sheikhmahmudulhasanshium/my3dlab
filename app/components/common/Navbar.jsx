"use client"; // Required to use usePathname client-side hook

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Hook to detect active path
import { Globe, Box, Coffee, Shapes, Car, Trees, Cloud } from "lucide-react";
import ThemeToggle from "../button/theme-toggle";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/scene/scene-1", title: "Scene 1 (Sphere)", Icon: Globe },
    { href: "/scene/scene-2", title: "Scene 2 (Box)", Icon: Box },
    { href: "/scene/scene-3", title: "Scene 3 (Mug)", Icon: Coffee },
    { href: "/scene/scene-4", title: "Scene 4 (Shapes)", Icon: Shapes },
    { href: "/scene/scene-5", title: "Scene 5 (Jeep)", Icon: Car },
    { href: "/scene/scene-6", title: "Scene 6 (Trees)", Icon: Trees },
    { href: "/scene/scene-7", title: "Scene 7 (Clouds)", Icon: Cloud },
  ];

  return (
    // Restored your exact translucent bg (bg-background/30) and split border opacity (border-b-border/50)
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
          {navLinks.map(({ href, title, Icon }) => {
            const isActive = pathname === href;

            return (
              <Link 
                key={href}
                href={href} 
                title={title}
                className={`p-2 rounded-lg transition-all shrink-0 ${
                  isActive 
                    ? "text-sky-400 bg-sky-500/10 font-medium" // Selected/Active color state
                    : "text-muted-foreground hover:text-sky-400 hover:bg-slate-500/10" // Default state
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            );
          })}
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