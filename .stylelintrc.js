module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-html/vue'
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties'
  ],
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    '**/typings/**/*',
    'public/css/**/*'
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'unocss',
          'layer',
          'apply',
          'variants',
          'responsive',
          'screen'
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['**/*.scss', '*.scss'],
      customSyntax: require('postcss-scss'),
      rules: {
        "at-rule-no-unknown": null,
        "scss/at-rule-no-unknown": [
          true,
          {
            ignoreAtRules: [
              'tailwind',
              'unocss',
              'layer',
              'apply',
              'variants',
              'responsive',
              'screen'
            ]
          }
        ],
      }
    }
  ]
}
