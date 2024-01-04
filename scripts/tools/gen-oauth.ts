import pkg from '@/package.json'
import { getRuntimeMode, loadEnv } from '@/utils/app'
import chalk from 'chalk'
import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'path'
const mode = getRuntimeMode()
const rootDir = path.resolve(__dirname, '../../')

loadEnv()

async function main() {
  console.log(
    chalk.cyan(`[gen-oauth] Generating OAuth providers for ${mode}...`)
  )
  const imports = []
  const drivers = []
  const { authConfig } = await import('@/libs/auth/config')
  for (const provider of authConfig.providers) {
    console.log(
      chalk.gray('Detected provider:'),
      chalk.yellow(provider.name),
      provider.id === 'credentials' ? 'skipped.' : 'generating...'
    )
    if (provider.id === 'credentials') continue
    imports.push(
      `import ${provider.name}Icon from '~icons/mdi/${
        pkg?.oauth?.[provider.id as keyof typeof pkg.oauth] || provider.id
      }'`
    )
    drivers.push(`{
      id: '${provider.id}',
      name: '${provider.name}',
      icon: <${provider.name}Icon />
    }`)
  }

  const result =
    imports.join('\n') +
    '\n' +
    `export const providers = [${drivers.join(',\n')}]`

  console.log(chalk.green('[gen-oauth] Writing to file...'))
  const filePath = path.resolve(rootDir, 'libs/auth/providers.tsx')
  await fs.writeFile(filePath, result, 'utf-8')

  console.log('Do format and lint...')
  execSync(
    path.resolve(rootDir, 'node_modules/.bin/prettier --write ' + filePath)
  )
  execSync(path.resolve(rootDir, 'node_modules/.bin/eslint --fix ' + filePath))
  console.log(chalk.green('[gen-oauth] Done!'))
}

main()
