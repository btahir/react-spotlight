import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/spotlight.css'],
  format: ['esm'],
  dts: true,
  clean: true,
  deps: {
    neverBundle: ['react', 'react-dom', '@floating-ui/react-dom'],
  },
})
