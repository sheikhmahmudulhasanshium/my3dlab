import "./globals.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import Navbar from "./components/common/Navbar";

export const metadata = {
  title: "my3DLibrary",
  description: "WebGL Asset Workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-primary selection:bg-sky-400 selection:text-sky-50 transition-colors duration-200 dark:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // Automatically detects and applies standard system preferences
          enableSystem
          disableTransitionOnChange
        >
          {/* Imported Stateless Navbar Component */}
          <Navbar />
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}