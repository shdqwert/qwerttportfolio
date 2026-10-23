import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('matter-js')) return 'matter'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion'
        }
      }
    }
  }
})
