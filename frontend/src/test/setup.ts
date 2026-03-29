import '@testing-library/jest-dom';

import '../i18n';
import { server } from './msw-server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock window.location to allow setting href in tests
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost/', origin: 'http://localhost', pathname: '/' },
  writable: true,
});

// Mock ResizeObserver — not implemented in jsdom but used by Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Radix UI uses PointerEvent for dropdown interactions
if (!global.PointerEvent) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  global.PointerEvent = MouseEvent as any;
}

// Mock matchMedia — not implemented in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
