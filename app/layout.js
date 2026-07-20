import "./globals.css";

export const metadata = {
  title: "3D Animated Space",
  description: "Next.js + Three.js Project",
};

export default function RootLayout({ children }) {
  return (
    // Adding the "dark" class here enables the dark variables from your CSS
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}