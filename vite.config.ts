import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
