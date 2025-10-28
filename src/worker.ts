import { WebWorkerMLCEngineHandler, MLCEngine } from '@mlc-ai/web-llm';

// Dev-only suppression of noisy Chromium WebGPU warning inside the worker too
// Vite exposes import.meta.env in module workers; guard defensively.
const isDev = (() => {
  try {
    // @ts-ignore
    return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  } catch {
    return false;
  }
})();

if (isDev) {
  const patterns = [
    'powerpreference option is currently ignored when calling requestadapter() on windows',
    'crbug.com/369219127',
  ];

  const stringify = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.message;
    try {
      return String(v);
    } catch {
      return '';
    }
  };

  const shouldSuppress = (args: unknown[]) => {
    const text = args.map(stringify).join(' | ').toLowerCase();
    return patterns.some(p => text.includes(p));
  };

  const ow = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    ow(...args);
  };

  const oi = console.info.bind(console);
  console.info = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    oi(...args);
  };

  const ol = console.log.bind(console);
  console.log = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    ol(...args);
  };

  const oe = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    oe(...args);
  };
}

const engine = new MLCEngine();
const handler = new WebWorkerMLCEngineHandler(engine);

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
