import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
import transformerCompileClass from '@unocss/transformer-compile-class'
import transformerVariantGroup from '@unocss/transformer-variant-group'
export default defineConfig({
  presets: [
    presetUno({
      dark: {
        dark: '.dark-mode',
        light: '.light-mode'
      }
    }),
    presetIcons(),
    presetAttributify()
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
    ]
  ],
  transformers: [
    transformerCompileClass({
      classPrefix: 'ouo-'
    }),
    transformerVariantGroup()
  ]
})
