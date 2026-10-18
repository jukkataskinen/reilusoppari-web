import { defineConfig } from "vitest/config";
import path from "node:path";

const rootDir = import.meta.dirname;

export default defineConfig({
  // Komponenttien renderöinti testeissä (painikepalaute): tsconfigin jsx on preserve, joten kerrotaan automaattinen JSX-muunnos.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
      "@content": path.resolve(rootDir, "./content"),
    },
  },
});
