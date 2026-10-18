import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Cloudflare Pages serves this app from the site root, not /Maps/.
  // Keeping the base path at / ensures the production build references
  // compiled assets from /assets/... instead of /Maps/assets/...
  base: '/',
  plugins: [react()],
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
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
