// vite.config.js (default config for dev/preview)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split out stable heavy libs so the main app entry chunk is smaller
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Keep everything else (including our icon meta + core app) in the main chunk for now
        },
      },
    },
    // Slightly more aggressive but safe minification
    minify: "esbuild",
    chunkSizeWarningLimit: 700,
  },
  // No build.lib here – this is for app mode
});
