// @ts-check

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'generated',
      'node_modules',
      'eslint.config.mjs',
    ],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      sourceType: 'module',

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      /*
       * Typescript
       */
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-floating-promises': 'error',

      '@typescript-eslint/no-misused-promises': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/consistent-type-definitions': [
        'error',
        'interface',
      ],

      '@typescript-eslint/no-unnecessary-condition': 'error',

      '@typescript-eslint/no-confusing-void-expression': 'error',

      '@typescript-eslint/await-thenable': 'error',

      '@typescript-eslint/require-await': 'error',

      /*
       * General
       */
      'eqeqeq': [
        'error',
        'always',
      ],

      'curly': [
        'error',
        'all',
      ],

      'no-console': 'error',

      'no-debugger': 'error',

      /*
       * Prettier
       */
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
);