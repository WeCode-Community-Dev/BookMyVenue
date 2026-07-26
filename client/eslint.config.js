import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';

export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'eslint-comments': eslintComments,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'eslint-comments/no-use': ['error', { allow: [] }],
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'error',
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}', 'src/context/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/incompatible-library': 'off'
    }
  },
  {
    files: ['src/pages/listVenue/addVenue/components/FinishStep.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off'
    }
  },
  {
    files: ['src/pages/Auth/resetPassword/index.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'off'
    }
  }
]);
