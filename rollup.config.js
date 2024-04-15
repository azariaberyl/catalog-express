import { terser } from 'rollup-plugin-terser';

// rollup.config.mjs
export default {
  input: 'src/main.js',
  output: {
    file: 'app.js',
    format: 'es',
  },
  plugins: [terser()],
};
