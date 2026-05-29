import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
      "#components": path.resolve(__dirname, "./src/components"),
      "#hooks": path.resolve(__dirname, "./src/hooks"),
      "#utils": path.resolve(__dirname, "./src/utils"),
      "#services": path.resolve(__dirname, "./src/services"),
      "#store": path.resolve(__dirname, "./src/store"),
      "#types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
