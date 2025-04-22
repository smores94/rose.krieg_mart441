import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      'three': path.resolve(__dirname, 'js/three.js-master/build/three.module.js'),
    }
  }
});
