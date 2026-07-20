# my3DLibrary

An interactive multi-page WebGL development lab and component library built with **Next.js (App Router)**, **React Three Fiber (R3F)**, **Three.js**, and styled using **Tailwind CSS** and **shadcn/ui**.

This workspace serves as a personal laboratory for designing, testing, and organizing reusable 3D scenes, custom shaders, and interactive web elements that can be seamlessly integrated into existing Next.js and TypeScript projects.

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **3D Rendering:** Three.js & React Three Fiber (R3F)
* **Theme System:** next-themes (with system default support)
* **Styling:** Tailwind CSS (v4) with theme-aware background states
* **UI Components:** shadcn/ui (Button, Card)
* **Architecture:** Stateless Arrow Function components
* **Package Manager:** pnpm

---

## ⚡ Key Features
* **Multi-Page 3D Navigation:** Routes organized dynamically inside the Next.js `scene/` path directory (Scene 1: Sphere, Scene 2: Box).
* **Unified Theme Integration:** Fully integrated dark and light themes supported by a custom `<ThemeToggle />` button. Fallback loaders, page backgrounds, and overlays transition seamlessly between themes.
* **Modular 3D Architecture:** High separation of concerns. Atomic 3D assets (`components/3D/`) are kept entirely separate from environment-level WebGL scenes.
* **Stateless Functional Architecture:** Codebase written cleanly using modern, stateless arrow functions for maximum legibility and standards compliance.
* **Responsive HTML Overlays:** Glassmorphic control cards (`backdrop-blur`) that float on top of the 3D Canvas with proper event delegation (`pointer-events-none`).

---

## 📂 Project Structure

This project uses a clean, highly portable structure to organize 3D assets separately from page routing:

my3DLibrary/
├── app/                        <-- Next.js Routing
│   ├── globals.css
│   ├── layout.js              <-- Layout wrapper integrating Navbar & ThemeProvider
│   ├── page.js                <-- Path: / (Main Entry Dashboard)
│   └── scene/                 <-- Path: /scene/
│       ├── scene-1/
│       │   └── page.js        <-- Route: /scene/scene-1 (Renders Sphere Scene)
│       └── scene-2/
│           └── page.js        <-- Route: /scene/scene-2 (Renders Box Scene)
│
└── app/components/             <-- Reusable UI & 3D Building Blocks
    ├── 3D/
    │   └── BoxAsset.js        <-- Reusable rotating box mesh
    ├── button/
    │   └── ThemeToggle.jsx    <-- Named theme-toggle button component
    ├── common/
    │   └── Navbar.jsx         <-- Shared navigation layout
    ├── providers/
    │   └── theme-provider.jsx <-- next-themes React context provider
    └── ThreeScene.jsx         <-- Reusable rotating sphere scene

---

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js and pnpm installed.

### Installation

1. Clone the repository:
   git clone https://github.com/sheikhmahmudulhasanshium/my3DLibrary.git
   cd my3DLibrary

2. Install dependencies:
   pnpm install

3. Run the development server:
   pnpm dev

4. Open http://localhost:3000 in your browser to view the active workspace.

---

## 🧩 Reusing Assets in Other Projects

The assets in this lab are built to be modular. To port a 3D component (like `BoxAsset.js` or `ThreeScene.jsx`) to another Next.js project:

1. **Install Peer Dependencies** in your target project:
   pnpm add three @react-three/fiber
   # If using TypeScript, also add:
   pnpm add -D @types/three

2. **Copy the Component**: Transfer the file (e.g., components/3D/BoxAsset.js) to your target project's component directory.

3. **Import Dynamically**: Ensure you disable SSR when importing components inside your pages to avoid canvas window mismatch errors:

   import dynamic from "next/dynamic";
   
   const BoxAsset = dynamic(() => import("@/components/3D/BoxAsset"), {
     ssr: false,
   });