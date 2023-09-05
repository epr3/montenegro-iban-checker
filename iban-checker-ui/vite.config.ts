/// <reference types="vitest" />
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./tests/setup.ts",
    coverage: {
      provider: "istanbul",
    },
  },
});
