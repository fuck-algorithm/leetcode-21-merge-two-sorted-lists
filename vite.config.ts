import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 55032
  },
  base: '/leetcode-21-merge-two-sorted-lists/'
})
