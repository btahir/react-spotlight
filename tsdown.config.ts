import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@floating-ui/react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
