import { vi } from "vitest";

export const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: push,
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
// vi.mock("@/actions/get-faculties", () => ({
//   cookies: vi
//     .fn()
//     .mockReturnValue(new Map([["XSRF-TOKEN", { value: "test-csrf-token" }]])),
// }));
