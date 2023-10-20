# PasteBin

A lightweight and modern paste bin and url shortener.

# Features

:yum: Next.js 13 with `App Directory` support
  - `RSC` (React State Component) for global state management and data fetching
  - `React Server Actions` for forms mutation
    - A React style full stack solution, a alternative to `tRPC`

:globe_with_meridians: I18n with `next-intl` 3 

:closed_lock_with_key: Auth with `next-auth` 5, including full OAuth support and basic credentials.
  - `next-auth` with `prisma` adapter, so that it is not support Edge environment in api route.
  - Credentials password hashed with `argon2`

:smirk: Auto Imports with `unplugin-auto-import` and `unplugin-icons`
  - Necessary `Next.js` components, utils, hooks, and icons are auto imported, so that you don't need to import them manually.

:shield: Validation with `zod`

:gem: Database ORM with `prisma`
  - Upcoming multi-drivers support, including `PostgreSQL`, `MySQL`, `SQLite`, `SQL Server`, and `MongoDB`

:atom_symbol: UI with `Chakra UI`

:gear: CSS utils library ~~`UnoCSS`~~, use `Tailwind CSS` instead.
  - `UnoCSS` is a better choice for `Tailwind CSS`, but there are issues blocked the use in `webpack` or `postcss`, waiting for the fix.

:screwdriver: Hooks library, provided by `react-use` and `ahooks`

:package: Package management with `bun`

:zap: Syntax highlight with `shikiji`

:nazar_amulet: Environment variables providing and validating with `@t3-oss/env`

:rainbow: `TypeScript` native support

:policeman: Lints and CI process with `husky` and `lint-staged`, checking via `eslint`, `tsc`, `prettier`, and `stylelint`

# Installation

You should define `database` related environment variables  in `.env.local` file before running the app.

It is required by `prisma` to generate database schema and types.

```bash
bun i # Install dependencies and generate database schema and types
```

# Development

```bash
bun dev
```

# Build

```bash
bun run build
```

# Preview

```bash
bun start
```
