import { defineConfig } from "@playwright/test";
import { STORAGE_STATE } from "./tests/e2e/fixtures/profile-accounts";

const SETUP_MATCH = /profile\.setup\.ts/;
const PROFILE_SPEC_MATCH = /user-profile\.spec\.ts/;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "profile-setup",
      testMatch: SETUP_MATCH,
    },
    {
      name: "e2e",
      testIgnore: PROFILE_SPEC_MATCH,
    },
    {
      name: "user-profile",
      dependencies: ["profile-setup"],
      testMatch: PROFILE_SPEC_MATCH,
      use: {
        storageState: STORAGE_STATE,
      },
    },
  ],
});
