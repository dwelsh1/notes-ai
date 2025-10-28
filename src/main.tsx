import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';

// Dev-only console filtering for noisy extension/Chromium messages
if (import.meta.env.DEV) {
  const suppressedErrorPatterns = [
    'attempting to use a disconnected port object',
  ];
  const suppressedGeneralPatterns = [
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

  const shouldSuppressAny = (args: unknown[], patterns: string[]): boolean => {
    const joined = args.map(stringify).join(' | ').toLowerCase();
    return patterns.some(p => joined.includes(p));
  };

  window.addEventListener('error', event => {
    if (shouldSuppressAny([event.message], suppressedErrorPatterns)) {
      event.preventDefault();
    }
  });

  const originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (shouldSuppressAny(args, suppressedErrorPatterns)) return;
    originalConsoleError(...args);
  };

  const originalConsoleWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (shouldSuppressAny(args, suppressedGeneralPatterns)) return;
    originalConsoleWarn(...args);
  };

  const originalConsoleInfo = console.info.bind(console);
  console.info = (...args: unknown[]) => {
    if (shouldSuppressAny(args, suppressedGeneralPatterns)) return;
    originalConsoleInfo(...args);
  };

  const originalConsoleLog = console.log.bind(console);
  console.log = (...args: unknown[]) => {
    if (shouldSuppressAny(args, suppressedGeneralPatterns)) return;
    originalConsoleLog(...args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
