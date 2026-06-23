import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Cloudflare Pages serves preview deployments from the domain root.
  // Absolute root assets keep deep-linked SPA routes from resolving JS/CSS
  // relative to the nested URL path.
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['@xyflow/react'],
          'search-vendor': ['fuse.js'],
        },
      },
    },
  },
})
