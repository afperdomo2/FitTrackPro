# AGENTS.md

## Quick rules

- **pnpm 10.30.3 ONLY** (enforced in `package.json`). Never npm or yarn.
- **`backend/` is NOT in the pnpm workspace.** Go is managed separately with `make`.
- **`packages/shared/`** (`@fittrackpro/shared`) holds shared types, enums, constants between web and mobile.
- **New dependencies must pass validation** (security, version stability, core compatibility). See `docs/monorepo.md#dependency-policy` and use Context7 MCP.
- **After changing TS/TSX/JS files** (web, mobile, shared packages): run `pnpm format` and `pnpm --filter <app> lint`.

## Skills & MCP

- **`heroui-react` skill** — load with `skill name: heroui-react` when creating or modifying HeroUI v3 components. Contains v3 API reference, compound patterns, and setup.
- **`heroui-react` MCP** — available as `opencode.json` MCP. Use `heroui-react_list_components`, `heroui-react_get_component_docs`, etc. to fetch component docs at runtime.
- **Context7 MCP** always available via `context7_query-docs` / `context7_resolve-library-id` for library docs.

## Docs by platform

| File                           | Content                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `docs/web/rules.md`            | Next.js 16, Tailwind v4, ESLint, HeroUI, forms, role-based access    |
| `docs/web/commands.md`         | dev, build, deploy, lint                                             |
| `docs/web/architecture.md`     | folder layout, App Router flow, component patterns, state management |
| `docs/mobile/rules.md`         | Expo SDK 56, RN 0.85                                                 |
| `docs/mobile/commands.md`      | dev, native, build, deploy                                           |
| `docs/mobile/architecture.md`  | folder layout, entrypoints, screen conventions                       |
| `docs/backend/rules.md`        | Go module, Gin, GORM, JWT, PostgreSQL, env                           |
| `docs/backend/commands.md`     | make targets, go test, go build, setup                               |
| `docs/backend/architecture.md` | domain-driven modules, handler/service/repository, middleware        |

## Framework version warnings

- **Next.js 16.2.6** — breaking changes. See `apps/web/AGENTS.md` and `docs/web/rules.md`.
- **Expo SDK 56** — breaking changes. See `apps/mobile/AGENTS.md` and `docs/mobile/rules.md`.
