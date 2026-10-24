import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./test/server";

// "error" makes any request without a handler fail loudly in tests,
// so a test can never reach a real API by accident.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());