module.exports = {
  '{src}/**.{ts,tsx,js,vue}': ['eslint -c .eslintrc.js'],
  '*.scss': ['stylelint --config .stylelintrc.json']
}
