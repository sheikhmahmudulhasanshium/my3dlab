import Link from "next/link";
// Fix: Updated path to match the lowercase theme-toggle filename
import ThemeToggle from "../button/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/30 backdrop-blur-md border-b border-border/50 pointer-events-auto">
      <Link href="/" className="font-bold tracking-tight hover:text-sky-400 transition-colors">
        my3dlab
      </Link>
      <div className="flex items-center gap-4 text-sm font-medium">
        <Link href="/scene/scene-1" className="hover:text-sky-400 transition-colors">
          Scene 1 (Sphere)
        </Link>
        <Link href="/scene/scene-2" className="hover:text-sky-400 transition-colors">
          Scene 2 (Box)
        </Link>
        <Link href="/scene/scene-3" className="hover:text-sky-400 transition-colors">
          Scene 3 (Mug)
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;