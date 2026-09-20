import { afterEach, beforeAll, vi } from "vitest";

beforeAll(() => {
  // Placeholder: integration setup extended when DB-backed tests land.
});

afterEach(() => {
  // Same per-test contract as the unit setup: stubbed env/globals never
  // leak across cases (clearMocks/restoreMocks run from config).
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
