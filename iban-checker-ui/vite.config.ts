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
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/config/index.ts",
        "src/lib/axios.ts",
        "src/server/**/*.ts",
        "src/context/**/*.{ts,tsx}",
      ],
      provider: "v8",
    },
  },
});
