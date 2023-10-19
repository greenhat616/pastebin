module.exports = {
  '**.{ts,tsx}': [
    'sh -c \'tsc-files --noEmit $(find ./src -name *.d.ts ! -path "./src/.*/*") $0 $@\'',
    'eslint -c .eslintrc.js'
  ],
  '**.{js,jsx}': ['eslint -c .eslintrc.js'],
  '*.scss,*.css': ['stylelint --config .stylelintrc.json']
}
