import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Add this to fix the process.env error
  define: {
    'process.env': {}
  },
  // Optional: Add these for better development experience
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  }
});
