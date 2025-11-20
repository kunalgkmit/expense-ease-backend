// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",        // required for supertest
    globals: true,              // enables test(), expect(), etc globally
    setupFiles: ["./tests/auth.test.js"],
  },
});
