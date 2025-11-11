import { server } from "./src/mocks/server";

import "@testing-library/jest-dom";
import "whatwg-fetch";

// Mock Next.js App Router navigation
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset handlers & mock functions after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up when tests end
afterAll(() => server.close());
