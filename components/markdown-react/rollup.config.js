import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import { terser } from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

const external = ['react', 'react-dom', 'marked'];

export default [
  {
    input: 'src/index.ts',
    plugins: [postcss({
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      use: {
        sass: {
          implementation: require('sass'),
        },
      },
      minimize: true,
      extract: true,
    })],
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/umd/index.min.js',
        format: 'umd',
        name: 'MarkdownReact',
        sourcemap: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        plugins: [terser()],
      },
    ],
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      babel({
        babelHelpers: 'runtime',
        presets: ['@babel/preset-react'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external,
    plugins: [dts()],
  },
];
