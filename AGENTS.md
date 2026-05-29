# AGENTS.md

## Monorepo boundaries

- **pnpm workspaces** cover only `apps/*` and `packages/*` (see `pnpm-workspace.yaml`).
- **`backend/` is NOT in the workspace.** Go module lives at `backend/go.mod`. Turbo does not orchestrate Go.
- **`packages/`** is reserved for shared TS code between `web` and `mobile`. Empty for now.

## Package manager

- **pnpm 10.30.3 ONLY.** Enforced in root `package.json` (`packageManager` field). Never use npm or yarn.

## Framework versions and quirks

- **Next.js 16.2.6** — breaking changes vs 14/15. Check `apps/web/node_modules/next/dist/docs/` before writing code. See also `apps/web/AGENTS.md`.
- **Expo SDK 56** — breaking changes. Check docs at https://docs.expo.dev/versions/v56.0.0/. See also `apps/mobile/AGENTS.md`.
- **Tailwind CSS v4** (web only) — no `tailwind.config.ts`. Theme defined via `@theme inline` in CSS. Uses `@import "tailwindcss"` instead of `@tailwind` directives.
- **ESLint flat config** (`eslint.config.mjs`) — web only. Mobile has no lint setup.

## Commands

```bash
# Root (all apps)
pnpm dev          # turbo dev
pnpm build        # turbo build
pnpm lint         # turbo lint
pnpm clean        # turbo clean
pnpm format       # prettier across all TS/JS/JSON/MD

# Individual dev
pnpm dev:api      # Go + air hot-reload (:8080)
pnpm dev:web      # Next.js Turbopack
pnpm dev:mobile   # Expo dev server

# Individual build
pnpm build:api    # go build → backend/bin/server
pnpm build:web    # next build
pnpm build:mobile # expo build

# Individual deploy
pnpm deploy:web     # next build (production)
pnpm deploy:mobile  # expo export --platform web

# Go tests
pnpm test:api      # go test ./...

# Mobile native
cd apps/mobile && npx expo start --ios
cd apps/mobile && npx expo start --android
```

## Architecture

```
apps/web/     → Next.js App Router (src/app/), Tailwind v4, Turbopack dev
apps/mobile/  → Expo SDK 56, RN 0.85, blank-typescript
backend/      → Go 1.26, cmd/server entrypoint, air hot-reload
packages/     → future shared libs
```

## Gotchas

- No test runner configured yet in any package.
- React versions differ between web (19.2.4) and mobile (19.2.3). Do not expect to alias them.
