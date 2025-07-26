import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import "./mocks/auth";
import { server } from "./mocks/server";
import "./mocks/utils";

process.env.NEXT_PUBLIC_API_URL = "http://localhost:3333";

class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

globalThis.ResizeObserver = ResizeObserver;

beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;

  window.HTMLElement.prototype.setPointerCapture = vi.fn();

  window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  Element.prototype.scrollIntoView = vi.fn();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
  window.localStorage.clear();
});
afterAll(() => {
  server.close();
});
