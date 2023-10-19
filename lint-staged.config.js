module.exports = {
  '**.{ts,tsx}': [
    'sh -c \'tsc-files --noEmit $(find ./ -name "*.d.ts" -not -path "./node_modules/**") $0 $@\'',
    'eslint -c .eslintrc.js'
  ],
  '**.{js,jsx}': ['eslint -c .eslintrc.js'],
  '*.scss,*.css': ['stylelint --config .stylelintrc.json']
}
