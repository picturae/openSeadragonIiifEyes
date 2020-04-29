// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const name = 'openSeadragonIiifEyes'

export default {
  input: `src/index.js`,
  output: [
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name: name,
      sourcemap: true,
    },
    {
      file: `module/${name}.js`,
      format: 'esm',
      name: name,
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs({
      // to read umd dependencies
      include: 'node_modules/**',
    }),
    terser(),
  ],
}
