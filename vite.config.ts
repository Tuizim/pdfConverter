import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// worker.format 'es' is required: mupdf's WASM loader relies on top-level
// await, which only runs correctly when the worker bundle itself is ESM.
export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
  },
  // O app já depende de OPFS, workers de módulo e mupdf-wasm (que usa
  // top-level await), recursos só existentes em navegadores modernos.
  // Um target mais conservador quebra o build do worker sem trazer
  // compatibilidade real com nada que o app suporte de qualquer forma.
  build: {
    target: 'es2022',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['mupdf'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
