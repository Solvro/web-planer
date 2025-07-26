import { vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (key: string) => ({ name: key, value: "mocked-value" }),
  }),
}));

vi.mock("@/lib/auth", () => ({
  getAccessToken: vi.fn(() => ({ token: "mock", secret: "mock" })),
  getRequestToken: vi.fn(() => ({
    token: "mock-token",
    secret: "mock-secret",
  })),
  auth: vi.fn(() => ({ id: 1, name: "Mock User" })),
  fetchToAdonis: vi.fn(() => ({ data: "mocked data" })),
}));
