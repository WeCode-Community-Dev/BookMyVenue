module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['check-file'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'import/default': 'off',
    'import/no-unresolved': ['error', { ignore: ['^node:'] }],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          { target: './src/features/auth', from: './src/features', except: ['./auth'] },
          { target: './src/features/venues', from: './src/features', except: ['./venues'] },
          {
            target: './src/features/bookings',
            from: './src/features',
            except: ['./bookings'],
          },
          { target: './src/features/owner', from: './src/features', except: ['./owner'] },
          { target: './src/features', from: './src/app' },
          {
            target: ['./src/components', './src/hooks', './src/lib', './src/utils', './src/config', './src/stores'],
            from: ['./src/features', './src/app'],
          },
        ],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        'src/components/ui/**': 'PASCAL_CASE',
        'src/**/*.{js,jsx}': 'KEBAB_CASE',
      },
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/!(__tests__)': 'KEBAB_CASE',
      },
    ],
  },
  ignorePatterns: ['dist', 'vite.config.js'],
  overrides: [
    {
      files: ['src/components/ui/**/*'],
      rules: {
        'check-file/filename-naming-convention': 'off',
      },
    },
  ],
};
