import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const playgroundDir = import.meta.dirname

export default defineConfig({
  root: playgroundDir,
  server: { port: 5173 },
  resolve: {
    alias: {
      '@datav/react-ts': resolve(playgroundDir, '../src/index.ts')
    }
  }
})
