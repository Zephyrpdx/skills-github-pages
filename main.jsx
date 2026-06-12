import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// ── window.storage polyfill ──────────────────────────────────────────────────
// The existing lesson modules use window.storage (a Claude artifact API).
// This polyfill provides the same async interface backed by localStorage.
window.storage = {
  async set(key, value) {
    try {
      localStorage.setItem('skills:' + key, value)
    } catch (e) {
      console.warn('storage.set failed:', e)
    }
  },
  async get(key) {
    const value = localStorage.getItem('skills:' + key)
    if (value === null) throw new Error('Key not found: ' + key)
    return { value }
  },
}

// ── Anthropic API fetch interceptor ─────────────────────────────────────────
// The existing modules call https://api.anthropic.com/v1/messages with no auth
// headers (the Claude artifact environment injected auth automatically). This
// interceptor adds the required headers using the API key stored in localStorage.
const _originalFetch = window.fetch.bind(window)
window.fetch = (url, options = {}) => {
  if (typeof url === 'string' && url.includes('api.anthropic.com')) {
    const apiKey = localStorage.getItem('anthropic-api-key') || ''
    options = {
      ...options,
      headers: {
        ...options.headers,
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }
  }
  return _originalFetch(url, options)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
