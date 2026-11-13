// Ensure window.fetch has both a getter and a setter so browser extensions that monkeypatch fetch do not throw TypeError
if (typeof window !== 'undefined') {
  try {
    let _fetch = window.fetch ? window.fetch.bind(window) : undefined;
    Object.defineProperty(window, 'fetch', {
      get() {
        return _fetch;
      },
      set(val) {
        _fetch = val;
      },
      configurable: true,
      enumerable: true
    });
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          get() {
            return _fetch;
          },
          set(val) {
            _fetch = val;
          },
          configurable: true,
          enumerable: true
        });
      } catch (_) {}
    }
  } catch (_) {}
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
