module.exports = {
  '**.{ts,tsx}': [
    'prettier --write',
    'eslint -c .eslintrc.js',
    () => 'tsc -p tsconfig.json --noEmit'
  ],
  '**.{js,jsx}': ['prettier --write', 'eslint -c .eslintrc.js'],
  '*.scss,*.css': ['stylelint --config .stylelintrc.json']
}
