import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // prerender.js reads it to link each route's CSS + JS chunks in the HTML
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('matter-js')) return 'matter'
          // Flip loads on idle (see engine.ts) — keep it out of the entry chunk
          if (/gsap[\/](dist[\/])?Flip/.test(id)) return 'flip'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion'
          // the shell + components every route renders: one chunk compresses
          // better than a dozen small ones
          const n = id.replace(/\\/g, '/')
          if (/\/src\/(app|motion|styles)\//.test(n) || /\/src\/content\/(shared|i18n|lang|en|images)\./.test(n)) return 'app'
          if (/\/src\/components\//.test(n) && !/(ConnectDrawer|Konami|Cursor|Intro|Playground|CaseBits|ScrollStage|Finale|TerminalFooter|BoardingFlight|FlightStart)\./.test(n)) return 'app'
        }
      }
    }
  }
})
