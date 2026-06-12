import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_URL is injected by the GitHub Actions workflow as /<repo-name>/
// When running locally with `npm run dev`, it defaults to '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  esbuild: {
    // Allow JSX in .jsx files without pragma comment
    jsxInject: undefined,
  },
})
