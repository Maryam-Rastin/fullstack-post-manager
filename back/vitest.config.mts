import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: {
      // Stops src/index.ts from calling app.listen() during tests
      VERCEL: "1",
      // Dummy value, so tests can never use your real Neon database.
      // dotenv does not override variables that are already set.
      POSTGRES_URL: "postgresql://test:test@localhost:5432/test",
    },
  },
});