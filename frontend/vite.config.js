

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles.scss";`, // Only for SCSS files
      },
    },
  },
  server: {
    port: 5173, // Ensure frontend runs on port 5173
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes "/api" prefix
      },
    },
  },
  build: {
    outDir: "dist",
  },
  base: "/",
});
