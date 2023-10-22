module.exports = {
  '**.{ts,tsx}': [
    'eslint -c .eslintrc.js',
    () => 'tsc -p tsconfig.json --noEmit'
  ],
  '**.{js,jsx}': ['eslint -c .eslintrc.js'],
  '*.scss,*.css': ['stylelint --config .stylelintrc.json']
}
