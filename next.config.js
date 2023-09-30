/* eslint-disable @typescript-eslint/no-var-requires */
/**  @type {(options?: import('unplugin-icons/resolver').ComponentResolverOption) => (name: string) => string | undefined} */
const IconsResolver = require('unplugin-icons/resolver')
/**  @type {(options?: import('unplugin-auto-import/types').Options) => any} */
const AutoImports = require('unplugin-auto-import/webpack')
/**  @type {(options?: import('unplugin-icons/types').Options) => any} */
const Icons = require('unplugin-icons/webpack')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(
      AutoImports({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.md$/ // .md
        ],
        eslintrc: {
          enabled: true
        },
        resolvers: [
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
        ]
      })
    )
    config.plugins.push(
      Icons({
        compiler: 'jsx',
        jsx: 'react'
      })
    )

    return config
  }
}

module.exports = withBundleAnalyzer(nextConfig)
