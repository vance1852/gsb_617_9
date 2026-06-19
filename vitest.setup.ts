import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/vue";

afterEach(() => {
  cleanup();
});

// Suppress noisy "Failed to resolve directive: motion" warnings emitted by
// components that opt-in to @vueuse/motion which is not installed in unit tests.
const originalWarn = console.warn.bind(console);
vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("Failed to resolve directive: motion")) return;
  originalWarn(...(args as Parameters<typeof console.warn>));
});
