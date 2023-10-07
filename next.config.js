/* eslint-disable @typescript-eslint/no-var-requires */
/**  @type {(options?: import('unplugin-icons/resolver').ComponentResolverOption) => (name: string) => string | undefined} */
const IconsResolver = require('unplugin-icons/resolver')
/**  @type {(options?: import('unplugin-auto-import/types').Options) => any} */
const AutoImports = require('unplugin-auto-import/webpack')
/**  @type {(options?: import('unplugin-icons/types').Options) => any} */
const Icons = require('unplugin-icons/webpack')
// const UnoCSS = require('@unocss/webpack').default
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.tsx'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**'
      }
    ],
    dangerouslyAllowSVG: true
  },
  /**
   *
   * @param {import('webpack').Configuration} config
   * @returns
   */
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true // Enable Top Level Await
    }

    // UnoCSS Support
    config.plugins.unshift(
      // Transformers for Unocss, commented because it's blocked by #
      // UnoCSS({
      //   // content: {
      //   //   pipeline: {
      //   //     include: [/src\/.*\.(s?css|[jt]sx?)$/],
      //   //     exclude: []
      //   //   }
      //   // }
      // }),
      // Unplugin Auto Imports
      AutoImports({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.md$/ // .md
        ],
        eslintrc: {
          enabled: true
        },
        resolvers: [
          // Unplugin Icons
          IconsResolver({
            compiler: 'jsx',
            jsx: 'react'
          })
        ],
        imports: [
          {
            swr: [['default', 'useSWR']],
            'next/image': [['default', 'NImage']],
            'next/head': [['default', 'NHead']],
            'next/link': [['default', 'NLink']],
            'next/script': [['default', 'NScript']]
          }
        ],
        dirs: ['utils', 'hooks']
      }),
      Icons({
        compiler: 'jsx',
        jsx: 'react'
      })
    )
    config.optimization.realContentHash = true

    // YAML Support
    config.module.rules.unshift({
      test: /\.ya?ml$/,
      use: 'yaml-loader'
    })
    return config
  }
}

module.exports = withBundleAnalyzer(withNextIntl(nextConfig))
