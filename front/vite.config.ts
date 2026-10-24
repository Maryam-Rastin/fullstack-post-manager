import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
  environment: "jsdom",
  environmentOptions: { jsdom: { url: "http://localhost:3001" } },
  setupFiles: "./src/setupTests.ts",
  env: { VITE_API_URL: "http://localhost:3001/api/" },
},
});
