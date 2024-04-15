import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// rollup.config.mjs
export default {
  input: 'src/main.js',
  output: {
    file: 'app.js',
    format: 'esm',
  },
  plugins: [terser(), nodeResolve(), commonjs(), json()],
};
