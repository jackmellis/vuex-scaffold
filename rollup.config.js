import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vuex-scaffold.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/vuex-scaffold.es.js',
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['vue', 'curry']
};
