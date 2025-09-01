// TODO: Add msw

import "@testing-library/jest-dom";
import { server } from "./src/mocks/server";

// Mock for Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any request handlers during tests
afterEach(() => server.resetHandlers());

// Clean up after tests
afterAll(() => server.close());

// Mock for Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockPrefetch = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
}));

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any request handlers during tests
afterEach(() => {
  server.resetHandlers();
  mockPush.mockClear();
  mockReplace.mockClear();
  mockRefresh.mockClear();
  mockPrefetch.mockClear();
});

// Clean up after tests
afterAll(() => server.close());
