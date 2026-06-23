import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative asset URLs so the same build works on Cloudflare Pages at `/`
  // and on GitHub Pages under `/Maps/`.
  base: './',
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
