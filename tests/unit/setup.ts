import type { SetupServerApi } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Worker-startup budget: this file runs in every forked worker before any
// test, so it must stay light. Heavy modules (MSW plus its interceptor
// chain, jest-dom) load lazily inside `beforeAll` — after the startup clock
// stops — instead of at the top level. Database clients must never be
// imported here; connect per-test (or per-file) so idle workers pay nothing.
let server: SetupServerApi | undefined;

beforeAll(async () => {
  await import("@testing-library/jest-dom/vitest");
  const { server: mockServer } = await import("@/mocks/server");
  server = mockServer;
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server?.resetHandlers();
});

afterAll(() => {
  server?.close();
});
