import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";
import assetOptimizerPlugin from "./vite/__plugins/asset-optimizer-plugin";

export default defineConfig({
  base: "/v2/",
  build: {
    outDir: "dist/v2",
  },
  plugins: [react(), tailwind(), assetOptimizerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/web"),
    },
  },
  server: {
    port: 4200,
    strictPort: true,
  },
});
