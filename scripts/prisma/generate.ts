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

  // Get configured driver
  const configuredDriver = process.env.DB_ADAPTER || ''
  if (!drivers.includes(configuredDriver)) {
    console.error(
      `${chalk.red('✗')} ${chalk.cyan(
        configuredDriver
      )} is not a supported driver.`
    )
    console.error(
      `Please set the ${chalk.cyan(
        'DB_ADAPTER'
      )} environment variable to one of the following:`
    )
    console.error(drivers.map((v) => `  - ` + v).join('\n'))
    process.exit(1)
  }
  // run prisma generate, and pipe the output to stdout, stderr, and stdin of the current process
  console.log(chalk.cyan('Generating...'))
  console.log(chalk.cyan(`  - ${configuredDriver}`))
  const command = `./node_modules/.bin/prisma generate --schema=./prisma/${configuredDriver}/schema.prisma`
  console.log(chalk.gray(`    $ ${chalk.reset(command)}`))
  await new Promise<void>((resolve, reject) => {
    const p = spawn(command, {
      shell: true,
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: rootDir,
      env: process.env
    })
    p.on('error', reject)
    p.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`prisma generate failed with code ${code}`))
      }
    })
  })
  // for (const driver of drivers) {
  //   console.log(chalk.cyan(`  - ${driver}`))
  //   await new Promise<void>((resolve, reject) => {
  //     const p = spawn(
  //       `pnpm prisma generate --schema=./prisma/${driver}/schema.prisma`,
  //       {
  //         shell: true,
  //         stdio: [process.stdin, process.stdout, process.stderr],
  //         cwd: rootDir,
  //         env: process.env
  //       }
  //     )
  //     p.on('error', reject)
  //     p.on('exit', (code) => {
  //       if (code === 0) {
  //         resolve()
  //       } else {
  //         reject(new Error(`prisma generate failed with code ${code}`))
  //       }
  //     })
  //   })
  // }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
