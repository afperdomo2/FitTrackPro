# Monorepo

## Package manager

- **pnpm 10.30.3 ONLY.** Enforced in `package.json` (`packageManager` field). Never use npm or yarn.
- `pnpm-workspace.yaml` covers `apps/*` and `packages/*`.
- `backend/` is **not** in the workspace. Go lives outside pnpm.

## Turborepo

- `turbo.json` orchestrates `build`, `dev`, `lint`, `clean`, `deploy`, `deploy:web`.
- `pnpm dev` runs all apps in parallel (persistent). `pnpm build` runs with `^` dependency.
- Go backend tasks (api) are not managed by turbo — see `docs/backend/commands.md`.

## Architecture

```
apps/web/     → Next.js App Router (src/app/), Tailwind v4, Turbopack dev
apps/mobile/  → Expo SDK 56, RN 0.85, blank-typescript
backend/      → Go 1.26, cmd/server entrypoint, air hot-reload
packages/     → reserved for shared TS code (empty)
```

## Global scripts

```bash
pnpm dev          # turbo dev (all apps)
pnpm build        # turbo build (all apps)
pnpm lint         # turbo lint
pnpm clean        # turbo clean
pnpm format       # prettier across all TS/JS/JSON/MD
```

## Shared gotchas

- No test runner configured yet in any JS/TS package.
- React versions differ: web (19.2.4) vs mobile (19.2.3). Do not alias them.
- Go is not orchestrated by turbo — use individual scripts (`pnpm dev:api`, `pnpm build:api`, `pnpm test:api`).
