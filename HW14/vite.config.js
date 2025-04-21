import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      // Map to three.js
      'three': './js/three.js-master/build/three.module.js'
    }
  }
})