const g = globalThis as typeof globalThis & { window: Record<string, unknown> };

g.window = {
  navigator: { userAgent: "vitest-node" },
  close: () => {},
  location: { reload: () => {} },
};
