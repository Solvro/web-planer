import { vi } from "vitest";

export const pushFunction = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushFunction,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi
    .fn()
    .mockReturnValue(new Map([["XSRF-TOKEN", { value: "test-csrf-token" }]])),
}));
