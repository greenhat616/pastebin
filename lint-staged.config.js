module.exports = {
  '**.{ts,tsx}': ['tsc-files --noEmit', 'eslint -c .eslintrc.js'],
  '**.{js,jsx}': ['eslint -c .eslintrc.js'],
  '*.scss,*.css': ['stylelint --config .stylelintrc.json']
}
