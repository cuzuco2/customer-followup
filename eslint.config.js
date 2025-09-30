import js from '@eslint/js';
import airbnbBase from 'eslint-config-airbnb-base';
import babelParser from '@babel/eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        allowImportExportEverywhere: true,
        sourceType: 'module',
        requireConfigFile: false,
      },
      globals: {
        browser: true,
      },
    },
    rules: {
      ...airbnbBase.rules,
      'import/extensions': ['error', { js: 'always' }],
      'linebreak-style': ['error', 'unix'],
      'no-param-reassign': [2, { props: false }],
    },
  },
];