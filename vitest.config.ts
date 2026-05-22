import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    testTimeout: 30000,
    // `threads` isolates each test file in its own worker, keeping module
    // mocks from leaking across the suite (which `vmThreads` allowed).
    pool: "threads",
    env: {
      BACKEND_URL: "http://test-backend",
    },
    coverage: {
      // Istanbul instruments at transform time, so coverage is collected
      // reliably under the jsdom environment (v8 coverage was not).
      provider: "istanbul",
      reporter: ["text", "text-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/types/**",
        "src/components/ui/**",
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
        "src/**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
