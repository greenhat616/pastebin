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
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
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
    config.plugins.push(
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
            prefix: 'i',
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
        dirs: ['utils', 'hooks', 'libs']
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

    // SVGR Support
    // Grab the existing rule that handles SVG imports
    // const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    // config.module.rules.push(
    //   // Reapply the existing rule, but only for svg imports ending in ?url
    //   {
    //     ...fileLoaderRule,
    //     test: /\.svg$/i,
    //     resourceQuery: /url/, // *.svg?url
    //   },
    //   // Convert all other *.svg imports to React components
    //   {
    //     test: /\.svg$/i,
    //     issuer: fileLoaderRule.issuer,
    //     resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
    //     use: ['@svgr/webpack'],
    //   }
    // )

    // // Modify the file loader rule to ignore *.svg, since we have it handled now.
    // fileLoaderRule.exclude = /\.svg$/i
    return config
  }
}

module.exports = withBundleAnalyzer(withNextIntl(nextConfig))
