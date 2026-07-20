import "./globals.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import Navbar from "./components/common/Navbar";

export const metadata = {
  title: "my3dlab",
  description: "WebGL Asset Workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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