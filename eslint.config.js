import js from '@eslint/js';

export default [
  js.config({
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  })
];
