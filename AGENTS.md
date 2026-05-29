# AGENTS.md

## Quick rules

- **pnpm 10.30.3 ONLY** (enforced in `package.json`). Never npm or yarn.
- **`backend/` is NOT in the pnpm workspace.** Go is managed separately with `make`.
- **`packages/`** is reserved for shared TS code. Empty for now.

## Docs

Platform-specific rules and commands live in `docs/`:

| File | Content |
|------|---------|
| `docs/monorepo.md` | Turborepo, pnpm workspaces, global scripts, architecture |
| `docs/web/rules.md` | Next.js 16, Tailwind v4, ESLint, structure |
| `docs/web/commands.md` | dev, build, deploy, lint |
| `docs/mobile/rules.md` | Expo SDK 56, RN 0.85, structure |
| `docs/mobile/commands.md` | dev, native, build, deploy |
| `docs/backend/rules.md` | Go module, air hot-reload, structure |
| `docs/backend/commands.md` | make targets, go test, go build |

## Framework version warnings

- **Next.js 16.2.6** — breaking changes. See `apps/web/AGENTS.md` and `docs/web/rules.md`.
- **Expo SDK 56** — breaking changes. See `apps/mobile/AGENTS.md` and `docs/mobile/rules.md`.
