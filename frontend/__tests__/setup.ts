import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import ResizeObserver from "resize-observer-polyfill";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "../mocks/server";

process.env.NEXT_PUBLIC_API_URL = "http://localhost:3333/api";
process.env.SKIP_ENV_VALIDATION = "true";

globalThis.ResizeObserver = ResizeObserver;

const takeRecordsMock = () => [];

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(takeRecordsMock);
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// Mock pointer capture methods for Radix UI components
Element.prototype.hasPointerCapture = vi.fn();
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

Element.prototype.scrollIntoView = vi.fn();

// Mock additional DOM methods that might be missing in JSDOM
Element.prototype.scroll = vi.fn();
Element.prototype.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
