import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import generateCaseIndex from './tooling/vite-plugins/generate-case-index'

export default defineConfig({
  plugins: [react(), tailwindcss(), generateCaseIndex()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup/vitest.ts',
    css: true,
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/component/**/*.test.{ts,tsx}'],
  },
})
