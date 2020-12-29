import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import base from './base';


export default Object.assign(base, {
  plugins: [
    commonjs(),
    terser(),
    nodeResolve(),
  ],
  output: Object.assign(base.output, {
    file: 'dist/bundles/callbag-router.es6.min.js',
  }),
});
