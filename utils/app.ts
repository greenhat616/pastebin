import { RuntimeMode } from '@/enums/app'
import { config } from 'dotenv'
import path from 'node:path'

export function getRuntimeMode(): RuntimeMode {
  return !process.env.NODE_ENV
    ? RuntimeMode.Development
    : process.env.NODE_ENV.toLowerCase() === 'production'
      ? RuntimeMode.Production
      : process.env.NODE_ENV.toLowerCase() === 'test'
        ? RuntimeMode.Test
        : RuntimeMode.Development
}

/**
 * Load environment variables from .env files
 * This helpers is used in scripts.
 *
 * Load order, ref: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order
 * @param {RuntimeMode|undefined} mode - runtime mode
 */
export function loadEnv(mode?: RuntimeMode): void {
  if (!mode) mode = getRuntimeMode()
  const rootPath = path.resolve(__dirname, '../')
  // 1. process.env
  // 2. load .env.[mode].local
  switch (mode) {
    case RuntimeMode.Development:
      config({ path: path.join(rootPath, '.env.development.local') })
    case RuntimeMode.Production:
      config({ path: path.join(rootPath, '.env.production.local') })
    case RuntimeMode.Test:
      config({ path: path.join(rootPath, '.env.test.local') })
  }
  // 3. load .env.local
  config({ path: path.join(rootPath, '.env.local') })
  // 4. load .env.[mode]
  switch (mode) {
    case RuntimeMode.Development:
      config({ path: path.join(rootPath, '.env.development') })
    case RuntimeMode.Production:
      config({ path: path.join(rootPath, '.env.production') })
    case RuntimeMode.Test:
      config({ path: path.join(rootPath, '.env.test') })
  }
  // 5. load .env
  config({ path: path.join(rootPath, '.env') })
}
