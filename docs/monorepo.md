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
backend/      → Go 1.26, Gin + GORM + PostgreSQL, domain-driven modules
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

## Dependency policy

Before adding or upgrading any library in web, mobile, or backend, run these validations in order:

### 1. Security audit

```bash
# JS packages (web / mobile)
pnpm audit

# Go packages (backend)
cd backend && govulncheck ./...
```

If any vulnerability is found, resolve it or choose an alternative before proceeding.

### 2. Context7 version check

Use Context7 MCP to fetch current documentation:

1. `resolve-library-id` with the library name and the task at hand
2. `query-docs` with the selected ID to confirm latest stable version, breaking changes, and compatibility notes

Prefer libraries with **High/Medium** source reputation and **Benchmark Score > 75**.

### 3. Core compatibility

Verify the new dependency works with current core runtimes:

| Platform | Core runtimes                                |
| -------- | -------------------------------------------- |
| Web      | React 19.2.4, Next.js 16.2.6, Tailwind v4    |
| Mobile   | React 19.2.3, Expo SDK 56, React Native 0.85 |
| Backend  | Go 1.26                                      |

Check peer dependencies, minimum version requirements, and known incompatibilities via Context7.

### 4. Approval checklist

- [ ] `pnpm audit` or `govulncheck` passed
- [ ] Context7 confirms latest stable version
- [ ] Compatible with core runtimes (no peer dep conflicts)
- [ ] Source reputation High or Medium
- [ ] `pnpm install` succeeds without warnings

### Upgrading existing dependencies

When bumping a version, always fetch version-specific docs via Context7 before the upgrade, especially for:

- Next.js, React, React DOM
- Expo, React Native, expo-\* packages
- Any lib with a major version bump

## Shared gotchas

- No test runner configured yet in any JS/TS package.
- React versions differ: web (19.2.4) vs mobile (19.2.3). Do not alias them.
- Go is not orchestrated by turbo — use individual scripts (`pnpm dev:api`, `pnpm build:api`, `pnpm test:api`).
