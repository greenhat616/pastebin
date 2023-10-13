import { loadEnv } from '@/utils/app'
import { getDictionaries } from '@/utils/fs'
import chalk from 'chalk'
import { spawn } from 'node:child_process'
import path from 'path'

const rootDir = path.resolve(__dirname, '../../')
loadEnv()

async function main() {
  // Get all supported drivers

  const drivers = await getDictionaries(path.join(rootDir, './prisma'))
  console.log(
    `${chalk.green('✓')} Found ${chalk.cyan(drivers.length)} drivers.`
  )
  // list all drivers
  console.log(chalk.cyan('Drivers:'))
  console.log(drivers.map((v) => `  - ` + v).join('\n'))

  // run prisma generate, and pipe the output to stdout, stderr, and stdin of the current process
  console.log(chalk.cyan('Generating...'))
  for (const driver of drivers) {
    console.log(chalk.cyan(`  - ${driver}`))
    await new Promise<void>((resolve, reject) => {
      const p = spawn(
        `pnpm prisma generate --schema=./prisma/${driver}/schema.prisma`,
        {
          shell: true,
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: rootDir,
          env: process.env
        }
      )
      p.on('error', reject)
      p.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`prisma generate failed with code ${code}`))
        }
      })
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
