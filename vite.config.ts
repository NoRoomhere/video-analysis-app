import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stripe: ['@stripe/stripe-js'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          utils: ['clsx', 'tailwind-merge', 'uuid']
        }
      },
      external: ['firebase']
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    exclude: ['firebase']
  }
});
