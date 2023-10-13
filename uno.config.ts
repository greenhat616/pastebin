import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
export default defineConfig({
  content: {
    filesystem: ['**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}']
    // codes below are commented out because they're required by `@unocss/webpack` to process `@import` and `@apply` directives,
    // and the usage of `@unocss/webpack` is blocked by the issue https://github.com/unocss/unocss/issues/3198
    // pipeline: {
    //   // include: [/src\/.*\.(s?css|[jt]sx?)$/],
    //   include: [/\.([jt]sx|mdx?|html|s?css)($|\?)/],
    //   exclude: []
    // }
  },
  presets: [
    presetUno({
      dark: {
        dark: '.dark-mode',
        light: '.light-mode'
      }
    }),
    presetIcons(),
    presetAttributify(),
    presetRemToPx()
  ],
  rules: [
    [
      /^bg-gradient-(\d+)$/,
      ([, d]) => ({
        '--un-gradient-shape': `${d}deg;`,
        '--un-gradient': 'var(--un-gradient-shape), var(--un-gradient-stops);',
        'background-image': 'linear-gradient(var(--un-gradient));'
      })
    ],
    [
      /^-bg-gradient-(\d+)$/,
      ([, d]) => ({
        '--un-gradient-shape': `-${d}deg;`,
        '--un-gradient': 'var(--un-gradient-shape), var(--un-gradient-stops);',
        'background-image': 'linear-gradient(var(--un-gradient));'
      })
    ],
    [
      'font-noto-serif',
      {
        'font-family': '"Noto Serif SC", "Noto Serif TC", serif'
      }
    ],
    [
      'font-code',
      {
        'font-family':
          '"Cascadia Code", var(--font-fira-code), SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      }
    ]
  ],
  transformers: [
    transformerDirectives({
      enforce: 'pre'
    }),
    transformerCompileClass({
      classPrefix: 'ouo-',
      trigger: /(["'`]):ouo(?:-)?(?<name>[^\s\1]+)?:\s([^\1]*?)\1/g
    }),
    transformerVariantGroup()
  ]
})
