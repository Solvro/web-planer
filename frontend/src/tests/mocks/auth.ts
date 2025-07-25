import { vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getAccessToken: vi.fn(() =>
    Promise.resolve({ token: "mock", secret: "mock" }),
  ),
  getRequestToken: vi.fn(() =>
    Promise.resolve({ token: "mock-token", secret: "mock-secret" }),
  ),
  auth: vi.fn(() => Promise.resolve({ id: 1, name: "Mock User" })),
  fetchToAdonis: vi.fn(() => Promise.resolve({ data: "mocked data" })),
}));
