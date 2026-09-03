import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';

export default tseslint.config(
  {
    ignores: ['dist/**', 'scripts/**', 'coverage/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'eslint-comments': eslintComments,
    },
    rules: {
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-use': 'error',
      'eslint-comments/require-description': 'error',
    },
  },
  {
    rules: {
      // TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Error handling
      '@typescript-eslint/only-throw-error': 'error',

      // General quality
      'no-undef': 'warn',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      eqeqeq: ['error', 'always'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
  },

  // Per-file overrides (keep minimal, document why)
  {
    files: ['src/types/express.ts'],
    rules: {
      // declare global { namespace Express { ... } } is the only valid TypeScript
      // mechanism for augmenting Express Request types — namespace is required here.
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  // Test files — disable type-aware linting (test patterns like supertest chaining,
  // mock data, and dynamic assertions conflict with strict type-checked rules).
  {
    files: ['tests/**/*.ts', 'vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: null,
      },
    },
    rules: {
      // Disable all type-aware rules inherited from strictTypeChecked + stylisticTypeChecked
      ...Object.fromEntries(
        Object.entries(tseslint.configs.disableTypeChecked.rules).map(([key]) => [key, 'off'])
      ),
      // Also disable non-type-aware strict rules that fight test patterns
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
);
