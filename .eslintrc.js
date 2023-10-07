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
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react/jsx-no-undef': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['~', './']
        ],
        extensions: ['.tsx', '.ts', '.jsx', '.js']
      }
    }
  }
}
