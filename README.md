# PasteBin

A lightweight and modern paste bin and url shortener.

# Features

- :yum: Next.js 13 with `App Directory` support
  - `RSC` (React State Component) for global state management and data fetching
  - `React Server Actions` for mutation
- :globe_with_meridians: I18n with `next-intl` 3 
- :closed_lock_with_key: Auth with `next-auth` 5, including full OAuth support and basic credentials.
  - `next-auth` with `prisma` adapter, so that it is not support Edge environment in api route.
  - Credentials password hashed with `argon2`
- :shield: Validation with `zod`
- :gem: Database ORM with `prisma`
  - Upcoming multi-drivers support, including `PostgreSQL`, `MySQL`, `SQLite`, `SQL Server`, and `MongoDB`
- :atom_symbol: UI with `Chakra UI`
- :gear: CSS utils library `UnoCSS`
- :screwdriver: Hooks library `react-use` and `ahooks`
- :package: Package management with `bun`
- :zap: Syntax highlight with `shikiji`
- :nazar_amulet: Environment variables provides and validation with `@t3-oss/env`
- :rainbow: `TypeScript` native support
- :policeman: Lints and CI process with `husky` and `lint-staged` with `eslint`, `tsc`, `prettier`, and `stylelint`

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
