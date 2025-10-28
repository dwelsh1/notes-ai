import '@testing-library/jest-dom';

// Mock WebLLM
jest.mock('@mlc-ai/web-llm', () => ({
  CreateWebWorkerMLCEngine: jest.fn(() =>
    Promise.resolve({
      generate: jest.fn(() => Promise.resolve('Mocked AI response')),
      interruptGenerate: jest.fn(),
    })
  ),
}));

// Mock Web Workers
global.Worker = jest.fn(() => ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
}));

// Mock IndexedDB
const mockIndexedDB = {
  open: jest.fn(() => ({
    result: {
      createObjectStore: jest.fn(),
      transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve(null)),
          put: jest.fn(() => Promise.resolve()),
        })),
      })),
    },
    addEventListener: jest.fn(),
  })),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
});

// Mock WebGPU
Object.defineProperty(navigator, 'gpu', {
  value: {
    requestAdapter: jest.fn(() =>
      Promise.resolve({
        requestDevice: jest.fn(() => Promise.resolve({})),
      })
    ),
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
