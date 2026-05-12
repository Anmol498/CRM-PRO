import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  format: ['cjs'],
  sourcemap: false,
  clean: true,
  noExternal: ['@travel-crm/shared'],
});
