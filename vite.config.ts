import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

const rootDir = import.meta.dirname

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.json',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx']
    })
  ],
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'classnames'],
      output: {
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? ''
          return name.endsWith('.css') ? 'style.css' : 'assets/[name][extname]'
        }
      }
    },
    cssCodeSplit: false
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true
  }
})
