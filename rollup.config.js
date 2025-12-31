import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import subpathExternals from 'rollup-plugin-subpath-externals';
// import { dts } from 'rollup-plugin-dts';
import clear from 'rollup-plugin-clear';
import pkg from './package.json' assert { type: 'json' };
import terser from '@rollup/plugin-terser';
import prettier from 'rollup-plugin-prettier';

const pkgName = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;

// banner
const banner =
  '/*!\n' +
  ` * ${pkg.name} v${pkg.version}\n` +
  ` * (c) 2023-present chandq\n` +
  ' * Released under the MIT License.\n' +
  ' */\n';
// 转换命名为驼峰命名
function transformCamel(str) {
  const re = /-(\w)/g;
  return str.replace(re, function ($0, $1) {
    return $1.toUpperCase();
  });
}
// umd的全局变量名
const moduleName = transformCamel(pkgName);

export default [
  // ESM build (JavaScript only)
  {
    input: `./src/index.ts`,
    output: {
      dir: 'dist/esm',
      format: 'es',
      entryFileNames: '[name].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
      banner
    },
    plugins: [
      clear({
        targets: ['dist']
      }),
      // Run plugin with prettier options.
      prettier({
        parser: 'typescript',
        tabWidth: 2,
        singleQuote: true
      }),
      // subpathExternals(pkg),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        include: ['src/**/*.ts'],
        declaration: false,
        outDir: 'dist/esm'
      }),
      json()
    ]
  },
  // CJS build (JavaScript only)
  {
    input: `./src/index.ts`,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: '[name].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
      banner
    },
    plugins: [
      // Run plugin with prettier options.
      prettier({
        parser: 'typescript',
        tabWidth: 2,
        singleQuote: true
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        include: ['src/**/*.ts'],
        declaration: false,
        outDir: 'dist/cjs'
      }),
      json()
    ]
  },
  // UMD build (JavaScript only)
  {
    input: `src/index.ts`,
    output: {
      dir: 'dist/umd',
      format: 'umd',
      entryFileNames: 'index.min.js',
      name: moduleName,
      banner
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        include: ['src/**/*.ts']
      }),
      json(),
      terser()
    ]
  }
];
