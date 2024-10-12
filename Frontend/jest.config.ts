import nextJest from "next/jest.js";
import type { Config } from "jest";
const createJestConfig = nextJest({
  dir: "./",
});

/**  @type{import("jest").Config} */
const config: Config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

module.exports = createJestConfig(config);
