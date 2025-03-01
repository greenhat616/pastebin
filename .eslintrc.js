module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json'
  ],
  rules: {
    'react/jsx-no-undef': 'off',
    '@typescript-eslint/no-empty-object-type': 'warn',
    'no-console': [
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
      { allow: ['warn', 'error'] }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'off' // turn off prettier rules due to conflict, and should be handled by prettier itself
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-undef': 'off', // should be off for typescript
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    }
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  }
}
