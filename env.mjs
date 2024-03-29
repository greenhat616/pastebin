import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DB_ADAPTER: z
      .enum(['postgresql', 'mongodb', 'mysql'])
      .default('postgresql'),
    PG_URL: z.string().url().optional(),
    PG_DIRECT_URL: z.string().url().optional(),
    CRON_TASK_TOKEN: z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1)
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR: z
      .string()
      .url()
      .optional()
      .default('https://cravatar.cn/avatar/{hash}?d=mm&s=500')
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    PG_URL: process.env.PG_URL,
    PG_DIRECT_URL: process.env.PG_DIRECT_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR:
      process.env.NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR,
    CRON_TASK_TOKEN:
      process.env.CRON_SECRET || // This is provided by Vercel
      process.env.CRON_TASK_TOKEN // This is provided by us, to customize the token
  }
})
